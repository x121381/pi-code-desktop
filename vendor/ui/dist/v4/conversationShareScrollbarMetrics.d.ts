export interface ConversationShareScrollbarMetricsInput {
    trackSize: number;
    viewportSize: number;
    contentSize: number;
    scrollOffset: number;
}
export interface ConversationShareScrollbarIndicatorMetrics {
    visible: boolean;
    size: number;
    offset: number;
}
export declare function resolveConversationShareScrollbarIndicatorMetrics({ trackSize, viewportSize, contentSize, scrollOffset, }: ConversationShareScrollbarMetricsInput): ConversationShareScrollbarIndicatorMetrics;
//# sourceMappingURL=conversationShareScrollbarMetrics.d.ts.map