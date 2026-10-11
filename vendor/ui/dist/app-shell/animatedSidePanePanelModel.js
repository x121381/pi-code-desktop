export const MIN_PREVIEW_PANE_HEAVY_CONTENT_VISIBLE_INLINE_SIZE_PX = 96;
export function resolveOpenTabLauncherItemIds({ developerToolsEnabled, hasReviewTab, canOpenSelectionSideConversation = false, supportsEmbeddedBrowser = true, }) {
    const itemIds = [];
    if (canOpenSelectionSideConversation) {
        itemIds.push("selection-side-conversation");
    }
    if (!hasReviewTab) {
        itemIds.push("review");
    }
    itemIds.push("terminal");
    if (supportsEmbeddedBrowser) {
        itemIds.push("browser");
    }
    if (developerToolsEnabled) {
        itemIds.push("developer-tools");
    }
    return itemIds;
}
export function shouldOfferSelectionSideConversation({ activeTaskId, isMobileTextInputViewport, mobileOverlay, }) {
    return Boolean(activeTaskId && !mobileOverlay && !isMobileTextInputViewport);
}
export function resolveAnimatedSidePanePanelLayout({ mobileOverlay }) {
    if (mobileOverlay) {
        return {
            collapsedSize: "0px",
            defaultSize: "100%",
            maxSize: "100%",
            minSize: "0px",
            useResizablePanel: false,
        };
    }
    return {
        collapsedSize: "0px",
        defaultSize: "0px",
        maxSize: "65%",
        minSize: "240px",
        useResizablePanel: true,
    };
}
export function shouldRenderPreviewPaneHeavyContent({ isActiveTab, isMediaPreview = false, isMobileOverlay = false, isResizeSettling = false, isSidePaneVisible, minVisibleInlineSizePx = MIN_PREVIEW_PANE_HEAVY_CONTENT_VISIBLE_INLINE_SIZE_PX, visibleInlineSizePx, }) {
    if (!isSidePaneVisible || !isActiveTab) {
        return false;
    }
    if (isMobileOverlay) {
        // Bugfix: 手机远控右侧栏用 transform 抽屉滑入，首次测量时可能还在视口外。
        // transform 动画结束不会触发 ResizeObserver，不能用桌面窄条优化延迟真实预览。
        return true;
    }
    if (isResizeSettling) {
        // 原生 video/audio 进入 HTML fullscreen 时会触发 resize；如果此时卸载
        // 媒体节点，浏览器会因 fullscreen 元素消失而立即退出全屏。
        return isMediaPreview;
    }
    if (visibleInlineSizePx === null) {
        return true;
    }
    return visibleInlineSizePx >= minVisibleInlineSizePx;
}
//# sourceMappingURL=animatedSidePanePanelModel.js.map