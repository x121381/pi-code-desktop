import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/* eslint-disable max-lines -- PreviewPane 当前同时承载文件读取、图片与 Office 预览、markdown/code 渲染和顶部路径面包屑；后续需按 header/body 边界继续拆分。 */
import { Fragment, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, } from "react";
import { ChevronRightIcon, Ellipsis, EyeIcon, ExternalLinkIcon, FileCode2Icon, CopyIcon, } from "lucide-react";
import { nanoid } from "nanoid";
import { Button } from "@/components/ui/button.js";
import { toast } from "@/components/ui/toast.js";
import { cn } from "@/components/lib/utils.js";
import { TID_PREVIEW_PANE } from "@zcode/shared";
import { useWorkspaceServices } from "@/hooks/useWorkspaceServices.js";
import { usePptxFileWatch } from "@/hooks/usePptxFileWatch.js";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
import { usePdfViewerLabels, usePptxViewerLabels, } from "@/hooks/usePreviewViewerLabels.js";
import { FILE_VIEWER_MAX_TEXT_BYTES, createDiffSourceFilePreviewSource, inferImageMediaType, inferMediaPreview, isPdfPreviewPath, isPptxPreviewPath, } from "@/lib/codeViewer.js";
import { normalizeCodeViewerSource } from "@/lib/codeViewerSource.js";
import { FileDisplayIcon, resolveFileDisplayDescriptor } from "@/lib/fileDisplay.js";
import { getPathLeaf, isAbsoluteFilePath } from "@/lib/path.js";
import { decodeBase64ToArrayBuffer, getOfficeFilePreviewKind } from "@/lib/officeFilePreview.js";
import { usePlatform } from "@/hooks/usePlatform.js";
import { useFileContextActions } from "@/hooks/useFileContextActions.js";
import { useWorkspaceOpenInEditorTarget } from "@/hooks/useWorkspaceOpenInEditorTarget.js";
import { logger } from "@/logger.js";
import { useZCodeStore } from "@/store/StoreProvider.js";
import { useCodeCommentPreviewStore } from "@/store/codeCommentPreviewStore.js";
import { resolveTheme } from "@/useTheme.js";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu.js";
import { readLastSelectedEditorId } from "@/lib/editorPreference.js";
import { PreviewPaneContent } from "@/previewPaneContent.js";
import { dispatchCodeCommentAddToChat, dispatchCodeCommentRemoveFromChat, isCodeCommentMarkedRemoved, } from "@/lib/codeCommentContext.js";
import { getWorkspaceFileRelativePath } from "@/workspace-file-tree/model.js";
import { resolveWorkspaceEditorSelection } from "@/lib/workspaceEditorSelection.js";
import { assertPptxPreviewDataComplete, isPptxPreviewIncompleteFileError, readPptxPreviewData, } from "@/lib/pptxPreviewData.js";
const BREADCRUMB_MASK_CLASS_BY_STATE = {
    none: "",
    left: "[mask-image:linear-gradient(to_right,transparent_0,black_16px,black_100%)] [-webkit-mask-image:linear-gradient(to_right,transparent_0,black_16px,black_100%)]",
    right: "[mask-image:linear-gradient(to_right,black_0,black_calc(100%-16px),transparent_100%)] [-webkit-mask-image:linear-gradient(to_right,black_0,black_calc(100%-16px),transparent_100%)]",
    both: "[mask-image:linear-gradient(to_right,transparent_0,black_16px,black_calc(100%-16px),transparent_100%)] [-webkit-mask-image:linear-gradient(to_right,transparent_0,black_16px,black_calc(100%-16px),transparent_100%)]",
};
const PREVIEW_PANE_DEFERRED_PLACEHOLDER_LINE_WIDTHS = [
    44, 72, 58, 86, 64, 78, 52, 90, 68, 48, 82, 60,
];
const EMPTY_CODE_COMMENT_PREVIEWS = [];
function normalizeBreadcrumbPathSegments(path) {
    return path.replace(/\\/g, "/").split("/").filter(Boolean);
}
function isMarkdownSource(source) {
    return source.type === "text" && source.language === "markdown";
}
function isSvgSource(source) {
    return source.type === "text" && source.path?.toLowerCase().endsWith(".svg") === true;
}
function isMarkdownFilePath(path) {
    if (!path) {
        return false;
    }
    const normalizedPath = path.toLowerCase();
    return normalizedPath.endsWith(".md") || normalizedPath.endsWith(".markdown");
}
export function isPreviewPaneMissingFileError(error) {
    if (typeof error === "object" && error !== null && "code" in error) {
        const code = error.code;
        if (code === "ENOENT") {
            return true;
        }
    }
    const message = error instanceof Error ? error.message : String(error);
    return /\bENOENT\b/i.test(message) || /no such file or directory/i.test(message);
}
export function shouldToastPptxReferenceFileMissing(source, error) {
    return (source?.type === "pptx" &&
        source.referenceNavigation !== undefined &&
        isPreviewPaneMissingFileError(error));
}
export function isPreviewPaneFileTooLargeError(error) {
    const message = error instanceof Error ? error.message : String(error);
    return /file is too large to preview/i.test(message);
}
export function getPreviewPaneSafeErrorMessage(error, sourcePath) {
    const message = error instanceof Error ? error.message : String(error);
    if (!isAbsoluteFilePath(sourcePath)) {
        return message;
    }
    const sourceLeaf = getPathLeaf(sourcePath);
    const pathVariants = new Set([
        sourcePath,
        sourcePath.replace(/\\/g, "/"),
        sourcePath.replace(/\//g, "\\"),
    ]);
    let safeMessage = message;
    for (const pathVariant of pathVariants) {
        if (pathVariant !== sourceLeaf) {
            safeMessage = safeMessage.split(pathVariant).join(sourceLeaf);
        }
    }
    return safeMessage;
}
export function resolvePptxPreviewReadErrorMessage(error, options) {
    if (isPreviewPaneMissingFileError(error)) {
        return options.fileMissingMessage;
    }
    if (isPreviewPaneFileTooLargeError(error)) {
        return options.legacyFileTooLargeMessage;
    }
    if (isPptxPreviewIncompleteFileError(error)) {
        return options.incompleteFileMessage;
    }
    return getPreviewPaneSafeErrorMessage(error, options.sourcePath);
}
export function readPreviewPaneScrollMetrics(container) {
    if (!container) {
        return null;
    }
    return {
        scrollHeight: container.scrollHeight,
        scrollTop: container.scrollTop,
    };
}
export function resolvePreviewPaneTextFileResult(result) {
    if (result.isBinary) {
        return {
            filePreview: result,
            fileTooLarge: false,
        };
    }
    return result.truncated
        ? {
            filePreview: null,
            fileTooLarge: true,
        }
        : {
            filePreview: result,
            fileTooLarge: false,
        };
}
function isSvgFilePath(path) {
    return path?.toLowerCase().endsWith(".svg") ?? false;
}
function getFileImageMediaType(path) {
    const mediaType = inferImageMediaType(path);
    return mediaType && mediaType !== "image/svg+xml" ? mediaType : null;
}
// 与 service 层 readFileRange 的默认分段大小对齐，一次 range 请求对应一次 RPC 调用。
const PDF_RANGE_CHUNK_BYTES = 256 * 1024;
// 小 PDF 直接循环拉全量（少量往返、渲染路径最简单）；超过阈值交给 pdf.js range 按需分段加载。
const PDF_FULL_READ_MAX_BYTES = 2 * 1024 * 1024;
export const PPTX_MAX_FILE_BYTES = 64 * 1024 * 1024;
export function isPptxPreviewFileTooLarge(size) {
    return size > PPTX_MAX_FILE_BYTES;
}
function PreviewPaneDeferredHeavyContent({ style }) {
    return (_jsx("div", { "aria-hidden": "true", className: "h-full w-full overflow-hidden bg-background", "data-preview-pane-heavy-content-deferred": "true", style: style, children: _jsx("div", { className: "sticky top-0 flex h-full min-h-0 flex-col gap-1.5 overflow-hidden p-3", "data-preview-pane-heavy-content-placeholder": "true", children: PREVIEW_PANE_DEFERRED_PLACEHOLDER_LINE_WIDTHS.map((width, index) => (_jsxs("div", { className: "flex h-4 shrink-0 items-center gap-2", children: [_jsx("span", { className: "h-3 w-8 shrink-0 rounded-sm bg-surface" }), _jsx("span", { className: "h-3 rounded-sm bg-surface-hover", style: { width: `${width}%` } })] }, `${width}-${index}`))) }) }));
}
export function resolvePreviewPaneImageSource(source) {
    if (!source) {
        return null;
    }
    if (source.type === "image") {
        return source;
    }
    if (source.type !== "file") {
        return null;
    }
    const mediaType = getFileImageMediaType(source.path);
    if (!mediaType) {
        return null;
    }
    return {
        type: "image",
        title: source.title,
        path: source.path,
        mediaType,
    };
}
export function resolvePreviewPaneMediaSource(source) {
    if (!source)
        return null;
    if (source.type === "media")
        return source;
    if (source.type !== "file")
        return null;
    const media = inferMediaPreview(source.path);
    if (!media)
        return null;
    return { ...source, type: "media", ...media };
}
export function resolveMediaPlaybackErrorMessageId(code) {
    return code === 3 || code === 4 ? "codeViewer.mediaUnsupported" : "codeViewer.mediaLoadFailed";
}
export function resolvePreviewPanePdfSource(source) {
    if (!source) {
        return null;
    }
    if (source.type === "pdf") {
        return source;
    }
    if (source.type !== "file" || !isPdfPreviewPath(source.path)) {
        return null;
    }
    return {
        type: "pdf",
        title: source.title,
        path: source.path,
    };
}
export function resolvePreviewPanePptxSource(source) {
    if (!source) {
        return null;
    }
    if (source.type === "pptx") {
        return source;
    }
    if (source.type !== "file" || !isPptxPreviewPath(source.path)) {
        return null;
    }
    return {
        ...source,
        type: "pptx",
    };
}
export function shouldShowPreviewPaneHeaderDivider(source) {
    return Boolean(resolvePreviewPanePdfSource(source) ||
        resolvePreviewPanePptxSource(source) ||
        resolvePreviewPaneMediaSource(source) ||
        (source?.type === "file" && getOfficeFilePreviewKind(source.path)));
}
function isPlainCodeSource(source) {
    if (!source) {
        return false;
    }
    if (source.type === "text") {
        return !isMarkdownSource(source) && !isSvgSource(source);
    }
    if (source.type === "file") {
        return (!isMarkdownFilePath(source.path) &&
            !isSvgFilePath(source.path) &&
            !getFileImageMediaType(source.path) &&
            // PDF、Office 和 PPTX 走专用只读预览，没有源码视图，也不该出现自动换行开关。
            !isPdfPreviewPath(source.path) &&
            !getOfficeFilePreviewKind(source.path) &&
            !isPptxPreviewPath(source.path));
    }
    if (source.type === "media")
        return false;
    if (source.type === "code-review") {
        return true;
    }
    return false;
}
export function getPreviewPaneDisplayOptions(source, viewModes = {}) {
    const canToggleMarkdownView = source !== null &&
        (isMarkdownSource(source) || (source.type === "file" && isMarkdownFilePath(source.path)));
    const canToggleSvgView = source !== null &&
        (isSvgSource(source) || (source.type === "file" && isSvgFilePath(source.path)));
    const canToggleCodeWrap = isPlainCodeSource(source) ||
        (canToggleMarkdownView && viewModes.markdownViewMode === "code") ||
        (canToggleSvgView && viewModes.svgViewMode === "code");
    return {
        canToggleCodeWrap,
        canToggleMarkdownView,
        canToggleSvgView,
        hasMoreMenu: canToggleMarkdownView || canToggleSvgView || canToggleCodeWrap,
    };
}
function buildCodeViewerBreadcrumb(source, workspacePath) {
    const sourcePath = source.path;
    if (!sourcePath) {
        if (!source.title.trim()) {
            return null;
        }
        return {
            rootLabel: null,
            parentSegments: [],
            fileLabel: source.title,
            fileIconSrc: null,
        };
    }
    const normalizedSourcePath = sourcePath.replace(/\\/g, "/");
    const normalizedWorkspacePath = workspacePath?.replace(/\\/g, "/").replace(/\/+$/, "") ?? null;
    const sourceLeaf = getPathLeaf(sourcePath);
    const descriptor = resolveFileDisplayDescriptor(sourcePath);
    if (normalizedWorkspacePath &&
        (normalizedSourcePath === normalizedWorkspacePath ||
            normalizedSourcePath.startsWith(`${normalizedWorkspacePath}/`))) {
        const relativePath = normalizedSourcePath === normalizedWorkspacePath
            ? ""
            : normalizedSourcePath.slice(normalizedWorkspacePath.length + 1);
        const relativeSegments = normalizeBreadcrumbPathSegments(relativePath);
        return {
            rootLabel: getPathLeaf(normalizedWorkspacePath),
            parentSegments: relativeSegments.slice(0, -1),
            fileLabel: relativeSegments.at(-1) ?? sourceLeaf,
            fileIconSrc: descriptor.fileIconSrc,
        };
    }
    const sourceSegments = normalizeBreadcrumbPathSegments(normalizedSourcePath);
    return {
        rootLabel: sourcePath.startsWith("/") ? "/" : (sourceSegments[0] ?? null),
        parentSegments: sourcePath.startsWith("/")
            ? sourceSegments.slice(0, -1)
            : sourceSegments.slice(1, -1),
        fileLabel: sourceSegments.at(-1) ?? sourceLeaf,
        fileIconSrc: descriptor.fileIconSrc,
    };
}
export function PreviewPane({ source: rawSource, workspacePath, onOpenBrowserUrl, onOpenCodeViewer, renderHeavyContent = true, markdownSelectionTarget, }) {
    const platform = usePlatform();
    const { intl } = useZCodeIntl();
    const theme = useZCodeStore((state) => state.theme);
    const codePreviewSettings = useZCodeStore((state) => state.codePreviewSettings);
    const source = useMemo(() => (rawSource ? normalizeCodeViewerSource(rawSource) : null), [rawSource]);
    const sourceWorkspacePath = source?.workspacePath ?? workspacePath;
    const matchedOpenContext = useWorkspaceOpenInEditorTarget({
        workspacePath: sourceWorkspacePath,
        workspaceIdentity: source?.workspaceIdentity,
        workspaceRemoteSessionId: source?.workspaceRemoteSessionId,
    });
    const openInEditorRemoteTarget = matchedOpenContext.remoteTarget;
    const isRemoteSource = Boolean(source?.workspaceIdentity ||
        source?.workspaceRemoteSessionId ||
        matchedOpenContext.isRemoteWorkspace);
    const fileActions = useFileContextActions();
    const { fileService, fileWatcherService, mediaPreviewService } = useWorkspaceServices(sourceWorkspacePath, source?.workspaceRemoteSessionId, source?.workspaceIdentity);
    const [filePreview, setFilePreview] = useState(null);
    const [fileTooLarge, setFileTooLarge] = useState(false);
    const [loadingInitial, setLoadingInitial] = useState(false);
    const [loadingImagePreview, setLoadingImagePreview] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [loadingMediaPreview, setLoadingMediaPreview] = useState(false);
    const [mediaPreviewUrl, setMediaPreviewUrl] = useState(null);
    const [mediaPreviewId, setMediaPreviewId] = useState(null);
    const mediaPreviewGenerationRef = useRef(0);
    const mediaRefreshAttemptedRef = useRef(false);
    const mediaRefreshInFlightRef = useRef(false);
    const mediaRefreshTimerRef = useRef(null);
    const mediaPlaybackRestoreRef = useRef(null);
    const [loadingPdfPreview, setLoadingPdfPreview] = useState(false);
    const [pdfViewerSource, setPdfViewerSource] = useState(null);
    const [officePreview, setOfficePreview] = useState(null);
    const [loadingOfficePreview, setLoadingOfficePreview] = useState(false);
    const [loadingPptxPreview, setLoadingPptxPreview] = useState(false);
    const [pptxPreviewData, setPptxPreviewData] = useState(null);
    const [validatedPptxReferenceNavigationRequestId, setValidatedPptxReferenceNavigationRequestId] = useState(null);
    const [error, setError] = useState(null);
    const [installedEditors, setInstalledEditors] = useState([]);
    const [preferredEditorId] = useState(() => readLastSelectedEditorId());
    const [markdownViewMode, setMarkdownViewMode] = useState("preview");
    const [svgViewMode, setSvgViewMode] = useState("preview");
    const [wrapLongLinesOverride, setWrapLongLinesOverride] = useState(null);
    const [breadcrumbMaskState, setBreadcrumbMaskState] = useState("none");
    const breadcrumbScrollRef = useRef(null);
    const breadcrumbContentRef = useRef(null);
    const scrollContainerRef = useRef(null);
    const preservedScrollMetricsRef = useRef({
        scrollHeight: 0,
        scrollTop: 0,
    });
    const previousRenderHeavyContentRef = useRef(renderHeavyContent);
    const resolvedTheme = resolveTheme(theme);
    const codeTheme = resolvedTheme === "dark" ? codePreviewSettings.darkTheme : codePreviewSettings.lightTheme;
    const imageSource = useMemo(() => resolvePreviewPaneImageSource(source), [source]);
    const mediaSource = useMemo(() => resolvePreviewPaneMediaSource(source), [source]);
    const pdfSource = useMemo(() => resolvePreviewPanePdfSource(source), [source]);
    const officePreviewKind = useMemo(() => (source?.type === "file" ? getOfficeFilePreviewKind(source.path) : null), [source]);
    const pptxSource = useMemo(() => resolvePreviewPanePptxSource(source), [source]);
    const showDocumentHeaderDivider = shouldShowPreviewPaneHeaderDivider(source);
    const pptxSourcePath = pptxSource?.path ?? null;
    const pptxReferenceNavigation = pptxSource?.referenceNavigation ?? null;
    const { ready: pptxFileWatchReady, reloadGeneration: pptxReloadGeneration } = usePptxFileWatch({
        filePath: pptxSourcePath,
        fileWatcherService,
    });
    const diffFilePreviewSource = useMemo(() => source?.type === "patch" || source?.type === "multi-file-diff"
        ? createDiffSourceFilePreviewSource(source, sourceWorkspacePath)
        : null, [source, sourceWorkspacePath]);
    const fileSource = (source?.type === "file" || source?.type === "code-review") &&
        !imageSource &&
        !pdfSource &&
        !officePreviewKind &&
        !pptxSource &&
        !mediaSource
        ? source
        : null;
    const codeCommentBucket = useMemo(() => source?.type !== "code-review" && source?.path && sourceWorkspacePath
        ? {
            workspacePath: sourceWorkspacePath,
            workspaceIdentity: source.workspaceIdentity,
            sourcePath: source.path,
        }
        : null, [source, sourceWorkspacePath]);
    const codeComments = useCodeCommentPreviewStore((state) => 
    // code-review 不读取 Composer 评论 store，但这里每次 selector 求值都不能返回新的 []，
    // 否则会破坏 useSyncExternalStore 的稳定 snapshot 契约并触发无限更新。
    codeCommentBucket ? state.getComments(codeCommentBucket) : EMPTY_CODE_COMMENT_PREVIEWS);
    const addCodeCommentPreview = useCodeCommentPreviewStore((state) => state.addComment);
    const removeCodeCommentPreview = useCodeCommentPreviewStore((state) => state.removeComment);
    const breadcrumb = useMemo(() => (source ? buildCodeViewerBreadcrumb(source, sourceWorkspacePath) : null), [source, sourceWorkspacePath]);
    const editorSelection = useMemo(() => resolveWorkspaceEditorSelection({
        installedEditors: isRemoteSource && !openInEditorRemoteTarget ? [] : installedEditors,
        selectedEditorId: preferredEditorId,
        remoteTarget: openInEditorRemoteTarget,
    }), [installedEditors, isRemoteSource, openInEditorRemoteTarget, preferredEditorId]);
    const selectedEditor = editorSelection.selectedEditor;
    const canOpenInEditor = Boolean(source?.path && selectedEditor);
    const canOpenDiffFilePreview = Boolean(diffFilePreviewSource && onOpenCodeViewer);
    const wrapLongLines = wrapLongLinesOverride ?? codePreviewSettings.wrapLongLines;
    const canCreateCodeComment = Boolean(source?.type !== "code-review" && source?.path && sourceWorkspacePath);
    const displayOptions = useMemo(() => getPreviewPaneDisplayOptions(source, {
        markdownViewMode,
        svgViewMode,
    }), [markdownViewMode, source, svgViewMode]);
    const { canToggleCodeWrap, canToggleMarkdownView, canToggleSvgView, hasMoreMenu } = displayOptions;
    const codeCommentLabels = useMemo(() => ({
        addComment: intl.formatMessage({ id: "codeViewer.comment.add" }),
        addCommentTooltip: intl.formatMessage({
            id: "codeViewer.comment.addTooltip",
        }),
        commentPlaceholder: intl.formatMessage({
            id: "codeViewer.comment.placeholder",
        }),
        submitComment: intl.formatMessage({ id: "codeViewer.comment.submit" }),
        cancelComment: intl.formatMessage({ id: "common.cancel" }),
        deleteComment: intl.formatMessage({ id: "codeViewer.comment.delete" }),
        commentLine: intl.formatMessage({ id: "codeViewer.comment.line" }),
        commentRange: intl.formatMessage({ id: "codeViewer.comment.range" }),
    }), [intl]);
    // PDF / PPTX 的标签与 dwf 的 workflow-artifact tab 共用一份（见该 hook 的注释）：
    // 两个 labels 接口都是必填全字段，各写一份漏的不会是类型错误，而是一句没翻译的文案。
    const pdfViewerLabels = usePdfViewerLabels();
    const pptxViewerLabels = usePptxViewerLabels();
    useEffect(() => {
        let disposed = false;
        platform
            .getInstalledEditors()
            .then((editors) => {
            if (disposed) {
                return;
            }
            setInstalledEditors(editors);
        })
            .catch((platformError) => {
            logger.warn("[PreviewPane] 获取已安装编辑器列表失败", {
                error: platformError instanceof Error ? platformError.message : String(platformError),
            });
        });
        return () => {
            disposed = true;
        };
    }, [platform]);
    useEffect(() => {
        if (!source) {
            return;
        }
        setMarkdownViewMode(source.type !== "code-review" && (isMarkdownSource(source) || isMarkdownFilePath(source.path))
            ? "preview"
            : "code");
        setSvgViewMode(source.type !== "code-review" && (isSvgSource(source) || isSvgFilePath(source.path))
            ? "preview"
            : "code");
        setWrapLongLinesOverride(null);
    }, [source]);
    const handleSubmitCodeComment = useCallback((params) => {
        if (!source?.path || !sourceWorkspacePath) {
            return;
        }
        const normalizedComment = params.comment.trim();
        const commentId = nanoid();
        dispatchCodeCommentAddToChat({
            id: commentId,
            workspacePath: sourceWorkspacePath,
            workspaceIdentity: source.workspaceIdentity,
            sourcePath: source.path,
            sourceTitle: source.title,
            startLine: params.range.startLine,
            endLine: params.range.endLine,
            selectedText: params.selectedText,
            comment: normalizedComment,
            contextLabel: intl.formatMessage({
                id: "codeViewer.comment.contextLabel",
            }),
            commentLabel: intl.formatMessage({
                id: "codeViewer.comment.commentLabel",
            }),
        });
        if (isCodeCommentMarkedRemoved({
            id: commentId,
            workspacePath: sourceWorkspacePath,
            workspaceIdentity: source.workspaceIdentity,
        })) {
            return;
        }
        addCodeCommentPreview({
            workspacePath: sourceWorkspacePath,
            workspaceIdentity: source.workspaceIdentity,
            sourcePath: source.path,
            comment: {
                id: commentId,
                sourcePath: source.path,
                sourceTitle: source.title,
                startLine: params.range.startLine,
                endLine: params.range.endLine,
                selectedText: params.selectedText,
                comment: normalizedComment,
            },
        });
    }, [addCodeCommentPreview, intl, source, sourceWorkspacePath]);
    const handleDeleteCodeComment = useCallback((commentId) => {
        if (!source?.path || !sourceWorkspacePath) {
            return;
        }
        removeCodeCommentPreview({
            workspacePath: sourceWorkspacePath,
            workspaceIdentity: source.workspaceIdentity,
            sourcePath: source.path,
            id: commentId,
        });
        dispatchCodeCommentRemoveFromChat({
            id: commentId,
            workspacePath: sourceWorkspacePath,
            workspaceIdentity: source.workspaceIdentity,
        });
    }, [removeCodeCommentPreview, source, sourceWorkspacePath]);
    const rememberScrollMetrics = useCallback(() => {
        const metrics = readPreviewPaneScrollMetrics(scrollContainerRef.current);
        if (!metrics) {
            return;
        }
        preservedScrollMetricsRef.current = metrics;
    }, []);
    useLayoutEffect(() => {
        const viewport = breadcrumbScrollRef.current;
        if (!viewport) {
            return;
        }
        // 交互说明：长路径首次打开时，用户最关心的是末尾文件名。
        // 这里在 breadcrumb 内容变更后只初始化滚到最右侧，后续用户手动滚动不再强行回弹。
        const frameId = requestAnimationFrame(() => {
            viewport.scrollLeft = Math.max(0, viewport.scrollWidth - viewport.clientWidth);
        });
        return () => {
            cancelAnimationFrame(frameId);
        };
    }, [breadcrumb]);
    useLayoutEffect(() => {
        const viewport = breadcrumbScrollRef.current;
        const content = breadcrumbContentRef.current;
        if (!viewport || !content) {
            setBreadcrumbMaskState("none");
            return;
        }
        const updateMaskState = () => {
            const maxScrollLeft = viewport.scrollWidth - viewport.clientWidth;
            if (maxScrollLeft <= 1) {
                setBreadcrumbMaskState("none");
                return;
            }
            const hasHiddenLeft = viewport.scrollLeft > 1;
            const hasHiddenRight = viewport.scrollLeft < maxScrollLeft - 1;
            setBreadcrumbMaskState(hasHiddenLeft && hasHiddenRight
                ? "both"
                : hasHiddenLeft
                    ? "left"
                    : hasHiddenRight
                        ? "right"
                        : "none");
        };
        // RAF-based debounce to coalesce resize events
        let rafId = null;
        let latestCallback = updateMaskState;
        const debouncedUpdate = () => {
            if (rafId !== null)
                return;
            rafId = requestAnimationFrame(() => {
                rafId = null;
                latestCallback();
            });
        };
        updateMaskState();
        viewport.addEventListener("scroll", updateMaskState, { passive: true });
        if (typeof ResizeObserver === "undefined") {
            window.addEventListener("resize", debouncedUpdate);
            return () => {
                viewport.removeEventListener("scroll", updateMaskState);
                window.removeEventListener("resize", debouncedUpdate);
                if (rafId !== null)
                    cancelAnimationFrame(rafId);
            };
        }
        const resizeObserver = new ResizeObserver(() => {
            latestCallback = updateMaskState;
            debouncedUpdate();
        });
        resizeObserver.observe(viewport);
        resizeObserver.observe(content);
        window.addEventListener("resize", debouncedUpdate);
        return () => {
            viewport.removeEventListener("scroll", updateMaskState);
            resizeObserver.disconnect();
            window.removeEventListener("resize", debouncedUpdate);
            if (rafId !== null)
                cancelAnimationFrame(rafId);
        };
    }, [breadcrumb]);
    useEffect(() => {
        let disposed = false;
        preservedScrollMetricsRef.current = {
            scrollHeight: 0,
            scrollTop: 0,
        };
        setFilePreview(null);
        setFileTooLarge(false);
        setError(null);
        setLoadingInitial(Boolean(fileSource));
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = 0;
        }
        if (!fileSource) {
            return () => {
                disposed = true;
            };
        }
        // 把传输分块直接当成多个文档解码和渲染，会在 UTF-8 字符中间产生乱码，
        // 同时让每块行号从 1 重置。文本预览现在只读取 service 允许的完整上限；
        // 非二进制结果返回 truncated 时丢弃局部文本并提示文件过大，不再拼接分块。
        void fileService
            .readTextFile({
            path: fileSource.path,
            offset: 0,
            length: FILE_VIEWER_MAX_TEXT_BYTES,
        })
            .then((result) => {
            if (disposed) {
                return;
            }
            const nextFileState = resolvePreviewPaneTextFileResult(result);
            setFilePreview(nextFileState.filePreview);
            setFileTooLarge(nextFileState.fileTooLarge);
        })
            .catch((readError) => {
            if (disposed) {
                return;
            }
            logger.error(`[PreviewPane] 读取文件失败 path=${fileSource.path}:`, readError);
            setError(isPreviewPaneMissingFileError(readError)
                ? intl.formatMessage({ id: "codeViewer.fileMissing" })
                : readError instanceof Error
                    ? readError.message
                    : String(readError));
        })
            .finally(() => {
            if (!disposed) {
                setLoadingInitial(false);
            }
        });
        return () => {
            disposed = true;
        };
    }, [fileService, fileSource, intl]);
    useEffect(() => {
        let disposed = false;
        if (!imageSource) {
            setImagePreview(null);
            setLoadingImagePreview(false);
            return () => {
                disposed = true;
            };
        }
        setLoadingImagePreview(true);
        setImagePreview(null);
        setError(null);
        void fileService
            .readMediaPreview({ path: imageSource.path })
            .then((result) => {
            if (disposed) {
                return;
            }
            setImagePreview(result);
        })
            .catch((previewError) => {
            if (disposed) {
                return;
            }
            logger.error(`[PreviewPane] 读取图片预览失败 path=${imageSource.path}:`, previewError);
            setError(isPreviewPaneMissingFileError(previewError)
                ? intl.formatMessage({ id: "codeViewer.fileMissing" })
                : previewError instanceof Error
                    ? previewError.message
                    : String(previewError));
        })
            .finally(() => {
            if (!disposed) {
                setLoadingImagePreview(false);
            }
        });
        return () => {
            disposed = true;
        };
    }, [fileService, imageSource, intl]);
    useEffect(() => {
        let disposed = false;
        let objectUrl = null;
        let preparedPreviewId = null;
        const generation = ++mediaPreviewGenerationRef.current;
        if (!mediaSource) {
            setLoadingMediaPreview(false);
            setMediaPreviewUrl(null);
            setMediaPreviewId(null);
            mediaRefreshAttemptedRef.current = false;
            if (mediaRefreshTimerRef.current)
                clearTimeout(mediaRefreshTimerRef.current);
            mediaRefreshTimerRef.current = null;
            mediaPlaybackRestoreRef.current = null;
            return () => {
                disposed = true;
            };
        }
        setLoadingMediaPreview(true);
        setMediaPreviewUrl(null);
        setMediaPreviewId(null);
        setError(null);
        mediaRefreshAttemptedRef.current = false;
        mediaRefreshInFlightRef.current = false;
        if (mediaRefreshTimerRef.current)
            clearTimeout(mediaRefreshTimerRef.current);
        mediaRefreshTimerRef.current = null;
        mediaPlaybackRestoreRef.current = null;
        if (!mediaPreviewService) {
            setLoadingMediaPreview(false);
            setError(intl.formatMessage({ id: "codeViewer.mediaUnavailable" }));
            return () => {
                disposed = true;
            };
        }
        void mediaPreviewService
            .prepare({
            path: mediaSource.path,
            expectedKind: mediaSource.kind,
        })
            .then((preview) => {
            const previewId = "previewId" in preview ? preview.previewId : null;
            if (previewId)
                preparedPreviewId = previewId;
            if (disposed || generation !== mediaPreviewGenerationRef.current) {
                if (previewId && mediaPreviewService?.release) {
                    void mediaPreviewService.release({ previewId }).catch(() => undefined);
                }
                return;
            }
            if ("url" in preview) {
                if (previewId)
                    setMediaPreviewId(previewId);
                setMediaPreviewUrl(preview.url);
            }
            else {
                objectUrl = URL.createObjectURL(new Blob([decodeBase64ToArrayBuffer(preview.dataBase64)], {
                    type: preview.mediaType,
                }));
                setMediaPreviewUrl(objectUrl);
            }
        })
            .catch((previewError) => {
            if (disposed || generation !== mediaPreviewGenerationRef.current)
                return;
            logger.error("[PreviewPane] 读取媒体预览失败", {
                path: mediaSource.path,
                error: previewError instanceof Error ? previewError.message : String(previewError),
            });
            setError(isPreviewPaneMissingFileError(previewError)
                ? intl.formatMessage({ id: "codeViewer.fileMissing" })
                : previewError instanceof Error
                    ? previewError.message
                    : String(previewError));
        })
            .finally(() => {
            if (!disposed && generation === mediaPreviewGenerationRef.current) {
                setLoadingMediaPreview(false);
            }
        });
        return () => {
            disposed = true;
            if (objectUrl)
                URL.revokeObjectURL(objectUrl);
            if (mediaRefreshTimerRef.current)
                clearTimeout(mediaRefreshTimerRef.current);
            mediaRefreshTimerRef.current = null;
            if (preparedPreviewId && mediaPreviewService?.release) {
                void mediaPreviewService.release({ previewId: preparedPreviewId }).catch(() => undefined);
            }
        };
    }, [intl, mediaPreviewService, mediaSource]);
    const handleMediaError = useCallback((event) => {
        const mediaElement = event.currentTarget;
        const refreshPlaybackUrl = mediaPreviewService?.refreshPlaybackUrl;
        if (!mediaPreviewId || !refreshPlaybackUrl) {
            setError(intl.formatMessage({
                id: resolveMediaPlaybackErrorMessageId(mediaElement.error?.code),
            }));
            return;
        }
        if (mediaRefreshAttemptedRef.current || mediaRefreshInFlightRef.current) {
            setError(intl.formatMessage({ id: "codeViewer.mediaLoadFailed" }));
            return;
        }
        mediaRefreshAttemptedRef.current = true;
        const generation = mediaPreviewGenerationRef.current;
        mediaPlaybackRestoreRef.current = {
            currentTime: Number.isFinite(mediaElement.currentTime) ? mediaElement.currentTime : 0,
            paused: mediaElement.paused,
            volume: mediaElement.volume,
            muted: mediaElement.muted,
        };
        setError(null);
        mediaRefreshTimerRef.current = setTimeout(() => {
            mediaRefreshTimerRef.current = null;
            if (generation !== mediaPreviewGenerationRef.current)
                return;
            mediaRefreshInFlightRef.current = true;
            void refreshPlaybackUrl({ previewId: mediaPreviewId })
                .then(({ url }) => {
                if (generation === mediaPreviewGenerationRef.current)
                    setMediaPreviewUrl(url);
            })
                .catch(() => {
                if (generation === mediaPreviewGenerationRef.current) {
                    setError(intl.formatMessage({ id: "codeViewer.mediaLoadFailed" }));
                }
            })
                .finally(() => {
                mediaRefreshInFlightRef.current = false;
            });
        }, 500);
    }, [intl, mediaPreviewId, mediaPreviewService]);
    const handleMediaLoadedMetadata = useCallback((event) => {
        const restore = mediaPlaybackRestoreRef.current;
        if (!restore)
            return;
        const mediaElement = event.currentTarget;
        mediaElement.volume = restore.volume;
        mediaElement.muted = restore.muted;
        try {
            mediaElement.currentTime = restore.currentTime;
        }
        catch {
            // 媒体元数据尚未完全就绪时由浏览器稍后继续处理，不阻断播放器加载。
        }
        if (!restore.paused)
            void mediaElement.play().catch(() => undefined);
        mediaPlaybackRestoreRef.current = null;
    }, []);
    useEffect(() => {
        let disposed = false;
        if (!pdfSource) {
            setPdfViewerSource(null);
            setLoadingPdfPreview(false);
            return () => {
                disposed = true;
            };
        }
        setLoadingPdfPreview(true);
        setPdfViewerSource(null);
        setError(null);
        const path = pdfSource.path;
        const readWholeFile = async (totalBytes) => {
            const chunks = [];
            let offset = 0;
            while (offset < totalBytes) {
                const chunk = await fileService.readFileRange({
                    path,
                    offset,
                    length: PDF_RANGE_CHUNK_BYTES,
                });
                if (disposed) {
                    return null;
                }
                if (chunk.length === 0) {
                    // 读取期间文件被截断时按已读部分返回，交给 pdf.js 判定完整性，避免死循环
                    break;
                }
                chunks.push(chunk);
                offset += chunk.length;
            }
            const data = new Uint8Array(offset);
            let position = 0;
            for (const chunk of chunks) {
                data.set(chunk, position);
                position += chunk.length;
            }
            return data;
        };
        void (async () => {
            const fileStat = await fileService.stat({ path });
            if (disposed) {
                return;
            }
            if (typeof fileStat.size !== "number") {
                // 版本偏差兜底：旧远端 stat 不返回 size，也一定没有 readFileRange，
                // 回退整档 base64 的旧通道（保留其 8MB 上限，超限走 catch 报错文案）。
                const preview = await fileService.readMediaPreview({ path });
                if (disposed) {
                    return;
                }
                setPdfViewerSource(`data:application/pdf;base64,${preview.dataBase64}`);
                return;
            }
            if (fileStat.size <= PDF_FULL_READ_MAX_BYTES) {
                const data = await readWholeFile(fileStat.size);
                if (!disposed && data) {
                    setPdfViewerSource(data);
                }
                return;
            }
            const totalBytes = fileStat.size;
            setPdfViewerSource({
                totalBytes,
                requestRange: (offset, length) => fileService.readFileRange({ path, offset, length }),
            });
        })()
            .catch((previewError) => {
            if (disposed) {
                return;
            }
            logger.error(`[PreviewPane] 读取 PDF 预览失败 path=${path}:`, previewError);
            setError(isPreviewPaneMissingFileError(previewError)
                ? intl.formatMessage({ id: "codeViewer.fileMissing" })
                : previewError instanceof Error
                    ? previewError.message
                    : String(previewError));
        })
            .finally(() => {
            if (!disposed) {
                setLoadingPdfPreview(false);
            }
        });
        return () => {
            disposed = true;
        };
    }, [fileService, pdfSource, intl]);
    useEffect(() => {
        let disposed = false;
        if (!officePreviewKind || source?.type !== "file") {
            setOfficePreview(null);
            setLoadingOfficePreview(false);
            return () => {
                disposed = true;
            };
        }
        setLoadingOfficePreview(true);
        setOfficePreview(null);
        setError(null);
        void fileService
            .readBinaryPreview({ path: source.path })
            .then((result) => {
            if (!disposed) {
                setOfficePreview(result);
            }
        })
            .catch((previewError) => {
            if (disposed) {
                return;
            }
            logger.error("[PreviewPane] 读取 Office 文件预览失败", {
                path: source.path,
                error: previewError instanceof Error ? previewError.message : String(previewError),
            });
            setError(isPreviewPaneMissingFileError(previewError)
                ? intl.formatMessage({ id: "codeViewer.fileMissing" })
                : isPreviewPaneFileTooLargeError(previewError)
                    ? intl.formatMessage({ id: "codeViewer.officeTooLarge" })
                    : previewError instanceof Error
                        ? previewError.message
                        : String(previewError));
        })
            .finally(() => {
            if (!disposed) {
                setLoadingOfficePreview(false);
            }
        });
        return () => {
            disposed = true;
        };
    }, [fileService, intl, officePreviewKind, source]);
    useEffect(() => {
        const navigation = pptxReferenceNavigation;
        if (!navigation || !pptxSourcePath) {
            setValidatedPptxReferenceNavigationRequestId(null);
            return;
        }
        let disposed = false;
        setValidatedPptxReferenceNavigationRequestId(null);
        void fileService
            .stat({ path: pptxSourcePath })
            .then(() => {
            if (!disposed) {
                setValidatedPptxReferenceNavigationRequestId(navigation.requestId);
            }
        })
            .catch((navigationError) => {
            if (!disposed && shouldToastPptxReferenceFileMissing(pptxSource, navigationError)) {
                toast(intl.formatMessage({
                    id: "chat.pptxElements.previewFileMissing",
                }));
            }
        });
        return () => {
            disposed = true;
        };
    }, [fileService, intl, pptxReferenceNavigation, pptxSource, pptxSourcePath]);
    useEffect(() => {
        let disposed = false;
        if (!pptxSourcePath) {
            setPptxPreviewData(null);
            setLoadingPptxPreview(false);
            return () => {
                disposed = true;
            };
        }
        if (!pptxFileWatchReady) {
            setPptxPreviewData(null);
            setLoadingPptxPreview(true);
            setError(null);
            return () => {
                disposed = true;
            };
        }
        setLoadingPptxPreview(true);
        setPptxPreviewData(null);
        setError(null);
        const path = pptxSourcePath;
        void (async () => {
            const fileStat = await fileService.stat({ path });
            if (disposed) {
                return;
            }
            if (typeof fileStat.size !== "number") {
                // 兼容旧远端：旧 Host 没有 size/range 能力，只能使用现有 8MB base64 通道。
                const preview = await fileService.readMediaPreview({ path });
                if (!disposed) {
                    setPptxPreviewData(decodeBase64ToArrayBuffer(preview.dataBase64));
                }
                return;
            }
            if (isPptxPreviewFileTooLarge(fileStat.size)) {
                setError(intl.formatMessage({ id: "codeViewer.pptx.fileTooLarge" }));
                return;
            }
            const data = await readPptxPreviewData({
                fileSize: fileStat.size,
                readRange: (offset, length) => fileService.readFileRange({ path, offset, length }),
                isDisposed: () => disposed,
            });
            if (disposed || !data) {
                return;
            }
            // 文件可能在分段读取期间被替换成另一个大小不同的版本；再次 stat 可以阻止把旧版本的
            // 前缀当作完整 PPTX 解析。相同大小的内容替换仍需 Host 提供 fingerprint 才能检测，暂不扩展现有协议。
            const currentFileStat = await fileService.stat({ path });
            if (disposed) {
                return;
            }
            assertPptxPreviewDataComplete({
                expectedBytes: fileStat.size,
                actualBytes: data.byteLength,
                observedFileSize: currentFileStat.size,
            });
            setPptxPreviewData(data);
        })()
            .catch((previewError) => {
            if (disposed) {
                return;
            }
            if (isPptxPreviewIncompleteFileError(previewError)) {
                logger.warn("[PreviewPane] PPTX 文件读取不完整，已阻止解析残缺数据", {
                    path,
                    expectedBytes: previewError.expectedBytes,
                    actualBytes: previewError.actualBytes,
                    observedFileSize: previewError.observedFileSize,
                });
            }
            else {
                logger.error(`[PreviewPane] 读取 PPTX 预览失败 path=${path}:`, previewError);
            }
            // 旧 Host 的 8MB base64 通道会把绝对路径拼进英文超限错误；原样展示既误导
            // 用户又泄漏远端目录。这里保留真实的 8MB 兼容边界，并对其它错误只展示文件名。
            setError(resolvePptxPreviewReadErrorMessage(previewError, {
                sourcePath: path,
                fileMissingMessage: intl.formatMessage({ id: "codeViewer.fileMissing" }),
                legacyFileTooLargeMessage: intl.formatMessage({
                    id: "codeViewer.pptx.legacyFileTooLarge",
                }),
                incompleteFileMessage: intl.formatMessage({ id: "codeViewer.pptx.incomplete" }),
            }));
        })
            .finally(() => {
            if (!disposed) {
                setLoadingPptxPreview(false);
            }
        });
        return () => {
            disposed = true;
        };
    }, [fileService, intl, pptxFileWatchReady, pptxReloadGeneration, pptxSourcePath]);
    const handlePreviewContentScroll = useCallback(() => {
        rememberScrollMetrics();
    }, [rememberScrollMetrics]);
    useLayoutEffect(() => {
        if (!renderHeavyContent) {
            return;
        }
        if (!previousRenderHeavyContentRef.current) {
            return;
        }
        rememberScrollMetrics();
    }, [filePreview, rememberScrollMetrics, renderHeavyContent, source]);
    useLayoutEffect(() => {
        const wasRenderingHeavyContent = previousRenderHeavyContentRef.current;
        previousRenderHeavyContentRef.current = renderHeavyContent;
        if (!renderHeavyContent) {
            return;
        }
        if (wasRenderingHeavyContent) {
            return;
        }
        const container = scrollContainerRef.current;
        const preservedScrollTop = preservedScrollMetricsRef.current.scrollTop;
        if (!container || preservedScrollTop <= 0) {
            return;
        }
        const frameId = requestAnimationFrame(() => {
            container.scrollTop = Math.min(preservedScrollTop, Math.max(0, container.scrollHeight - container.clientHeight));
        });
        return () => {
            cancelAnimationFrame(frameId);
        };
    }, [renderHeavyContent, source]);
    if (!source) {
        return null;
    }
    const handleOpenInEditor = async () => {
        if (!source.path || !selectedEditor) {
            return;
        }
        try {
            // 远程能力过滤产生的 fallback 只用于本次打开；不能把它写回面板偏好，
            // 否则同一 PreviewPane 切回本地文件时仍会错误沿用远程 VS Code。
            const result = await platform.openInEditor(selectedEditor.id, source.path, {
                pathKind: "file",
                remoteTarget: openInEditorRemoteTarget,
                workspaceIdentity: source.workspaceIdentity,
            });
            if (result.success) {
                return;
            }
            logger.warn("[PreviewPane] 用编辑器打开文件失败", {
                editorId: selectedEditor.id,
                path: source.path,
                error: result.error ?? "unknown-error",
            });
        }
        catch (platformError) {
            logger.warn("[PreviewPane] 打开文件失败", {
                path: source.path,
                error: platformError instanceof Error ? platformError.message : String(platformError),
            });
        }
    };
    const handleOpenDiffFilePreview = () => {
        if (!diffFilePreviewSource) {
            return;
        }
        onOpenCodeViewer?.(diffFilePreviewSource);
    };
    const deferredBodyStyle = !renderHeavyContent && preservedScrollMetricsRef.current.scrollHeight > 0
        ? {
            height: `${preservedScrollMetricsRef.current.scrollHeight}px`,
        }
        : undefined;
    return (_jsxs("aside", { "data-testid": TID_PREVIEW_PANE, className: "flex h-full flex-col overflow-hidden bg-background", children: [_jsxs("div", { className: cn("flex h-10 items-center gap-8 bg-surface/30", showDocumentHeaderDivider && "border-b border-border"), children: [_jsx("div", { ref: breadcrumbScrollRef, className: cn("min-w-0 flex-1 overflow-x-auto !scrollbar-hide", BREADCRUMB_MASK_CLASS_BY_STATE[breadcrumbMaskState]), children: _jsxs("div", { ref: breadcrumbContentRef, className: "flex min-w-max items-center px-3 gap-0.5 text-ui-base text-foreground-subtle", children: [breadcrumb?.rootLabel ? (_jsx("span", { className: "shrink-0 text-foreground-subtle", children: breadcrumb.rootLabel })) : null, breadcrumb?.rootLabel ? (_jsx(ChevronRightIcon, { className: "size-3.5 shrink-0 text-foreground-subtlest" })) : null, breadcrumb?.parentSegments.map((segment, index) => (_jsxs(Fragment, { children: [_jsx("span", { className: "shrink-0", children: segment }), _jsx(ChevronRightIcon, { className: "size-3.5 shrink-0 text-foreground-subtlest" })] }, `${segment}-${index}`))), _jsxs("span", { className: "inline-flex min-w-0 items-center gap-1 text-foreground", children: [breadcrumb?.fileIconSrc ? (_jsx(FileDisplayIcon, { src: breadcrumb.fileIconSrc, size: 14, className: "shrink-0" })) : null, _jsx("span", { className: "truncate", children: breadcrumb?.fileLabel ?? source.title })] })] }) }), _jsxs("div", { className: "flex shrink-0 pr-1.5 items-center gap-2", children: [canOpenDiffFilePreview ? (_jsxs(Button, { type: "button", size: "default", variant: "ghost", className: "shrink-0 rounded-lg text-foreground-subtle hover:text-foreground", "data-diff-source-preview-trigger": true, onClick: handleOpenDiffFilePreview, title: intl.formatMessage({
                                    id: "codeViewer.openSourcePreview",
                                }), "aria-label": intl.formatMessage({
                                    id: "codeViewer.openSourcePreview",
                                }), children: [_jsx(FileCode2Icon, { className: "size-3.5", "data-icon": "inline-start" }), _jsx("span", { children: intl.formatMessage({
                                            id: "codeViewer.openSourcePreview",
                                        }) })] })) : null, hasMoreMenu || source.path ? (_jsxs(DropdownMenu, { children: [_jsx(DropdownMenuTrigger, { asChild: true, children: _jsx(Button, { type: "button", size: "icon-md", variant: "ghost", className: "shrink-0 text-foreground-subtle hover:text-foreground", "aria-label": intl.formatMessage({ id: "common.more" }), title: intl.formatMessage({ id: "common.more" }), children: _jsx(Ellipsis, { className: "size-3.5" }) }) }), _jsxs(DropdownMenuContent, { align: "end", className: "w-48", children: [canToggleMarkdownView ? (_jsxs(_Fragment, { children: [_jsx(DropdownMenuLabel, { children: intl.formatMessage({ id: "codeViewer.markdownMode" }) }), _jsxs(DropdownMenuRadioGroup, { value: markdownViewMode, onValueChange: (value) => {
                                                            setMarkdownViewMode(value);
                                                        }, children: [_jsxs(DropdownMenuRadioItem, { value: "preview", children: [_jsx(EyeIcon, { className: "size-4" }), intl.formatMessage({
                                                                        id: "codeViewer.markdownPreview",
                                                                    })] }), _jsxs(DropdownMenuRadioItem, { value: "code", children: [_jsx(FileCode2Icon, { className: "size-4" }), intl.formatMessage({
                                                                        id: "codeViewer.markdownSource",
                                                                    })] })] })] })) : null, canToggleSvgView ? (_jsxs(_Fragment, { children: [canToggleMarkdownView ? _jsx(DropdownMenuSeparator, {}) : null, _jsx(DropdownMenuLabel, { children: intl.formatMessage({ id: "codeViewer.svgMode" }) }), _jsxs(DropdownMenuRadioGroup, { value: svgViewMode, onValueChange: (value) => {
                                                            setSvgViewMode(value);
                                                        }, children: [_jsxs(DropdownMenuRadioItem, { value: "preview", children: [_jsx(EyeIcon, { className: "size-4" }), intl.formatMessage({ id: "codeViewer.svgPreview" })] }), _jsxs(DropdownMenuRadioItem, { value: "code", children: [_jsx(FileCode2Icon, { className: "size-4" }), intl.formatMessage({ id: "codeViewer.svgSource" })] })] })] })) : null, canToggleCodeWrap ? (_jsxs(_Fragment, { children: [canToggleMarkdownView || canToggleSvgView ? _jsx(DropdownMenuSeparator, {}) : null, _jsxs(DropdownMenuCheckboxItem, { checked: wrapLongLines, onCheckedChange: (checked) => {
                                                            setWrapLongLinesOverride(Boolean(checked));
                                                        }, children: [_jsx(FileCode2Icon, { className: "size-4" }), intl.formatMessage({ id: "codeViewer.wrapLines" })] })] })) : null, source.path ? (_jsxs(_Fragment, { children: [hasMoreMenu ? _jsx(DropdownMenuSeparator, {}) : null, _jsxs(DropdownMenuItem, { onSelect: () => void fileActions.copyAbsolutePath({ path: source.path }), children: [_jsx(CopyIcon, { className: "size-4" }), intl.formatMessage({ id: "fileActions.copyAbsolutePath" })] }), _jsxs(DropdownMenuItem, { onSelect: () => void fileActions.copyRelativePath({
                                                            path: source.path,
                                                            relativePath: sourceWorkspacePath
                                                                ? getWorkspaceFileRelativePath(sourceWorkspacePath, source.path)
                                                                : source.path,
                                                        }), children: [_jsx(CopyIcon, { className: "size-4" }), intl.formatMessage({ id: "fileActions.copyRelativePath" })] })] })) : null] })] })) : null, _jsx(Button, { type: "button", size: "icon-md", variant: "ghost", className: "shrink-0 text-foreground-subtle hover:text-foreground disabled:text-foreground-subtlest", onClick: () => {
                                    void handleOpenInEditor();
                                }, disabled: !canOpenInEditor, title: selectedEditor
                                    ? intl.formatMessage({ id: "appHeader.openInEditor" }, { editor: selectedEditor.name })
                                    : intl.formatMessage({ id: "chat.changeSummary.openInEditor" }), "aria-label": selectedEditor
                                    ? intl.formatMessage({ id: "appHeader.openInEditor" }, { editor: selectedEditor.name })
                                    : intl.formatMessage({ id: "chat.changeSummary.openInEditor" }), children: _jsx(ExternalLinkIcon, { className: "size-3.5" }) })] })] }), _jsx("div", { className: "min-h-0 flex-1", children: renderHeavyContent ? (_jsx(PreviewPaneContent, { source: pptxSource ?? imageSource ?? pdfSource ?? mediaSource ?? source, filePreview: filePreview, fileTooLarge: fileTooLarge, loadingInitial: loadingInitial, loadingImagePreview: loadingImagePreview, imagePreview: imagePreview, mediaSource: mediaSource, loadingMediaPreview: loadingMediaPreview, mediaPreviewUrl: mediaPreviewUrl, onMediaError: handleMediaError, onMediaLoadedMetadata: handleMediaLoadedMetadata, loadingPdfPreview: loadingPdfPreview, pdfViewerSource: pdfViewerSource, pdfViewerLabels: pdfViewerLabels, loadingOfficePreview: loadingOfficePreview, officePreview: officePreview, officePreviewKind: officePreviewKind, loadingPptxPreview: loadingPptxPreview, pptxPreviewData: pptxPreviewData, pptxViewerLabels: pptxViewerLabels, pptxReferenceSource: pptxSource && sourceWorkspacePath
                        ? {
                            workspacePath: sourceWorkspacePath,
                            ...(pptxSource.workspaceIdentity
                                ? { workspaceIdentity: pptxSource.workspaceIdentity }
                                : {}),
                            ...(pptxSource.workspaceRemoteSessionId
                                ? { remoteSessionId: pptxSource.workspaceRemoteSessionId }
                                : {}),
                            sourcePath: pptxSource.path,
                            sourceTitle: pptxSource.title,
                        }
                        : null, pptxReferenceNavigation: pptxReferenceNavigation, pptxReferenceNavigationReady: pptxReferenceNavigation !== null &&
                        validatedPptxReferenceNavigationRequestId === pptxReferenceNavigation.requestId, error: error, codePreviewSettings: codePreviewSettings, codeTheme: codeTheme, resolvedTheme: resolvedTheme, theme: theme, workspacePath: sourceWorkspacePath, onOpenBrowserUrl: onOpenBrowserUrl, markdownSelectionTarget: markdownSelectionTarget &&
                        (source.workspaceIdentity?.trim() || sourceWorkspacePath) ===
                            markdownSelectionTarget.workspaceKey
                        ? markdownSelectionTarget
                        : undefined, markdownViewMode: markdownViewMode, svgViewMode: svgViewMode, wrapLongLines: wrapLongLines, codeComments: codeComments, enableCodeLineSelection: canCreateCodeComment, enableCodeGutterUtility: canCreateCodeComment, codeCommentLabels: codeCommentLabels, onSubmitCodeComment: handleSubmitCodeComment, onDeleteCodeComment: handleDeleteCodeComment, 
                    // PreviewPane 外层只是 flex 壳，真实滚动发生在具体内容组件的 overflow 容器。
                    // 折叠侧边面板卸载重内容前必须保存该容器的位置。
                    onScroll: handlePreviewContentScroll, scrollContainerRef: scrollContainerRef })) : (_jsx(PreviewPaneDeferredHeavyContent, { style: deferredBodyStyle })) })] }));
}
//# sourceMappingURL=PreviewPane.js.map