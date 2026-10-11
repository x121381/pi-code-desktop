import { type SidePaneTabPresentationLabels } from "@/app-shell/sidePaneTabPresentation.js";
import type { RecentClosedSidePaneTab } from "@/hooks/useAppPanels.js";
import type { WorkspaceSidePaneTab } from "@/lib/workspaceSidePane.js";
export declare function SidePaneTabOverview({ tabs, activeTabId, recentClosedTabs, labels, onActivateTab, onCloseTab, onReopenClosedTab, }: {
    tabs: WorkspaceSidePaneTab[];
    activeTabId: string;
    recentClosedTabs: RecentClosedSidePaneTab[];
    labels: SidePaneTabPresentationLabels & {
        title: string;
        searchPlaceholder: string;
        openTabs: string;
        recentlyClosedTabs: string;
        noResults: string;
        closeTab: (title: string) => string;
        relativeTime: (timestamp: number) => string;
    };
    onActivateTab: (tabId: string) => void;
    onCloseTab: (tabId: string) => void;
    onReopenClosedTab: (tabId: string) => void;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=SidePaneTabOverview.d.ts.map