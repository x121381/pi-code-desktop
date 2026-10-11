/* eslint-disable max-lines -- Off-Peak 凭证解析、支持矩阵与 Request Auth 共用同一组契约，拆散会让双凭证/Team 身份边界更难追踪。 */
/* Host 派发时按当前票据构造逐请求鉴权材料；Provider/Model 静态事实由 Built-in Config 提供。 */
import { BUILTIN_MODEL_PROVIDER_IDS, resolveOffPeakProviderId, buildRuntimeZCodeApiUrl, } from "@zcode/shared";
import { isOffPeakMockEnabled, startOffPeakMockGateway } from "./offPeakMockGateway.js";
import { AccountRequestCredentialUnavailableError } from "../model-provider/accountProviderRequestAuthService.js";
/** 仅用于确定性配置错误；host 据类型输出 permanent，禁止依赖错误文本分流。 */
export class OffPeakPermanentDispatchError extends Error {
    failureKind = "permanent";
    constructor(message) {
        super(message);
        this.name = "OffPeakPermanentDispatchError";
    }
}
/** 双凭证解析失败的类型化错误（UI 可据此提示登录/配置 coding plan）。 */
export class OffPeakCredentialsUnavailableError extends OffPeakPermanentDispatchError {
    missing;
    constructor(missing) {
        super(missing === "jwt"
            ? "off-peak requires zcode login (jwt missing)"
            : "off-peak requires a coding plan provider api key");
        this.missing = missing;
        this.name = "OffPeakCredentialsUnavailableError";
    }
}
/** 当前 provider family / selected connection 不属于 Off-Peak 支持矩阵。 */
export class OffPeakCodingPlanUnavailableError extends OffPeakPermanentDispatchError {
    reason;
    constructor(reason) {
        super(`off-peak selected coding plan unavailable: ${reason}`);
        this.reason = reason;
        this.name = "OffPeakCodingPlanUnavailableError";
    }
}
/** 用户常驻模型或 idle plan 模型缺失时停止空耗 ticket 的类型化错误。 */
export class OffPeakModelUnavailableError extends OffPeakPermanentDispatchError {
    scope;
    constructor(scope) {
        super(scope === "idlePlan"
            ? "off-peak dispatch has no usable model (Built-in Provider models empty)"
            : "off-peak dispatch has no usable user workspace model");
        this.scope = scope;
        this.name = "OffPeakModelUnavailableError";
    }
}
const ZCODE_JWT_TOKEN_KEY = "zcodejwttoken";
const ACTIVE_OAUTH_PROVIDER_KEY = "oauth:active_provider";
function resolveSelectedOffPeakCodingPlan(provider) {
    if (!provider) {
        throw new OffPeakCodingPlanUnavailableError("connection_unavailable");
    }
    const { access, providerId } = provider;
    if (access.planKind === "start-plan") {
        throw new OffPeakCodingPlanUnavailableError("start_plan_not_supported");
    }
    if (access.planKind === "individual-coding-plan") {
        return {
            kind: access.family === "zai" ? "zai-personal" : "bigmodel-personal",
            providerFamily: access.family,
            providerId,
        };
    }
    if (access.planKind !== "team-coding-plan") {
        throw new OffPeakCodingPlanUnavailableError("connection_unavailable");
    }
    return {
        kind: access.family === "zai" ? "zai-team" : "bigmodel-team",
        providerFamily: access.family,
        providerId,
        organizationId: access.organizationId,
        projectId: access.projectId,
    };
}
function createOffPeakSelectionFingerprint(provider) {
    return JSON.stringify(provider ?? null);
}
/**
 * 解析当前 selected connection 的 Off-Peak 双凭证。
 *
 * 派发凭据必须与 UI 选中的 Coding Plan 保持一致，避免 ZAI/Team 任务误用个人 BigModel key。
 * 以 settings 的 family + selectedKey 为唯一选择来源，再通过执行入口注入的鉴权来源
 * 解析动态凭据。
 * Team key 继续复用 Account Request Auth 的 org/project resolver，失败时绝不回退个人 key。
 */
export async function resolveOffPeakCredentials(deps, options = {}) {
    const env = deps.env ?? process.env;
    if (options.allowMockCredentials !== false && env["ZCODE_OFFPEAK_MOCK"] === "1") {
        if (env["ZCODE_OFFPEAK_MOCK_NO_PLAN"] === "1") {
            throw new OffPeakCodingPlanUnavailableError("connection_unavailable");
        }
        // mock 网关不校验凭证；使用确定性 metadata 让 UI 和 ticket/runtime 仍共享同一 support 形状。
        return {
            jwt: "offpeak-mock-jwt",
            codingPlanApiKey: "offpeak-mock-key",
            kind: "bigmodel-personal",
            providerFamily: "bigmodel",
            providerId: BUILTIN_MODEL_PROVIDER_IDS.bigmodelIndividualCodingPlan,
        };
    }
    // settings 可能在账号 Provider 解析期间切换。前后指纹不一致时重读一次，禁止拼接两代凭证。
    for (let attempt = 0; attempt < 2; attempt += 1) {
        const provider = await deps.resolveAccountProvider();
        const selection = resolveSelectedOffPeakCodingPlan(provider);
        const activeProvider = (await deps.credentialService.load(ACTIVE_OAUTH_PROVIDER_KEY))?.trim() ?? "";
        if (activeProvider !== selection.providerFamily) {
            // zcode JWT 是当前 App 登录身份的全局镜像；只校验 selectedKey 会把
            // ZAI JWT 与 BigModel key（或反向）拼到同一请求，服务端只能在取号时才拒绝。
            throw new OffPeakCodingPlanUnavailableError("provider_identity_mismatch");
        }
        const jwt = (await deps.credentialService.load(ZCODE_JWT_TOKEN_KEY))?.trim() ?? "";
        if (!jwt) {
            throw new OffPeakCredentialsUnavailableError("jwt");
        }
        const [latestProvider, latestActiveProvider] = await Promise.all([
            deps.resolveAccountProvider(),
            deps.credentialService.load(ACTIVE_OAUTH_PROVIDER_KEY),
        ]);
        if (createOffPeakSelectionFingerprint(provider) !==
            createOffPeakSelectionFingerprint(latestProvider) ||
            activeProvider !== latestActiveProvider?.trim()) {
            continue;
        }
        if (!provider ||
            provider.access.family !== selection.providerFamily ||
            (selection.kind.endsWith("-team")
                ? provider.access.planKind !== "team-coding-plan"
                : provider.access.planKind !== "individual-coding-plan")) {
            throw new OffPeakCodingPlanUnavailableError("connection_unavailable");
        }
        let codingPlanApiKey = "";
        let accountScope;
        try {
            const auth = await deps.accountRequestAuthService.resolveCurrent({
                providerId: selection.providerId,
                modelId: resolveOffPeakProviderId(selection.providerFamily),
                accountAccess: provider.access,
                reason: "off-peak",
            });
            codingPlanApiKey = auth.apiKey?.trim() ?? "";
            accountScope = auth.accountScope;
        }
        catch (error) {
            if (error instanceof AccountRequestCredentialUnavailableError) {
                throw new OffPeakCredentialsUnavailableError("codingPlanApiKey");
            }
            throw error;
        }
        if (!codingPlanApiKey) {
            throw new OffPeakCredentialsUnavailableError("codingPlanApiKey");
        }
        return {
            ...selection,
            jwt,
            codingPlanApiKey,
            ...(accountScope ? { accountScope } : {}),
            ...(provider.baseURL ? { providerBaseURL: provider.baseURL } : {}),
        };
    }
    throw new OffPeakCodingPlanUnavailableError("selection_changed");
}
/**
 * BigModel Team 的组织/项目必须和鉴权凭证来自同一次 selected connection 解析。
 *
 * Off-Peak 过去只传 JWT 与 Coding Plan key，服务端没有 BigModel access key，
 * 无法反查 Team Plan 的 organization/project。旧版 connection key 可能只有 projectId，
 * 此时禁止发送半套身份头，避免服务端按错误组织归属校验。
 */
export function buildOffPeakPlanIdentityHeaders(credentials) {
    if (credentials.kind !== "bigmodel-team") {
        return {};
    }
    const organizationId = credentials.organizationId?.trim() ?? "";
    const projectId = credentials.projectId?.trim() ?? "";
    if (!organizationId || !projectId) {
        return {};
    }
    return {
        "bigmodel-organization": organizationId,
        "bigmodel-project": projectId,
    };
}
/**
 * 构造一次闲时执行的动态鉴权材料。Endpoint、模型能力和 reasoning 等静态事实由
 * Built-in Provider / Model Config 提供，禁止再随单次派发下发。
 */
export function buildOffPeakRequestAuth(params) {
    return {
        // Anthropic 兼容客户端会发送 x-api-key；服务端仍以 Authorization 与计划 Key 裁决。
        apiKey: params.credentials.jwt,
        ...(params.credentials.accountScope ? { accountScope: params.credentials.accountScope } : {}),
        headers: {
            Authorization: `Bearer ${params.credentials.jwt}`,
            "X-Coding-Plan-Api-Key": params.credentials.codingPlanApiKey,
            "X-Off-Peak-Ticket-ID": params.ticketId,
            ...buildOffPeakPlanIdentityHeaders(params.credentials),
        },
    };
}
/** renderer 可见的脱敏支持快照；凭证原文始终留在 host/service 内存。 */
export async function resolveOffPeakCodingPlanSupport(deps) {
    try {
        const snapshot = await resolveOffPeakCredentials(deps);
        return {
            supported: true,
            kind: snapshot.kind,
            providerFamily: snapshot.providerFamily,
            providerId: snapshot.providerId,
        };
    }
    catch (error) {
        if (error instanceof OffPeakCodingPlanUnavailableError) {
            return { supported: false, reason: error.reason };
        }
        if (error instanceof OffPeakCredentialsUnavailableError) {
            return {
                supported: false,
                reason: error.missing === "jwt" ? "jwt_missing" : "connection_unavailable",
            };
        }
        throw error;
    }
}
/**
 * mock 网关的上游解析：把 admitted 的 messages 代理到用户 coding plan 的 anthropic
 * 兼容端点（真模型、走用户自己的 key，仅开发/演示）。
 */
export async function resolveOffPeakMockUpstream(deps) {
    const credentials = await resolveOffPeakCredentials(deps, {
        // mock 自己的 placeholder 不能拿去代理上游；这里强制解析真实 selected connection。
        allowMockCredentials: false,
    });
    if (!credentials.providerBaseURL) {
        throw new Error("off-peak mock upstream requires a selected coding plan provider endpoint");
    }
    return {
        url: `${credentials.providerBaseURL.replace(/\/$/, "")}/v1/messages`,
        headers: {
            "x-api-key": credentials.codingPlanApiKey,
            authorization: `Bearer ${credentials.codingPlanApiKey}`,
        },
    };
}
/**
 * origin 解析器（memoized）：mock 模式懒启动进程内网关（固定端口，多实例经 EADDRINUSE
 * 复用同一份票据状态），真实模式指向 zcode API origin。node 服务装配与 host 派发两侧
 * 各持一个解析器也安全——谁先绑定谁持有网关，另一方外部复用。
 */
export function createOffPeakOriginResolver(deps) {
    const env = deps.env ?? process.env;
    let originPromise = null;
    let closeGateway = null;
    return {
        resolveOrigin: () => {
            if (!originPromise) {
                originPromise = (async () => {
                    if (!isOffPeakMockEnabled(env)) {
                        return new URL(buildRuntimeZCodeApiUrl(env, "/")).origin;
                    }
                    const gateway = await startOffPeakMockGateway({
                        logger: deps.logger,
                        resolveUpstream: deps.resolveUpstream,
                    });
                    if (!gateway.external)
                        closeGateway = gateway.close;
                    return gateway.origin;
                })().catch((error) => {
                    originPromise = null; // 失败后允许重试（如端口短暂占用）
                    throw error;
                });
            }
            return originPromise;
        },
        close: async () => {
            const close = closeGateway;
            closeGateway = null;
            if (close)
                await close();
        },
    };
}
//# sourceMappingURL=offPeakRuntimeModel.js.map