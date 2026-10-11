import { type WindowTabState } from "@/store/tabStore.js";
export interface WorkspaceOpenInEditorScope {
    workspacePath?: string;
    workspaceIdentity?: string;
    workspaceRemoteSessionId?: string;
}
export declare function resolveWorkspaceOpenInEditorTarget(tabs: readonly WindowTabState[], scope: WorkspaceOpenInEditorScope): {
    isRemoteWorkspace: boolean;
    remoteTarget: import("@zcode/shared").OpenInEditorRemoteTarget | undefined;
};
export declare function useWorkspaceOpenInEditorTarget(scope: WorkspaceOpenInEditorScope): {
    isRemoteWorkspace: boolean;
    remoteTarget: import("@zcode/shared").OpenInEditorRemoteTarget | undefined;
};
//# sourceMappingURL=useWorkspaceOpenInEditorTarget.d.ts.map