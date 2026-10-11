export declare function readPersistedPaneSession(workspaceKey: string): string | null;
export declare function persistPaneSession(workspaceKey: string, sessionId: string | null): void;
export interface UsePaneSessionPersistenceParams {
    workspaceKey: string;
    activeSessionId: string | null;
    /** startDraft 的显式用户意图代次；大于 0 时 null 表示草稿，不是待恢复。 */
    draftFocusVersion: number;
    /** 手机 /remote 不消费 desktop pane 的本地恢复状态。 */
    enabled?: boolean;
    /** 恢复入口：与用户点击任务列表同一条选择路径，保证副作用（已读清理等）一致。 */
    selectSession: (sessionId: string) => void;
}
export declare function shouldRestorePersistedPaneSession(params: {
    activeSessionId: string | null;
    draftFocusVersion: number;
    enabled: boolean;
    rendererReload: boolean;
}): boolean;
/**
 * 挂载时恢复上次绑定的 session；此后跟随选择态写入/清除。
 * 只在每个 workspaceKey 首次挂载时恢复一次——用户显式回到 draft（新任务）
 * 属于选择变化，会把持久化键清掉，不会被反复拉回旧会话。
 */
export declare function usePaneSessionPersistence({ workspaceKey, activeSessionId, draftFocusVersion, enabled, selectSession, }: UsePaneSessionPersistenceParams): void;
//# sourceMappingURL=usePaneSessionPersistence.d.ts.map