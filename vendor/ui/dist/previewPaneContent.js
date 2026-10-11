import { jsx as _jsx } from "react/jsx-runtime";
import { useMemo } from "react";
import { inferCodeLanguage } from "@/lib/codeViewer.js";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
import { MarkdownPreviewContent } from "@/previewPaneMarkdownContent.js";
import { CodeContent } from "@/previewPaneCodeContent.js";
import { ImagePreviewContent, SvgPreviewContent } from "@/previewPaneImageContent.js";
import { PreviewPaneMediaContent } from "@/previewPaneMediaContent.js";
import { PdfPreviewContent } from "@/previewPanePdfContent.js";
import { PptxPreviewContent } from "@/previewPanePptxContent.js";
import { PatchFallbackContent } from "@/previewPanePatchFallbackContent.js";
import { DiffViewer } from "@/components/ui/diff-viewer.js";
import { PreviewPaneOfficeContent } from "@/previewPaneOfficeContent.js";
import { resolveCodeReviewContentProjection } from "@/previewPaneCodeReview.js";
function isSvgPath(path) {
    return path?.toLowerCase().endsWith(".svg") ?? false;
}
export function getPreviewPaneErrorTextClass(error, fileMissingMessage) {
    return error === fileMissingMessage ? "text-foreground-subtlest" : "text-destructive";
}
export function PreviewPaneContent({ source, filePreview, fileTooLarge, loadingInitial, loadingImagePreview, imagePreview, mediaSource, loadingMediaPreview, mediaPreviewUrl, onMediaError, onMediaLoadedMetadata, loadingPdfPreview, pdfViewerSource, pdfViewerLabels, loadingOfficePreview, officePreview, officePreviewKind, loadingPptxPreview, pptxPreviewData, pptxViewerLabels, pptxReferenceSource, pptxReferenceNavigation, pptxReferenceNavigationReady, error, codePreviewSettings, codeTheme, resolvedTheme, theme, workspacePath, onOpenBrowserUrl, markdownSelectionTarget, markdownViewMode, svgViewMode, wrapLongLines, codeComments, enableCodeLineSelection = false, enableCodeGutterUtility = false, codeCommentLabels, onSubmitCodeComment, onDeleteCodeComment, onScroll, scrollContainerRef, }) {
    const { intl } = useZCodeIntl();
    const fileMissingMessage = intl.formatMessage({ id: "codeViewer.fileMissing" });
    const mediaLabels = {
        loading: intl.formatMessage({ id: "codeViewer.loadingMedia" }),
        unavailable: intl.formatMessage({ id: "codeViewer.mediaUnavailable" }),
        unsupported: intl.formatMessage({ id: "codeViewer.mediaUnsupported" }),
    };
    const multiFileDiffFiles = useMemo(() => {
        if (source.type !== "multi-file-diff") {
            return null;
        }
        // DiffViewer 是 memo 组件，预览 pane 父级滚动/加载状态刷新时，
        // JSX 内联 oldFile/newFile 会生成新对象并强制 diff 重新渲染。
        return {
            oldFile: {
                name: source.path ?? source.title,
                contents: source.beforeContent,
                cacheKey: `old:${source.path ?? source.title}:${source.beforeContent.length}:${source.beforeContent.slice(0, 100)}:${source.beforeContent.slice(-100)}`,
            },
            newFile: {
                name: source.path ?? source.title,
                contents: source.afterContent,
                cacheKey: `new:${source.path ?? source.title}:${source.afterContent.length}:${source.afterContent.slice(0, 100)}:${source.afterContent.slice(-100)}`,
            },
        };
    }, [
        source.type,
        source.type === "multi-file-diff" ? source.afterContent : null,
        source.type === "multi-file-diff" ? source.beforeContent : null,
        source.type === "multi-file-diff" ? source.path : null,
        source.type === "multi-file-diff" ? source.title : null,
    ]);
    if (source.type === "patch") {
        return (_jsx(PatchFallbackContent, { patch: source.patch, codePreviewSettings: codePreviewSettings, resolvedTheme: resolvedTheme, sourcePath: source.path, sourceTitle: source.title }));
    }
    if (source.type === "multi-file-diff" && multiFileDiffFiles) {
        return (_jsx(DiffViewer, { oldFile: multiFileDiffFiles.oldFile, newFile: multiFileDiffFiles.newFile, diffClassName: "block", fontSizePx: codePreviewSettings.fontSizePx, lightTheme: codePreviewSettings.lightTheme, darkTheme: codePreviewSettings.darkTheme, themeType: resolvedTheme }));
    }
    if (source.type === "text") {
        const isMarkdownSource = source.language === "markdown";
        const isSvgSource = isSvgPath(source.path);
        if (isMarkdownSource && markdownViewMode === "preview") {
            return (_jsx(MarkdownPreviewContent, { selectionTarget: markdownSelectionTarget, sourceKey: source.path ??
                    JSON.stringify([source.title, source.type === "text" ? source.content : ""]), sourceTitle: source.path ?? source.title, sourcePath: source.path, content: source.content, workspacePath: workspacePath, theme: theme, codePreviewSettings: codePreviewSettings, onOpenBrowserUrl: onOpenBrowserUrl }));
        }
        if (isSvgSource && svgViewMode === "preview") {
            return _jsx(SvgPreviewContent, { title: source.title, svgContent: source.content });
        }
        return (_jsx(CodeContent, { code: source.content, language: source.language, codePreviewSettings: codePreviewSettings, codeTheme: codeTheme, theme: theme, wrapLongLines: wrapLongLines, comments: codeComments, enableLineSelection: enableCodeLineSelection, enableGutterUtility: enableCodeGutterUtility, labels: codeCommentLabels, onSubmitCodeComment: onSubmitCodeComment, onDeleteCodeComment: onDeleteCodeComment, onScroll: onScroll, scrollContainerRef: scrollContainerRef }));
    }
    if (source.type === "image") {
        if (loadingImagePreview || (!error && !imagePreview)) {
            return (_jsx("div", { className: "p-3 text-ui-base text-foreground-subtle", children: intl.formatMessage({ id: "codeViewer.loadingImage" }) }));
        }
        if (error || !imagePreview) {
            const errorMessage = error ?? intl.formatMessage({ id: "codeViewer.imageUnavailable" });
            return (_jsx("div", { className: `p-3 text-ui-base ${error ? getPreviewPaneErrorTextClass(error, fileMissingMessage) : "text-destructive"}`, children: errorMessage }));
        }
        return (_jsx(ImagePreviewContent, { title: source.title, imageSource: `data:${imagePreview.mediaType};base64,${imagePreview.dataBase64}`, sourcePath: source.path }));
    }
    if (source.type === "media" && mediaSource) {
        return (_jsx(PreviewPaneMediaContent, { error: error, labels: mediaLabels, loading: loadingMediaPreview, onMediaError: onMediaError, onMediaLoadedMetadata: onMediaLoadedMetadata, source: mediaSource, url: mediaPreviewUrl }));
    }
    if (source.type === "pdf") {
        if (loadingPdfPreview || (!error && !pdfViewerSource)) {
            return (_jsx("div", { className: "p-3 text-ui-base text-foreground-subtle", children: intl.formatMessage({ id: "codeViewer.loadingPdf" }) }));
        }
        if (error || !pdfViewerSource) {
            const errorMessage = error ?? intl.formatMessage({ id: "codeViewer.pdfUnavailable" });
            return (_jsx("div", { className: `p-3 text-ui-base ${error ? getPreviewPaneErrorTextClass(error, fileMissingMessage) : "text-destructive"}`, children: errorMessage }));
        }
        return _jsx(PdfPreviewContent, { source: pdfViewerSource, labels: pdfViewerLabels });
    }
    if (source.type === "file" && officePreviewKind) {
        return (_jsx(PreviewPaneOfficeContent, { error: error, kind: officePreviewKind, loading: loadingOfficePreview, onOpenBrowserUrl: onOpenBrowserUrl, preview: officePreview, resolvedTheme: resolvedTheme, sourcePath: source.path }));
    }
    if (source.type === "pptx") {
        if (loadingPptxPreview || (!error && !pptxPreviewData)) {
            return (_jsx("div", { className: "p-3 text-ui-base text-foreground-subtle", children: intl.formatMessage({ id: "codeViewer.loadingPptx" }) }));
        }
        if (error || !pptxPreviewData) {
            const errorMessage = error ?? intl.formatMessage({ id: "codeViewer.pptxUnavailable" });
            return (_jsx("div", { className: `p-3 text-ui-base ${error ? getPreviewPaneErrorTextClass(error, fileMissingMessage) : "text-destructive"}`, children: errorMessage }));
        }
        return (_jsx(PptxPreviewContent, { data: pptxPreviewData, labels: pptxViewerLabels, fileName: source.path, onOpenBrowserUrl: onOpenBrowserUrl, ...(pptxReferenceSource ? { referenceSource: pptxReferenceSource } : {}), ...(pptxReferenceNavigation ? { referenceNavigation: pptxReferenceNavigation } : {}), referenceNavigationReady: pptxReferenceNavigationReady }));
    }
    if (loadingInitial && !filePreview) {
        return (_jsx("div", { className: "p-3 text-ui-base text-foreground-subtle", children: intl.formatMessage({ id: "codeViewer.loadingFile" }) }));
    }
    if (error && !filePreview) {
        return (_jsx("div", { className: `p-3 text-ui-base ${getPreviewPaneErrorTextClass(error, fileMissingMessage)}`, children: error }));
    }
    if (fileTooLarge) {
        return (_jsx("div", { className: "p-3 text-ui-base text-foreground-subtle", children: intl.formatMessage({ id: "codeViewer.fileTooLarge" }) }));
    }
    if (!filePreview) {
        return null;
    }
    if (filePreview.isBinary) {
        return (_jsx("div", { className: "p-3 text-ui-base text-foreground-subtle", children: intl.formatMessage({ id: "codeViewer.binary" }) }));
    }
    if (filePreview.content.length === 0) {
        return (_jsx("div", { className: "p-3 text-ui-base text-foreground-subtle", children: intl.formatMessage({ id: "codeViewer.empty" }) }));
    }
    const fileLanguage = inferCodeLanguage(source.path, filePreview.content);
    const codeReviewProjection = source.type === "code-review"
        ? resolveCodeReviewContentProjection(source, filePreview.content)
        : null;
    const isMarkdownFile = fileLanguage === "markdown";
    const isSvgFile = isSvgPath(source.path);
    if (source.type !== "code-review" && isMarkdownFile && markdownViewMode === "preview") {
        return (_jsx(MarkdownPreviewContent, { selectionTarget: markdownSelectionTarget, sourceKey: source.path ?? source.title, sourceTitle: source.path ?? source.title, sourcePath: source.path, content: filePreview.content, workspacePath: workspacePath, onOpenBrowserUrl: onOpenBrowserUrl }));
    }
    if (source.type !== "code-review" && isSvgFile && svgViewMode === "preview") {
        return _jsx(SvgPreviewContent, { title: source.title, svgContent: filePreview.content });
    }
    return (_jsx(CodeContent, { code: filePreview.content, language: fileLanguage, codePreviewSettings: codePreviewSettings, codeTheme: codeTheme, theme: theme, wrapLongLines: wrapLongLines, comments: codeReviewProjection?.inlineComments ?? codeComments, topComment: codeReviewProjection?.topComment, topCommentShowRange: false, topCommentNotice: codeReviewProjection?.targetLineOutOfRange
            ? intl.formatMessage({ id: "codeViewer.review.targetLineMissing" })
            : undefined, focusedRange: codeReviewProjection?.focusedRange, focusRequestId: source.type === "code-review" ? source.review.requestId : undefined, enableLineSelection: source.type === "code-review" ? false : enableCodeLineSelection, enableGutterUtility: source.type === "code-review" ? false : enableCodeGutterUtility, labels: codeCommentLabels, onSubmitCodeComment: source.type === "code-review" ? undefined : onSubmitCodeComment, onDeleteCodeComment: source.type === "code-review" ? undefined : onDeleteCodeComment, onScroll: onScroll, scrollContainerRef: scrollContainerRef }));
}
//# sourceMappingURL=previewPaneContent.js.map