import { type CodingPlanUsageSource } from "@/settings/usage-stats/CodingPlanUsagePanel.js";
export type UsageStatsSectionTab = "app" | "codingPlan" | `codingPlan:${string}`;
export declare function UsageStatsSection({ activeTab, providerSourcesLoading, workspaceIdentity, workspacePath, selectedCodingPlanSource, }: {
    activeTab: UsageStatsSectionTab;
    providerSourcesLoading: boolean;
    workspaceIdentity?: string;
    workspacePath?: string;
    selectedCodingPlanSource?: CodingPlanUsageSource | null;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=UsageStatsSection.d.ts.map