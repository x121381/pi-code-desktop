import { type CodingPlanUsageAvailableProvider } from "@/CodingPlanUsageRemainingPanel.js";
import { type CodingPlanFunnelContext } from "@/lib/codingPlanFunnelTelemetry.js";
import { type SidebarUsageCodingPlanProviderId } from "@/lib/sidebarUsageCodingPlanProviderPreference.js";
export { resolveSidebarFooterPlanBadgeLabel, resolveSidebarFooterProfilePlanBadge, } from "@/WorkspaceSidebarFooterPlanBadgeHelpers.js";
export declare function WorkspaceSidebarFooterUsageSummary({ enabled, onUsageClick, onUpgradeClick, workspaceIdentity, workspacePath, }: {
    enabled: boolean;
    onUsageClick?: () => void;
    onUpgradeClick?: (providerId: SidebarUsageCodingPlanProviderId, funnelContext: CodingPlanFunnelContext) => void;
    workspaceIdentity?: string;
    workspacePath?: string;
}): import("react/jsx-runtime").JSX.Element;
export declare function useWorkspaceSidebarFooterUsageSummaryState({ enabled, workspaceIdentity, workspacePath, }: {
    enabled: boolean;
    workspaceIdentity?: string;
    workspacePath?: string;
}): {
    audience: "individual" | "team" | undefined;
    availableCodingPlanProviders: CodingPlanUsageAvailableProvider[];
    providerSourcesLoading: boolean;
    providerEntitlements: ({
        snapshot: import("@zcode/shared").UsageEntitlementSnapshot | null;
        loading: boolean;
        error: string | null;
        refresh: (refreshOptions?: import("@/hooks/useUsageEntitlement.js").UsageEntitlementRefreshOptions) => Promise<void>;
        sourceId: "account:zai-individual-coding-plan";
        providerId: "account:zai-individual-coding-plan";
        accountAccess: {
            type: "zhipu-account";
            accountType: "bigmodel" | "zai";
            mode: "start-plan" | "individual-coding-plan" | "team-coding-plan" | "highspeed" | "off-peak";
            entitled: boolean;
        } | {
            type: "zhipu-account";
            family: "bigmodel" | "zai";
            planKind: "start-plan";
        } | {
            type: "zhipu-account";
            family: "bigmodel" | "zai";
            planKind: "individual-coding-plan";
        } | {
            type: "zhipu-account";
            family: "bigmodel" | "zai";
            planKind: "team-coding-plan";
            productId: string;
            organizationId: string;
            projectId: string;
        };
    } | {
        snapshot: import("@zcode/shared").UsageEntitlementSnapshot | null;
        loading: boolean;
        error: string | null;
        refresh: (refreshOptions?: import("@/hooks/useUsageEntitlement.js").UsageEntitlementRefreshOptions) => Promise<void>;
        sourceId: "account:bigmodel-individual-coding-plan";
        providerId: "account:bigmodel-individual-coding-plan";
        accountAccess: {
            type: "zhipu-account";
            accountType: "bigmodel" | "zai";
            mode: "start-plan" | "individual-coding-plan" | "team-coding-plan" | "highspeed" | "off-peak";
            entitled: boolean;
        } | {
            type: "zhipu-account";
            family: "bigmodel" | "zai";
            planKind: "start-plan";
        } | {
            type: "zhipu-account";
            family: "bigmodel" | "zai";
            planKind: "individual-coding-plan";
        } | {
            type: "zhipu-account";
            family: "bigmodel" | "zai";
            planKind: "team-coding-plan";
            productId: string;
            organizationId: string;
            projectId: string;
        };
    } | {
        snapshot: import("@zcode/shared").UsageEntitlementSnapshot | null;
        loading: boolean;
        error: string | null;
        refresh: (refreshOptions?: import("@/hooks/useUsageEntitlement.js").UsageEntitlementRefreshOptions) => Promise<void>;
        sourceId: import("@/lib/sidebarUsageCodingPlanProviderPreference.js").SidebarUsageCodingPlanSourceId;
        providerId: SidebarUsageCodingPlanProviderId;
        accountAccess: {
            type: "zhipu-account";
            accountType: "bigmodel" | "zai";
            mode: "start-plan" | "individual-coding-plan" | "team-coding-plan" | "highspeed" | "off-peak";
            entitled: boolean;
        } | {
            type: "zhipu-account";
            family: "bigmodel" | "zai";
            planKind: "start-plan";
        } | {
            type: "zhipu-account";
            family: "bigmodel" | "zai";
            planKind: "individual-coding-plan";
        } | {
            type: "zhipu-account";
            family: "bigmodel" | "zai";
            planKind: "team-coding-plan";
            productId: string;
            organizationId: string;
            projectId: string;
        };
        label: string;
    })[];
    profilePlanBadge: import("@/WorkspaceSidebarFooterPlanBadgeHelpers.js").SidebarFooterProfilePlanBadge | null;
    selectedProviderId: import("@/lib/sidebarUsageCodingPlanProviderPreference.js").SidebarUsageCodingPlanSourceId | undefined;
    upgradeTargetProviderId: SidebarUsageCodingPlanProviderId;
    usageState: import("@/CodingPlanUsageRemainingPanel.js").CodingPlanUsageRemainingState | null;
};
export type WorkspaceSidebarFooterUsageSummaryState = ReturnType<typeof useWorkspaceSidebarFooterUsageSummaryState>;
export declare function WorkspaceSidebarFooterUsageSummaryContent({ state, onUsageClick, onUpgradeClick, }: {
    state: WorkspaceSidebarFooterUsageSummaryState;
    onUsageClick?: () => void;
    onUpgradeClick?: (providerId: SidebarUsageCodingPlanProviderId, funnelContext: CodingPlanFunnelContext) => void;
}): import("react/jsx-runtime").JSX.Element;
export declare function WorkspaceSidebarFooterPlanBadge({ state, }: {
    state: WorkspaceSidebarFooterUsageSummaryState;
}): import("react/jsx-runtime").JSX.Element | null;
//# sourceMappingURL=WorkspaceSidebarFooterUsageSummary.d.ts.map