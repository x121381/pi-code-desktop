import type { ChatViewSummaryPanelVariant } from "@/v4/legacyChatViewTypes.js";
export declare const CONVERSATION_DRAFT_CONTENT_WIDTH_CLASS_NAME = "max-w-2xl";
export declare const CONVERSATION_CONTENT_WITH_STATUS_PANEL_WIDTH_CLASS_NAME = "w-full @min-[864px]/conversation:w-[calc(100%_-_6rem)] @min-[864px]/conversation:max-w-4xl @min-[1280px]/conversation:w-[calc(100%_-_24rem)] @min-[1280px]/conversation:max-w-6xl";
export declare const CONVERSATION_CONTENT_WITHOUT_STATUS_PANEL_WIDTH_CLASS_NAME = "w-full @min-[864px]/conversation:w-[calc(100%_-_6rem)] @min-[864px]/conversation:max-w-4xl @min-[1280px]/conversation:w-[calc(100%_-_24rem)] @min-[1280px]/conversation:max-w-6xl";
export declare const CONVERSATION_STATUS_PANEL_INLINE_OFFSET_CLASS_NAME = "-translate-x-42";
export declare const CONVERSATION_STATUS_PANEL_INLINE_OFFSET_PX = 168;
export declare const CONVERSATION_STATUS_PANEL_WIDE_OFFSET_CLASS_NAME = "@min-[1280px]/conversation:-translate-x-42";
export type ConversationStatusPanelResolvedVariant = ChatViewSummaryPanelVariant | "auto";
export declare function getConversationContentWidthClassName(params: {
    centeredEmptyLayout: boolean;
    statusPanelLayout: "none" | "auto" | "inline";
}): string;
export declare function resolveConversationStatusPanelVariant(params: {
    variantOverride: ConversationStatusPanelResolvedVariant | null;
}): ConversationStatusPanelResolvedVariant;
export declare function shouldUseConversationStatusPanelInlineLayout(params: {
    hasContent: boolean;
    variant: ConversationStatusPanelResolvedVariant;
}): boolean;
export declare function getConversationStatusPanelOffsetClassName(layout: "none" | "auto" | "inline"): string | undefined;
//# sourceMappingURL=conversationLayout.d.ts.map