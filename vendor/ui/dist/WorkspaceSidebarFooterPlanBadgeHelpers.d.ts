import type { UsageEntitlementSnapshot } from "@zcode/shared";
export type SidebarFooterProfilePlanBadge = {
    audience: "individual";
    snapshot: UsageEntitlementSnapshot;
} | {
    audience: "team";
    snapshot?: never;
};
export declare function resolveSidebarFooterProfilePlanBadge({ hasTeamPlanEntitlement, individualEntitlements, }: {
    hasTeamPlanEntitlement: boolean;
    individualEntitlements: Array<{
        providerId: string;
        snapshot: UsageEntitlementSnapshot | null;
        loading?: boolean;
    }>;
}): SidebarFooterProfilePlanBadge | null;
export declare function resolveSidebarFooterPlanBadgeLabel(snapshot: UsageEntitlementSnapshot | null): string | null;
//# sourceMappingURL=WorkspaceSidebarFooterPlanBadgeHelpers.d.ts.map