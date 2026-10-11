import { type ProviderFamilyConnectionSelectionSettings, type ProviderFamilyDomain, type ZCodeAccountAccess, type ZCodeProviderAccountAccess } from "@zcode/shared";
import { type EnterpriseCodingPlanProductDisplay } from "@/settings/model-provider-section/enterpriseCodingPlanProducts.js";
import type { SidebarUsageCodingPlanProviderId, SidebarUsageCodingPlanSourceId } from "@/lib/sidebarUsageCodingPlanProviderPreference.js";
export interface CodingPlanUsageSource {
    id: SidebarUsageCodingPlanSourceId;
    providerId: SidebarUsageCodingPlanProviderId;
    label: string;
    accountAccess: ZCodeProviderAccountAccess | ZCodeAccountAccess;
}
export declare function buildPersonalCodingPlanUsageSource({ providerId, accountAccess, label, }: {
    providerId: SidebarUsageCodingPlanProviderId;
    accountAccess: ZCodeProviderAccountAccess | ZCodeAccountAccess;
    label?: string | null;
}): CodingPlanUsageSource;
export type CurrentSidebarCodingPlanUsageSource = {
    audience: "individual";
    providerId: SidebarUsageCodingPlanProviderId;
    sourceId: SidebarUsageCodingPlanSourceId;
    accountAccess: ZCodeProviderAccountAccess | ZCodeAccountAccess;
    teamSource?: never;
} | {
    audience: "team";
    providerId: SidebarUsageCodingPlanProviderId;
    sourceId: SidebarUsageCodingPlanSourceId;
    teamSource: CodingPlanUsageSource;
};
export declare function buildCodingPlanUsageSources({ accountAccesses, subscribedTeamProducts, }: {
    accountAccesses: Partial<Record<ProviderFamilyDomain, ZCodeProviderAccountAccess>>;
    subscribedTeamProducts: EnterpriseCodingPlanProductDisplay[];
}): CodingPlanUsageSource[];
export declare function resolveSidebarCurrentCodingPlanUsageSource({ selections, selectedProviderId, accountAccesses, teamSources, }: {
    selections?: ProviderFamilyConnectionSelectionSettings | null;
    selectedProviderId: string | null;
    accountAccesses: Partial<Record<ProviderFamilyDomain, ZCodeProviderAccountAccess>>;
    teamSources: CodingPlanUsageSource[];
}): CurrentSidebarCodingPlanUsageSource | null;
export declare function matchesTeamPlanUsageSourceKey(sourceId: string, selectedKey: string): boolean;
//# sourceMappingURL=codingPlanUsageSources.d.ts.map