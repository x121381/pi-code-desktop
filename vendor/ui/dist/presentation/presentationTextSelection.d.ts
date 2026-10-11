import type { PresentationElementBounds, PresentationPageSize } from "@/presentation/types.js";
interface PresentationElementTextSelectionOptions {
    selection: Selection | null;
    renderSurface: HTMLElement | null;
    pageSize: PresentationPageSize;
    elementBounds: PresentationElementBounds;
    elementText?: string;
}
/**
 * 从浏览器 Selection 中只提取当前高亮 PPTX 元素 bounds 内的文本。
 *
 * 原因：一次原生划选可以跨越多个 renderer DOM 元素；引用不能直接使用
 * Selection.toString()，否则会把相邻 shape/table-cell 的内容带入当前元素引用。
 */
export declare function getPresentationElementSelectedText({ selection, renderSurface, pageSize, elementBounds, elementText, }: PresentationElementTextSelectionOptions): string | null;
export {};
//# sourceMappingURL=presentationTextSelection.d.ts.map