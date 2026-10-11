import type { GitChangeSourceId } from "@zcode/shared";
export declare function useTaskSidePaneMemoryBridge({ activeTaskId, gitSelectedSourceId, setGitSelectedSourceId, workspaceAbsPath, workspaceIdentity, }: {
    activeTaskId: string | null;
    gitSelectedSourceId: GitChangeSourceId;
    setGitSelectedSourceId: (value: GitChangeSourceId) => void;
    workspaceAbsPath: string;
    workspaceIdentity?: string;
}): {
    browserRestoreUrls: Record<string, string>;
    handleBrowserUrlChange: (tabId: string, url: string) => void;
};
//# sourceMappingURL=useTaskSidePaneMemoryBridge.d.ts.map