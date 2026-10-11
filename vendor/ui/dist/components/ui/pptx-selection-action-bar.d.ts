import { type ReactNode } from "react";
interface PptxSelectionActionBarProps {
    children: ReactNode;
    open: boolean;
    boundary: HTMLElement | null;
    label: string;
    commentPlaceholder: string;
    cancelLabel: string;
    addToConversationLabel: string;
    editing: boolean;
    disabled: boolean;
    onAiEdit: () => void;
    onCancelAiEdit: () => void;
    onAddToConversation: (comment: string) => void;
    onExitSelection: () => void;
}
/**
 * PPTX 元素选择的应用层操作条。
 *
 * 锚点仍位于幻灯片 transform 容器内，内容通过 Popover Portal 渲染；这样既能读取
 * 缩放后的真实 DOMRect，又不会让按钮尺寸随幻灯片缩放或被页面 overflow 裁切。
 */
export declare function PptxSelectionActionBar({ children, open, boundary, label, commentPlaceholder, cancelLabel, addToConversationLabel, editing, disabled, onAiEdit, onCancelAiEdit, onAddToConversation, onExitSelection, }: PptxSelectionActionBarProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=pptx-selection-action-bar.d.ts.map