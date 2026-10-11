import { type OfficialMcpAuthFailureReason, type ZCodeAccountAccess, type ZCodeProviderAccountAccess } from "@zcode/shared";
import type { ModelSelectionView } from "@zcode/provider";
/**
 * 凭证解析成功日志的去重键（导出仅为可单测，无其他消费方）。
 *
 * 生产日志保留 JWT 有效期分桶，帮助区分凭据过期与套餐不可用，不记录凭据原文。
 * resolver 只合并正在执行的请求，没有时间缓存；因此按小时分桶去重，避免每次
 * MCP 调用都产生 info 日志。凭据有效期跨桶、进入 expired 或切换套餐类型时重新记录。
 */
export declare function createCredentialResolvedLogKey(input: {
    providerFamily: "zai" | "bigmodel";
    planTargetType: string | null;
    maasJwtExpiresInSeconds: number | undefined;
}): string;
export interface OfficialMcpCredentialResolverDeps {
    accountRequestAuthService: {
        resolveAccessCurrent(access: ZCodeProviderAccountAccess): Promise<ZCodeAccountAccess | null>;
    };
    credentialService: {
        load(key: string): Promise<string | null | undefined>;
    };
    modelSelectionService: {
        getView(): Promise<ModelSelectionView>;
    };
}
export type OfficialMcpPlanScope = {
    targetType: "PERSONAL";
} | {
    targetType: "TEAM";
    organizationId: string;
    projectId: string;
};
export type OfficialMcpWireScope = OfficialMcpPlanScope | null;
/** 解析成功后的凭证快照。仅在 host/service 进程内存活，脱敏后才允许过 RPC。 */
export interface OfficialMcpCredentialSnapshot {
    jwt: string;
    /**
     * MaaS 登录 JWT（`oauth:<family>:access_token` 的原文，**不带 Bearer 前缀**）。
     * 前缀在 buildOfficialMcpAuthHeaders 里加，与 reset / usage 通道的既有约定一致。
     */
    codingPlanAuthorization?: string;
    providerFamily: "zai" | "bigmodel";
    /** 当前选中连接的产品/额度归属；畸形旧 Team key 无法精确归属时为 null。 */
    planScope: OfficialMcpPlanScope | null;
    /** 实际发往 Server MCP 的身份头 scope；ZAI Team 与 Off-Peak 一致为 null。 */
    wireScope: OfficialMcpWireScope;
}
export type OfficialMcpCredentialOutcome = {
    ok: true;
    snapshot: OfficialMcpCredentialSnapshot;
} | {
    ok: false;
    reason: OfficialMcpAuthFailureReason;
};
/**
 * 解析当前选中连接的官方 MCP 凭证。
 *
 * 防竞态：Registry、动态 Account Access、active provider、zcode JWT 与 MaaS JWT
 * 都可能在解析期间变化。这里在前后各取一次并比对，任一不一致就整轮
 * 重来，绝不拼接两代凭证——既包括"zcode JWT 来自 ZAI 而 MaaS JWT 来自 BigModel"（跨 family 混搭），
 * 也包括"旧 JWT + 新 JWT"（同 family 的 token 轮换）。两轮仍不稳定则按不可用返回。
 */
export declare function resolveOfficialMcpCredentials(deps: OfficialMcpCredentialResolverDeps): Promise<OfficialMcpCredentialOutcome>;
/**
 * 由凭证快照构造本次请求的身份头。
 * Team 身份成对原子性：organization/project 任一缺失时两者都不发送。
 */
export declare function buildOfficialMcpAuthHeaders(snapshot: OfficialMcpCredentialSnapshot): Record<string, string>;
/** host handler 透传的请求上下文；不参与凭证选择。 */
export interface OfficialMcpAuthHeadersRequestContext {
    mcpKey: string;
    pluginId: string;
    targetOrigin: string;
    workspace: {
        workspaceIdentity?: string;
        workspaceKey: string;
        workspacePath: string;
    };
}
export type OfficialMcpAuthHeadersOutcome = {
    ok: true;
    headers: Record<string, string>;
} | {
    ok: false;
    reason: OfficialMcpAuthFailureReason;
};
/**
 * 身份头解析入口，带 in-flight 去重。
 *
 * 只合并**并发**请求：已有解析在飞时后来者复用同一 Promise；settle 后立即丢弃，
 * 下一个请求重新完整解析。不做任何时间维度缓存，因此不存在"读到已被替换的旧凭证"的窗口。
 * 作用域为 host 全局——凭证是全局状态，按 plugin/mcpKey/workspace 分桶只会削弱去重、不增隔离。
 */
export declare function createOfficialMcpAuthHeadersResolver(deps: OfficialMcpCredentialResolverDeps): {
    resolveHeaders(request?: OfficialMcpAuthHeadersRequestContext): Promise<OfficialMcpAuthHeadersOutcome>;
};
//# sourceMappingURL=officialMcpCredentials.d.ts.map