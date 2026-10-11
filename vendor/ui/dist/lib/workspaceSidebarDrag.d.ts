import type { WorkspaceTabState } from "@/store/tabStore.js";
import type { SortingStrategy } from "@dnd-kit/sortable";
export declare function resolveWorkspaceDragSiblingDisplacement(params: {
    activeIndex: number;
    index: number;
    itemGap: number;
    overIndex: number;
}): number;
export declare const workspaceVerticalListSortingStrategy: SortingStrategy;
export declare function resolveWorkspaceDragExpanded(params: {
    activeDragId: string | null;
    expanded: boolean;
    tabId: string;
}): boolean;
export declare function resolveWorkspaceDragGlobalIndices(params: {
    activeId: string;
    overId: string;
    projectTabs: readonly WorkspaceTabState[];
    workspaceTabs: readonly WorkspaceTabState[];
}): {
    fromIndex: number;
    toIndex: number;
} | null;
//# sourceMappingURL=workspaceSidebarDrag.d.ts.map