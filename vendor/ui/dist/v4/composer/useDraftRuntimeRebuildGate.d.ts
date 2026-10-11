/**
 * 重建窗口上限。实测 agent start→ready 约 550-650ms，createSession 再数百 ms，5s 有充分余量。
 * 超时只解除门禁，不取消重建——迟到的 binding 仍会正常更新 effectiveSessionId 并唤醒附件重传。
 */
export declare const DRAFT_RUNTIME_REBUILD_TIMEOUT_MS = 5000;
export interface DraftRuntimeRebuildGateState {
    rebuilding: boolean;
    /** 换代发生时的预热会话 id；出现与之不同的非空 id 即视为重建完成。 */
    pendingFrom: string | null;
    /** 单调递增，仅用于让计时器 effect 在「重建中再次换代」时重新起算。 */
    epoch: number;
}
export type DraftRuntimeRebuildGateEvent = {
    type: "runtimeRestart";
    prewarmSessionId: string | null;
} | {
    type: "prewarmSessionChanged";
    prewarmSessionId: string | null;
} | {
    type: "rebuildTimeout";
};
export declare const DRAFT_RUNTIME_REBUILD_GATE_IDLE: DraftRuntimeRebuildGateState;
export declare function reduceDraftRuntimeRebuildGate(state: DraftRuntimeRebuildGateState, event: DraftRuntimeRebuildGateEvent): DraftRuntimeRebuildGateState;
export interface DraftRuntimeRebuildGate {
    /** 预热会话正在重建；true 时必须禁止发送，否则附件会挂在已消失的会话上。 */
    rebuilding: boolean;
}
/**
 * CUA Helper 就绪、liveness 恢复等原因会回收 agent runtime（workspace-dispose），把草稿态
 * 尚未持久化的预热会话一并冲掉。此 hook 在 runtime 换代时递增 draftRuntimeInvalidationVersion
 * 触发重建，并在重建窗口内给出 rebuilding=true 供发送门禁使用。
 *
 * 换代信号优先取 onRuntimeLifecycle 的 unavailable：它在 dispose 当场到达。onRuntimeRestart
 * 只在新 agent 进程 spawn 时才发，而 agent 是懒启动——没人发请求就不 spawn，于是换代通知
 * 永不到达、预热会话永不重建，附件一直卡在 waitingSession，直到用户手动点一次发送才被踹活
 * （生产实测 helper ready 到重建间隔 2.3s/6.0s/26.3s，全等于用户点击时刻）。
 *
 * 正式会话态（sessionId !== null）不启用：那条路径由 CLI 的 cold-session-resume 负责。
 */
export declare function useDraftRuntimeRebuildGate(params: {
    /** 仅草稿态（sessionId === null）启用。 */
    enabled: boolean;
    workspacePath: string;
    workspaceIdentity?: string;
    /** 当前预热会话 id；出现新的非空值即视为重建完成。 */
    prewarmSessionId: string | null;
    onRuntimeRestart?: (listener: () => void) => () => void;
    /** 承载 transport 暴露 runtime 存活态时优先用它，替代 onRuntimeRestart。 */
    onRuntimeLifecycle?: (listener: (state: "available" | "unavailable") => void) => () => void;
    timeoutMs?: number;
}): DraftRuntimeRebuildGate;
//# sourceMappingURL=useDraftRuntimeRebuildGate.d.ts.map