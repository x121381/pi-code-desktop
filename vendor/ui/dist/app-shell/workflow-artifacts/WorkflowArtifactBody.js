import { jsx as _jsx } from "react/jsx-runtime";
import { lazy, Suspense, useMemo } from "react";
import { CodeBlock } from "@/components/ai-elements/code-block.js";
import { MessageResponse } from "@/components/ai-elements/message.js";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
import { buildPresetLabels, isArtifactPresetKind, } from "@/app-shell/workflow-artifacts/artifactPresentation.js";
import { ArtifactPresetBody } from "@/app-shell/workflow-artifacts/ArtifactPresetBody.js";
import { ArtifactMetadataCard, ArtifactNotice, WorkflowArtifactHtmlCard, } from "@/app-shell/workflow-artifacts/WorkflowArtifactCards.js";
import { encodeBytesToBase64 } from "@/hooks/useWorkflowRunArtifactBytes.js";
import { usePdfViewerLabels, usePptxViewerLabels } from "@/hooks/usePreviewViewerLabels.js";
/**
 * `workflow-artifact` tab 的正文。
 *
 * ⚠ 术语：artifact = 脚本经 `artifact.*` 发布给用户看的产出。
 *
 * **零新渲染依赖**：pdf / 图片 / markdown / office / 文本全部走既有的叶子查看器，预置看板走
 * 4b 的四个渲染器。分派的判据是 journal 记录上的 `contentType`——它由 driver 按扩展名表算出、
 * 可被 `opts.contentType` 覆盖，是这条链路唯一的类型真相（store 读回来时会自己重新嗅一次，
 * 那个值刻意不用）。
 *
 * **刻意不做 iframe**：renderer 没有 CSP，`allow-scripts allow-same-origin` 的 sandbox 组合
 * 等价于逃逸。html 因此走既有的浏览器 tab（见 `WorkflowArtifactHtmlCard`）。
 */
// 三个重量级查看器都懒加载：pdf.js / docx-preview / xlsx wasm 各自都是几百 KB，
// 而绝大多数会话从不打开产物 tab。既有的 previewPane* 包装本身已经带 Suspense。
const PdfPreviewContent = lazy(() => import("@/previewPanePdfContent.js").then((module) => ({ default: module.PdfPreviewContent })));
const PptxPreviewContent = lazy(() => import("@/previewPanePptxContent.js").then((module) => ({ default: module.PptxPreviewContent })));
const PreviewPaneOfficeContent = lazy(() => import("@/previewPaneOfficeContent.js").then((module) => ({
    default: module.PreviewPaneOfficeContent,
})));
const PPTX_CONTENT_TYPE = "application/vnd.openxmlformats-officedocument.presentationml.presentation";
const DOCX_CONTENT_TYPE = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
const XLSX_CONTENT_TYPE = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
/** 文本类：正文用等宽 code viewer 呈现。`text/markdown` 不在其中——它走 MessageResponse。 */
function textLanguageFor(contentType) {
    if (contentType === "application/json")
        return "json";
    if (contentType === "text/csv")
        return "csv";
    if (contentType === "text/plain")
        return "text";
    if (contentType.startsWith("text/"))
        return "text";
    return undefined;
}
export function WorkflowArtifactBody(props) {
    const { intl } = useZCodeIntl();
    const { artifact } = props;
    // 预置看板不读字节，直接画。
    if (isArtifactPresetKind(artifact.kind)) {
        const labels = buildPresetLabels((descriptor, values) => intl.formatMessage(descriptor, values));
        return (_jsx("div", { className: "h-full min-h-0 overflow-auto p-4", "data-artifact-body": "preset", children: _jsx(ArtifactPresetBody, { artifact: artifact, items: props.items, labels: labels, invalidLabel: intl.formatMessage({
                    id: "chat.toolCall.workflow.run.artifacts.presetInvalid",
                }), ...(props.metadataLoading
                    ? {}
                    : {
                        missingLabel: intl.formatMessage({
                            id: "chat.toolCall.workflow.run.artifacts.unavailable",
                        }),
                    }) }) }));
    }
    if (props.error !== null) {
        return (_jsx(ArtifactNotice, { testId: "workflow-artifact-error", tone: "error", text: intl.formatMessage({ id: "chat.toolCall.workflow.run.artifacts.loadError" }), detail: props.error }));
    }
    if (props.loading || props.bytes === null) {
        return (_jsx(ArtifactNotice, { testId: "workflow-artifact-loading", text: intl.formatMessage({ id: "chat.toolCall.workflow.run.artifacts.loading" }) }));
    }
    return _jsx(WorkflowArtifactContent, { ...props, bytes: props.bytes });
}
/**
 * 字节已就绪之后的分派。拆成第二个组件的理由是 hooks：markdown 的解码、office 的 base64
 * 回程都得用 `useMemo`，而它们在「还没读到字节」的那一帧不能被跳过（hooks 数量必须恒定）。
 */
function WorkflowArtifactContent({ artifact, bytes, blob, objectUrl, theme, resolvedTheme, onOpenBrowserUrl, onReveal, localSourcePath, isLatestVersion, }) {
    const { intl } = useZCodeIntl();
    const pdfLabels = usePdfViewerLabels();
    const pptxLabels = usePptxViewerLabels();
    const contentType = artifact.contentType ?? "application/octet-stream";
    // 文本三态（markdown / 代码 / html 源）共用一次解码。TextDecoder 在 renderer 里恒在。
    const text = useMemo(() => {
        if (contentType !== "text/markdown" &&
            contentType !== "text/html" &&
            textLanguageFor(contentType) === undefined) {
            return undefined;
        }
        return new TextDecoder().decode(bytes);
    }, [bytes, contentType]);
    // office 查看器只吃 `FileBinaryPreview.dataBase64`，所以这里走一次回程编码。
    // 只在真的是 office 文件时才算——20 MiB 的 base64 不该为一份 pdf 白算一遍。
    const officePreview = useMemo(() => {
        if (contentType !== DOCX_CONTENT_TYPE && contentType !== XLSX_CONTENT_TYPE)
            return null;
        return {
            path: artifact.sourcePath ?? artifact.id,
            dataBase64: encodeBytesToBase64(bytes),
            totalBytes: bytes.length,
        };
    }, [artifact.id, artifact.sourcePath, bytes, contentType]);
    // pptx 查看器吃 ArrayBuffer。`slice` 出一份独立缓冲：Uint8Array 的 buffer 可能带偏移。
    const pptxBuffer = useMemo(() => contentType === PPTX_CONTENT_TYPE
        ? bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength)
        : null, [bytes, contentType]);
    if (contentType === "text/markdown") {
        return (_jsx("div", { className: "h-full min-h-0 overflow-y-auto px-4 py-4", "data-artifact-body": "markdown", children: _jsx(MessageResponse, { className: "mx-auto w-full min-w-0 max-w-4xl break-words text-foreground", theme: theme, children: text ?? "" }) }));
    }
    if (contentType === "application/pdf") {
        return (_jsx("div", { className: "h-full min-h-0", "data-artifact-body": "pdf", children: _jsx(Suspense, { fallback: _jsx(ArtifactNotice, { text: pdfLabels.loading }), children: _jsx(PdfPreviewContent, { labels: pdfLabels, source: blob ?? new Blob([bytes]) }) }) }));
    }
    if (contentType.startsWith("image/")) {
        return (_jsx("div", { className: "flex h-full min-h-0 items-center justify-center overflow-auto bg-background-alt p-4", "data-artifact-body": "image", children: objectUrl === null ? (_jsx(ArtifactNotice, { text: intl.formatMessage({ id: "chat.toolCall.workflow.run.artifacts.loadError" }), tone: "error" })) : (_jsx("img", { alt: artifact.title ?? artifact.id, className: "max-h-full max-w-full object-contain", "data-testid": "workflow-artifact-image", src: objectUrl })) }));
    }
    if (contentType === PPTX_CONTENT_TYPE && pptxBuffer !== null) {
        return (_jsx("div", { className: "h-full min-h-0", "data-artifact-body": "pptx", children: _jsx(Suspense, { fallback: _jsx(ArtifactNotice, { text: pptxLabels.loading }), children: _jsx(PptxPreviewContent, { data: pptxBuffer, fileName: artifact.sourcePath ?? artifact.id, labels: pptxLabels, ...(onOpenBrowserUrl === undefined ? {} : { onOpenBrowserUrl }) }) }) }));
    }
    if (officePreview !== null) {
        return (_jsx("div", { className: "h-full min-h-0", "data-artifact-body": "office", children: _jsx(Suspense, { fallback: _jsx(ArtifactNotice, { text: pdfLabels.loading }), children: _jsx(PreviewPaneOfficeContent, { error: null, kind: contentType === XLSX_CONTENT_TYPE ? "excel" : "docx", loading: false, preview: officePreview, resolvedTheme: resolvedTheme, sourcePath: artifact.sourcePath ?? artifact.id, ...(onOpenBrowserUrl === undefined ? {} : { onOpenBrowserUrl }) }) }) }));
    }
    if (contentType === "text/html") {
        return (_jsx(WorkflowArtifactHtmlCard, { artifact: artifact, bytes: bytes.length, isLatestVersion: isLatestVersion, ...(localSourcePath === undefined ? {} : { localSourcePath }), ...(onOpenBrowserUrl === undefined ? {} : { onOpenBrowserUrl }), ...(onReveal === undefined ? {} : { onReveal }) }));
    }
    const language = textLanguageFor(contentType);
    if (language !== undefined && text !== undefined) {
        return (_jsx("div", { className: "h-full min-h-0 overflow-auto", "data-artifact-body": "text", children: _jsx(CodeBlock, { appTheme: theme, code: text, language: language, showLineNumbers: true }) }));
    }
    // 表外类型（`application/octet-stream` 与一切没人认得的东西）：给一张**元数据卡**，
    // 不假装能渲染。卡上带「在工作区显示」；交给别的 App 打开走 tab 头部的「作为文件打开」。
    return (_jsx(ArtifactMetadataCard, { artifact: artifact, bytes: bytes.length, note: intl.formatMessage({ id: "chat.toolCall.workflow.run.artifacts.unsupported" }), testId: "workflow-artifact-unsupported", ...(onReveal === undefined
            ? {}
            : {
                action: {
                    label: intl.formatMessage({ id: "chat.toolCall.workflow.run.artifacts.reveal" }),
                    onActivate: onReveal,
                    testId: "workflow-artifact-unsupported-reveal",
                },
            }) }));
}
//# sourceMappingURL=WorkflowArtifactBody.js.map