interface StorageLike {
    getItem(key: string): string | null;
    setItem(key: string, value: string): void;
}
export declare const WORKFLOW_RUN_ACK_STORAGE_KEY = "zcode-workflow-run-acknowledged";
/** 集合上限；满了淘汰最早确认的。256 远大于任何会话列表里同时挂着的已结束 run 数。 */
export declare const WORKFLOW_RUN_ACK_LIMIT = 256;
export interface WorkflowRunAckStore {
    isAcknowledged(runId: string): boolean;
    acknowledge(runIds: readonly string[]): void;
    subscribe(listener: () => void): () => void;
    /** 版本号快照：每次集合变化 +1，供 useSyncExternalStore 判等。 */
    getVersion(): number;
}
export declare function createWorkflowRunAckStore(storage: StorageLike | null): WorkflowRunAckStore;
export declare function getWorkflowRunAckStore(): WorkflowRunAckStore;
/** 测试用：换掉单例（含 `null` 复位）。 */
export declare function setWorkflowRunAckStoreForTesting(store: WorkflowRunAckStore | null): void;
/** 订阅确认集合的版本；返回的谓词随版本变化换引用，调用方据此重算行选择。 */
export declare function useWorkflowRunAcknowledged(): (runId: string) => boolean;
export {};
//# sourceMappingURL=workflowRunAckStore.d.ts.map