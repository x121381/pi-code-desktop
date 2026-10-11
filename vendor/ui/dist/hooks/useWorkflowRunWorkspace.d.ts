import type { WorkflowRunWorkspaceNode } from "@zcode/shared/zcode-protocol-v4";
interface WorkflowRunWorkspaceState {
    nodes: readonly WorkflowRunWorkspaceNode[];
    /** 至少成功读过一次（占位与落点都等它）。 */
    loaded: boolean;
    loading: boolean;
    /** 清单被网关截尾（超过 maxNodes）。 */
    truncated: boolean;
    /** 会话不支持工作区查询（老 CLI）。 */
    unavailable: boolean;
    error: string | null;
}
export declare function useWorkflowRunWorkspace(options: {
    sessionId: string;
    runId: string;
    /** 刷新信号：活投影里该 run 的 `lastEventSequence`；run 不在投影里时缺席（只查一次）。 */
    refreshSignal?: number;
    enabled?: boolean;
}): WorkflowRunWorkspaceState;
export {};
//# sourceMappingURL=useWorkflowRunWorkspace.d.ts.map