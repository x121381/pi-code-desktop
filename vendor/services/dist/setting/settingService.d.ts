import type { ProviderFamilyDomain } from "@zcode/shared";
import type { ISettingService } from "./setting.js";
import { type LegacyTeamConnection } from "#src/setting/legacyAccountConnectionSettings.js";
export declare function createSettingService(): ISettingService;
/** Host 私有迁移入口，不加入 Setting RPC；普通 get/update 从不等待 OAuth 查询。 */
export declare function createSettingServiceWithMigrations(): {
    service: ISettingService;
    prepareLegacyAccountConnections: (resolveOrganization: (connection: LegacyTeamConnection) => Promise<string | null>) => Promise<readonly ProviderFamilyDomain[]>;
};
//# sourceMappingURL=settingService.d.ts.map