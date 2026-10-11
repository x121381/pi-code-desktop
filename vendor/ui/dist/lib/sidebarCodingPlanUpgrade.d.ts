import { type ProviderFamilyDomain, type UsageEntitlementSnapshot } from "@zcode/shared";
import type { CodingPlanUsageAvailableProvider } from "@/CodingPlanUsageRemainingPanel.js";
import type { SidebarUsageCodingPlanProviderId } from "@/lib/sidebarUsageCodingPlanProviderPreference.js";
export interface SidebarCodingPlanUpgradeEntitlement {
    providerId: SidebarUsageCodingPlanProviderId;
    snapshot: UsageEntitlementSnapshot | null;
    loading: boolean;
}
export declare function resolveSidebarCodingPlanUpgradeFallbackProviderId(providerFamilyDomain: ProviderFamilyDomain | null): SidebarUsageCodingPlanProviderId;
export declare function isTerminalCodingPlanSnapshot(snapshot: UsageEntitlementSnapshot | null): boolean;
export declare function isMaxCodingPlanSnapshot(snapshot: UsageEntitlementSnapshot | null): boolean;
export declare function resolveSidebarCodingPlanUpgradeProviderId(params: {
    availableProviders: CodingPlanUsageAvailableProvider[];
    entitlements: SidebarCodingPlanUpgradeEntitlement[];
    modelProvidersLoading: boolean;
    selectedProviderId?: SidebarUsageCodingPlanProviderId;
}): SidebarUsageCodingPlanProviderId | undefined;
//# sourceMappingURL=sidebarCodingPlanUpgrade.d.ts.map