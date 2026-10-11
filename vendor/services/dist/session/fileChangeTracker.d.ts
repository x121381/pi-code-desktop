/**
 * Session 文件变更追踪器
 *
 * 记录 agent runtime 文件写入产生的 before/after 内容。
 * 同一文件在同一轮中被多次修改时，只保留首次 before 和最末 after（合并首尾）。
 *
 * 用途：
 * - Rewind：回滚到某一轮时，逆序还原 beforeContent
 * - 汇聚：获取整个 session 所有文件操作的最终结果
 */
/** 单个文件在一轮中的变更快照（合并首尾） */
interface FileSnapshot {
    path: string;
    /** 该轮首次修改前的文件内容，null 表示新文件 */
    beforeContent: string | null;
    /** 该轮最后一次写入的内容 */
    afterContent: string;
    /** 该轮内被写入的次数 */
    writeCount: number;
}
/** 可序列化的文件快照（用于持久化） */
interface SerializedFileSnapshot {
    path: string;
    beforeContent: string | null;
    afterContent: string;
    writeCount: number;
}
/** 可序列化的轮次文件变更（用于持久化） */
interface SerializedTurnFileChanges {
    turnIndex: number;
    snapshots: SerializedFileSnapshot[];
    fileState?: "applied" | "reverted";
}
export declare class SessionFileChangeTracker {
    private turns;
    private currentTurnIndex;
    /** 开始新一轮对话，推进 turnIndex */
    newTurn(): number;
    /**
     * 记录一次文件写入操作。
     * 应在 writeTextFile 执行前读取原文件内容，写入后调用此方法。
     *
     * @param path 文件路径
     * @param beforeContent 写入前的文件内容，null 表示新文件
     * @param afterContent 写入后的文件内容
     */
    record(path: string, beforeContent: string | null, afterContent: string): void;
    /** 获取指定轮次的文件变更 */
    getChangesForTurn(turnIndex: number): FileSnapshot[];
    /** 获取指定轮次文件状态 */
    getFileStateForTurn(turnIndex: number): "applied" | "reverted";
    /** 更新指定轮次文件状态 */
    setFileStateForTurn(turnIndex: number, fileState: "applied" | "reverted"): void;
    /** 获取指定轮次之后（不含该轮）的所有文件变更，按轮次正序 */
    getChangesAfterTurn(turnIndex: number): FileSnapshot[];
    /**
     * 计算回滚到指定轮次所需的文件还原操作。
     * 返回每个文件应还原到的内容（null 表示应删除该文件）。
     * 逻辑：收集 toTurnIndex 之后所有轮次中每个文件最早的 beforeContent。
     * 如果该文件在 toTurnIndex 或之前也被修改过，则用那一轮的 afterContent。
     */
    getRewindOperations(toTurnIndex: number): Map<string, string | null>;
    /** 获取整个 session 中所有被修改过的文件及其最终内容 */
    getAllChangedFiles(): Map<string, {
        originalContent: string | null;
        finalContent: string;
    }>;
    /** 获取当前轮次索引 */
    getCurrentTurnIndex(): number;
    /** 对仅有消息历史、没有 fileChanges 的旧任务，补齐当前轮次游标 */
    restoreCurrentTurnIndex(turnIndex: number): void;
    /** 获取总轮次数 */
    getTurnCount(): number;
    /** 序列化为可 JSON 化的结构 */
    serialize(): SerializedTurnFileChanges[];
    /** 从序列化数据恢复 */
    static deserialize(data: SerializedTurnFileChanges[]): SessionFileChangeTracker;
    /** 截断到指定轮次（含），删除之后的所有记录 */
    truncateAfterTurn(turnIndex: number): void;
}
export {};
//# sourceMappingURL=fileChangeTracker.d.ts.map