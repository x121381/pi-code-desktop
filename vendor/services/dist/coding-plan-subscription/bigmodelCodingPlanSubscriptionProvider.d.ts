import { type RequestVerificationClientConfig } from "@zcode/shared";
import type { ApiClient, RequestVerificationConfig, ForceUpdateConfig, CodingPlanAgreementResponse, CodingPlanBatchPreviewRequest, CodingPlanBatchPreviewResponse, CodingPlanCreateSignRequest, CodingPlanPaymentCheckRequest, CodingPlanPaymentCheckResponse, CodingPlanPendingOrderCheckResponse, CodingPlanPaypalSetupTokenRequest, CodingPlanPaypalSetupTokenResponse, CodingPlanPaypalSubscribeRequest, CodingPlanPaypalSubscribeResponse, CodingPlanPaypalSupportRequest, CodingPlanPaypalSupportResponse, CodingPlanProductInfo, CodingPlanProductInfoRequest, CodingPlanBillingDiscountConfig, CodingPlanStaticProductsConfig, CodingPlanStaticTeamProductsConfig, CodingPlanSubscriptionProviderId, CodingPlanPreviewRequest, CodingPlanPreviewResponse, CodingPlanStripeBindRequest, CodingPlanStripeBindResponse, CodingPlanStripeCard, CodingPlanStripePayRequest, CodingPlanStripePayResponse, CodingPlanStripeUnbindRequest, CodingPlanUpdateSignRequest, EnterpriseCodingPlanCancelOrderRequest, EnterpriseCodingPlanCancelOrderResponse, EnterpriseCodingPlanCreateOrderRequest, EnterpriseCodingPlanCreateOrderResponse, EnterpriseCodingPlanBalanceResponse, EnterpriseCodingPlanContinuePayRequest, EnterpriseCodingPlanOrderCalculateRequest, EnterpriseCodingPlanOrderCalculateResponse, EnterpriseCodingPlanPendingOrder, EnterpriseCodingPlanOrderStatusRequest, EnterpriseCodingPlanOrderStatusResponse, EnterpriseCodingPlanPricingRequest, EnterpriseCodingPlanPricingResponse, EnterpriseCodingPlanProjectApiKeyUnavailableReason, StartPlanPreviewConfig, ManualClaimPlanClaimRequest, ManualClaimPlanClaimResult, ManualClaimPlanPreviewSnapshot, ZCodeModelContextBudgetStrategy, DynamicWorkflowClientConfig } from "@zcode/shared";
import type { ModelSelectionView } from "@zcode/provider";
import type { OffPeakClientConfig } from "./codingPlanSubscription.js";
import type { ICredentialService } from "../credential/credential.js";
interface ZCodeClientConfigEnvelope {
    code?: number;
    msg?: string;
    success?: boolean;
    data?: {
        configs?: (RequestVerificationClientConfig & {
            forceUpdate?: ForceUpdateConfig | null;
            codingPlanBillingDiscount?: CodingPlanBillingDiscountConfig;
            codingPlanStaticProducts?: CodingPlanStaticProductsConfig;
            codingPlanStaticTeamProducts?: CodingPlanStaticTeamProductsConfig;
            startPlanPreview?: StartPlanPreviewConfig | null;
            offPeak?: {
                enable_offpeak_task?: boolean;
            } | null;
            modelContextBudget?: {
                strategy?: unknown;
            } | null;
            dynamicWorkflow?: {
                mode?: unknown;
            } | null;
        }) | null;
    } | null;
}
interface BigModelCodingPlanSubscriptionProviderOptions {
    apiClient: ApiClient;
    credentialService: Pick<ICredentialService, "load">;
    resolveOffPeakModelSelectionView?: () => Promise<ModelSelectionView>;
}
interface TeamPlanProjectApiKeyPrewarmStatus {
    status: "available" | "unavailable";
    reason?: EnterpriseCodingPlanProjectApiKeyUnavailableReason;
    message?: string | null;
}
export declare class BigModelCodingPlanSubscriptionProvider {
    protected readonly apiClient: ApiClient;
    protected readonly credentialService: Pick<ICredentialService, "load">;
    private readonly resolveOffPeakModelSelectionView?;
    private clientConfigSnapshot;
    private clientConfigSnapshotExpiresAt;
    private clientConfigRequest;
    constructor(options: BigModelCodingPlanSubscriptionProviderOptions);
    /** 当前 family 的 Coding Plan providerId（bigmodelCodingPlan / zaiCodingPlan）。 */
    protected codingPlanProviderId(): CodingPlanSubscriptionProviderId;
    /** 当前 family 的业务域名（bigmodel 域 / zai 域）。 */
    protected resolveFamilyEnterpriseHost(): string;
    /** 当前 family 的业务 OAuth token。 */
    protected loadFamilyEnterpriseToken(): Promise<string>;
    /** 当前 family 的业务鉴权头。 */
    protected createFamilyEnterpriseAuthHeaders(token: string): Record<string, string>;
    batchPreview(request?: CodingPlanBatchPreviewRequest): Promise<CodingPlanBatchPreviewResponse>;
    getStaticProducts(): Promise<CodingPlanStaticProductsConfig>;
    getStaticTeamProducts(): Promise<CodingPlanStaticTeamProductsConfig>;
    getStartPlanPreview(): Promise<StartPlanPreviewConfig | null>;
    getManualClaimPlanPreviews(): Promise<ManualClaimPlanPreviewSnapshot>;
    claimManualPlan(request: ManualClaimPlanClaimRequest): Promise<ManualClaimPlanClaimResult>;
    /**
     * 闲时任务灰度配置：复用 client/configs 通道零新增请求。
     * forceRefresh 供"打开 Automations 入口补拉"（1h 快照否则灰度翻转最长 1h 不可见）。
     */
    getOffPeakClientConfig(options?: {
        forceRefresh?: boolean;
    }): Promise<OffPeakClientConfig>;
    /**
     * 动态工作流灰度快照：与闲时任务同走
     * client/configs，零新增请求。三条边界：
     *   1. 本地覆盖（ZCODE_DYNAMIC_WORKFLOW_MODE）在任何网络动作之前裁决，命中即返回——
     *      preview 构建和开发者手测因此不受 1h 快照与首次 Host 竞态影响；
     *   2. forceRefresh 与 Off-Peak 同义，清掉快照后重拉（灰度翻转最长 1h 不可见）；
     *   3. 请求失败 fail-closed：返回 default（disabled）并 warn，绝不把异常抛给调用方——
     *      调用方在 session create/client 就绪路径上，灰度读失败不能阻断普通聊天。
     */
    getDynamicWorkflowClientConfig(options?: {
        forceRefresh?: boolean;
    }): Promise<DynamicWorkflowClientConfig>;
    getModelContextBudgetStrategy(): Promise<ZCodeModelContextBudgetStrategy>;
    getBillingDiscount(): Promise<CodingPlanBillingDiscountConfig | undefined>;
    getRequestVerificationConfig(): Promise<RequestVerificationConfig | null>;
    getForceUpdateConfig(): Promise<ForceUpdateConfig | null>;
    preview(request: CodingPlanPreviewRequest): Promise<CodingPlanPreviewResponse>;
    productInfo(request: CodingPlanProductInfoRequest): Promise<CodingPlanProductInfo>;
    createSign(request: CodingPlanCreateSignRequest): Promise<CodingPlanAgreementResponse>;
    updateSign(request: CodingPlanUpdateSignRequest): Promise<CodingPlanAgreementResponse>;
    checkPayment(request: CodingPlanPaymentCheckRequest): Promise<CodingPlanPaymentCheckResponse>;
    checkPendingOrders(request?: {
        providerId?: CodingPlanSubscriptionProviderId;
    }): Promise<CodingPlanPendingOrderCheckResponse>;
    queryStripeCards(request?: {
        providerId?: CodingPlanSubscriptionProviderId;
    }): Promise<CodingPlanStripeCard[]>;
    bindStripeCard(request: CodingPlanStripeBindRequest): Promise<CodingPlanStripeBindResponse>;
    unbindStripeCard(request: CodingPlanStripeUnbindRequest): Promise<string>;
    payStripe(request: CodingPlanStripePayRequest): Promise<CodingPlanStripePayResponse>;
    checkPaypalSupport(request?: CodingPlanPaypalSupportRequest): Promise<CodingPlanPaypalSupportResponse>;
    createPaypalSetupToken(request: CodingPlanPaypalSetupTokenRequest): Promise<CodingPlanPaypalSetupTokenResponse>;
    subscribePaypal(request: CodingPlanPaypalSubscribeRequest): Promise<CodingPlanPaypalSubscribeResponse>;
    getEnterprisePricing(request?: EnterpriseCodingPlanPricingRequest): Promise<EnterpriseCodingPlanPricingResponse>;
    getEnterpriseBalance(): Promise<EnterpriseCodingPlanBalanceResponse>;
    calculateEnterpriseOrder(request: EnterpriseCodingPlanOrderCalculateRequest): Promise<EnterpriseCodingPlanOrderCalculateResponse>;
    createEnterpriseOrder(request: EnterpriseCodingPlanCreateOrderRequest): Promise<EnterpriseCodingPlanCreateOrderResponse>;
    getEnterprisePendingOrders(): Promise<EnterpriseCodingPlanPendingOrder[]>;
    cancelEnterpriseOrder(request: EnterpriseCodingPlanCancelOrderRequest): Promise<EnterpriseCodingPlanCancelOrderResponse>;
    continueEnterpriseOrderPayment(request: EnterpriseCodingPlanContinuePayRequest): Promise<EnterpriseCodingPlanCreateOrderResponse>;
    checkEnterpriseOrderStatus(request: EnterpriseCodingPlanOrderStatusRequest): Promise<EnterpriseCodingPlanOrderStatusResponse>;
    private post;
    private get;
    private postZaiPay;
    private getZaiPay;
    private getClientConfigs;
    private resolveEndpointConfig;
    private loadBigModelAccessToken;
    protected enrichEnterprisePricingTeamProjects(response: EnterpriseCodingPlanPricingResponse): Promise<EnterpriseCodingPlanPricingResponse>;
    protected ensureSubscribedTeamPlanProjectApiKeys(response: EnterpriseCodingPlanPricingResponse, token: string): Promise<Map<string, TeamPlanProjectApiKeyPrewarmStatus>>;
    protected loadZaiAuthorization(): Promise<string>;
}
export declare function resolveCodingPlanClientConfigUrl(env: NodeJS.ProcessEnv): URL;
export declare function createBigModelLoginAuthHeaders(token: string): Record<string, string>;
export declare function createZaiLoginAuthHeaders(token: string): Record<string, string>;
/**
 * 闲时任务灰度判据（纯函数供单测）：远端只提供曝光开关，模型成员和事实
 * 来自 ZCode Built-in Provider / Model Config。
 * mock 模式（ZCODE_OFFPEAK_MOCK=1）只替代产品曝光与套餐状态；模型候选仍来自 Registry。
 */
export declare function resolveOffPeakClientConfig(payload: ZCodeClientConfigEnvelope, env: NodeJS.ProcessEnv, modelSelectionView?: ModelSelectionView): OffPeakClientConfig;
export {};
//# sourceMappingURL=bigmodelCodingPlanSubscriptionProvider.d.ts.map