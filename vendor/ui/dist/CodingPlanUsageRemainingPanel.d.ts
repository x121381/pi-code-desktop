import type { UsageEntitlementSnapshot, ZCodeAccountAccess, ZCodeProviderAccountAccess } from "@zcode/shared";
import type { SidebarUsageCodingPlanProviderId, SidebarUsageCodingPlanSourceId } from "@/lib/sidebarUsageCodingPlanProviderPreference.js";
export interface CodingPlanUsageRemainingEntitlement {
    sourceId?: SidebarUsageCodingPlanSourceId;
    providerId: SidebarUsageCodingPlanProviderId;
    accountAccess: ZCodeProviderAccountAccess | ZCodeAccountAccess;
    label?: string;
    snapshot: UsageEntitlementSnapshot | null;
    loading: boolean;
    error: string | null;
}
export interface CodingPlanUsageAvailableProvider {
    providerId: SidebarUsageCodingPlanProviderId;
    accountAccess: ZCodeProviderAccountAccess | ZCodeAccountAccess;
    label: string;
}
export interface CodingPlanUsageRemainingState {
    activeProviderId?: SidebarUsageCodingPlanSourceId;
    displayedEntitlement: CodingPlanUsageRemainingEntitlement | null;
    displayedProviderId?: SidebarUsageCodingPlanSourceId;
    hasAnyActiveCodingPlan: boolean;
    loading: boolean;
    providerEntitlements: CodingPlanUsageRemainingEntitlement[];
    tabProviders: CodingPlanUsageRemainingTabProvider[];
    visibleSnapshot: UsageEntitlementSnapshot | null;
}
interface CodingPlanUsageRemainingTabProvider {
    id: SidebarUsageCodingPlanSourceId;
    providerId: SidebarUsageCodingPlanProviderId;
    label: string;
}
export declare function hasActiveCodingPlanSnapshot(snapshot: UsageEntitlementSnapshot | null, providerId: string): boolean;
export declare function resolveCodingPlanUsageRemainingState(params: {
    availableProviders: CodingPlanUsageAvailableProvider[];
    entitlements: CodingPlanUsageRemainingEntitlement[];
    modelProvidersLoading: boolean;
    selectedProviderId?: SidebarUsageCodingPlanSourceId;
}): CodingPlanUsageRemainingState | null;
export declare function hasCodingPlanUsageRemainingPanel(params: {
    availableProviders: CodingPlanUsageAvailableProvider[];
    entitlements: CodingPlanUsageRemainingEntitlement[];
    modelProvidersLoading: boolean;
    selectedProviderId?: SidebarUsageCodingPlanSourceId;
}): boolean;
export declare function CodingPlanUsageRemainingPanel({ availableProviders, audience, className, entitlements, modelProvidersLoading, onProviderChange, onUsageClick, selectedProviderId, }: {
    availableProviders: CodingPlanUsageAvailableProvider[];
    audience?: "individual" | "team";
    className?: string;
    entitlements: CodingPlanUsageRemainingEntitlement[];
    modelProvidersLoading: boolean;
    onProviderChange?: (providerId: SidebarUsageCodingPlanSourceId) => void;
    onUsageClick?: () => void;
    selectedProviderId?: SidebarUsageCodingPlanSourceId;
}): import("react/jsx-runtime").JSX.Element | null;
export {};
//# sourceMappingURL=CodingPlanUsageRemainingPanel.d.ts.map