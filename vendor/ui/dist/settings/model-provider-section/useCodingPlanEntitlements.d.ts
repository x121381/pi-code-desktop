import type { ProviderSettingsView } from "@zcode/services";
import { type ProviderFamilyConnectionSelectionSettings } from "@zcode/shared";
import { type UsageEntitlementRefreshOptions } from "@/hooks/useUsageEntitlement.js";
import type { CodingPlanEntitlementState } from "@/settings/model-provider-section/constants.js";
export declare function resolveCodingPlanProviderFingerprintAutoRefresh({ loading, providerFingerprint, skippedProviderFingerprint, suppressAutoRefresh, }: {
    loading: boolean;
    providerFingerprint: string;
    skippedProviderFingerprint: string;
    suppressAutoRefresh: boolean;
}): {
    shouldRefresh: boolean;
    skippedProviderFingerprint: string;
};
export declare function useCodingPlanAccessRefresh({ refresh, selectedPlanKey, }: {
    refresh: (options?: UsageEntitlementRefreshOptions) => Promise<void>;
    selectedPlanKey: string | null;
}): void;
export declare function useCodingPlanEntitlements({ providerSettingsView, connectionSelections, suppressProviderFingerprintAutoRefresh, }: {
    providerSettingsView: ProviderSettingsView | null;
    connectionSelections?: ProviderFamilyConnectionSelectionSettings;
    suppressProviderFingerprintAutoRefresh?: boolean;
}): {
    entitlements: Partial<Record<string, CodingPlanEntitlementState>>;
    /** 当前具备 Account Access、能够独立查询权益的 Start Plan Provider。 */
    enabledStartPlanProviderIds: string[];
    refresh: (options?: UsageEntitlementRefreshOptions) => Promise<void>;
};
//# sourceMappingURL=useCodingPlanEntitlements.d.ts.map