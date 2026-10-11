import type { AssistantTextRow, ConversationRow, TurnHeaderRow, UserInputRow } from "@zcode/shared/zcode-protocol-v4";
import { type PluginUiRowPinResolver } from "@/plugin-ui/index.js";
import type { AssistantWorkRow, ConversationTurnFlowItem } from "@/v4/conversationTurnFlowItems.js";
export interface ConversationTurnWorkStatus {
    state: "running" | "completed" | "interrupted";
    durationMs?: number;
}
export interface ConversationTurnWorkSegment {
    key: string;
    triggerRow?: UserInputRow;
    flowItems: ConversationTurnFlowItem[];
    assistantWorkRows: AssistantWorkRow[];
    assistantHistoryRows: AssistantWorkRow[];
    assistantFollowingRows: AssistantWorkRow[];
    assistantHistoryDefaultOpen: boolean;
    workStatus?: ConversationTurnWorkStatus;
}
export declare function resolveConversationTurnWorkStatus(header: TurnHeaderRow | undefined, workRows: readonly AssistantWorkRow[], isRunning: boolean, durationMs: number | undefined, isInterrupted?: boolean): ConversationTurnWorkStatus | undefined;
export declare function resolveConversationTurnWorkDurationMs(header: TurnHeaderRow | undefined, options: {
    nowMs?: number;
}, isRunning: boolean): number | undefined;
export declare function buildConversationTurnWorkSegments(options: {
    key: string;
    header?: TurnHeaderRow;
    orderedRows: readonly ConversationRow[];
    assistantTailRows: readonly AssistantWorkRow[];
    latestAssistantTextRow?: AssistantTextRow;
    isRunning: boolean;
    isLastTurn: boolean;
    isInterrupted: boolean;
    forceOpenHistory: boolean;
    timelineOnly: boolean;
    nowMs?: number;
    /** 插件卡片进不进折叠区的裁决；缺省沿用"全部常驻"。 */
    pluginUiPinResolver?: PluginUiRowPinResolver;
}): ConversationTurnWorkSegment[];
//# sourceMappingURL=conversationTurnWorkSegments.d.ts.map