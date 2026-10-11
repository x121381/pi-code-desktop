import type { SubagentRow, ToolCallRow } from "@zcode/shared/zcode-protocol-v4";
import type { TaskChatToolCallTreeNode } from "@/lib/toolCallTree.js";
import { type ConversationReasoningVisibility } from "@/v4/conversationRowContext.js";
import type { AssistantWorkRow } from "@/v4/conversationTurnRenderUnits.js";
import { type ConversationCuaGroupRenderItem } from "@/v4/conversationCuaGroups.js";
export type ConversationAssistantWorkRenderItem = {
    kind: "row";
    key: string;
    row: AssistantWorkRow;
} | {
    kind: "exploreGroup";
    key: string;
    rowId: number;
    rows: ToolCallRow[];
    node: TaskChatToolCallTreeNode;
} | ConversationCuaGroupRenderItem | {
    kind: "executeGroup";
    key: string;
    rowId: number;
    rows: ToolCallRow[];
    node: TaskChatToolCallTreeNode;
} | {
    kind: "changesGroup";
    key: string;
    rowId: number;
    rows: ToolCallRow[];
    node: TaskChatToolCallTreeNode;
} | {
    kind: "agentToolCall";
    key: string;
    row: ToolCallRow;
    subagentRow: SubagentRow;
};
export declare const ENABLE_EXPLORE_TOOL_CALL_GROUPING = true;
export { ENABLE_CUA_TOOL_CALL_GROUPING } from "@/v4/conversationCuaGroups.js";
export declare const ENABLE_TERMINAL_TOOL_CALL_GROUPING = true;
export declare const ENABLE_CHANGES_TOOL_CALL_GROUPING = false;
export interface ConversationAssistantWorkRenderOptions {
    stageTailIsRunning?: boolean;
    enableCuaGrouping?: boolean;
    enableExploreGrouping?: boolean;
    enableTerminalGrouping?: boolean;
    enableChangesGrouping?: boolean;
}
export declare function buildAssistantWorkRenderItems(rows: readonly AssistantWorkRow[], reasoningVisibility: ConversationReasoningVisibility, options?: ConversationAssistantWorkRenderOptions): ConversationAssistantWorkRenderItem[];
//# sourceMappingURL=conversationAssistantWorkItems.d.ts.map