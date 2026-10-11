/** 分享选择面板的几何约束；面板内容本身仍由 CSS 自适应。 */
export declare const CONVERSATION_SHARE_SELECTION_PANEL_EDGE_INSET_PX = 24;
export declare const CONVERSATION_SHARE_SELECTION_PANEL_DOCK_GAP_PX = 16;
/** 两行候选（各 48px、间距 8px）加面板上下 padding 16px，低于此高度面板不再可用。 */
export declare const CONVERSATION_SHARE_SELECTION_PANEL_MIN_HEIGHT_PX = 120;
export declare const CONVERSATION_SHARE_SELECTION_PANEL_MAX_HEIGHT_PROPERTY = "--conversation-share-selection-panel-max-height";
export declare const CONVERSATION_SHARE_SELECTION_PANEL_CENTER_Y_PROPERTY = "--conversation-share-selection-panel-center-y";
export interface ConversationShareSelectionPanelLayoutInput {
    /** 会话内容容器高度，不包含 WorkspaceHeader。 */
    containerHeightPx: number;
    /** 底部 composer/share dock 顶部，相对于会话内容容器的坐标。 */
    dockStartPx: number;
}
export interface ConversationShareSelectionPanelLayout {
    centerYPx: number;
    maxHeightPx: number;
    topPx: number;
    bottomPx: number;
}
/**
 * 计算面板的最大可视高度和垂直锚点。
 *
 * 面板内容少时由内容测量决定实际高度；这里仅提供 max-height，避免
 * 自然高度超过底部 dock 后遮挡输入区。顶部基线固定在边距安全区内，
 * 发生底部碰撞时只压缩面板可视高度，列表仍由 ScrollArea 承接滚动。
 *
 * 不能只做 `min(容器可用高度, dock 之上的高度)`，短视口或高 dock 下
 * 后者会趋近 0，面板被压成不可用的零高度薄片。现在保留一个最小高度：
 * 先回收顶部安全距，仍不够时才允许侵入 dock 间距，且始终不超出容器本身。
 */
export declare function resolveConversationShareSelectionPanelLayout({ containerHeightPx, dockStartPx, }: ConversationShareSelectionPanelLayoutInput): ConversationShareSelectionPanelLayout;
/** 将布局结果写入共享父容器，让面板和 Timeline 使用同一套坐标系。 */
export declare function syncConversationShareSelectionPanelLayout(container: HTMLElement, dock: HTMLElement): ConversationShareSelectionPanelLayout;
//# sourceMappingURL=conversationShareSelectionPanelLayout.d.ts.map