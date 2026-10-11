import type { ConversationDelta } from "./delta.js";
import type { ConversationSnapshot } from "./snapshot.js";
/**
 * 仅供服务端在未发布的候选快照内批量归约使用。
 *
 * 冷恢复逐条调用不可变 apply 时，每次 append/upsert 都复制随历史增长的
 * rows.window，并再次线性查找 rowId，长会话因此退化为 O(N²)。候选快照尚未对外可见，
 * 可以在这条明确的隔离边界内复用同一份数组和增量索引；普通客户端仍使用上面的
 * 不可变语义，避免已发布快照被后续事件篡改。
 */
export interface MutableConversationSnapshotAccumulator {
    snapshot: ConversationSnapshot;
    rowIndexById: Map<number, number>;
}
export declare function createMutableConversationSnapshotAccumulator(snapshot: ConversationSnapshot): MutableConversationSnapshotAccumulator;
/** 应用单条 delta，返回新快照（入参不被修改）。 */
export declare function applyConversationDelta(snapshot: ConversationSnapshot, delta: ConversationDelta): ConversationSnapshot;
/** 按序应用一串 delta。 */
export declare function applyConversationDeltas(snapshot: ConversationSnapshot, deltas: readonly ConversationDelta[]): ConversationSnapshot;
/**
 * 在未发布候选快照上原地应用单条 delta；语义必须与 applyConversationDelta 一致。
 * 调用者不得把 accumulator.snapshot 暴露给订阅者后继续调用本函数。
 */
export declare function applyConversationDeltaMutable(accumulator: MutableConversationSnapshotAccumulator, delta: ConversationDelta): void;
/** 按序原地应用一串 delta，仅适用于未发布的候选快照。 */
export declare function applyConversationDeltasMutable(accumulator: MutableConversationSnapshotAccumulator, deltas: readonly ConversationDelta[]): void;
//# sourceMappingURL=apply.d.ts.map