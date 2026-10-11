import type { ApiKeyCreationUsageScene } from "./api-key-usage-scene.js";
export interface ProjectAccessTokenScope {
    readonly origin: string;
    readonly family: "bigmodel" | "zai";
    readonly accountId: string;
    readonly organizationId: string;
    readonly projectId: string;
    readonly apiKeyId: string;
    readonly usageScene: ApiKeyCreationUsageScene;
    /** 登录生命周期标识，不能使用 Token 原文或短期 Token 的哈希。 */
    readonly loginGeneration: string;
}
export type ProjectAccessTokenResult = {
    readonly enabled: false;
} | {
    readonly enabled: true;
    readonly token: string;
    readonly expiresAt: number;
};
export declare class ProjectAccessTokenError extends Error {
    readonly code: "project_token_invalid_response" | "project_token_scope_invalidated";
    constructor(code: "project_token_invalid_response" | "project_token_scope_invalidated");
}
/** I/O adapter 确认的临时故障；不携带原始响应、URL、Token 或 cause。 */
export declare class ProjectAccessTokenTransientError extends Error {
    constructor();
}
/**
 * 账号鉴权 owner 的纯内存状态，不含网络、存储、定时器或全局单例。
 * Host 和 Standalone 分别持有实例；签发由其已有 I/O adapter 注入。
 */
export declare class ProjectAccessTokenCache {
    #private;
    constructor(options?: {
        now?: () => number;
        random?: () => number;
        onRefreshDeferred?: () => void;
    });
    resolve(scope: ProjectAccessTokenScope, issue: () => Promise<unknown>, rejectedFingerprint?: string): Promise<ProjectAccessTokenResult>;
    invalidate(scope: ProjectAccessTokenScope): void;
    clear(): void;
}
/** 仅用于拒绝某一代 PAT 的比较，不作为账号身份，也不传给模型上游。 */
export declare function projectAccessTokenFingerprint(token: string): Promise<string>;
//# sourceMappingURL=project-access-token.d.ts.map