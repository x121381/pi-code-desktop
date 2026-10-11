import type { PresentationPageElement } from "@/presentation/types.js";
interface PresentationElementCellInput {
    gridSpan: number;
    rowSpan: number;
    hMerge: boolean;
    vMerge: boolean;
    text?: string;
}
interface PresentationElementRowInput {
    height: number;
    cells: readonly PresentationElementCellInput[];
}
export interface PresentationElementNodeInput {
    id: string;
    name: string;
    nodeType: "shape" | "picture" | "table" | "group" | "chart" | "unknown";
    position: {
        x: number;
        y: number;
    };
    size: {
        w: number;
        h: number;
    };
    text?: string;
    columns?: readonly number[];
    rows?: readonly PresentationElementRowInput[];
}
export interface PresentationGroupTextEntryInput {
    nodeId: string;
    nodePath: string;
    text: string;
    bounds: {
        x: number;
        y: number;
        w: number;
        h: number;
    };
}
export declare function buildPresentationPageElements(options: {
    slideIndex: number;
    slidePart: string;
    nodes: readonly PresentationElementNodeInput[];
    groupTextEntries: readonly PresentationGroupTextEntryInput[];
}): PresentationPageElement[];
export declare function hitTestPresentationElement(elements: readonly PresentationPageElement[], point: {
    x: number;
    y: number;
}): PresentationPageElement | null;
export {};
//# sourceMappingURL=presentationElementModel.d.ts.map