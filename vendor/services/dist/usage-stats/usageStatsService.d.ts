import type { ApiClient } from "@zcode/shared";
import type { ICredentialService } from "../credential/credential.js";
import type { IAccountRequestAuthService } from "../model-provider/accountRequestAuthService.js";
import type { IZCodeAgentService } from "../zcode-agent/zcodeAgent.js";
import type { IUsageStatsService } from "./usageStats.js";
import { type UsageApiAuthorizationRequest, type UsageApiAuthorization } from "./providers/bigmodelUsageQuotaProvider.js";
import type { OfficialMcpCredentialSource } from "./providers/zcodeMcpQuotaProvider.js";
interface UsageStatsServiceDependencies {
    apiClient: ApiClient;
    accountRequestAuthService: Pick<IAccountRequestAuthService, "resolveAccessCurrent" | "resolveCurrent" | "assertCurrent">;
    resolveApiAuthorization?: (request: UsageApiAuthorizationRequest) => Promise<UsageApiAuthorization | null>;
    credentialService?: Pick<ICredentialService, "load">;
    env?: NodeJS.ProcessEnv;
    /** App Usage 经 ZCode Protocol 读取 agent 数据库真实统计。 */
    zcodeAgentService: Pick<IZCodeAgentService, "getAppUsageStats">;
    /**
     * 官方 Server MCP 额度的凭证来源（与 server MCP 调用同一套 5 个身份头）。
     * 缺省时 entitlement 快照不含 MCP 额度。
     */
    officialMcpCredentialSource?: OfficialMcpCredentialSource;
}
export declare function createUsageStatsService(dependencies: UsageStatsServiceDependencies): IUsageStatsService;
export {};
//# sourceMappingURL=usageStatsService.d.ts.map