import { type OffPeakCodingPlanKind, type OffPeakCodingPlanSupport, type OffPeakCodingPlanUnsupportedReason, type ZCodeAccountAccess } from "@zcode/shared";
import type { ServiceLogger } from "../logger/serviceLogger.js";
import type { IAccountRequestAuthService } from "../model-provider/accountRequestAuthService.js";
/** 仅用于确定性配置错误；host 据类型输出 permanent，禁止依赖错误文本分流。 */
export declare class OffPeakPermanentDispatchError extends Error {
    readonly failureKind: "permanent";
    constructor(message: string);
}
/** 双凭证解析失败的类型化错误（UI 可据此提示登录/配置 coding plan）。 */
export declare class OffPeakCredentialsUnavailableError extends OffPeakPermanentDispatchError {
    readonly missing: "jwt" | "codingPlanApiKey";
    constructor(missing: "jwt" | "codingPlanApiKey");
}
/** 当前 provider family / selected connection 不属于 Off-Peak 支持矩阵。 */
export declare class OffPeakCodingPlanUnavailableError extends OffPeakPermanentDispatchError {
    readonly reason: OffPeakCodingPlanUnsupportedReason;
    constructor(reason: OffPeakCodingPlanUnsupportedReason);
}
/** 用户常驻模型或 idle plan 模型缺失时停止空耗 ticket 的类型化错误。 */
export declare class OffPeakModelUnavailableError extends OffPeakPermanentDispatchError {
    readonly scope: "idlePlan" | "workspaceUser";
    constructor(scope: "idlePlan" | "workspaceUser");
}
export interface OffPeakCredentialSnapshot {
    jwt: string;
    codingPlanApiKey: string;
    accountScope?: string;
    kind: OffPeakCodingPlanKind;
    providerFamily: "zai" | "bigmodel";
    providerId: string;
    /** BigModel Team 组织/项目身份；仅两者同时存在时才允许进入请求头。 */
    organizationId?: string;
    projectId?: string;
    /** 仅供进程内 mock 代理真实选中 Coding Plan 上游；不会过 RPC 或持久化。 */
    providerBaseURL?: string;
}
interface OffPeakCredentialResolverDeps {
    credentialService: {
        load(key: string): Promise<string | null | undefined>;
    };
    accountRequestAuthService: IAccountRequestAuthService;
    resolveAccountProvider(): Promise<{
        readonly providerId: string;
        readonly access: ZCodeAccountAccess;
        readonly baseURL?: string;
    } | null>;
    env?: NodeJS.ProcessEnv;
}
/**
 * 解析当前 selected connection 的 Off-Peak 双凭证。
 *
 * 派发凭据必须与 UI 选中的 Coding Plan 保持一致，避免 ZAI/Team 任务误用个人 BigModel key。
 * 以 settings 的 family + selectedKey 为唯一选择来源，再通过执行入口注入的鉴权来源
 * 解析动态凭据。
 * Team key 继续复用 Account Request Auth 的 org/project resolver，失败时绝不回退个人 key。
 */
export declare function resolveOffPeakCredentials(deps: OffPeakCredentialResolverDeps, options?: {
    allowMockCredentials?: boolean;
}): Promise<OffPeakCredentialSnapshot>;
/**
 * BigModel Team 的组织/项目必须和鉴权凭证来自同一次 selected connection 解析。
 *
 * Off-Peak 过去只传 JWT 与 Coding Plan key，服务端没有 BigModel access key，
 * 无法反查 Team Plan 的 organization/project。旧版 connection key 可能只有 projectId，
 * 此时禁止发送半套身份头，避免服务端按错误组织归属校验。
 */
export declare function buildOffPeakPlanIdentityHeaders(credentials: OffPeakCredentialSnapshot): Record<string, string>;
/**
 * 构造一次闲时执行的动态鉴权材料。Endpoint、模型能力和 reasoning 等静态事实由
 * Built-in Provider / Model Config 提供，禁止再随单次派发下发。
 */
export declare function buildOffPeakRequestAuth(params: {
    credentials: OffPeakCredentialSnapshot;
    ticketId: string;
}): {
    apiKey: string;
    headers: Record<string, string>;
    accountScope?: string;
};
/** renderer 可见的脱敏支持快照；凭证原文始终留在 host/service 内存。 */
export declare function resolveOffPeakCodingPlanSupport(deps: OffPeakCredentialResolverDeps): Promise<OffPeakCodingPlanSupport>;
/**
 * mock 网关的上游解析：把 admitted 的 messages 代理到用户 coding plan 的 anthropic
 * 兼容端点（真模型、走用户自己的 key，仅开发/演示）。
 */
export declare function resolveOffPeakMockUpstream(deps: {
    credentialService: OffPeakCredentialResolverDeps["credentialService"];
    accountRequestAuthService: OffPeakCredentialResolverDeps["accountRequestAuthService"];
    resolveAccountProvider: OffPeakCredentialResolverDeps["resolveAccountProvider"];
    env?: NodeJS.ProcessEnv;
}): Promise<{
    url: string;
    headers: Record<string, string>;
}>;
/**
 * origin 解析器（memoized）：mock 模式懒启动进程内网关（固定端口，多实例经 EADDRINUSE
 * 复用同一份票据状态），真实模式指向 zcode API origin。node 服务装配与 host 派发两侧
 * 各持一个解析器也安全——谁先绑定谁持有网关，另一方外部复用。
 */
export declare function createOffPeakOriginResolver(deps: {
    logger: ServiceLogger;
    resolveUpstream: () => Promise<{
        url: string;
        headers: Record<string, string>;
    }>;
    env?: NodeJS.ProcessEnv;
}): {
    resolveOrigin: () => Promise<string>;
    close: () => Promise<void>;
};
export {};
//# sourceMappingURL=offPeakRuntimeModel.d.ts.map