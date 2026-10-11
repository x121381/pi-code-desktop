import type { ComponentProps } from "react";
export { clampImagePreviewOffset as clampMarkdownImagePreviewOffset } from "@/components/ai-elements/image-preview-dialog.js";
export type MarkdownImageProps = ComponentProps<"img"> & {
    node?: unknown;
    workspacePath?: string;
    workspaceHomePath?: string;
    sessionId?: string;
    readAttachment?: (params: {
        sessionId: string;
        ref: string;
    }) => Promise<{
        bytes: Uint8Array;
        mediaType: string;
    } | {
        url: string;
        mediaType: string;
    }>;
};
/**
 * Streamdown 会在 rehype 前按空行拆块。仅移除连续纯图片行之间的空行，让同组图片进入
 * 同一个 Markdown 块；代码围栏里的相似文本必须保持原样。
 */
export declare function normalizeConsecutiveMarkdownImageBlocks(markdown: string): string;
/**
 * Streamdown 的 harden 会过滤 rehype 自定义属性，因此在 React component mapping
 * 层识别纯图片段落，确保画廊标记和响应式 class 不会被安全层剥离。
 */
export declare function MarkdownImageParagraph({ children, node: _node, ...props }: ComponentProps<"p"> & {
    node?: unknown;
}): import("react/jsx-runtime").JSX.Element;
export declare function MarkdownImage({ alt, className, node: _node, onError, onLoad, readAttachment, sessionId, src, workspacePath, workspaceHomePath, ...props }: MarkdownImageProps): import("react/jsx-runtime").JSX.Element | null;
//# sourceMappingURL=markdown-image.d.ts.map