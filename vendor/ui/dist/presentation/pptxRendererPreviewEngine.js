import { RECOMMENDED_ZIP_LIMITS, buildTextIndex, buildPresentation, materializeSlideNodes, parseZipLazyMedia, renderSlide, } from "@aiden0z/pptx-renderer/browser";
import { buildPresentationPageElements } from "@/presentation/presentationElementModel.js";
function readTextBody(textBody) {
    return textBody?.paragraphs
        .map((paragraph) => paragraph.runs.map((run) => run.text).join(""))
        .join("\n")
        .trim();
}
class PptxRendererPreviewDocument {
    presentation;
    pageCount;
    pageSize;
    activeHandles = new Set();
    elementCache = new Map();
    disposed = false;
    constructor(presentation) {
        this.presentation = presentation;
        this.pageCount = presentation.slides.length;
        this.pageSize = {
            width: presentation.width,
            height: presentation.height,
        };
    }
    getPageElements(pageIndex) {
        if (this.disposed) {
            throw new Error("Presentation preview document has been disposed");
        }
        const cached = this.elementCache.get(pageIndex);
        if (cached) {
            return cached;
        }
        const slide = this.presentation.slides[pageIndex];
        if (!slide) {
            throw new RangeError(`Presentation page index is out of range: ${pageIndex}`);
        }
        materializeSlideNodes(this.presentation, slide);
        // 只为当前页建立 group 文本索引，避免显式选择一页时提前 materialize 整份演示文稿。
        const groupTextIndex = buildTextIndex({ ...this.presentation, slides: [slide] }, {
            includeGroups: true,
            includeShapes: true,
            includeTables: false,
        });
        const directNodeIds = new Set(slide.nodes.map((node) => node.id));
        const elements = buildPresentationPageElements({
            slideIndex: pageIndex,
            slidePart: slide.slidePath,
            nodes: slide.nodes.map((node) => ({
                id: node.id,
                name: node.name,
                nodeType: node.nodeType,
                position: node.position,
                size: node.size,
                ...(node.nodeType === "shape" ? { text: readTextBody(node.textBody) } : {}),
                ...(node.nodeType === "table"
                    ? {
                        columns: node.columns ?? [],
                        rows: (node.rows ?? []).map((row) => ({
                            height: row.height,
                            cells: row.cells.map((cell) => ({
                                gridSpan: cell.gridSpan,
                                rowSpan: cell.rowSpan,
                                hMerge: cell.hMerge,
                                vMerge: cell.vMerge,
                                text: readTextBody(cell.textBody),
                            })),
                        })),
                    }
                    : {}),
            })),
            groupTextEntries: groupTextIndex
                .filter((entry) => entry.slideIndex === 0 &&
                entry.textKind === "shape" &&
                entry.nodePath.startsWith("slides/0/nodes/") &&
                !directNodeIds.has(entry.nodeId))
                .map((entry) => ({
                nodeId: entry.nodeId,
                nodePath: entry.nodePath,
                text: entry.text,
                bounds: entry.bounds,
            })),
        });
        this.elementCache.set(pageIndex, elements);
        return elements;
    }
    renderPage(pageIndex, container, options) {
        if (this.disposed) {
            throw new Error("Presentation preview document has been disposed");
        }
        const slide = this.presentation.slides[pageIndex];
        if (!slide) {
            throw new RangeError(`Presentation page index is out of range: ${pageIndex}`);
        }
        const upstreamHandle = renderSlide(this.presentation, slide, {
            onNavigate: options?.onNavigate
                ? (target) => options.onNavigate?.({
                    pageIndex: target.slideIndex,
                    url: target.url,
                })
                : undefined,
            onNodeError: options?.onNodeError,
        });
        container.append(upstreamHandle.element);
        let handleDisposed = false;
        const handle = {
            ready: upstreamHandle.ready,
            dispose: () => {
                if (handleDisposed) {
                    return;
                }
                handleDisposed = true;
                upstreamHandle.dispose();
                upstreamHandle.element.remove();
                this.activeHandles.delete(handle);
            },
        };
        this.activeHandles.add(handle);
        return handle;
    }
    dispose() {
        if (this.disposed) {
            return;
        }
        this.disposed = true;
        for (const handle of this.activeHandles) {
            handle.dispose();
        }
        this.activeHandles.clear();
        this.elementCache.clear();
    }
}
export const pptxRendererPreviewEngine = {
    async open(data) {
        const files = await parseZipLazyMedia(data, RECOMMENDED_ZIP_LIMITS);
        const presentation = buildPresentation(files, { lazySlides: true });
        return new PptxRendererPreviewDocument(presentation);
    },
};
//# sourceMappingURL=pptxRendererPreviewEngine.js.map