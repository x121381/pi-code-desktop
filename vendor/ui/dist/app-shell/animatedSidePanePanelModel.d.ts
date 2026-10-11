export declare const MIN_PREVIEW_PANE_HEAVY_CONTENT_VISIBLE_INLINE_SIZE_PX = 96;
export type OpenTabLauncherItemId = "selection-side-conversation" | "review" | "terminal" | "browser" | "developer-tools";
export declare function resolveOpenTabLauncherItemIds({ developerToolsEnabled, hasReviewTab, canOpenSelectionSideConversation, supportsEmbeddedBrowser, }: {
    developerToolsEnabled: boolean;
    hasReviewTab: boolean;
    canOpenSelectionSideConversation?: boolean;
    supportsEmbeddedBrowser?: boolean;
}): OpenTabLauncherItemId[];
export declare function shouldOfferSelectionSideConversation({ activeTaskId, isMobileTextInputViewport, mobileOverlay, }: {
    activeTaskId: string | null;
    isMobileTextInputViewport: boolean;
    mobileOverlay: boolean;
}): boolean;
export declare function resolveAnimatedSidePanePanelLayout({ mobileOverlay }: {
    mobileOverlay: boolean;
}): {
    collapsedSize: string;
    defaultSize: string;
    maxSize: string;
    minSize: string;
    useResizablePanel: boolean;
};
export declare function shouldRenderPreviewPaneHeavyContent({ isActiveTab, isMediaPreview, isMobileOverlay, isResizeSettling, isSidePaneVisible, minVisibleInlineSizePx, visibleInlineSizePx, }: {
    isActiveTab: boolean;
    isMediaPreview?: boolean;
    isMobileOverlay?: boolean;
    isResizeSettling?: boolean;
    isSidePaneVisible: boolean;
    minVisibleInlineSizePx?: number;
    visibleInlineSizePx: number | null;
}): boolean;
//# sourceMappingURL=animatedSidePanePanelModel.d.ts.map