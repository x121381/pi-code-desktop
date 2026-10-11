import { type ApiClient, type UsageMcpQuotaScope, type UsageMcpQuotaSnapshot, type UsageQuotaLimit } from "@zcode/shared";
import { type OfficialMcpCredentialOutcome } from "#src/official-mcp/officialMcpCredentials.js";
/**
 * 注入的官方 MCP 凭证来源。
 *
 * 注入的是**凭证解析**而不是 createOfficialMcpAuthHeadersResolver 的 resolveHeaders：
 * 归属校验需要 snapshot.providerFamily，而身份头里没有 family 信息（只有 target-type /
 * organization / project）。身份头仍由共享的 buildOfficialMcpAuthHeaders 构造，保持单源。
 */
export interface OfficialMcpCredentialSource {
    resolve(): Promise<OfficialMcpCredentialOutcome>;
}
/** 本次 entitlement 查询的连接归属，用于和凭证归属比对。 */
export interface McpQuotaRequestScope {
    providerFamily: "zai" | "bigmodel";
    organizationId?: string | null;
    projectId?: string | null;
}
/**
 * 凭证归属是否与本次 entitlement 查询一致。
 *
 * 凭证来自 settings 当前选中的连接，而 entitlement 是按面板 provider tab 分别查询的。
 * 同时持有 Z.ai 与 BigModel Coding Plan（或个人 + Team）的用户，如果不做这层比对，
 * 就会在另一个 tab 下看到不属于它的 MCP 额度。
 */
export declare function matchesMcpQuotaScope(scope: UsageMcpQuotaScope, request: McpQuotaRequestScope): boolean;
/**
 * 服务端汇总的总额度映射成一条等价的 UsageQuotaLimit，直接复用现有额度条 / 额度卡的展示逻辑。
 *
 * percentage 沿用 quota 接口语义（**已使用**占比），展示端统一反转成剩余。
 */
export declare function buildMcpQuotaAggregateLimit(params: {
    totalUsage: {
        used: number;
        limit: number;
        remaining: number;
    };
    nextResetTime?: number;
}): UsageQuotaLimit | null;
/**
 * 读取一次 MCP 额度。可选数据面：任何失败都返回 null 并只记 warn，
 * 绝不影响 entitlement 快照本身的成功与降级语义。
 */
export declare function fetchMcpQuotaSnapshot(params: {
    apiClient: ApiClient;
    credentialSource: OfficialMcpCredentialSource;
    env: NodeJS.ProcessEnv;
    requestScope: McpQuotaRequestScope;
}): Promise<UsageMcpQuotaSnapshot | null>;
//# sourceMappingURL=zcodeMcpQuotaProvider.d.ts.map