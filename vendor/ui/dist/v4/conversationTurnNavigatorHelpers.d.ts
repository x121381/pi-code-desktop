import type { ConversationTurnRenderUnit } from "@/v4/conversationTurnRenderUnits.js";
export type ConversationTurnNavigatorAssistantPreviewKind = "empty" | "running" | "text";
export interface ConversationTurnNavigatorItem {
    key: string;
    turnId: string;
    unitIndex: number;
    rowId: number;
    userPreview: string;
    assistantPreview: string;
    assistantPreviewKind: ConversationTurnNavigatorAssistantPreviewKind;
    isRunning: boolean;
}
export interface BuildConversationTurnNavigatorItemsOptions {
    assistantEmptyPreview: string;
    assistantRunningPreview: string;
    userFallbackPreview: string;
    maxPreviewChars?: number;
    maxPreviewParagraphs?: number;
}
export interface ConversationTurnNavigatorVirtualItem {
    index: number;
    start: number;
    size: number;
}
export interface ResolveConversationTurnNavigatorActiveUnitIndexOptions {
    items: readonly ConversationTurnNavigatorItem[];
    virtualItems: readonly ConversationTurnNavigatorVirtualItem[];
    scrollOffsetPx: number;
    viewportHeightPx: number;
}
export interface ConversationTurnNavigatorQueryPosition {
    rowId: number;
    start: number;
    end: number;
}
export interface ResolveConversationTurnNavigatorActiveQueryRowIdOptions {
    positions: readonly ConversationTurnNavigatorQueryPosition[];
    scrollOffsetPx: number;
    viewportHeightPx: number;
}
export type ConversationTurnNavigatorBarTone = "idle" | "mid" | "near" | "peak";
export type ConversationTurnNavigatorBarColorTone = "focus" | "muted";
export interface ConversationTurnNavigatorBarVisualState {
    colorTone: ConversationTurnNavigatorBarColorTone;
    opacity: number;
    scaleX: number;
    tone: ConversationTurnNavigatorBarTone;
}
export interface ResolveConversationTurnNavigatorBarVisualStateOptions {
    itemIndex: number;
    visualFocusItemIndex: number | undefined;
}
export interface ResolveConversationTurnNavigatorVisualFocusItemIndexOptions {
    activeItemIndex: number;
    interactionItemIndex: number | undefined;
}
export declare const CONVERSATION_TURN_NAVIGATOR_MIN_WIDTH_PX = 864;
export type ConversationTurnNavigatorHydrationResult = {
    status: "hydrated";
    logEpoch: string;
} | {
    status: "not-enough-queries";
    logEpoch: string;
} | {
    status: "retryable-failure";
    logEpoch: string;
} | {
    status: "stale";
    logEpoch: string;
};
export declare function shouldHydrateConversationTurnNavigatorDirectory(params: {
    canLoadOlder: boolean;
    containerWidthPx: number;
    hasLoadHandler: boolean;
    loadingOlder: boolean;
}): boolean;
export declare function resolveConversationTurnNavigatorHydrationRetryDelayMs(failedAttemptCount: number): number | null;
export declare function buildConversationTurnNavigatorItems(units: readonly ConversationTurnRenderUnit[], options: BuildConversationTurnNavigatorItemsOptions): ConversationTurnNavigatorItem[];
export declare function resolveConversationTurnNavigatorActiveUnitIndex({ items, virtualItems, scrollOffsetPx, viewportHeightPx, }: ResolveConversationTurnNavigatorActiveUnitIndexOptions): number | undefined;
export declare function resolveConversationTurnNavigatorActiveQueryRowId({ positions, scrollOffsetPx, viewportHeightPx, }: ResolveConversationTurnNavigatorActiveQueryRowIdOptions): number | undefined;
export declare function resolveConversationTurnNavigatorBarVisualState({ itemIndex, visualFocusItemIndex, }: ResolveConversationTurnNavigatorBarVisualStateOptions): ConversationTurnNavigatorBarVisualState;
export declare function resolveConversationTurnNavigatorVisualFocusItemIndex({ interactionItemIndex, }: ResolveConversationTurnNavigatorVisualFocusItemIndexOptions): number | undefined;
//# sourceMappingURL=conversationTurnNavigatorHelpers.d.ts.map