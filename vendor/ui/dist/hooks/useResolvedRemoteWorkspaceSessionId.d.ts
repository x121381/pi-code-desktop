import { type WorkspaceTabState } from "@/store/tabStore.js";
import { type WorkspaceServiceResolverState } from "@/lib/workspaceServiceResolver.js";
export declare function resolveRemoteWorkspaceSessionIdForTarget<TServices>(params: {
    workspacePath: string | null | undefined;
    preferredRemoteSessionId?: string | null;
    workspaceIdentity?: string | null;
    remoteTarget?: unknown;
    activeTab?: WorkspaceTabState | null;
    state: WorkspaceServiceResolverState<TServices>;
}): string | null;
export declare function useResolvedRemoteWorkspaceSessionId(workspacePath: string | null | undefined, preferredRemoteSessionId?: string | null, workspaceIdentity?: string | null, remoteTarget?: unknown): string | null;
//# sourceMappingURL=useResolvedRemoteWorkspaceSessionId.d.ts.map