import type { HTMLAttributes, KeyboardEvent as ReactKeyboardEvent, Ref } from "react";
import type { BundledTheme } from "shiki";
import type { CodeCommentPreview, CodeCommentRange } from "@/lib/codeCommentContext.js";
import { type KeyboardShortcutPlatformInfo } from "@/lib/keyboardShortcuts.js";
export interface CodeCommentLabels {
    addComment: string;
    addCommentTooltip: string;
    commentPlaceholder: string;
    submitComment: string;
    cancelComment: string;
    deleteComment: string;
    commentLine: string;
    commentRange: string;
}
export interface CodeViewerProps extends HTMLAttributes<HTMLDivElement> {
    code: string;
    enableSyntaxHighlighting?: boolean;
    language: string;
    showLineNumbers?: boolean;
    theme?: BundledTheme;
    wrapLongLines?: boolean;
    fontSizePx?: number;
    firstLineNumber?: number;
    comments?: readonly CodeCommentPreview[];
    topComment?: CodeCommentPreview | null;
    topCommentShowRange?: boolean;
    topCommentNotice?: string;
    focusedRange?: CodeCommentRange | null;
    focusRequestId?: string;
    /**
     * 需要点名的行号（1 起，与 `firstLineNumber` 同一坐标）：只把这些行的**行号**染成警示色，
     * 代码本身不动。编译反馈卡用它标出被诊断指到的行。
     */
    markedLines?: readonly number[];
    enableLineSelection?: boolean;
    enableGutterUtility?: boolean;
    labels?: Partial<CodeCommentLabels>;
    onSubmitCodeComment?: (params: {
        range: CodeCommentRange;
        selectedText: string;
        comment: string;
    }) => void;
    onDeleteCodeComment?: (commentId: string) => void;
    scrollContainerRef?: Ref<HTMLDivElement>;
}
export declare function resolveCodeViewerColorScheme(theme?: BundledTheme): "light" | "dark";
/**
 * 被点名行号的着色规则。行号格是 @pierre/diffs 在 Shadow DOM 里画的 `[data-column-number="<行号>"]`，
 * 外层 class 进不去，只能随 unsafeCSS 注入；颜色走应用 token（自定义属性穿透 shadow root），
 * 深浅主题自动跟随。非正整数与重复值丢弃，空集合返回空串。
 */
export declare function codeViewerMarkedLinesCss(lines: readonly number[] | undefined): string;
export declare function isCodeCommentSubmitShortcut(event: Pick<ReactKeyboardEvent<HTMLTextAreaElement>, "ctrlKey" | "key" | "metaKey">, platformInfo?: KeyboardShortcutPlatformInfo): boolean;
export declare function isCodeCommentCancelShortcut(event: Pick<ReactKeyboardEvent<HTMLTextAreaElement>, "key">): boolean;
export declare function formatCodeCommentSubmitShortcutLabel(platformInfo?: KeyboardShortcutPlatformInfo): string;
export declare function formatCodeCommentCancelShortcutLabel(): string;
export declare function findCodeViewerLineElement(root: ParentNode, lineNumber: number): HTMLElement | null;
export declare function findCodeViewerCommentElement(root: ParentNode, commentId: string): HTMLElement | null;
export declare function CodeCommentAnnotation({ comment, labels, onDelete, showRange, }: {
    comment: CodeCommentPreview;
    labels: CodeCommentLabels;
    onDelete?: (commentId: string) => void;
    showRange?: boolean;
}): import("react/jsx-runtime").JSX.Element;
export declare function CodeViewer({ code, enableSyntaxHighlighting, language, showLineNumbers, theme, wrapLongLines, fontSizePx, firstLineNumber, comments, topComment, topCommentShowRange, topCommentNotice, focusedRange, focusRequestId, markedLines, enableLineSelection, enableGutterUtility, labels: labelOverrides, onSubmitCodeComment, onDeleteCodeComment, scrollContainerRef, className, style, ...props }: CodeViewerProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=code-viewer.d.ts.map