import { type BrowserViewportSize } from "@zcode/shared";
import { type BrowserViewportZoom } from "@/browser-use/browserViewportZoom.js";
export declare function BrowserViewportToolbar({ isVisible, onViewportSizeChange, onZoomChange, viewportSize, zoom, }: {
    isVisible: boolean;
    onViewportSizeChange: (viewportSize: BrowserViewportSize) => void;
    onZoomChange: (zoom: BrowserViewportZoom) => void;
    viewportSize: BrowserViewportSize;
    zoom: BrowserViewportZoom;
}): React.JSX.Element;
//# sourceMappingURL=BrowserViewportToolbar.d.ts.map