import type { MarkdownSelectionTarget } from "@/lib/conversationSelectionReference.js";
import type { FileTextSlice } from "@zcode/shared";
import { type CodeViewerSource, type MediaCodeViewerSource } from "@/lib/codeViewer.js";
export declare function isPreviewPaneMissingFileError(error: unknown): boolean;
export declare function shouldToastPptxReferenceFileMissing(source: CodeViewerSource | null, error: unknown): boolean;
export declare function isPreviewPaneFileTooLargeError(error: unknown): boolean;
export declare function getPreviewPaneSafeErrorMessage(error: unknown, sourcePath: string): string;
export declare function resolvePptxPreviewReadErrorMessage(error: unknown, options: {
    sourcePath: string;
    fileMissingMessage: string;
    legacyFileTooLargeMessage: string;
    incompleteFileMessage: string;
}): string;
export declare function readPreviewPaneScrollMetrics(container: Pick<HTMLElement, "scrollHeight" | "scrollTop"> | null): {
    scrollHeight: number;
    scrollTop: number;
} | null;
export declare function resolvePreviewPaneTextFileResult(result: FileTextSlice): {
    filePreview: FileTextSlice | null;
    fileTooLarge: boolean;
};
export declare const PPTX_MAX_FILE_BYTES: number;
export declare function isPptxPreviewFileTooLarge(size: number): boolean;
export declare function resolvePreviewPaneImageSource(source: CodeViewerSource | null): Extract<CodeViewerSource, {
    type: "image";
}> | null;
export declare function resolvePreviewPaneMediaSource(source: CodeViewerSource | null): MediaCodeViewerSource | null;
export declare function resolveMediaPlaybackErrorMessageId(code: number | undefined): "codeViewer.mediaUnsupported" | "codeViewer.mediaLoadFailed";
export declare function resolvePreviewPanePdfSource(source: CodeViewerSource | null): Extract<CodeViewerSource, {
    type: "pdf";
}> | null;
export declare function resolvePreviewPanePptxSource(source: CodeViewerSource | null): Extract<CodeViewerSource, {
    type: "pptx";
}> | null;
export declare function shouldShowPreviewPaneHeaderDivider(source: CodeViewerSource | null): boolean;
export declare function getPreviewPaneDisplayOptions(source: CodeViewerSource | null, viewModes?: {
    markdownViewMode?: "preview" | "code";
    svgViewMode?: "preview" | "code";
}): {
    canToggleCodeWrap: boolean;
    canToggleMarkdownView: boolean;
    canToggleSvgView: boolean;
    hasMoreMenu: boolean;
};
export declare function PreviewPane({ source: rawSource, workspacePath, onOpenBrowserUrl, onOpenCodeViewer, renderHeavyContent, markdownSelectionTarget, }: {
    source: CodeViewerSource | null;
    onClose: () => void;
    workspacePath?: string;
    onOpenBrowserUrl?: (url: string) => void;
    onOpenCodeViewer?: (source: CodeViewerSource) => void;
    renderHeavyContent?: boolean;
    markdownSelectionTarget?: MarkdownSelectionTarget;
}): import("react/jsx-runtime").JSX.Element | null;
//# sourceMappingURL=PreviewPane.d.ts.map