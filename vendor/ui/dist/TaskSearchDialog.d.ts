import type { ZCodeTaskMeta } from "@zcode/shared";
import type { WorkspaceTabState } from "@/store/tabStore.js";
type TaskSearchResultItem = ZCodeTaskMeta & {
    searchSnippet?: string;
    searchSnippets?: string[];
};
export declare function TaskSearchDialog({ workspaceTabs, onSelectTask, onSelectSearchResult, openRequestId, }: {
    workspaceTabs: WorkspaceTabState[];
    onSelectTask: (targetWorkspacePath: string, taskId: string, targetWorkspaceIdentity?: string) => void;
    onSelectSearchResult?: (task: TaskSearchResultItem, context: {
        query: string;
        searchSnippet?: string;
        snippetIndex?: number;
    }) => void;
    openRequestId?: number;
}): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=TaskSearchDialog.d.ts.map