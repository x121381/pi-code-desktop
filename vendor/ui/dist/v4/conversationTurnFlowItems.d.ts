import type { AssistantTextRow, ConversationRow, TurnHeaderRow, UserInputRow } from "@zcode/shared/zcode-protocol-v4";
import type { ConversationCuaGroupRenderItem } from "@/v4/conversationCuaGroups.js";
export type AssistantWorkRow = Exclude<ConversationRow, TurnHeaderRow | UserInputRow>;
export type ConversationTurnFlowItem = {
    kind: "userInput";
    row: UserInputRow;
} | {
    kind: "assistantHistory";
    rows: AssistantWorkRow[];
} | {
    kind: "assistantText";
    row: AssistantTextRow;
    latest: boolean;
} | {
    kind: "assistantWork";
    rows: AssistantWorkRow[];
} | ConversationCuaGroupRenderItem;
export declare function buildConversationFlowItems(options: {
    orderedRows: readonly ConversationRow[];
    assistantHistoryRows: readonly AssistantWorkRow[];
    assistantFollowingRows: readonly AssistantWorkRow[];
    assistantTailRows: readonly AssistantWorkRow[];
    /** 当前 visual work segment 外置展示的末段正文。 */
    visibleAssistantTextRow?: AssistantTextRow;
    /** 整个 product turn 唯一可挂 action 的最终正文。 */
    latestAssistantTextRow?: AssistantTextRow;
    timelineOnly: boolean;
}): ConversationTurnFlowItem[];
//# sourceMappingURL=conversationTurnFlowItems.d.ts.map