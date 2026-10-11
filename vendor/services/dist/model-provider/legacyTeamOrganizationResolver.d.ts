import { type ApiClient, type ProviderFamilyDomain } from "@zcode/shared";
import type { LegacyTeamConnection } from "#src/setting/legacyAccountConnectionSettings.js";
/** 仅供旧连接导入：只读 OAuth 用户信息，不依赖当前 Provider，也不申请团队 Key。退役旧版后删除。 */
export declare function createLegacyTeamOrganizationResolver(dependencies: {
    apiClient: ApiClient;
    loadOAuthTokenSet: (family: ProviderFamilyDomain) => Promise<{
        accessToken: string;
        zcodeJwtToken?: string | null;
    } | null>;
}): (connection: LegacyTeamConnection) => Promise<string | null>;
//# sourceMappingURL=legacyTeamOrganizationResolver.d.ts.map