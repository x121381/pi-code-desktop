import type { ZCodeSessionEndedSubagent, ZCodeSessionSubagentsResult } from "@zcode/shared";
export interface SessionSubagentsViewState {
    revision: number;
    ended: ZCodeSessionSubagentsResult["ended"];
    error: string | null;
    loading: boolean;
}
export declare function mergeEndedSubagentPages(current: readonly ZCodeSessionEndedSubagent[], incoming: readonly ZCodeSessionEndedSubagent[]): ZCodeSessionEndedSubagent[];
export declare function resolveEndedSubagentRefreshTargetCount(options: {
    loadedItemCount: number;
    nextTotal: number;
    previousTotal: number;
    requestedCount: number;
}): number;
export declare function useSessionSubagents(options: {
    enabled?: boolean;
    refreshKey?: string | number | null;
    remoteSessionId?: string;
    sessionId?: string | null;
    workspaceIdentity?: string;
    workspacePath: string;
}): {
    loadMore: () => Promise<void>;
    refresh: () => Promise<void>;
    revision: number;
    ended: ZCodeSessionSubagentsResult["ended"];
    error: string | null;
    loading: boolean;
};
//# sourceMappingURL=useSessionSubagents.d.ts.map