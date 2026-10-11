import { jsx as _jsx } from "react/jsx-runtime";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { DocxEditorViewer, setWasmSource, useDocxEditor, useDocxModel, } from "@extend-ai/react-docx";
import docxWasmUrl from "@extend-ai/react-docx/docx_wasm_bg.wasm?url";
import { calculateDocxPreviewFit, installDocumentLinkSafety, } from "@/lib/officeFilePreview.js";
import { logger } from "@/logger.js";
setWasmSource(docxWasmUrl);
let nextDocxModelRenderKey = 0;
const docxModelRenderKeys = new WeakMap();
function getDocxModelRenderKey(model) {
    const existingKey = docxModelRenderKeys.get(model);
    if (existingKey !== undefined) {
        return existingKey;
    }
    nextDocxModelRenderKey += 1;
    docxModelRenderKeys.set(model, nextDocxModelRenderKey);
    return nextDocxModelRenderKey;
}
function isSameDocxPreviewFit(current, next) {
    return (current !== null &&
        Math.abs(current.scale - next.scale) < 0.001 &&
        Math.abs(current.width - next.width) < 0.5 &&
        Math.abs(current.height - next.height) < 0.5);
}
function ResponsiveDocxEditorViewer({ model, onOpenBrowserUrl, sourcePath, }) {
    // 轻量 ReactDocxViewer 不走编辑器的完整分页与排版链路，预览结果会和编辑画布不一致。
    // 使用同一个 editor controller 驱动文档画布，但固定为只读模式，避免暴露任何编辑能力。
    const editor = useDocxEditor({
        starterModel: model,
        initialFileName: sourcePath,
        initialDocumentTheme: "light",
    });
    const viewportRef = useRef(null);
    const contentRef = useRef(null);
    const [fit, setFit] = useState(null);
    // 外层使用 transform 缩放页面，但 react-docx 的虚拟列表不会自动识别 transform。
    // 必须同步传入相同 zoomScale，否则滚动坐标会按未缩放页高计算，导致闪白或末页无法挂载。
    const pageVirtualization = useMemo(() => ({ zoomScale: fit?.scale ?? 1 }), [fit?.scale]);
    const updateFit = useCallback(() => {
        const viewport = viewportRef.current;
        const content = contentRef.current;
        if (!viewport || !content) {
            return;
        }
        const next = calculateDocxPreviewFit({
            availableWidth: viewport.clientWidth,
            naturalHeight: content.offsetHeight,
            naturalWidth: content.offsetWidth,
        });
        if (!next) {
            return;
        }
        setFit((current) => {
            if (isSameDocxPreviewFit(current, next)) {
                return current;
            }
            // 调试说明：拖动 Preview Pane 时会按帧触发 ResizeObserver；高频尺寸轨迹只走 debug，
            // 生产构建不落盘，避免响应式布局把日志量放大到和 resize 事件同数量级。
            logger.debug("[PreviewPane] DOCX 预览宽度已同步", {
                path: sourcePath,
                availableWidth: viewport.clientWidth,
                naturalWidth: content.offsetWidth,
                scale: next.scale,
            });
            return next;
        });
    }, [sourcePath]);
    useLayoutEffect(() => {
        const content = contentRef.current;
        const disposeLinkSafety = content ? installDocumentLinkSafety(content, onOpenBrowserUrl) : null;
        updateFit();
        if (typeof ResizeObserver === "undefined") {
            return disposeLinkSafety ?? undefined;
        }
        const resizeObserver = new ResizeObserver(updateFit);
        if (viewportRef.current) {
            resizeObserver.observe(viewportRef.current);
        }
        if (contentRef.current) {
            resizeObserver.observe(contentRef.current);
        }
        return () => {
            resizeObserver.disconnect();
            disposeLinkSafety?.();
        };
    }, [onOpenBrowserUrl, updateFit]);
    return (_jsx("div", { ref: viewportRef, className: "w-full min-w-0", "data-docx-fit-viewport": true, children: _jsx("div", { className: "relative mx-auto", "data-docx-fit-frame": true, style: fit ? { width: fit.width, height: fit.height } : undefined, children: _jsx("div", { ref: contentRef, className: "theme-zai-light min-w-max text-foreground", "data-docx-fit-content": true, style: fit
                    ? {
                        position: "absolute",
                        left: 0,
                        top: 0,
                        transform: `scale(${fit.scale})`,
                        transformOrigin: "top left",
                    }
                    : undefined, children: _jsx(DocxEditorViewer, { className: "min-w-max", editor: editor, mode: "read-only", pageGapBackgroundColor: "transparent", pageVirtualization: pageVirtualization }) }) }) }));
}
export function PreviewPaneOfficeLegacyDocContent({ buffer, errorMessage, onOpenBrowserUrl, sourcePath, }) {
    const { model, isLoading, error } = useDocxModel(buffer);
    useEffect(() => {
        if (!error) {
            return;
        }
        logger.error("[PreviewPane] DOCX 文件解析失败", {
            path: sourcePath,
            error: error.message,
        });
    }, [error, sourcePath]);
    if (isLoading) {
        return (_jsx("div", { "aria-busy": "true", className: "h-full min-h-0 w-full bg-background", "data-office-preview-pending": true }));
    }
    if (error || !model) {
        return (_jsx("div", { className: "p-3 text-ui-base text-destructive", role: "alert", children: errorMessage }));
    }
    return (_jsx("div", { className: "h-full min-h-0 w-full min-w-0 overflow-auto bg-background p-4 max-sm:p-2", "data-office-preview-kind": "doc", children: _jsx(ResponsiveDocxEditorViewer, { model: model, onOpenBrowserUrl: onOpenBrowserUrl, sourcePath: sourcePath }, getDocxModelRenderKey(model)) }));
}
//# sourceMappingURL=previewPaneOfficeLegacyDocContent.js.map