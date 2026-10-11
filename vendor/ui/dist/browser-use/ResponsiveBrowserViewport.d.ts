import { type ReactNode } from "react";
import { type BrowserViewportSize } from "@zcode/shared";
import { type BrowserViewportZoom } from "@/browser-use/browserViewportZoom.js";
export declare const DEFAULT_RESPONSIVE_BROWSER_VIEWPORT_SIZE: {
    readonly width: 393;
    readonly height: 852;
};
/**
 * 保持同一层 DOM 包装，仅切换 frame 的 CSS 尺寸，避免开关自由尺寸时重建 Electron guest。
 * 尺寸只属于当前 Browser tab 的 React 实例，不写入跨端 store 或持久化状态。
 */
export declare function ResponsiveBrowserViewport({ active, children, desktopZoomFactor, isComposed, onResize, onViewportSizeChange, viewportSize, zoom, }: {
    active: boolean;
    children: ReactNode;
    desktopZoomFactor: number;
    isComposed: boolean;
    onResize?: () => void;
    onViewportSizeChange: (viewportSize: BrowserViewportSize) => void;
    viewportSize: BrowserViewportSize;
    zoom: BrowserViewportZoom;
}): React.JSX.Element;
//# sourceMappingURL=ResponsiveBrowserViewport.d.ts.map