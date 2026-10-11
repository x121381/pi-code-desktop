export type ConversationMessageProjectionPolicy = "realUserInput" | "visibleAssistant" | "providerContextOnly" | "timelineOnly" | "hiddenSynthetic";
export interface ConversationProjectionMessage {
    info: {
        metadata?: unknown;
        role?: string;
        semantics?: ConversationProjectionMessageSemantics;
        source?: string;
        summary?: unknown;
        synthetic?: boolean;
        visibility?: string;
    };
    parts?: readonly ConversationProjectionPart[];
}
export interface ConversationProjectionMessageSemantics {
    kind?: string;
    origin?: string;
    providerVisibility?: string;
    source?: string;
    transcriptVisibility?: string;
    uiVisibility?: string;
}
export interface ConversationProjectionPart {
    ignored?: boolean;
    metadata?: unknown;
    summaryMessageId?: string;
    synthetic?: boolean;
    text?: string;
    timelineType?: string;
    type?: string;
}
export declare function getConversationMessageProjectionPolicy(message: ConversationProjectionMessage): ConversationMessageProjectionPolicy;
export declare function isConversationRealUserTurnStarter(message: ConversationProjectionMessage): boolean;
/**
 * provider-context user carrier 中会真正启动独立 model-only turn 的统一 source policy。
 * live/cold 都必须消费这一个判据，否则冷恢复会跳过 carrier messageId 并生成临时 turn identity。
 */
export declare function getConversationModelOnlyTurnTriggerSource(message: ConversationProjectionMessage): string | null;
export declare function isConversationProviderContextOnlyMessage(message: ConversationProjectionMessage): boolean;
export declare function isConversationTimelineOnlyMessage(message: ConversationProjectionMessage): boolean;
export declare function isConversationHiddenSyntheticMessage(message: ConversationProjectionMessage): boolean;
//# sourceMappingURL=conversation-message-projection-policy.d.ts.map