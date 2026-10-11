import type { CSSProperties } from "react";
export declare const ZOOM_STEP = 0.25;
export declare const MIN_SCALE = 0.25;
export declare const MAX_SCALE = 4;
export declare const DEFAULT_SCALE = 1;
export declare const WHEEL_ZOOM_SENSITIVITY = 0.002;
export declare const ZOOM_COMMIT_DELAY_MS = 200;
export declare function clampScale(scale: number): number;
export interface PdfZoomPointer {
    clientX: number;
    clientY: number;
}
export interface PdfPageSize {
    width: number;
    height: number;
}
export interface PdfZoomAnchor extends PdfZoomPointer {
    pageXRatio: number;
    pageYRatio: number;
}
export declare function resolvePdfPageSize(current: PdfPageSize | null, width: number, height: number): PdfPageSize;
export declare function getPdfPageDisplaySize(intrinsicSize: PdfPageSize | null, displayScale: number): CSSProperties | undefined;
export declare function getPdfPagePreviewStyle(hasStableLayoutBox: boolean, previewScale: number): CSSProperties | undefined;
export declare function capturePdfZoomAnchor(container: HTMLDivElement, pageViewport: HTMLDivElement, pointer?: PdfZoomPointer): PdfZoomAnchor | null;
export declare function restorePdfZoomAnchor(container: HTMLDivElement, pageViewport: HTMLDivElement, anchor: PdfZoomAnchor): void;
export declare function usePdfZoomOverlay(): {
    clearZoomOverlay: () => void;
    pageViewportRef: import("react").RefObject<HTMLDivElement | null>;
    stageZoomOverlay: (targetWidth: number, targetHeight: number) => void;
};
//# sourceMappingURL=usePdfZoomOverlay.d.ts.map