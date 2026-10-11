import type { WorkspacePurpose } from "@zcode/shared";
import type { WorkspaceTabState } from "@/store/tabStore.js";
export declare function getWorkspacePurpose(target: {
    workspacePurpose?: WorkspacePurpose;
}): WorkspacePurpose;
export declare function partitionWorkspaceTabsByPurpose(workspaceTabs: WorkspaceTabState[]): {
    allTaskWorkspaceTabs: WorkspaceTabState[];
    conversationWorkspaceTabs: WorkspaceTabState[];
    projectWorkspaceTabs: WorkspaceTabState[];
};
//# sourceMappingURL=workspacePurpose.d.ts.map