export type ConversationSelectionGuardResult = "eligible" | "ineligible" | "single-limit";
export declare function hasExcludedConversationSelectionEndpoint(startElement: Element | null | undefined, endElement: Element | null | undefined): boolean;
export declare function guardConversationSelectionCandidate(input: {
    enabled: boolean;
    sameRow: boolean;
    insideTimeline: boolean;
    excluded: boolean;
    sameSelectableRegion: boolean;
    supportedContent: boolean;
    text: string;
    hasLayout: boolean;
}): ConversationSelectionGuardResult;
//# sourceMappingURL=conversationSelectionGuard.d.ts.map