import type { WorkspaceSidePaneTab } from "@/lib/workspaceSidePane.js";
export declare function SortableSidePaneTabTrigger({ tab, title, closeTabLabel, closeTabMenuLabel, closeOtherTabsLabel, closeAllTabsLabel, diffBadgeLabel, isActive, onActivateTab, onCloseTab, onCloseOtherTabs, onCloseAllTabs, canCloseOtherTabs, }: {
    tab: WorkspaceSidePaneTab;
    title: string;
    closeTabLabel: string;
    closeTabMenuLabel: string;
    closeOtherTabsLabel: string;
    closeAllTabsLabel: string;
    diffBadgeLabel: string;
    isActive: boolean;
    onActivateTab: (tabId: string) => void;
    onCloseTab: (tabId: string) => void;
    onCloseOtherTabs: (tabId: string) => void;
    onCloseAllTabs: () => void;
    canCloseOtherTabs: boolean;
}): import("react/jsx-runtime").JSX.Element;
export declare function SidePaneTabDragOverlay({ tab, title, diffBadgeLabel, }: {
    tab: WorkspaceSidePaneTab;
    title: string;
    diffBadgeLabel: string;
}): import("react/jsx-runtime").JSX.Element;
export declare function SidePaneTabIcon({ tab }: {
    tab: WorkspaceSidePaneTab;
}): import("react/jsx-runtime").JSX.Element;
export declare function getPatchFileDisplayTarget(source: {
    path?: string;
    title: string;
    patch: string;
}): string | null;
export declare function getSidePaneTabTitle(tab: WorkspaceSidePaneTab, formatMessage: (descriptor: {
    id: string;
}, values?: Record<string, string>) => string): string;
//# sourceMappingURL=SidePaneTabTrigger.d.ts.map