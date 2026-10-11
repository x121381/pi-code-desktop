"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon, ZoomInIcon, ZoomOutIcon } from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/TextLayer.css";
const pdfWorkerSrc = "/zcode-assets/pdf.worker.min.mjs";
import { cn } from "../../components/lib/utils.js";
import { Button } from "../../components/ui/button.js";
import * as pdfZoom from "../../components/ui/usePdfZoomOverlay.js";
import { isAppleKeyboardPlatform } from "../../lib/keyboardShortcuts.js";
import { createPdfJsDocumentOptions } from "../../lib/pdfJsAssets.js";
pdfjs.GlobalWorkerOptions.workerSrc = pdfWorkerSrc;
// 与 service 层 readFileRange 的默认分段大小对齐，一次 range 请求对应一次 RPC 调用。
const RANGE_CHUNK_BYTES = 256 * 1024;
// ReportLab 的 STSong-Light 等 Type0 字体只声明预定义 CMap，PDF 内并未嵌入
// 字符映射；浏览器原生 PDF 预览自带该资源，而 PDF.js 必须显式传入 cMapUrl。
// 使用 Vite base 解析，Desktop 的 file:// 与 Web/手机远控的子路径部署都读取各自静态资源。
const DOCUMENT_OPTIONS = createPdfJsDocumentOptions(typeof globalThis.__ZCODE_VITE_ENV__?.BASE_URL === "string" ? globalThis.__ZCODE_VITE_ENV__.BASE_URL : "./", globalThis.location?.href ?? "http://localhost/");
// range 模式关闭整档预取与流式加载，保持“只拉需要的页”；模块级常量保证引用稳定，
// 避免 react-pdf 因 options 引用变化重新加载文档。
const RANGE_DOCUMENT_OPTIONS = {
    ...DOCUMENT_OPTIONS,
    disableAutoFetch: true,
    disableStream: true,
    rangeChunkSize: RANGE_CHUNK_BYTES,
};
function isPdfViewerRangeSource(source) {
    return (typeof source === "object" &&
        source !== null &&
        "requestRange" in source &&
        typeof source.requestRange === "function");
}
class PdfViewerRangeTransport extends pdfjs.PDFDataRangeTransport {
    rangeSource;
    onRequestError;
    constructor(rangeSource, onRequestError) {
        super(rangeSource.totalBytes, rangeSource.initialData ?? null);
        this.rangeSource = rangeSource;
        this.onRequestError = onRequestError;
    }
    requestDataRange(begin, end) {
        this.rangeSource
            .requestRange(begin, end - begin)
            .then((chunk) => {
            this.onDataRange(begin, chunk);
        })
            .catch((error) => {
            this.onRequestError(error instanceof Error ? error : new Error(String(error)));
        });
    }
}
const DEFAULT_LABELS = {
    loading: "Loading PDF…",
    loadError: "Failed to load PDF",
    noData: "No PDF data",
    previousPage: "Previous page",
    nextPage: "Next page",
    pageInput: "Page number",
    zoomIn: "Zoom in",
    zoomOut: "Zoom out",
};
function normalizePdfSource(source) {
    if (typeof source === "string" || source instanceof Blob) {
        return source;
    }
    // pdf.js 会把二进制数据 transfer 给 worker，导致原 buffer detached；
    // 复制一份，保证调用方复用同一份数据重新打开预览时不会报错。
    if (source instanceof ArrayBuffer) {
        return { data: new Uint8Array(source.slice(0)) };
    }
    return { data: new Uint8Array(source) };
}
export function PdfViewer({ source, labels, onLoadError, className, ...props }) {
    const mergedLabels = { ...DEFAULT_LABELS, ...labels };
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageInput, setPageInput] = useState("1");
    // renderScale 是真正传给 <Page> 的值；displayScale 是用户看到的目标倍率，
    // 缩放手势期间只更新 displayScale（CSS transform 预览），停顿后再提交给 renderScale。
    const [renderScale, setRenderScale] = useState(pdfZoom.DEFAULT_SCALE);
    const [displayScale, setDisplayScale] = useState(pdfZoom.DEFAULT_SCALE);
    const [pageIntrinsicSize, setPageIntrinsicSize] = useState(null);
    const [rangeError, setRangeError] = useState(false);
    const scrollContainerRef = useRef(null);
    const pendingScrollToTopRef = useRef(false);
    const displayScaleRef = useRef(pdfZoom.DEFAULT_SCALE);
    const renderScaleRef = useRef(pdfZoom.DEFAULT_SCALE);
    const pendingZoomAnchorRef = useRef(null);
    const onLoadErrorRef = useRef(onLoadError);
    onLoadErrorRef.current = onLoadError;
    const { clearZoomOverlay, pageViewportRef, stageZoomOverlay } = pdfZoom.usePdfZoomOverlay();
    const rangeTransport = useMemo(() => {
        if (!isPdfViewerRangeSource(source)) {
            return null;
        }
        return new PdfViewerRangeTransport(source, (error) => {
            setRangeError(true);
            onLoadErrorRef.current?.(error);
        });
    }, [source]);
    const file = useMemo(() => {
        if (rangeTransport) {
            return { range: rangeTransport };
        }
        return normalizePdfSource(source);
    }, [rangeTransport, source]);
    useEffect(() => {
        return () => {
            // 文档切换/卸载时中止 range 传输，让 pdf.js 停止等待未完成的分段请求
            rangeTransport?.abort();
        };
    }, [rangeTransport]);
    useEffect(() => {
        setNumPages(null);
        setPageNumber(1);
        setPageInput("1");
        setRenderScale(pdfZoom.DEFAULT_SCALE);
        setDisplayScale(pdfZoom.DEFAULT_SCALE);
        setPageIntrinsicSize(null);
        setRangeError(false);
        displayScaleRef.current = pdfZoom.DEFAULT_SCALE;
        renderScaleRef.current = pdfZoom.DEFAULT_SCALE;
        pendingScrollToTopRef.current = false;
        pendingZoomAnchorRef.current = null;
        clearZoomOverlay();
    }, [clearZoomOverlay, file]);
    const goToPage = useCallback((target) => {
        if (numPages === null) {
            return;
        }
        const clamped = Math.min(Math.max(1, Math.round(target)), numPages);
        setPageInput(String(clamped));
        if (clamped !== pageNumber) {
            clearZoomOverlay();
            setPageIntrinsicSize(null);
            pendingZoomAnchorRef.current = null;
            pendingScrollToTopRef.current = true;
            setPageNumber(clamped);
        }
    }, [clearZoomOverlay, numPages, pageNumber]);
    const handlePageRenderSuccess = useCallback((completedScale, originalWidth, originalHeight) => {
        // react-pdf 的旧 render task 可能在新倍率提交后才回调，不能让旧回调提前移除覆盖层。
        if (Math.abs(completedScale - renderScaleRef.current) > 0.001) {
            return;
        }
        setPageIntrinsicSize((current) => pdfZoom.resolvePdfPageSize(current, originalWidth, originalHeight));
        clearZoomOverlay();
        const container = scrollContainerRef.current;
        const pendingScrollToTop = pendingScrollToTopRef.current;
        pendingScrollToTopRef.current = false;
        if (!container) {
            return;
        }
        if (pendingScrollToTop) {
            container.scrollTop = 0;
        }
    }, [clearZoomOverlay]);
    const commitPageInput = useCallback(() => {
        const parsed = Number.parseInt(pageInput.trim(), 10);
        if (Number.isNaN(parsed)) {
            setPageInput(String(pageNumber));
            return;
        }
        goToPage(parsed);
    }, [goToPage, pageInput, pageNumber]);
    const handleKeyDown = useCallback((event) => {
        // 页码输入框内保留方向键的光标语义
        if (event.target.tagName === "INPUT") {
            return;
        }
        if (event.key === "ArrowLeft") {
            event.preventDefault();
            goToPage(pageNumber - 1);
        }
        else if (event.key === "ArrowRight") {
            event.preventDefault();
            goToPage(pageNumber + 1);
        }
    }, [goToPage, pageNumber]);
    const documentLoaded = numPages !== null;
    const zoomTo = useCallback((target, pointer) => {
        const current = displayScaleRef.current;
        const next = pdfZoom.clampScale(target);
        if (next === current) {
            return;
        }
        const container = scrollContainerRef.current;
        const pageViewport = pageViewportRef.current;
        pendingZoomAnchorRef.current =
            container && pageViewport
                ? pdfZoom.capturePdfZoomAnchor(container, pageViewport, pointer)
                : null;
        displayScaleRef.current = next;
        setDisplayScale(next);
    }, [pageViewportRef]);
    useLayoutEffect(() => {
        const anchor = pendingZoomAnchorRef.current;
        const container = scrollContainerRef.current;
        const pageViewport = pageViewportRef.current;
        pendingZoomAnchorRef.current = null;
        if (anchor && container && pageViewport) {
            // 缩放布局提交后再校正，跨越“居中 / 横向滚动”边界时也保持指针下的内容点稳定。
            pdfZoom.restorePdfZoomAnchor(container, pageViewport, anchor);
        }
    }, [displayScale, pageViewportRef]);
    // 手势停顿后把预览倍率一次性提交给 <Page> 重渲染；displayScale 每次变化都会重置计时器。
    useEffect(() => {
        if (displayScale === renderScale) {
            return;
        }
        const timer = window.setTimeout(() => {
            // react-pdf 会在 scale key 变化时卸载旧 canvas，并隐藏尚未绘制完成的新 canvas。
            // 提交前复制当前位图作为双缓冲覆盖层，直到新 canvas 的 onRenderSuccess 到达。
            const pageViewport = pageViewportRef.current;
            if (pageViewport) {
                stageZoomOverlay(pageViewport.offsetWidth, pageViewport.offsetHeight);
            }
            renderScaleRef.current = displayScale;
            setRenderScale(displayScale);
        }, pdfZoom.ZOOM_COMMIT_DELAY_MS);
        return () => {
            window.clearTimeout(timer);
        };
    }, [displayScale, renderScale, stageZoomOverlay]);
    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container || !documentLoaded) {
            return;
        }
        const zoomWithAppleModifier = isAppleKeyboardPlatform();
        const handleWheelZoom = (event) => {
            // macOS 绑定 command，其余平台（Windows/Linux）绑定 ctrl
            const zoomModifierPressed = zoomWithAppleModifier ? event.metaKey : event.ctrlKey;
            if (!zoomModifierPressed) {
                return;
            }
            // 修饰键 + 滚轮独占为缩放手势，不再滚动页面内容
            event.preventDefault();
            if (event.deltaY === 0) {
                return;
            }
            zoomTo(displayScaleRef.current * Math.exp(-event.deltaY * pdfZoom.WHEEL_ZOOM_SENSITIVITY), event);
        };
        // React 的 onWheel 委托在 root 上是 passive 监听，preventDefault 不生效；
        // 这里直接挂非 passive 的原生监听，避免缩放时页面同时滚动。
        container.addEventListener("wheel", handleWheelZoom, { passive: false });
        return () => {
            container.removeEventListener("wheel", handleWheelZoom);
        };
    }, [documentLoaded, zoomTo]);
    const controlsDisabled = numPages === null;
    const zoomPercent = Math.round(displayScale * 100);
    const zoomPreviewScale = displayScale / renderScale;
    const pageDisplaySize = pdfZoom.getPdfPageDisplaySize(pageIntrinsicSize, displayScale);
    const pagePreviewStyle = pdfZoom.getPdfPagePreviewStyle(pageDisplaySize !== undefined, zoomPreviewScale);
    return (_jsxs("div", { tabIndex: 0, onKeyDown: handleKeyDown, className: cn("flex h-full min-h-0 flex-col outline-none", className), ...props, children: [_jsx("div", { ref: scrollContainerRef, className: "min-h-0 flex-1 overflow-auto", children: _jsx("div", { className: "mx-auto w-max p-4", children: rangeError ? (_jsx("div", { className: "p-3 text-ui-base text-destructive", children: mergedLabels.loadError })) : (_jsx("div", { ref: pageViewportRef, className: "relative", style: pageDisplaySize, children: _jsx("div", { style: pagePreviewStyle, children: _jsx(Document, { file: file, options: rangeTransport ? RANGE_DOCUMENT_OPTIONS : DOCUMENT_OPTIONS, onLoadSuccess: (document) => {
                                    setNumPages(document.numPages);
                                    const clamped = Math.min(pageNumber, document.numPages);
                                    setPageNumber(clamped);
                                    setPageInput(String(clamped));
                                }, onLoadError: onLoadError, loading: _jsx("div", { className: "p-3 text-ui-base text-foreground-subtle", children: mergedLabels.loading }), error: _jsx("div", { className: "p-3 text-ui-base text-destructive", children: mergedLabels.loadError }), noData: _jsx("div", { className: "p-3 text-ui-base text-foreground-subtle", children: mergedLabels.noData }), children: _jsx(Page, { pageNumber: pageNumber, scale: renderScale, renderAnnotationLayer: false, onRenderSuccess: (page) => handlePageRenderSuccess(page.width / page.originalWidth, page.originalWidth, page.originalHeight), className: "shadow-md" }) }) }) })) }) }), _jsxs("div", { className: "flex shrink-0 items-center justify-center gap-1 border-t border-border px-2 py-1.5", children: [_jsx(Button, { variant: "ghost", size: "icon-sm", "aria-label": mergedLabels.previousPage, disabled: controlsDisabled || pageNumber <= 1, onClick: () => goToPage(pageNumber - 1), children: _jsx(ChevronLeftIcon, {}) }), _jsxs("div", { className: "flex items-center gap-1 text-ui-base text-foreground-subtle", children: [_jsx("input", { value: pageInput, inputMode: "numeric", disabled: controlsDisabled, "aria-label": mergedLabels.pageInput, onChange: (event) => setPageInput(event.target.value), onKeyDown: (event) => {
                                    if (event.key === "Enter") {
                                        event.preventDefault();
                                        commitPageInput();
                                    }
                                }, onBlur: commitPageInput, className: "h-6 w-10 rounded-md border border-input-border bg-input px-1 text-center text-ui-base text-foreground outline-none transition-colors hover:border-input-border-hover focus-visible:border-input-border-focused focus-visible:bg-input-focused disabled:pointer-events-none disabled:opacity-50" }), _jsxs("span", { children: ["/ ", numPages ?? "-"] })] }), _jsx(Button, { variant: "ghost", size: "icon-sm", "aria-label": mergedLabels.nextPage, disabled: controlsDisabled || numPages === null || pageNumber >= numPages, onClick: () => goToPage(pageNumber + 1), children: _jsx(ChevronRightIcon, {}) }), _jsx("div", { className: "mx-1 h-4 w-px bg-border" }), _jsx(Button, { variant: "ghost", size: "icon-sm", "aria-label": mergedLabels.zoomOut, disabled: controlsDisabled || displayScale <= pdfZoom.MIN_SCALE, onClick: () => zoomTo(displayScale - pdfZoom.ZOOM_STEP), children: _jsx(ZoomOutIcon, {}) }), _jsxs("span", { className: "w-11 text-center text-ui-base text-foreground-subtle tabular-nums", children: [zoomPercent, "%"] }), _jsx(Button, { variant: "ghost", size: "icon-sm", "aria-label": mergedLabels.zoomIn, disabled: controlsDisabled || displayScale >= pdfZoom.MAX_SCALE, onClick: () => zoomTo(displayScale + pdfZoom.ZOOM_STEP), children: _jsx(ZoomInIcon, {}) })] })] }));
}
//# sourceMappingURL=pdf-viewer.js.map