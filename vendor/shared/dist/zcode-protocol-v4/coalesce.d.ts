import type { ConversationDelta } from "./delta.js";
import { type WorkflowRunWireBounds } from "./workflow-runs-delta.js";
/**
 * 对一个 flush 窗口内的 delta 序列做语义保持合并。
 * 输入输出均按权威日志序；纯函数，不修改入参。
 *
 * `bounds` 只为测试留的注入口（默认就是真界）：规则 6 拒绝合并那一支在 1024 的界下要几千条
 * 事件才走得到，而它恰好是**合并等于顺序施加**这条定律最容易破的地方。
 */
export declare function coalesceConversationDeltas(deltas: readonly ConversationDelta[], bounds?: WorkflowRunWireBounds): ConversationDelta[];
/**
 * conflation 辅助（sessions-index 等最新态 topic 通用）：按 key 只保留每个对象的最后一次更新。
 * 保序：保留项按其「最后一次出现」的相对顺序输出。
 */
export declare function conflateByKey<T>(items: readonly T[], keyOf: (item: T) => string): T[];
//# sourceMappingURL=coalesce.d.ts.map