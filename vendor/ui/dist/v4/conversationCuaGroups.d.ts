import type { AssistantTextRow, ReasoningRow, ToolCallRow } from "@zcode/shared/zcode-protocol-v4";
import type { TaskChatToolCallTreeNode } from "@/lib/toolCallTree.js";
import type { AssistantWorkRow } from "@/v4/conversationTurnRenderUnits.js";
import type { ConversationTurnFlowItem } from "@/v4/conversationTurnFlowItems.js";
export type ConversationCuaGroupEvent = {
    kind: "tool";
    row: ToolCallRow;
    node: TaskChatToolCallTreeNode;
} | {
    kind: "assistantMessage";
    row: AssistantTextRow;
} | {
    kind: "reasoning";
    row: ReasoningRow;
};
export interface ConversationCuaGroupRenderItem {
    kind: "cuaGroup";
    key: string;
    rowId: number;
    rows: ToolCallRow[];
    events: ConversationCuaGroupEvent[];
    node: TaskChatToolCallTreeNode;
    active: boolean;
    flowKind: "assistantHistory" | "assistantWork";
    assistantResponseIds: string[];
}
export declare const ENABLE_CUA_TOOL_CALL_GROUPING = true;
export declare function isOfficialCuaToolCallRow(row: AssistantWorkRow): boolean;
export declare function prepareCuaGroupFlowItems(sourceItems: readonly ConversationTurnFlowItem[], options: {
    enabled: boolean;
    stageTailIsRunning: boolean;
}): ConversationTurnFlowItem[];
/** 仅供 timeline-only/旧工作项路径兼容；正常 product turn 在 flow 层完成混合聚合。 */
export declare function prepareCuaGroups(rows: readonly AssistantWorkRow[], enabled: boolean, stageTailIsRunning: boolean): Array<AssistantWorkRow | ConversationCuaGroupRenderItem>;
//# sourceMappingURL=conversationCuaGroups.d.ts.map