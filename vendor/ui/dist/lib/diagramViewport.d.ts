export type DiagramPoint = {
    x: number;
    y: number;
};
export type DiagramViewportTransform = {
    scale: number;
    translateX: number;
    translateY: number;
};
export type DiagramViewportBounds = {
    height: number;
    width: number;
    x?: number;
    y?: number;
};
export declare const MIN_DIAGRAM_SCALE = 0.25;
export declare const MAX_DIAGRAM_SCALE = 4;
export declare function clampDiagramScale(scale: number): number;
export declare function zoomDiagramAtPoint(transform: DiagramViewportTransform, viewportPoint: DiagramPoint, nextScale: number): DiagramViewportTransform;
export declare function panDiagram(transform: DiagramViewportTransform, delta: DiagramPoint): DiagramViewportTransform;
export declare function fitDiagramToViewport({ diagramX, diagramY, diagramHeight, diagramWidth, padding, viewportHeight, viewportWidth, }: {
    diagramHeight: number;
    diagramWidth: number;
    diagramX?: number;
    diagramY?: number;
    padding?: number;
    viewportHeight: number;
    viewportWidth: number;
}): DiagramViewportTransform;
//# sourceMappingURL=diagramViewport.d.ts.map