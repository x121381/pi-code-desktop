import { BROWSER_VIEWPORT_ZOOM_OPTIONS, DEFAULT_BROWSER_VIEWPORT_ZOOM, type BrowserViewportSize, type BrowserViewportZoom } from "@zcode/shared";
export { BROWSER_VIEWPORT_ZOOM_OPTIONS, DEFAULT_BROWSER_VIEWPORT_ZOOM };
export type { BrowserViewportZoom };
/** Fit 的画布内边距与 ResponsiveBrowserViewport 的 `p-4` 保持一致。 */
export declare const RESPONSIVE_BROWSER_CANVAS_PADDING_PX = 16;
export declare function resolveBrowserViewportScale({ canvasSize, desktopZoomFactor, viewportSize, zoom, }: {
    canvasSize: BrowserViewportSize | null;
    desktopZoomFactor?: number;
    viewportSize: BrowserViewportSize;
    zoom: BrowserViewportZoom;
}): number;
export declare function resolveBrowserViewportRendererScale({ desktopZoomFactor, visualScale, }: {
    desktopZoomFactor: number;
    visualScale: number;
}): number;
export declare function resolveResponsiveBrowserGuestLayout(desktopZoomFactor: number): {
    layoutScale: number;
    transformScale: number;
};
//# sourceMappingURL=browserViewportZoom.d.ts.map