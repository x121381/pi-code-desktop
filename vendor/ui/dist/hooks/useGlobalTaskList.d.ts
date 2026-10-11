import type { WindowHostControllerTaskListItem, ZCodeTaskListKind } from "@zcode/services";
import type { WorkspaceTabState } from "@/store/tabStore.js";
export declare function useGlobalTaskList(params: {
    kind: ZCodeTaskListKind;
    workspaceTabs: WorkspaceTabState[];
    sortBy: "created" | "updated";
    searchQuery: string;
    expanded: boolean;
    collapsedLimit: number;
}): {
    items: WindowHostControllerTaskListItem[];
    total: number;
    hasMore: boolean;
    loading: boolean;
    syncingRemoteWorkspaces: boolean;
    refresh: () => Promise<void>;
};
//# sourceMappingURL=useGlobalTaskList.d.ts.map