import { jsx as _jsx } from "react/jsx-runtime";
import { AppUsagePanel } from "../settings/usage-stats/AppUsagePanel.js";
import { CodingPlanUsagePanel, } from "../settings/usage-stats/CodingPlanUsagePanel.js";
export function UsageStatsSection({ activeTab, providerSourcesLoading, workspaceIdentity, workspacePath, selectedCodingPlanSource, }) {
    if (activeTab === "app") {
        return _jsx(AppUsagePanel, {});
    }
    return (_jsx(CodingPlanUsagePanel, { loadingSources: providerSourcesLoading, workspaceIdentity: workspaceIdentity, workspacePath: workspacePath, selectedSource: selectedCodingPlanSource }));
}
//# sourceMappingURL=UsageStatsSection.js.map