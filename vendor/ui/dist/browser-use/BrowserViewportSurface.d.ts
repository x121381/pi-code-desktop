import { type RefObject } from "react";
import { type BrowserViewportSize } from "@zcode/shared";
import { type BrowserViewportZoom } from "@/browser-use/browserViewportZoom.js";
import { type BrowserState } from "@/embeddedBrowserHelpers.js";
export declare function BrowserViewportSurface({ browserRegionRef, browserState, desktopZoomFactor, isResidencyRestore, formatMessage, isEmptyBrowserState, isComposed, isResponsiveMode, isViewportEmulated, onRetryGuest, onRetryLoad, onViewportResize, onViewportSizeChange, onWebviewRef, shouldMountWebview, showResizeWarning, webviewGeneration, viewportSize, viewportZoom, }: {
    browserRegionRef: RefObject<HTMLDivElement | null>;
    browserState: BrowserState;
    desktopZoomFactor: number;
    isResidencyRestore: boolean;
    formatMessage: (descriptor: {
        id: string;
    }, values?: Record<string, number | string>) => string;
    isEmptyBrowserState: boolean;
    isComposed: boolean;
    isResponsiveMode: boolean;
    isViewportEmulated?: boolean;
    onRetryGuest: () => void;
    onRetryLoad: () => void;
    onViewportResize: () => void;
    onViewportSizeChange: (viewportSize: BrowserViewportSize) => void;
    onWebviewRef: (node: ElectronWebviewTag | null) => void;
    shouldMountWebview?: boolean;
    showResizeWarning: boolean;
    webviewGeneration: number;
    viewportSize: BrowserViewportSize;
    viewportZoom: BrowserViewportZoom;
}): React.JSX.Element;
//# sourceMappingURL=BrowserViewportSurface.d.ts.map