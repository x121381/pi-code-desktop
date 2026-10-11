import type { ProjectMemoryWorkspaceSummary } from "@zcode/services";
export type MemoryViewerLoadingState = "idle" | "loading" | "ready" | "error";
export declare function MemorySettingsViewer({ catalogError, catalogState, selectedWorkspace, workspaces, onRefresh, onScopeKeyChange, }: {
    catalogError: string | null;
    catalogState: MemoryViewerLoadingState;
    selectedWorkspace: ProjectMemoryWorkspaceSummary | undefined;
    workspaces: ProjectMemoryWorkspaceSummary[];
    onRefresh: () => Promise<void>;
    onScopeKeyChange: (workspaceId: string) => void;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=MemorySettingsViewer.d.ts.map