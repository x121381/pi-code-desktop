/** 跨 workspace pane 的归属徽标（未来跨 workspace session 的多路径徽标在此扩展）。 */
export interface PaneWorkspaceBadge {
    /** 展示名（workspacePath basename）。 */
    label: string;
    /** 完整路径（tooltip）。 */
    workspacePath: string;
    /** 远程 workspace（SSH/WSL/Docker）标识。 */
    remote: boolean;
}
export interface ConversationHeaderProps {
    /** meta.title；仅作为测试/可观测投影，不渲染占位 header。 */
    title: string;
    /** 向右拆分新 draft 窗格（叶子数达上限时宿主不下发）。 */
    onSplitRight?: () => void;
    /** 向下拆分新 draft 窗格。 */
    onSplitDown?: () => void;
    /** 关闭本窗格（仅非 primary pane 下发；关 pane ≠ 停 session）。 */
    onClosePane?: () => void;
    /** 跨 workspace pane 的归属徽标（pane workspace ≠ shell 当前 workspace 时下发）。 */
    workspaceBadge?: PaneWorkspaceBadge;
}
/**
 * pane chrome：不占布局高度，只在右上角悬浮拆分/关闭入口。
 * 保留 title data 节点，供 E2E 读取投影但不恢复旧横条。
 */
declare function ConversationHeaderImpl({ title, onClosePane, workspaceBadge, }: ConversationHeaderProps): import("react/jsx-runtime").JSX.Element;
export declare const ConversationHeader: import("react").MemoExoticComponent<typeof ConversationHeaderImpl>;
export {};
//# sourceMappingURL=ConversationHeader.d.ts.map