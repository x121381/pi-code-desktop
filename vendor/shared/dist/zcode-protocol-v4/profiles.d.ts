import type { DeliveryProfile } from "./core.js";
import type { ConversationDelta } from "./delta.js";
import type { ConversationRow } from "./rows.js";
export declare function filterConversationRowsForProfile(rows: readonly ConversationRow[], _profile: DeliveryProfile): ConversationRow[];
/**
 * 按 profile 的 streamPaths 开关过滤 delta 序列。
 * row.delta 按流式能力过滤；结构性完整行在两个 profile 中保持同一产品事实。
 * 纯函数，不修改入参；输出保持权威日志序。
 */
export declare function filterConversationDeltasForProfile(deltas: readonly ConversationDelta[], profile: DeliveryProfile): ConversationDelta[];
//# sourceMappingURL=profiles.d.ts.map