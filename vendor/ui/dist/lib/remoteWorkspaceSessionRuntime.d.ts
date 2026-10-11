import type { ZCodeSessionStoreState } from "@/store/zcodeSessionStore.js";
interface RemoteWorkspaceRuntimeTab {
    workspacePath: string;
    workspaceIdentity?: string;
}
interface MarkRemoteWorkspaceRunningTasksFailedParams {
    tabs: RemoteWorkspaceRuntimeTab[];
    getWorkspaceState: ZCodeSessionStoreState["getWorkspaceState"];
    setTaskRuntimeState: ZCodeSessionStoreState["setTaskRuntimeState"];
    reason: string;
}
export declare function markRemoteWorkspaceRunningTasksFailed({ tabs, getWorkspaceState, setTaskRuntimeState, reason, }: MarkRemoteWorkspaceRunningTasksFailedParams): number;
export {};
//# sourceMappingURL=remoteWorkspaceSessionRuntime.d.ts.map