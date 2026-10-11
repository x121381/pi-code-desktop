"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useCallback, useEffect, useMemo, useRef, useState, } from "react";
import { ChevronLeftIcon, ChevronRightIcon, FileDownIcon, Loader2Icon, MousePointer2Icon, ZoomInIcon, ZoomOutIcon, } from "lucide-react";
import { Button } from "@/components/ui/button.js";
import { Input } from "@/components/ui/input.js";
import { PopoverAnchor } from "@/components/ui/popover.js";
import { toast } from "@/components/ui/toast.js";
import { PptxSelectionActionBar } from "@/components/ui/pptx-selection-action-bar.js";
import { cn } from "@/components/lib/utils.js";
import { logger } from "@/logger.js";
import { useOptionalPlatform } from "@/hooks/usePlatform.js";
import { PPTX_MAX_ZOOM_PERCENT, PPTX_MIN_ZOOM_PERCENT, PPTX_ZOOM_STEP_PERCENT, clampPresentationPageNumber, clampPresentationZoomPercent, } from "@/presentation/presentationPreviewControls.js";
import { hitTestPresentationElement } from "@/presentation/presentationElementModel.js";
import { getPresentationElementSelectedText } from "@/presentation/presentationTextSelection.js";
import { installDocumentLinkSafety, sanitizeDocumentHref } from "@/lib/officeFilePreview.js";
import { createPptxElementReference, dispatchPptxElementReferenceAddToChat, sha256Fingerprint, } from "@/lib/pptxElementReference.js";
function isSamePresentationElement(left, right) {
    if (!left || !right) {
        return false;
    }
    return (left.nodeId === right.nodeId &&
        left.nodeType === right.nodeType &&
        left.rowIndex === right.rowIndex &&
        left.cellIndex === right.cellIndex);
}
function toPresentationPoint(surface, pageSize, clientX, clientY) {
    const rect = surface.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) {
        return null;
    }
    return {
        x: ((clientX - rect.left) / rect.width) * pageSize.width,
        y: ((clientY - rect.top) / rect.height) * pageSize.height,
    };
}
function RenderedPage({ document, pageIndex, scale, generation, interactive = false, onNavigate, onOpenBrowserUrl, onRenderError, selectionMode = false, elements = [], selectedElement = null, onSelectElement, renderSurfaceRef, }) {
    const frameRef = useRef(null);
    const internalMountRef = useRef(null);
    const mountRef = renderSurfaceRef ?? internalMountRef;
    const textSelectionEnabled = selectionMode && Boolean(selectedElement?.text?.trim());
    useEffect(() => {
        const frame = frameRef.current;
        if (!frame) {
            return;
        }
        // 幻灯片内部 overflow:hidden 容器的滚动条已被全局隐藏，但选区拖拽自动滚动、
        // 链接焦点 scrollIntoView 等原生行为仍能滚动它们，内容会无声偏移且无法拖回。
        // scroll 不冒泡，这里用捕获监听把内部任何滚动偏移复位。
        const resetScroll = (event) => {
            const target = event.target;
            if (target instanceof HTMLElement && (target.scrollTop !== 0 || target.scrollLeft !== 0)) {
                target.scrollTop = 0;
                target.scrollLeft = 0;
            }
        };
        frame.addEventListener("scroll", resetScroll, true);
        return () => frame.removeEventListener("scroll", resetScroll, true);
    }, []);
    useEffect(() => {
        const mount = mountRef.current;
        if (!mount) {
            return;
        }
        let handle = null;
        let disposeLinkSafety;
        let cancelled = false;
        const reportRenderError = (error) => {
            if (cancelled) {
                return;
            }
            onRenderError?.(generation, error instanceof Error ? error : new Error(String(error)));
        };
        try {
            handle = document.renderPage(pageIndex, mount, {
                onNavigate: (target) => {
                    if (target.pageIndex !== undefined) {
                        onNavigate?.(target.pageIndex);
                        return;
                    }
                    const safeUrl = sanitizeDocumentHref(target.url);
                    if (safeUrl && !safeUrl.startsWith("#")) {
                        onOpenBrowserUrl?.(safeUrl);
                    }
                },
            });
            // PPTX renderer 会把 OOXML 外链直接写成 <a href>；必须在页面挂载点
            // 统一净化并阻断主 renderer 导航，同时覆盖异步追加的链接节点。
            disposeLinkSafety = installDocumentLinkSafety(mount, onOpenBrowserUrl);
            void handle.ready.catch(reportRenderError);
        }
        catch (error) {
            reportRenderError(error);
        }
        return () => {
            // dispose() 不保证 ready Promise 同步结束；先取消回调，避免已卸载页面的迟到错误写入下一次会话。
            cancelled = true;
            disposeLinkSafety?.();
            handle?.dispose();
            mount.replaceChildren();
        };
    }, [document, generation, onNavigate, onOpenBrowserUrl, onRenderError, pageIndex]);
    return (_jsx("div", { ref: frameRef, className: "relative shrink-0 overflow-hidden bg-background shadow-md", style: {
            width: document.pageSize.width * scale,
            height: document.pageSize.height * scale,
        }, children: _jsxs("div", { "data-zcode-pptx-render-surface": "", className: "absolute left-0 top-0 origin-top-left", style: {
                width: document.pageSize.width,
                height: document.pageSize.height,
                transform: `scale(${scale})`,
            }, children: [_jsx("div", { ref: mountRef, "data-zcode-pptx-render-surface": "true", className: cn("absolute inset-0", interactive && (!selectionMode || textSelectionEnabled)
                        ? "pointer-events-auto"
                        : "pointer-events-none", textSelectionEnabled && "select-text"), onPointerDownCapture: (event) => {
                        if (!textSelectionEnabled) {
                            return;
                        }
                        const point = toPresentationPoint(event.currentTarget, document.pageSize, event.clientX, event.clientY);
                        const hitElement = point ? hitTestPresentationElement(elements, point) : null;
                        if (isSamePresentationElement(hitElement, selectedElement)) {
                            return;
                        }
                        // 选中浮层覆盖真实文本，且底层页面禁用了指针命中，浏览器无法创建原生文字 Selection。
                        // 含文本元素高亮后只放行其 bounds；bounds 外仍由稳定元素模型切换选择，避免打开底层超链接。
                        event.preventDefault();
                        event.stopPropagation();
                        if (hitElement) {
                            onSelectElement?.(hitElement);
                        }
                    }, onClickCapture: (event) => {
                        if (!selectionMode) {
                            return;
                        }
                        // 文字划选结束后的 click 不得恢复 PPTX 内部跳转；原生 Selection 已在 pointer 序列中完成。
                        event.preventDefault();
                        event.stopPropagation();
                    } }), selectionMode ? (_jsx("div", { className: "pointer-events-none absolute inset-0", "data-pptx-element-selection-overlay": "true", children: elements.map((element) => {
                        const elementKey = [
                            element.nodeId,
                            element.nodeType,
                            element.rowIndex ?? "",
                            element.cellIndex ?? "",
                        ].join(":");
                        const selected = isSamePresentationElement(selectedElement, element);
                        const elementButton = (_jsx("button", { type: "button", "aria-pressed": selected, "aria-label": element.text || element.nodeName || element.nodeType, className: cn("absolute border outline-none transition-colors", textSelectionEnabled ? "pointer-events-none" : "pointer-events-auto", selected
                                ? "border-primary bg-accent/30"
                                : "border-transparent bg-transparent hover:border-primary hover:bg-accent/20"), style: {
                                left: element.bounds.x,
                                top: element.bounds.y,
                                width: element.bounds.width,
                                height: element.bounds.height,
                                zIndex: element.zIndex * 2 + (element.nodeType === "table-cell" ? 1 : 0),
                            }, onClick: () => onSelectElement?.(element) }, elementKey));
                        return selected ? (_jsx(PopoverAnchor, { asChild: true, children: elementButton }, `anchor:${elementKey}`)) : (elementButton);
                    }) })) : null] }) }));
}
function PptxThumbnail({ document, pageIndex, generation, selected, scrollRoot, labels, onSelect, }) {
    const buttonRef = useRef(null);
    const [visible, setVisible] = useState(false);
    const [width, setWidth] = useState(0);
    useEffect(() => {
        const button = buttonRef.current;
        if (!button || typeof IntersectionObserver === "undefined") {
            setVisible(true);
            return;
        }
        const observer = new IntersectionObserver(([entry]) => setVisible(entry?.isIntersecting ?? false), { root: scrollRoot, rootMargin: "200px 0px" });
        observer.observe(button);
        return () => observer.disconnect();
    }, [scrollRoot]);
    useEffect(() => {
        const button = buttonRef.current;
        if (!button) {
            return;
        }
        const updateWidth = () => setWidth(Math.max(0, button.clientWidth - 16));
        updateWidth();
        if (typeof ResizeObserver === "undefined") {
            window.addEventListener("resize", updateWidth);
            return () => window.removeEventListener("resize", updateWidth);
        }
        const observer = new ResizeObserver(updateWidth);
        observer.observe(button);
        return () => observer.disconnect();
    }, []);
    useEffect(() => {
        if (selected) {
            buttonRef.current?.scrollIntoView({ block: "nearest" });
        }
    }, [selected]);
    const scale = width > 0 ? width / document.pageSize.width : 0;
    return (_jsxs("button", { ref: buttonRef, type: "button", "aria-current": selected ? "page" : undefined, "aria-label": labels.thumbnail(pageIndex + 1), className: cn("flex w-full flex-col items-center gap-1 rounded-lg border p-2 text-ui-xs text-foreground-subtle outline-none transition-colors", selected
            ? "border-border-hover bg-selected text-foreground"
            : "border-transparent hover:border-border hover:bg-surface-hover"), onClick: onSelect, children: [_jsx("div", { className: "flex w-full items-center justify-center overflow-hidden bg-surface", style: {
                    aspectRatio: `${document.pageSize.width} / ${document.pageSize.height}`,
                }, children: visible && scale > 0 ? (_jsx(RenderedPage, { document: document, generation: generation, pageIndex: pageIndex, scale: scale })) : null }), _jsx("span", { className: "tabular-nums", children: pageIndex + 1 })] }));
}
function useElementSize(node) {
    const [size, setSize] = useState({ width: 0, height: 0 });
    useEffect(() => {
        if (!node) {
            return;
        }
        const update = () => setSize({ width: node.clientWidth, height: node.clientHeight });
        update();
        if (typeof ResizeObserver === "undefined") {
            window.addEventListener("resize", update);
            return () => window.removeEventListener("resize", update);
        }
        const observer = new ResizeObserver(update);
        observer.observe(node);
        return () => observer.disconnect();
    }, [node]);
    return size;
}
export function PptxPreviewViewer({ data, labels, onOpenBrowserUrl, className, fileName, referenceSource, referenceNavigation, referenceNavigationReady = true, }) {
    const [presentation, setPresentation] = useState(null);
    const [loadError, setLoadError] = useState(false);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageInput, setPageInput] = useState("1");
    const [zoomPercent, setZoomPercent] = useState(100);
    const [exportingPdf, setExportingPdf] = useState(false);
    const [thumbnailRoot, setThumbnailRoot] = useState(null);
    const [previewViewport, setPreviewViewport] = useState(null);
    const [selectionMode, setSelectionMode] = useState(false);
    const [selectedElement, setSelectedElement] = useState(null);
    const [aiEditDraft, setAiEditDraft] = useState(null);
    const [addingReference, setAddingReference] = useState(false);
    const viewportSize = useElementSize(previewViewport);
    const generationRef = useRef(0);
    const platform = useOptionalPlatform();
    const canExportPdf = Boolean(platform?.printPageToPdf && platform?.saveFile);
    const appliedReferenceNavigationRequestIdRef = useRef(null);
    const mainRenderSurfaceRef = useRef(null);
    const document = presentation?.document ?? null;
    const documentGeneration = presentation?.generation ?? 0;
    useEffect(() => {
        const generation = generationRef.current + 1;
        generationRef.current = generation;
        let cancelled = false;
        let openedDocument = null;
        setPresentation(null);
        setLoadError(false);
        setPageNumber(1);
        setPageInput("1");
        setZoomPercent(100);
        setSelectionMode(false);
        setSelectedElement(null);
        setAiEditDraft(null);
        setAddingReference(false);
        void sha256Fingerprint(data)
            .then((sourceFingerprint) => import("@/presentation/pptxRendererPreviewEngine.js")
            .then(({ pptxRendererPreviewEngine }) => pptxRendererPreviewEngine.open(data))
            .then((nextDocument) => ({ nextDocument, sourceFingerprint })))
            .then(({ nextDocument, sourceFingerprint }) => {
            openedDocument = nextDocument;
            if (cancelled || generation !== generationRef.current) {
                nextDocument.dispose();
                return;
            }
            setPresentation({
                generation,
                document: nextDocument,
                sourceFingerprint,
            });
        })
            .catch((error) => {
            if (cancelled || generation !== generationRef.current) {
                return;
            }
            logger.error("[PptxPreviewViewer] PPTX 解析失败", error);
            setLoadError(true);
        });
        return () => {
            // open() 的 Promise 不会因 effect cleanup 自动取消；generation 让旧会话的迟到结果只能释放资源，不能污染新会话状态。
            cancelled = true;
            if (generation === generationRef.current) {
                generationRef.current += 1;
            }
            openedDocument?.dispose();
        };
    }, [data]);
    const goToPage = useCallback((target) => {
        if (!document || document.pageCount === 0) {
            return;
        }
        const nextPage = clampPresentationPageNumber(target, document.pageCount);
        setPageNumber(nextPage);
        setPageInput(String(nextPage));
    }, [document]);
    const commitPageInput = useCallback(() => {
        const parsed = Number.parseInt(pageInput.trim(), 10);
        if (Number.isNaN(parsed)) {
            setPageInput(String(pageNumber));
            return;
        }
        goToPage(parsed);
    }, [goToPage, pageInput, pageNumber]);
    const handleKeyDown = useCallback((event) => {
        // 评论草稿的 Textarea 经 Popover Portal 渲染，但仍在 React 树内向此处冒泡；
        // 只豁免 INPUT 会让方向键在评论框里翻页，并连带清空未提交的评论。
        const target = event.target;
        if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) {
            return;
        }
        if (event.key === "Escape" && selectionMode) {
            event.preventDefault();
            if (aiEditDraft) {
                // 编辑评论时 Esc 只回退到 AI 编辑条，避免误按直接丢弃已输入内容。
                setAiEditDraft(null);
                return;
            }
            setSelectionMode(false);
            setSelectedElement(null);
        }
        else if (event.key === "ArrowLeft") {
            event.preventDefault();
            goToPage(pageNumber - 1);
        }
        else if (event.key === "ArrowRight") {
            event.preventDefault();
            goToPage(pageNumber + 1);
        }
    }, [aiEditDraft, goToPage, pageNumber, selectionMode]);
    const exitElementSelection = useCallback(() => {
        setSelectionMode(false);
        setSelectedElement(null);
        setAiEditDraft(null);
    }, []);
    const mainScale = useMemo(() => {
        if (!document || viewportSize.width === 0 || viewportSize.height === 0) {
            return 1;
        }
        const fitScale = Math.min(Math.max(1, viewportSize.width - 32) / document.pageSize.width, Math.max(1, viewportSize.height - 32) / document.pageSize.height);
        return fitScale * (zoomPercent / 100);
    }, [document, viewportSize.height, viewportSize.width, zoomPercent]);
    const handleRenderError = useCallback((generation, error) => {
        if (generation !== generationRef.current) {
            return;
        }
        logger.error("[PptxPreviewViewer] PPTX 页面渲染失败", error);
        setLoadError(true);
    }, []);
    const handlePageNavigate = useCallback((targetPageIndex) => goToPage(targetPageIndex + 1), [goToPage]);
    useEffect(() => {
        if (!referenceNavigation) {
            return;
        }
        // 引用跳转的入口位于 Composer；旧选择浮层若继续存在，会让用户误以为引用页定位同时恢复了元素。
        // 因此先关闭 generation-local 选择，再等待文件存在性校验和文档解析完成后尝试页码定位。
        setSelectionMode(false);
        setSelectedElement(null);
        setAiEditDraft(null);
        if (!referenceNavigationReady ||
            !document ||
            appliedReferenceNavigationRequestIdRef.current === referenceNavigation.requestId) {
            return;
        }
        appliedReferenceNavigationRequestIdRef.current = referenceNavigation.requestId;
        const referencedPageNumber = referenceNavigation.pageIndex + 1;
        if (!Number.isInteger(referenceNavigation.pageIndex) ||
            referenceNavigation.pageIndex < 0 ||
            referenceNavigation.pageIndex >= document.pageCount) {
            toast(labels.referencedPageMissing(referencedPageNumber));
            return;
        }
        goToPage(referencedPageNumber);
        if (presentation?.sourceFingerprint !== referenceNavigation.expectedSourceFingerprint) {
            toast(labels.referencedSourceChanged(referencedPageNumber));
        }
    }, [
        document,
        goToPage,
        labels,
        presentation?.sourceFingerprint,
        referenceNavigation,
        referenceNavigationReady,
    ]);
    useEffect(() => {
        setSelectedElement(null);
        setAiEditDraft(null);
    }, [documentGeneration, pageNumber]);
    const pageElements = useMemo(() => (document && selectionMode ? document.getPageElements(pageNumber - 1) : []), [document, pageNumber, selectionMode]);
    const handleAiEdit = useCallback(() => {
        if (!selectedElement || !presentation || !referenceSource || addingReference) {
            return;
        }
        const renderSurface = mainRenderSurfaceRef.current;
        const selectedText = getPresentationElementSelectedText({
            selection: renderSurface?.ownerDocument.defaultView?.getSelection() ?? null,
            renderSurface,
            pageSize: presentation.document.pageSize,
            elementBounds: selectedElement.bounds,
            elementText: selectedElement.text,
        });
        setAiEditDraft(selectedText ? { selectedText } : {});
    }, [addingReference, presentation, referenceSource, selectedElement]);
    const handleSelectElement = useCallback((element) => {
        setAiEditDraft(null);
        setSelectedElement(element);
    }, []);
    const handleAddToConversation = useCallback((comment) => {
        if (!selectedElement ||
            !presentation ||
            !referenceSource ||
            !aiEditDraft ||
            addingReference) {
            return;
        }
        const normalizedComment = comment.trim();
        const referenceGeneration = generationRef.current;
        setAddingReference(true);
        // 部分文字划选曾覆盖完整 element.text，导致 textFingerprint 锁定子串，
        // 而 OOXML resolver 校验的是整个 shape/cell。完整文本用于冲突校验，子串只作模型上下文。
        void createPptxElementReference({
            element: selectedElement,
            ...aiEditDraft,
            ...(normalizedComment ? { comment: normalizedComment } : {}),
            ...referenceSource,
            sourceFingerprint: presentation.sourceFingerprint,
        })
            .then((reference) => {
            if (referenceGeneration !== generationRef.current) {
                return;
            }
            dispatchPptxElementReferenceAddToChat(reference);
            setAiEditDraft(null);
        })
            .catch((error) => {
            if (referenceGeneration === generationRef.current) {
                logger.error("[PptxPreviewViewer] 创建 PPTX 元素引用失败", error);
            }
        })
            .finally(() => {
            if (referenceGeneration === generationRef.current) {
                setAddingReference(false);
            }
        });
    }, [addingReference, aiEditDraft, presentation, referenceSource, selectedElement]);
    const suggestedPdfName = useMemo(() => {
        const base = fileName?.split(/[\\/]/).pop()?.trim();
        if (!base) {
            return "presentation.pdf";
        }
        const pptExtension = /\.(pptx?|ppsx?)$/i;
        return pptExtension.test(base) ? base.replace(pptExtension, ".pdf") : `${base}.pdf`;
    }, [fileName]);
    const handleExportPdf = useCallback(async () => {
        const printPageToPdf = platform?.printPageToPdf;
        const saveFile = platform?.saveFile;
        if (!document || exportingPdf || !printPageToPdf || !saveFile) {
            return;
        }
        setExportingPdf(true);
        let printHost = null;
        try {
            const { renderPresentationToPrintHost } = await import("@/presentation/presentationPdfPrintExport.js");
            printHost = await renderPresentationToPrintHost(document, window.document);
            const printResult = await printPageToPdf();
            // 拿到 PDF 字节立即释放打印 DOM，避免保存对话框期间占着全量页面的内存
            printHost.dispose();
            printHost = null;
            if (!printResult.success || !printResult.data) {
                throw new Error(printResult.error ?? "print_failed");
            }
            const saveResult = await saveFile({
                data: printResult.data,
                suggestedName: suggestedPdfName,
            });
            if (saveResult.canceled) {
                return;
            }
            if (!saveResult.success || !saveResult.path) {
                throw new Error(saveResult.error ?? "save_failed");
            }
            toast(labels.exportPdfSuccess(saveResult.path));
        }
        catch (error) {
            logger.error("[PptxPreviewViewer] PPTX 导出 PDF 失败", error);
            toast(labels.exportPdfFailed);
        }
        finally {
            printHost?.dispose();
            setExportingPdf(false);
        }
    }, [document, exportingPdf, labels, platform, suggestedPdfName]);
    if (loadError) {
        return _jsx("div", { className: "p-3 text-ui-base text-destructive", children: labels.loadError });
    }
    if (!document) {
        return _jsx("div", { className: "p-3 text-ui-base text-foreground-subtle", children: labels.loading });
    }
    if (document.pageCount === 0) {
        return _jsx("div", { className: "p-3 text-ui-base text-foreground-subtle", children: labels.noSlides });
    }
    const pageIndex = pageNumber - 1;
    return (_jsxs("div", { tabIndex: 0, onKeyDown: handleKeyDown, className: cn("flex h-full min-h-0 outline-none", className), children: [_jsx("aside", { ref: setThumbnailRoot, "aria-label": labels.thumbnails, className: "w-24 shrink-0 overflow-y-auto border-r border-border bg-surface/30 p-2 sm:w-32", children: _jsx("div", { className: "flex flex-col gap-2", children: Array.from({ length: document.pageCount }, (_, index) => (_jsx(PptxThumbnail, { document: document, generation: documentGeneration, pageIndex: index, selected: index === pageIndex, scrollRoot: thumbnailRoot, labels: labels, onSelect: () => goToPage(index + 1) }, index))) }) }), _jsxs("div", { className: "flex min-w-0 flex-1 flex-col bg-background", children: [_jsx("div", { ref: setPreviewViewport, className: "min-h-0 flex-1 overflow-auto", children: _jsx("div", { className: "grid min-h-full min-w-full place-items-center p-4", children: _jsx(PptxSelectionActionBar, { open: selectionMode && selectedElement !== null, boundary: previewViewport, label: labels.aiEdit, commentPlaceholder: labels.commentPlaceholder, cancelLabel: labels.cancelAiEdit, addToConversationLabel: labels.addToConversation, editing: aiEditDraft !== null, disabled: addingReference, onAiEdit: handleAiEdit, onCancelAiEdit: () => setAiEditDraft(null), onAddToConversation: handleAddToConversation, onExitSelection: exitElementSelection, children: _jsx(RenderedPage, { document: document, generation: documentGeneration, pageIndex: pageIndex, scale: mainScale, interactive: true, selectionMode: selectionMode, elements: pageElements, selectedElement: selectedElement, onSelectElement: handleSelectElement, renderSurfaceRef: mainRenderSurfaceRef, onNavigate: handlePageNavigate, onOpenBrowserUrl: onOpenBrowserUrl, onRenderError: handleRenderError }) }) }) }), _jsxs("div", { className: "flex min-h-10 shrink-0 flex-wrap items-center justify-center gap-1 border-t border-border bg-surface/30 px-2 py-1.5 text-ui-base", children: [referenceSource ? (_jsxs(Button, { type: "button", size: "sm", variant: selectionMode ? "secondary" : "ghost", "aria-pressed": selectionMode, "aria-label": selectionMode ? labels.exitElementSelection : labels.selectElement, title: selectionMode ? labels.exitElementSelection : labels.selectElement, onClick: () => {
                                    setSelectionMode((current) => !current);
                                    setSelectedElement(null);
                                    setAiEditDraft(null);
                                }, children: [_jsx(MousePointer2Icon, { className: "size-4" }), selectionMode ? labels.exitElementSelection : labels.selectElement] })) : null, _jsx(Button, { type: "button", size: "icon-md", variant: "ghost", "aria-label": labels.previousPage, title: labels.previousPage, disabled: pageNumber <= 1, onClick: () => goToPage(pageNumber - 1), children: _jsx(ChevronLeftIcon, {}) }), _jsx(Input, { type: "text", inputMode: "numeric", "aria-label": labels.pageInput, value: pageInput, onChange: (event) => setPageInput(event.target.value), onBlur: commitPageInput, onKeyDown: (event) => {
                                    if (event.key === "Enter") {
                                        commitPageInput();
                                        event.currentTarget.blur();
                                    }
                                }, className: "w-12 text-center text-mobile-input-safe tabular-nums md:text-ui-base" }), _jsxs("span", { className: "min-w-10 text-center tabular-nums text-foreground-subtle", children: ["/ ", document.pageCount] }), _jsx(Button, { type: "button", size: "icon-md", variant: "ghost", "aria-label": labels.nextPage, title: labels.nextPage, disabled: pageNumber >= document.pageCount, onClick: () => goToPage(pageNumber + 1), children: _jsx(ChevronRightIcon, {}) }), _jsx("div", { className: "mx-1 h-5 w-px bg-border", "aria-hidden": "true" }), _jsx(Button, { type: "button", size: "icon-md", variant: "ghost", "aria-label": labels.zoomOut, title: labels.zoomOut, disabled: zoomPercent <= PPTX_MIN_ZOOM_PERCENT, onClick: () => setZoomPercent((current) => clampPresentationZoomPercent(current - PPTX_ZOOM_STEP_PERCENT)), children: _jsx(ZoomOutIcon, {}) }), _jsxs("span", { className: "w-12 text-center tabular-nums text-foreground-subtle", children: [zoomPercent, "%"] }), _jsx(Button, { type: "button", size: "icon-md", variant: "ghost", "aria-label": labels.zoomIn, title: labels.zoomIn, disabled: zoomPercent >= PPTX_MAX_ZOOM_PERCENT, onClick: () => setZoomPercent((current) => clampPresentationZoomPercent(current + PPTX_ZOOM_STEP_PERCENT)), children: _jsx(ZoomInIcon, {}) }), canExportPdf ? (_jsxs(_Fragment, { children: [_jsx("div", { className: "mx-1 h-5 w-px bg-border", "aria-hidden": "true" }), _jsx(Button, { type: "button", size: "icon-md", variant: "ghost", "aria-label": exportingPdf ? labels.exportingPdf : labels.exportPdf, title: exportingPdf ? labels.exportingPdf : labels.exportPdf, disabled: exportingPdf, onClick: () => void handleExportPdf(), children: exportingPdf ? _jsx(Loader2Icon, { className: "animate-spin" }) : _jsx(FileDownIcon, {}) })] })) : null] })] })] }));
}
//# sourceMappingURL=pptx-preview-viewer.js.map