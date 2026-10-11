import { readRequestVerificationConfig, requestVerificationClaimHeaders, isRequestVerificationMessage, } from "@zcode/shared";
import { BIGMODEL_PROVIDER_ID, BUILTIN_MODEL_PROVIDER_IDS, REQUEST_VERIFICATION_REQUIRED, CODING_PLAN_SYSTEM_BUSY, buildRuntimeZCodeApiUrl, isZaiCodingPlanProviderId, resolveBigModelApiOrigin, resolveZaiBusinessBaseUrl, ZAI_PROVIDER_ID, ZCODE_VERSION, DEFAULT_ZCODE_MODEL_CONTEXT_BUDGET_STRATEGY, createDynamicWorkflowClientConfig, normalizeDynamicWorkflowMode, resolveDynamicWorkflowClientConfig, DEFAULT_DYNAMIC_WORKFLOW_MODE, ZCODE_DYNAMIC_WORKFLOW_MODE_ENV, } from "@zcode/shared";
import { readApiJson } from "../providers/api/apiJson.js";
import { createServiceLogger } from "../logger/serviceLogger.js";
import { ensureBigModelTeamPlanProjectApiKeyWithStatus, } from "#src/bigmodel/teamPlanApiKey.js";
const BIGMODEL_CODING_PLAN_API_PREFIX = "/api/biz";
const ZAI_CODING_PLAN_PAY_API_PREFIX = "/api/pay";
const ZCODE_CLIENT_CONFIG_API_PREFIX = "/api/v1/client/configs";
const REQUEST_TIMEOUT_MS = 15_000;
const CLIENT_CONFIG_CACHE_TTL_MS = 60 * 60 * 1000;
const CODING_PLAN_ZAI_OVERSEAS_PAYMENT_REQUIRED = "coding_plan_zai_overseas_payment_required";
const ZCODE_JWT_TOKEN_KEY = "zcodejwttoken";
const log = createServiceLogger("codingPlanSubscription");
// 合并时曾丢失秒到毫秒的边界转换，导致客户端用本机时间误判待生效权益。
function readServerTimeMilliseconds(value) {
    return typeof value === "number" && Number.isFinite(value) && value >= 0
        ? value * 1_000
        : undefined;
}
export class BigModelCodingPlanSubscriptionProvider {
    apiClient;
    credentialService;
    resolveOffPeakModelSelectionView;
    clientConfigSnapshot = null;
    clientConfigSnapshotExpiresAt = 0;
    clientConfigRequest = null;
    constructor(options) {
        this.apiClient = options.apiClient;
        this.credentialService = options.credentialService;
        this.resolveOffPeakModelSelectionView = options.resolveOffPeakModelSelectionView;
    }
    // ─────────── family 维度抽象（供 ZaiCodingPlanSubscriptionProvider 覆盖）───────────
    // 原 enterprise 读方法（getEnterprisePricing / enrichEnterprisePricingTeamProjects 等）
    // 把 family 硬编码成 bigmodel：providerId=bigmodelCodingPlan、host=resolveBigModelApiOrigin、
    // token=loadBigModelAccessToken。zai family 对称化时无法复用。
    // 这里把 family 维度抽成 protected 虚方法，bigmodel 默认实现保持原行为，zai 子类覆盖即可。
    /** 当前 family 的 Coding Plan providerId（bigmodelCodingPlan / zaiCodingPlan）。 */
    codingPlanProviderId() {
        return BUILTIN_MODEL_PROVIDER_IDS.bigmodelIndividualCodingPlan;
    }
    /** 当前 family 的业务域名（bigmodel 域 / zai 域）。 */
    resolveFamilyEnterpriseHost() {
        return resolveBigModelApiOrigin(process.env);
    }
    /** 当前 family 的业务 OAuth token。 */
    async loadFamilyEnterpriseToken() {
        return this.loadBigModelAccessToken();
    }
    /** 当前 family 的业务鉴权头。 */
    createFamilyEnterpriseAuthHeaders(token) {
        return createBigModelLoginAuthHeaders(token);
    }
    async batchPreview(request = {}) {
        return this.post(request.providerId, "/pay/batch-preview", {
            invitationCode: request.invitationCode,
        });
    }
    async getStaticProducts() {
        const payload = await this.getClientConfigs();
        return unwrapClientConfigProducts(payload);
    }
    async getStaticTeamProducts() {
        const payload = await this.getClientConfigs();
        return unwrapClientConfigTeamProducts(payload);
    }
    async getStartPlanPreview() {
        const payload = await this.getClientConfigs();
        return unwrapClientConfigStartPlanPreview(payload);
    }
    async getManualClaimPlanPreviews() {
        const token = (await this.credentialService.load(ZCODE_JWT_TOKEN_KEY))?.trim();
        const url = new URL(buildRuntimeZCodeApiUrl(process.env, "/api/v1/zcode-plan/billing/preview"));
        url.searchParams.set("app_version", ZCODE_VERSION);
        url.searchParams.set("platform", resolveClientPlatformKey());
        const payload = await readCodingPlanApiJson(this.apiClient, url, {
            method: "GET",
            headers: token ? { Authorization: `Bearer ${token}` } : undefined,
            timeoutMs: REQUEST_TIMEOUT_MS,
        });
        // 新 ZCode billing 接口沿用平台 envelope（code=0 成功），不能复用
        // BigModel 支付接口的 code=200 解包器，否则合法 preview 会被误判失败。
        if (payload.code !== undefined && payload.code !== 0) {
            throw new Error(payload.msg?.trim() || "manual_claim_preview_failed");
        }
        if (!payload.data) {
            throw new Error(payload.msg?.trim() || "manual_claim_preview_missing_data");
        }
        const data = payload.data;
        const serverTime = readServerTimeMilliseconds(data.server_time);
        const plans = (data.plans ?? []).flatMap((plan) => {
            const planId = plan.plan_id?.trim() ?? "";
            if (!planId)
                return [];
            return [
                {
                    planId,
                    name: plan.name?.trim() || planId,
                    description: plan.description?.trim() ?? "",
                    priority: Number.isFinite(plan.priority) ? (plan.priority ?? 0) : 0,
                    entitlements: (plan.entitlements ?? []).flatMap((entitlement) => {
                        const entitlementId = entitlement.entitlement_id?.trim() ?? "";
                        if (!entitlementId)
                            return [];
                        return [
                            {
                                entitlementId,
                                showName: entitlement.show_name?.trim() ?? "",
                                meter: entitlement.meter?.trim() ?? "",
                                unitType: entitlement.unit_type?.trim() ?? "",
                                capabilities: entitlement.capabilities ?? [],
                                grantUnits: Number.isFinite(entitlement.grant_units)
                                    ? (entitlement.grant_units ?? 0)
                                    : 0,
                                period: entitlement.period?.trim() ?? "",
                                priority: Number.isFinite(entitlement.priority) ? (entitlement.priority ?? 0) : 0,
                                ...(Number.isFinite(entitlement.effective_at)
                                    ? { effectiveAt: entitlement.effective_at }
                                    : {}),
                            },
                        ];
                    }),
                },
            ];
        });
        return { ...(serverTime === undefined ? {} : { serverTime }), plans };
    }
    async claimManualPlan(request) {
        const token = (await this.credentialService.load(ZCODE_JWT_TOKEN_KEY))?.trim();
        if (!token) {
            return { success: false, code: 401, message: "" };
        }
        const payload = await readCodingPlanApiJson(this.apiClient, new URL(buildRuntimeZCodeApiUrl(process.env, "/api/v1/zcode-plan/billing/claim")), {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                ...requestVerificationClaimHeaders(request),
                "X-ZCode-App-Version": ZCODE_VERSION,
                "X-Platform": resolveClientPlatformKey(),
            },
            body: JSON.stringify({ plan_id: request.planId }),
            timeoutMs: REQUEST_TIMEOUT_MS,
        });
        // 领取接口的错误码可能是数字字符串；缺失 code 仍不推断成功。
        const rawCode = payload.code;
        const code = typeof rawCode === "number"
            ? rawCode
            : typeof rawCode === "string" && /^\d+$/.test(rawCode)
                ? Number(rawCode)
                : -1;
        const serverTime = readServerTimeMilliseconds(payload.data?.server_time);
        if (code !== 0 || !payload.data?.plan) {
            const failureEndsAt = payload.data?.plan?.ends_at;
            return {
                success: false,
                code,
                // 服务端已完成翻译，顶层 msg 不是用户文案；空值由 UI 本地化兜底。
                message: typeof payload.data?.message === "string" ? payload.data.message : "",
                ...(serverTime === undefined ? {} : { serverTime }),
                // 保留既有结果字段兼容其他调用方；营销提示不再据此推导文案。
                ...(Number.isFinite(failureEndsAt) ? { failureEndsAt } : {}),
            };
        }
        const plan = payload.data.plan;
        return {
            success: true,
            code,
            message: payload.msg?.trim() ?? "",
            ...(serverTime === undefined ? {} : { serverTime }),
            plan: {
                userPlanId: plan.user_plan_id?.trim() ?? "",
                planId: plan.plan_id?.trim() || request.planId,
                status: plan.status?.trim() ?? "",
                ...(Number.isFinite(plan.starts_at) ? { startsAt: plan.starts_at } : {}),
                ...(Number.isFinite(plan.ends_at) ? { endsAt: plan.ends_at } : {}),
                entitlements: (plan.entitlements ?? []).flatMap((entitlement) => {
                    const entitlementId = entitlement.entitlement_id?.trim() ?? "";
                    if (!entitlementId)
                        return [];
                    return [
                        {
                            entitlementId,
                            showName: entitlement.show_name?.trim() ?? "",
                            ...(Number.isFinite(entitlement.effective_at)
                                ? { effectiveAt: entitlement.effective_at }
                                : {}),
                        },
                    ];
                }),
            },
        };
    }
    /**
     * 闲时任务灰度配置：复用 client/configs 通道零新增请求。
     * forceRefresh 供"打开 Automations 入口补拉"（1h 快照否则灰度翻转最长 1h 不可见）。
     */
    async getOffPeakClientConfig(options) {
        if (process.env["ZCODE_OFFPEAK_MOCK"] === "1") {
            // mock 已经明确替代远端曝光配置，不能再先等待 /client/configs：
            // 离线 Desktop E2E 会一直停在 Loading，根本无法进入闲时执行链。
            const modelSelectionView = await this.resolveOffPeakModelSelectionView?.();
            return resolveOffPeakClientConfig({}, process.env, modelSelectionView);
        }
        if (options?.forceRefresh) {
            this.clientConfigSnapshot = null;
            this.clientConfigSnapshotExpiresAt = 0;
        }
        const payload = await this.getClientConfigs();
        const modelSelectionView = await this.resolveOffPeakModelSelectionView?.();
        return resolveOffPeakClientConfig(payload, process.env, modelSelectionView);
    }
    /**
     * 动态工作流灰度快照：与闲时任务同走
     * client/configs，零新增请求。三条边界：
     *   1. 本地覆盖（ZCODE_DYNAMIC_WORKFLOW_MODE）在任何网络动作之前裁决，命中即返回——
     *      preview 构建和开发者手测因此不受 1h 快照与首次 Host 竞态影响；
     *   2. forceRefresh 与 Off-Peak 同义，清掉快照后重拉（灰度翻转最长 1h 不可见）；
     *   3. 请求失败 fail-closed：返回 default（disabled）并 warn，绝不把异常抛给调用方——
     *      调用方在 session create/client 就绪路径上，灰度读失败不能阻断普通聊天。
     */
    async getDynamicWorkflowClientConfig(options) {
        // 覆盖合法即短路：判据（normalize）与快照构造（resolve）都留在 shared，这里不复述取值域。
        if (normalizeDynamicWorkflowMode(process.env[ZCODE_DYNAMIC_WORKFLOW_MODE_ENV])) {
            return resolveDynamicWorkflowClientConfig({ remote: undefined, env: process.env });
        }
        if (options?.forceRefresh) {
            this.clientConfigSnapshot = null;
            this.clientConfigSnapshotExpiresAt = 0;
        }
        try {
            const payload = await this.getClientConfigs();
            return resolveDynamicWorkflowClientConfig({
                remote: payload.data?.configs?.dynamicWorkflow,
                env: process.env,
            });
        }
        catch (error) {
            log.warn(undefined, "动态工作流灰度配置读取失败，按关闭处理", {
                errorMessage: error instanceof Error ? error.message : String(error),
            });
            return createDynamicWorkflowClientConfig(DEFAULT_DYNAMIC_WORKFLOW_MODE, "default");
        }
    }
    async getModelContextBudgetStrategy() {
        // 3.12.2：预算统一为 preflight-v1；保留兼容方法，但不能再为每次建会话等待远端配置。
        return DEFAULT_ZCODE_MODEL_CONTEXT_BUDGET_STRATEGY;
    }
    async getBillingDiscount() {
        const payload = await this.getClientConfigs();
        return unwrapClientConfigBillingDiscount(payload);
    }
    async getRequestVerificationConfig() {
        return readRequestVerificationConfig((await this.getClientConfigs()).data?.configs);
    }
    async getForceUpdateConfig() {
        const payload = await this.getClientConfigs();
        return unwrapClientConfigForceUpdate(payload);
    }
    async preview(request) {
        return this.post(request.providerId, resolvePreviewPath(request.providerId), {
            productId: request.productId,
            invitationCode: request.invitationCode,
            imRef: request.imRef ?? null,
            ticket: request.ticket ?? null,
            randstr: request.randstr ?? null,
            // Coding Plan 试算接口默认按 Maas 渠道处理，不显式标记会丢失 zcode 来源归因。
            salesChannel: request.salesChannel ?? "zcode",
        });
    }
    async productInfo(request) {
        const url = new URL(`${resolveCodingPlanHost(request.providerId)}${BIGMODEL_CODING_PLAN_API_PREFIX}/product/info`);
        url.searchParams.set("productId", request.productId);
        return this.get(request.providerId, url);
    }
    async createSign(request) {
        if (request.providerId && isZaiCodingPlanProviderId(request.providerId)) {
            throw new Error(CODING_PLAN_ZAI_OVERSEAS_PAYMENT_REQUIRED);
        }
        return this.post(request.providerId, "/pay/create-sign", {
            bizId: request.bizId,
            payType: request.payType ?? "ALI",
            invitationCode: request.invitationCode,
            renew: request.renew ?? null,
            isDelay: request.isDelay ?? 0,
            effectiveTime: request.effectiveTime ?? null,
        });
    }
    async updateSign(request) {
        if (request.providerId && isZaiCodingPlanProviderId(request.providerId)) {
            throw new Error(CODING_PLAN_ZAI_OVERSEAS_PAYMENT_REQUIRED);
        }
        return this.post(request.providerId, "/pay/product/update/sign", {
            bizId: request.bizId,
            payType: request.payType ?? "ALI",
        });
    }
    async checkPayment(request) {
        const url = new URL(`${resolveCodingPlanHost(request.providerId)}${BIGMODEL_CODING_PLAN_API_PREFIX}/pay/check`);
        url.searchParams.set("bizId", request.bizId);
        const status = await this.get(request.providerId, url);
        return { status };
    }
    async checkPendingOrders(request = {}) {
        return this.get(request.providerId, new URL(`${resolveCodingPlanHost(request.providerId)}${BIGMODEL_CODING_PLAN_API_PREFIX}/pay/check-pending-orders`));
    }
    async queryStripeCards(request = {}) {
        return this.getZaiPay(request.providerId, "/stripe/query");
    }
    async bindStripeCard(request) {
        return this.postZaiPay(request.providerId, "/stripe/bind", {
            paymentMethodId: request.paymentMethodId,
            returnUrl: request.returnUrl,
            trackingContext: request.trackingContext,
        });
    }
    async unbindStripeCard(request) {
        return this.postZaiPay(request.providerId, "/stripe/unbind", {
            paymentMethodId: request.paymentMethodId,
        });
    }
    async payStripe(request) {
        return this.postZaiPay(request.providerId, "/stripe/pay", {
            productId: request.productId,
            paymentMethodId: request.paymentMethodId,
            isSubscribe: request.isSubscribe ?? true,
            returnUrl: request.returnUrl,
            channelCode: request.channelCode,
            estimatePayAmount: request.estimatePayAmount,
            invitationCode: request.invitationCode,
            bizId: request.bizId,
            renew: request.renew ?? false,
        });
    }
    async checkPaypalSupport(request = {}) {
        return this.getZaiPay(request.providerId, "/paypal/isSupport");
    }
    async createPaypalSetupToken(request) {
        return this.postZaiPay(request.providerId, "/paypal/setupToken", {
            returnUrl: request.returnUrl,
            cancelUrl: request.cancelUrl,
        });
    }
    async subscribePaypal(request) {
        return this.postZaiPay(request.providerId, "/paypal/subscribe", {
            productId: request.productId,
            productDesc: request.productDesc,
            setupTokenId: request.setupTokenId,
            amount: request.amount,
            isSubscribe: request.isSubscribe ?? true,
            estimatePayAmount: request.estimatePayAmount,
            invitationCode: request.invitationCode,
            bizId: request.bizId,
            channelCode: request.channelCode,
        });
    }
    async getEnterprisePricing(request = {}) {
        const providerId = this.codingPlanProviderId();
        const host = this.resolveFamilyEnterpriseHost();
        if (request.authenticated === false) {
            const payload = await readCodingPlanApiJson(this.apiClient, `${host}${BIGMODEL_CODING_PLAN_API_PREFIX}/campaign/partner/enterprise/pricing`, {
                method: "GET",
                timeoutMs: REQUEST_TIMEOUT_MS,
            });
            return unwrapEnvelope(payload, providerId);
        }
        const response = await this.get(providerId, new URL(`${host}${BIGMODEL_CODING_PLAN_API_PREFIX}/subscription/enterprise/v2/pricing`));
        return this.enrichEnterprisePricingTeamProjects(response);
    }
    async getEnterpriseBalance() {
        return this.get(BUILTIN_MODEL_PROVIDER_IDS.bigmodelIndividualCodingPlan, new URL(`${resolveBigModelEnterpriseHost()}${BIGMODEL_CODING_PLAN_API_PREFIX}/subscription/enterprise/v2/balance`));
    }
    async calculateEnterpriseOrder(request) {
        return this.post(BUILTIN_MODEL_PROVIDER_IDS.bigmodelIndividualCodingPlan, "/subscription/enterprise/v2/order/calculate", { ...request });
    }
    async createEnterpriseOrder(request) {
        return this.post(BUILTIN_MODEL_PROVIDER_IDS.bigmodelIndividualCodingPlan, "/subscription/enterprise/v2/order", { ...request });
    }
    async getEnterprisePendingOrders() {
        const url = new URL(`${resolveBigModelEnterpriseHost()}${BIGMODEL_CODING_PLAN_API_PREFIX}/subscription/enterprise/v2/orders/pending`);
        return this.get(BUILTIN_MODEL_PROVIDER_IDS.bigmodelIndividualCodingPlan, url);
    }
    async cancelEnterpriseOrder(request) {
        return this.post(BUILTIN_MODEL_PROVIDER_IDS.bigmodelIndividualCodingPlan, `/subscription/enterprise/v2/order/${encodeURIComponent(request.orderNo)}/cancel`, {});
    }
    async continueEnterpriseOrderPayment(request) {
        return this.post(BUILTIN_MODEL_PROVIDER_IDS.bigmodelIndividualCodingPlan, `/subscription/enterprise/v2/order/${encodeURIComponent(request.orderNo)}/pay`, {});
    }
    async checkEnterpriseOrderStatus(request) {
        const url = new URL(`${resolveBigModelEnterpriseHost()}${BIGMODEL_CODING_PLAN_API_PREFIX}/subscription/enterprise/v2/order/${encodeURIComponent(request.orderNo)}/status`);
        return this.get(BUILTIN_MODEL_PROVIDER_IDS.bigmodelIndividualCodingPlan, url);
    }
    async post(providerId, path, body) {
        const endpoint = await this.resolveEndpointConfig(providerId);
        const payload = await readCodingPlanApiJson(this.apiClient, `${endpoint.host}${BIGMODEL_CODING_PLAN_API_PREFIX}${path}`, {
            method: "POST",
            timeoutMs: REQUEST_TIMEOUT_MS,
            headers: endpoint.headers,
            body: JSON.stringify(dropUndefined(body)),
        });
        return unwrapEnvelope(payload, endpoint.providerId);
    }
    async get(providerId, url) {
        const endpoint = await this.resolveEndpointConfig(providerId);
        const payload = await readCodingPlanApiJson(this.apiClient, url, {
            method: "GET",
            timeoutMs: REQUEST_TIMEOUT_MS,
            headers: endpoint.headers,
        });
        return unwrapEnvelope(payload, endpoint.providerId);
    }
    async postZaiPay(providerId, path, body) {
        const endpoint = await this.resolveEndpointConfig(providerId);
        assertZaiPaymentProvider(endpoint.providerId);
        const payload = await readCodingPlanApiJson(this.apiClient, `${endpoint.host}${ZAI_CODING_PLAN_PAY_API_PREFIX}${path}`, {
            method: "POST",
            timeoutMs: REQUEST_TIMEOUT_MS,
            headers: endpoint.headers,
            body: JSON.stringify(dropUndefined(body)),
        });
        return unwrapEnvelope(payload, endpoint.providerId);
    }
    async getZaiPay(providerId, path) {
        const endpoint = await this.resolveEndpointConfig(providerId);
        assertZaiPaymentProvider(endpoint.providerId);
        const payload = await readCodingPlanApiJson(this.apiClient, `${endpoint.host}${ZAI_CODING_PLAN_PAY_API_PREFIX}${path}`, {
            method: "GET",
            timeoutMs: REQUEST_TIMEOUT_MS,
            headers: endpoint.headers,
        });
        return unwrapEnvelope(payload, endpoint.providerId);
    }
    async getClientConfigs() {
        if (this.clientConfigSnapshot && this.clientConfigSnapshotExpiresAt > Date.now()) {
            return this.clientConfigSnapshot;
        }
        if (this.clientConfigRequest) {
            return await this.clientConfigRequest;
        }
        // client/configs 和其他 ZCode 平台接口必须共享运行时 endpoint；
        // E2E/测试环境会通过 ZCODE_BASE_URL 指向本地 mock，硬编码线上域名会让套餐状态不可控。
        const url = resolveCodingPlanClientConfigUrl(process.env);
        url.searchParams.set("app_version", ZCODE_VERSION);
        url.searchParams.set("platform", resolveClientPlatformKey());
        // StartPlanCard 和套餐列表都来自同一个 client/configs。
        // 同屏分别读取 preview/products 时必须合并请求，避免未登录设置页重复打远端配置。
        this.clientConfigRequest = readCodingPlanApiJson(this.apiClient, url, {
            method: "GET",
            timeoutMs: REQUEST_TIMEOUT_MS,
        });
        try {
            const payload = await this.clientConfigRequest;
            this.clientConfigSnapshot = payload;
            this.clientConfigSnapshotExpiresAt = Date.now() + CLIENT_CONFIG_CACHE_TTL_MS;
            return payload;
        }
        finally {
            this.clientConfigRequest = null;
        }
    }
    async resolveEndpointConfig(providerId) {
        const normalizedProviderId = providerId ?? BUILTIN_MODEL_PROVIDER_IDS.bigmodelIndividualCodingPlan;
        if (isZaiCodingPlanProviderId(normalizedProviderId)) {
            const authorization = await this.loadZaiAuthorization();
            return {
                providerId: normalizedProviderId,
                host: resolveZaiCodingPlanHost(),
                headers: createZaiLoginAuthHeaders(authorization),
            };
        }
        const token = await this.loadBigModelAccessToken();
        return {
            providerId: normalizedProviderId,
            host: resolveBigModelApiOrigin(process.env),
            headers: createBigModelLoginAuthHeaders(token),
        };
    }
    async loadBigModelAccessToken() {
        const token = (await this.credentialService.load(`oauth:${BIGMODEL_PROVIDER_ID}:access_token`))?.trim();
        if (!token) {
            throw new Error("bigmodel_oauth_required");
        }
        const zcodeJwtToken = (await this.credentialService.load(ZCODE_JWT_TOKEN_KEY))?.trim();
        if (zcodeJwtToken && token === zcodeJwtToken) {
            // 旧版 BigModel OAuth callback 曾把 zcode JWT 同时写进
            // oauth:bigmodel:access_token，付费套餐预览会拿它去打 bigmodel.cn 并报令牌过期。
            // 这里在服务边界拦截旧污染状态，避免继续向 BigModel 业务接口发送错误凭据。
            log.warn(undefined, "BigModel access token is stale zcode JWT; login required");
            throw new Error("bigmodel_oauth_required");
        }
        return token;
    }
    async enrichEnterprisePricingTeamProjects(response) {
        if (response.productList.length === 0) {
            return response;
        }
        const hasSubscribedProduct = response.productList.some((product) => product.subscribed === true);
        const hasSubscribedProductMissingProjectContext = response.productList.some((product) => product.subscribed === true &&
            (!product.projectId?.trim() || !product.organizationId?.trim()));
        if (hasSubscribedProduct && !hasSubscribedProductMissingProjectContext) {
            const apiKeyStatuses = await this.ensureSubscribedTeamPlanProjectApiKeys(response, await this.loadFamilyEnterpriseToken());
            return applyTeamPlanProjectApiKeyStatuses(response, apiKeyStatuses);
        }
        const token = await this.loadFamilyEnterpriseToken();
        const host = this.resolveFamilyEnterpriseHost();
        const customerInfo = await readCodingPlanApiJson(this.apiClient, `${host}${BIGMODEL_CODING_PLAN_API_PREFIX}/customer/getCustomerInfo`, {
            method: "GET",
            timeoutMs: REQUEST_TIMEOUT_MS,
            headers: this.createFamilyEnterpriseAuthHeaders(token),
        });
        const teamProjects = resolveBigModelTeamProjects(customerInfo.data);
        if (teamProjects.length === 0) {
            return response;
        }
        const fallbackSubscribedProductId = hasSubscribedProduct
            ? null
            : (resolveFallbackEnterpriseTeamPlanProduct(response.productList)?.productId ?? null);
        const enrichedResponse = {
            ...response,
            productList: response.productList.map((product) => {
                const shouldEnrichProduct = product.subscribed === true ||
                    (fallbackSubscribedProductId !== null &&
                        product.productId === fallbackSubscribedProductId);
                if (!shouldEnrichProduct) {
                    return product;
                }
                const matchedTeamProjects = resolveProductTeamProjects(product, teamProjects);
                if (matchedTeamProjects.length === 0) {
                    return product;
                }
                const primaryProject = matchedTeamProjects[0];
                return {
                    ...product,
                    // 企业 pricing 的 subscribed 商品只返回 productId/tier，不返回 org/project。
                    // 有些账号只返回 organizationId，不返回 projectId；必须继续读取 customerInfo.organizations 数组，
                    // 并按机构匹配团队项目，否则多机构账号会漏掉真实 Team Plan 连接方式。
                    // 另有测试环境账号 pricing 全部返回 subscribed=false，但 customerInfo 已有 projectType=2 团队项目；
                    // 此时 customerInfo 是更可靠的已购凭据，需要反向补出当前团队套餐入口。
                    organizationId: primaryProject?.organizationId ?? product.organizationId,
                    organizationName: primaryProject?.organizationName ?? product.organizationName,
                    projectId: primaryProject?.projectId ?? product.projectId,
                    projectName: primaryProject?.projectName ?? product.projectName,
                    teamProjects: matchedTeamProjects,
                    subscribed: true,
                };
            }),
        };
        const apiKeyStatuses = await this.ensureSubscribedTeamPlanProjectApiKeys(enrichedResponse, token);
        return applyTeamPlanProjectApiKeyStatuses(enrichedResponse, apiKeyStatuses);
    }
    async ensureSubscribedTeamPlanProjectApiKeys(response, token) {
        const teamContexts = collectSubscribedTeamPlanProjectContexts(response.productList);
        const statuses = new Map();
        if (teamContexts.length === 0) {
            return statuses;
        }
        const host = this.resolveFamilyEnterpriseHost();
        log.info(undefined, "Team Plan project api key prewarm started", {
            family: this.codingPlanProviderId(),
            teamProjectCount: teamContexts.length,
        });
        for (const teamContext of teamContexts) {
            try {
                const result = await ensureBigModelTeamPlanProjectApiKeyWithStatus({
                    apiClient: this.apiClient,
                    authorization: token,
                    host,
                    teamContext,
                    timeoutMs: REQUEST_TIMEOUT_MS,
                });
                log.info(undefined, "Team Plan project api key prewarm result", {
                    family: this.codingPlanProviderId(),
                    diagnostics: result.diagnostics,
                    organizationId: teamContext.organizationId,
                    projectId: teamContext.projectId,
                    status: result.status,
                });
                statuses.set(createTeamPlanProjectStatusKey(teamContext), createTeamPlanProjectApiKeyPrewarmStatusFromEnsureResult(result));
            }
            catch (error) {
                // 多团队套餐每个项目都需要独立 zcode-team-api-key。
                // 单个团队项目创建失败不能阻断 pricing 返回，否则会让其他团队入口一起不可见。
                log.warn(undefined, "Team Plan project api key prewarm failed", {
                    family: this.codingPlanProviderId(),
                    organizationId: teamContext.organizationId,
                    projectId: teamContext.projectId,
                    error: error instanceof Error ? error.message : String(error),
                });
                statuses.set(createTeamPlanProjectStatusKey(teamContext), {
                    status: "unavailable",
                    reason: "request_failed",
                    message: error instanceof Error ? error.message : String(error),
                });
            }
        }
        return statuses;
    }
    async loadZaiAuthorization() {
        const token = (await this.credentialService.load(`oauth:${ZAI_PROVIDER_ID}:access_token`))?.trim();
        if (!token) {
            throw new Error("zai_oauth_required");
        }
        return token;
    }
}
export function resolveCodingPlanClientConfigUrl(env) {
    return new URL(buildRuntimeZCodeApiUrl(env, ZCODE_CLIENT_CONFIG_API_PREFIX));
}
function resolveFallbackEnterpriseTeamPlanProduct(products) {
    let selected = null;
    let selectedScore = Number.NEGATIVE_INFINITY;
    for (const product of products) {
        const score = getEnterpriseTeamPlanFallbackProductScore(product);
        if (score > selectedScore) {
            selected = product;
            selectedScore = score;
        }
    }
    return selected;
}
function applyTeamPlanProjectApiKeyStatuses(response, statuses) {
    if (statuses.size === 0) {
        return response;
    }
    return {
        ...response,
        productList: response.productList.map((product) => applyTeamPlanProjectApiKeyStatus(product, statuses)),
    };
}
function applyTeamPlanProjectApiKeyStatus(product, statuses) {
    const teamProjects = product.teamProjects?.map((project) => applyTeamPlanProjectContextApiKeyStatus(project, statuses));
    const productStatus = getTeamPlanProjectApiKeyStatus({
        organizationId: product.organizationId ?? "",
        projectId: product.projectId ?? "",
    }, statuses);
    return {
        ...product,
        ...(teamProjects ? { teamProjects } : {}),
        ...(productStatus ? createTeamPlanProjectApiKeyStatusFields(productStatus) : {}),
    };
}
function applyTeamPlanProjectContextApiKeyStatus(project, statuses) {
    const status = getTeamPlanProjectApiKeyStatus(project, statuses);
    if (!status) {
        return project;
    }
    return {
        ...project,
        ...createTeamPlanProjectApiKeyStatusFields(status),
    };
}
function createTeamPlanProjectApiKeyStatusFields(status) {
    return {
        apiKeyStatus: status.status,
        apiKeyUnavailableReason: status.status === "unavailable" ? (status.reason ?? null) : null,
        apiKeyUnavailableMessage: status.status === "unavailable" ? (status.message ?? null) : null,
    };
}
function getTeamPlanProjectApiKeyStatus(project, statuses) {
    const organizationId = project.organizationId?.trim() ?? "";
    const projectId = project.projectId?.trim() ?? "";
    if (!organizationId || !projectId) {
        return null;
    }
    return statuses.get(createTeamPlanProjectStatusKey({ organizationId, projectId })) ?? null;
}
function createTeamPlanProjectApiKeyPrewarmStatusFromEnsureResult(result) {
    if (result.apiKey) {
        return { status: "available" };
    }
    return {
        status: "unavailable",
        reason: isNoValidTeamPlanAuthorizationMessage(result.diagnostics.create?.msg)
            ? "no_valid_team_plan_authorization"
            : "request_failed",
        message: result.diagnostics.create?.msg ?? result.diagnostics.list.msg ?? null,
    };
}
function createTeamPlanProjectStatusKey(project) {
    return `${project.organizationId.trim()}:${project.projectId.trim()}`;
}
function isNoValidTeamPlanAuthorizationMessage(message) {
    return Boolean(message?.includes("暂无有效的团队套餐授权记录"));
}
function getEnterpriseTeamPlanFallbackProductScore(product) {
    let score = 0;
    if (product.tier === "PRO") {
        score += 100;
    }
    if (product.subscribeMode === "ONE_TIME") {
        score += 20;
    }
    if (product.subscribePeriod === "MONTHLY") {
        score += 10;
    }
    return score;
}
function resolveProductTeamProjects(product, teamProjects) {
    const organizationId = product.organizationId?.trim() ?? "";
    const projectId = product.projectId?.trim() ?? "";
    return teamProjects.filter((project) => {
        if (organizationId && project.organizationId !== organizationId) {
            return false;
        }
        if (projectId && project.projectId !== projectId) {
            return false;
        }
        return true;
    });
}
function collectSubscribedTeamPlanProjectContexts(products) {
    const result = [];
    const seen = new Set();
    for (const product of products) {
        if (product.subscribed !== true) {
            continue;
        }
        const projectContexts = product.teamProjects && product.teamProjects.length > 0
            ? product.teamProjects
            : [
                {
                    organizationId: product.organizationId ?? null,
                    projectId: product.projectId ?? null,
                },
            ];
        for (const projectContext of projectContexts) {
            const organizationId = projectContext.organizationId?.trim() ?? "";
            const projectId = projectContext.projectId?.trim() ?? "";
            if (!organizationId || !projectId) {
                continue;
            }
            const key = `${organizationId}\0${projectId}`;
            if (seen.has(key)) {
                continue;
            }
            seen.add(key);
            result.push({ organizationId, projectId });
        }
    }
    return result;
}
function resolveBigModelTeamProjects(customerInfo) {
    const result = [];
    for (const organization of customerInfo?.organizations ?? []) {
        const organizationId = organization.organizationId?.trim() ?? "";
        if (!organizationId) {
            continue;
        }
        for (const project of organization.projects ?? []) {
            const projectId = project.projectId?.trim() ?? "";
            if (!projectId || !isBigModelTeamCodingPlanProject(project)) {
                continue;
            }
            result.push({
                organizationId,
                organizationName: organization.organizationName ?? null,
                projectId,
                projectName: project.projectName ?? null,
            });
        }
    }
    return result;
}
function isBigModelTeamCodingPlanProject(project) {
    // 团队套餐项目类型由 customerInfo.projectType 标识。
    // 不能写死项目名称，否则团队项目改名或国际化名称变化后会漏选。
    return String(project.projectType ?? "").trim() === "2";
}
export function createBigModelLoginAuthHeaders(token) {
    return {
        // BigModel 登录态业务接口要求 Authorization 直接传 accessToken。
        // 这里不能套 Bearer；Bearer 只适用于模型/API Key 类接口。
        Authorization: token,
        "Content-Type": "application/json",
    };
}
export function createZaiLoginAuthHeaders(token) {
    return {
        // Z.ai provider connection 已把 access_token 持久化为业务 JWT。
        // 这里不能使用模型 API key，也不能给业务 JWT 添加 Bearer 前缀。
        Authorization: token,
        "Content-Type": "application/json",
    };
}
function resolveCodingPlanHost(providerId) {
    return providerId && isZaiCodingPlanProviderId(providerId)
        ? resolveZaiCodingPlanHost()
        : resolveBigModelApiOrigin(process.env);
}
function resolveZaiCodingPlanHost() {
    // Z.ai Coding Plan 的 /api/biz 与 /api/pay 业务接口必须跟随产品环境。
    // 业务 token 必须发送到 .env 配置的 ZAI Business origin；未覆盖时默认 api.z.ai。
    return resolveZaiBusinessBaseUrl(process.env);
}
function resolveBigModelEnterpriseHost() {
    // 企业套餐 token 必须发送到 .env 配置的 BigModel origin；未覆盖时默认 bigmodel.cn，
    // 服务端返回空响应后被归一成系统繁忙。
    return resolveBigModelApiOrigin(process.env);
}
function resolvePreviewPath(providerId) {
    return providerId && isZaiCodingPlanProviderId(providerId) ? "/pay/zai-preview" : "/pay/preview";
}
function assertZaiPaymentProvider(providerId) {
    if (!isZaiCodingPlanProviderId(providerId)) {
        throw new Error(CODING_PLAN_ZAI_OVERSEAS_PAYMENT_REQUIRED);
    }
}
function unwrapEnvelope(payload, providerId) {
    if (payload.code !== undefined && payload.code !== 200) {
        throw new Error(normalizeRemoteErrorMessage(payload.msg, providerId, payload.code));
    }
    if (payload.success === false) {
        throw new Error(normalizeRemoteErrorMessage(payload.msg, providerId));
    }
    if (payload.data === null || payload.data === undefined) {
        const providerName = resolveCodingPlanProviderName(providerId);
        throw new Error(payload.msg?.trim() || `${providerName} response missing data`);
    }
    return payload.data;
}
/** 旧服务端目录仍使用 builtin 键；只在配置边界转换，不能扩散成运行时身份别名。 */
function normalizeStaticProductProviderIds(products) {
    const normalized = { ...products };
    const raw = products;
    for (const [legacyId, currentId] of [
        ["builtin:bigmodel-coding-plan", BUILTIN_MODEL_PROVIDER_IDS.bigmodelIndividualCodingPlan],
        ["builtin:zai-coding-plan", BUILTIN_MODEL_PROVIDER_IDS.zaiIndividualCodingPlan],
    ]) {
        // 显式空数组表示关闭该目录；只有旧键不存在时才使用新键，不能用长度判断回退。
        if (Object.hasOwn(raw, legacyId))
            normalized[currentId] = raw[legacyId];
        delete normalized[legacyId];
    }
    return normalized;
}
function unwrapClientConfigProducts(payload) {
    if (payload.code !== undefined && payload.code !== 0) {
        throw new Error(payload.msg?.trim() || "ZCode client config request failed");
    }
    const products = payload.data?.configs?.codingPlanStaticProducts;
    if (!products || typeof products !== "object") {
        throw new Error("ZCode client config missing Coding Plan products");
    }
    return normalizeStaticProductProviderIds(products);
}
function unwrapClientConfigTeamProducts(payload) {
    if (payload.code !== undefined && payload.code !== 0) {
        throw new Error(payload.msg?.trim() || "ZCode client config request failed");
    }
    const products = payload.data?.configs?.codingPlanStaticTeamProducts;
    if (!products || typeof products !== "object") {
        throw new Error("ZCode client config missing Coding Plan team products");
    }
    for (const providerProducts of Object.values(products)) {
        if (!Array.isArray(providerProducts) ||
            !providerProducts.every(isCodingPlanStaticTeamProduct)) {
            // 远端配置没有运行时类型保障；无效静态目录必须整体降级为读取失败，
            // 让 UI 继续使用实时 pricing 恢复团队订阅身份，不能在合并阶段抛错。
            throw new Error("ZCode client config has invalid Coding Plan team products");
        }
    }
    return normalizeStaticProductProviderIds(products);
}
function isCodingPlanStaticTeamProduct(value) {
    if (!value || typeof value !== "object") {
        return false;
    }
    const product = value;
    return (isNonEmptyString(product.productId) &&
        isNonEmptyString(product.productName) &&
        (product.tier === "LITE" || product.tier === "PRO" || product.tier === "MAX") &&
        (product.subscribeMode === "CONTINUOUS" || product.subscribeMode === "ONE_TIME") &&
        (product.subscribePeriod === "MONTHLY" ||
            product.subscribePeriod === "QUARTERLY" ||
            product.subscribePeriod === "YEARLY") &&
        isNonEmptyString(product.purchaseMethodName) &&
        product.priceCurrency === "CNY" &&
        isValidCardCopyConfig(product.equity) &&
        isValidCardCopyConfig(product.description));
}
function isNonEmptyString(value) {
    return typeof value === "string" && value.trim().length > 0;
}
function isValidCardCopyConfig(value) {
    return value === undefined || (Array.isArray(value) && value.every(isValidCardCopyConfigItem));
}
function isValidCardCopyConfigItem(value) {
    if (typeof value === "string") {
        return value.trim().length > 0;
    }
    if (!value || typeof value !== "object") {
        return false;
    }
    const item = value;
    return (isNonEmptyString(item.text) && (item.tooltip === undefined || typeof item.tooltip === "string"));
}
function unwrapClientConfigBillingDiscount(payload) {
    if (payload.code !== undefined && payload.code !== 0) {
        throw new Error(payload.msg?.trim() || "ZCode client config request failed");
    }
    const configs = payload.data?.configs;
    if (!configs || !("codingPlanBillingDiscount" in configs)) {
        return undefined;
    }
    return configs.codingPlanBillingDiscount;
}
function unwrapClientConfigStartPlanPreview(payload) {
    if (payload.code !== undefined && payload.code !== 0) {
        throw new Error(payload.msg?.trim() || "ZCode client config request failed");
    }
    const preview = payload.data?.configs?.startPlanPreview;
    if (!preview) {
        return null;
    }
    if (typeof preview.planId !== "string" ||
        typeof preview.name !== "string" ||
        !Array.isArray(preview.entitlements)) {
        throw new Error("ZCode client config invalid Start Plan preview");
    }
    return {
        planId: preview.planId,
        name: preview.name,
        entitlements: preview.entitlements.filter(isValidStartPlanPreviewEntitlement),
    };
}
function unwrapClientConfigForceUpdate(payload) {
    if (payload.code !== undefined && payload.code !== 0) {
        throw new Error(payload.msg?.trim() || "ZCode client config request failed");
    }
    const forceUpdate = payload.data?.configs?.forceUpdate;
    if (!forceUpdate) {
        return null;
    }
    const minimalVersion = forceUpdate.minimalVersion;
    if (typeof minimalVersion !== "string" || minimalVersion.trim() === "") {
        return null;
    }
    return { minimalVersion: minimalVersion.trim() };
}
function isValidStartPlanPreviewEntitlement(entitlement) {
    return (typeof entitlement?.grantUnits === "number" &&
        typeof entitlement.meter === "string" &&
        typeof entitlement.period === "string" &&
        typeof entitlement.showName === "string" &&
        typeof entitlement.unitType === "string");
}
function resolveClientPlatformKey() {
    return `${process.platform}-${process.arch}`;
}
function normalizeRemoteErrorMessage(msg, providerId, code) {
    const message = msg?.trim();
    if (message && isUnrenderableRemoteErrorMessage(message)) {
        return CODING_PLAN_SYSTEM_BUSY;
    }
    if (message && isRequestVerificationMessage(message)) {
        return REQUEST_VERIFICATION_REQUIRED;
    }
    const providerName = resolveCodingPlanProviderName(providerId);
    return message || `${providerName} request failed${code ? `: ${code}` : ""}`;
}
async function readCodingPlanApiJson(apiClient, input, init) {
    try {
        return await readApiJson(apiClient, input, init);
    }
    catch (error) {
        const message = readRemoteErrorMessage(error);
        if (isUnrenderableRemoteErrorMessage(message)) {
            // 支付接口偶发返回 WAF/HTML 页面或非 JSON 响应，原样透传会把整段
            // HTML 渲到确认支付页。服务边界先收敛为稳定错误码，UI 再做本地化提示。
            throw new Error(CODING_PLAN_SYSTEM_BUSY);
        }
        throw error;
    }
}
function readRemoteErrorMessage(error) {
    if (error instanceof Error) {
        return error.message || error.name;
    }
    if (typeof error === "object" && error !== null && "message" in error) {
        const message = error.message;
        if (typeof message === "string") {
            return message;
        }
    }
    return String(error);
}
function isUnrenderableRemoteErrorMessage(message) {
    const normalized = message.trim().toLowerCase();
    if (!normalized) {
        return false;
    }
    return (normalized.startsWith("<!doctype") ||
        /<\s*(html|head|body|script|style|title|meta)\b/.test(normalized) ||
        normalized.includes("errors.aliyun.com") ||
        normalized.includes("request has been blocked") ||
        normalized.includes("unexpected token '<'") ||
        normalized.includes("unexpected end of json input") ||
        normalized.includes("invalid json response"));
}
function resolveCodingPlanProviderName(providerId) {
    return isZaiCodingPlanProviderId(providerId) ? "Z.ai" : "BigModel";
}
function dropUndefined(value) {
    return Object.fromEntries(Object.entries(value).filter(([, entry]) => entry !== undefined));
}
/**
 * 闲时任务灰度判据（纯函数供单测）：远端只提供曝光开关，模型成员和事实
 * 来自 ZCode Built-in Provider / Model Config。
 * mock 模式（ZCODE_OFFPEAK_MOCK=1）只替代产品曝光与套餐状态；模型候选仍来自 Registry。
 */
export function resolveOffPeakClientConfig(payload, env, modelSelectionView = EMPTY_OFF_PEAK_MODEL_SELECTION_VIEW) {
    const hasModels = modelSelectionView.providers.some((provider) => provider.models.length > 0);
    if (env["ZCODE_OFFPEAK_MOCK"] === "1") {
        return {
            enabled: hasModels,
            modelSelectionView,
            // ZCODE_OFFPEAK_MOCK_NO_PLAN=1 演示「非 coding plan 锁定」态；缺省视为已订阅。
            codingPlanActive: env["ZCODE_OFFPEAK_MOCK_NO_PLAN"] !== "1",
        };
    }
    const raw = payload.data?.configs?.offPeak;
    return {
        enabled: raw?.enable_offpeak_task === true && hasModels,
        modelSelectionView,
    };
}
const EMPTY_OFF_PEAK_MODEL_SELECTION_VIEW = Object.freeze({
    revision: 0,
    providers: Object.freeze([]),
});
//# sourceMappingURL=bigmodelCodingPlanSubscriptionProvider.js.map