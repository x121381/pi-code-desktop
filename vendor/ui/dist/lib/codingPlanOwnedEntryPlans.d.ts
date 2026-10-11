import { type UsageEntitlementSnapshot } from "@zcode/shared";
export declare function buildOwnedEntryPlanList({ snapshots, teamProducts, }: {
    snapshots: readonly (UsageEntitlementSnapshot | null | undefined)[];
    teamProducts: readonly {
        subscribed?: boolean | null;
        tier: string;
        productId: string;
    }[];
}): string;
//# sourceMappingURL=codingPlanOwnedEntryPlans.d.ts.map