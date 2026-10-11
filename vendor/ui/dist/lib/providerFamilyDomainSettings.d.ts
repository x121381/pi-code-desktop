import type { ISettingService } from "@zcode/services";
import { type ProviderFamilyConnectionSelectionSettings, type ProviderFamilyDomain } from "@zcode/shared";
export declare function resolveLogoutProviderFamilyDomain(params: {
    currentDomain: ProviderFamilyDomain | null | undefined;
}): ProviderFamilyDomain | null;
export declare function setProviderFamilyDomain(settingService: Pick<ISettingService, "get" | "update">, domain: ProviderFamilyDomain): Promise<void>;
export declare function buildOAuthProviderFamilySelections(domain: ProviderFamilyDomain, currentSelections: ProviderFamilyConnectionSelectionSettings | null | undefined): ProviderFamilyConnectionSelectionSettings;
export declare function clearProviderFamilyDomain(settingService: Pick<ISettingService, "update">): Promise<void>;
//# sourceMappingURL=providerFamilyDomainSettings.d.ts.map