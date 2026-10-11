export declare function resolveDesktopZoomFactor(zoomLevel: number): number;
/**
 * 读取当前窗口的 Electron 页面缩放；Web 装配返回 level 0，因此自然回退为 factor 1。
 * 这里复用 IPlatformService，避免共享 UI 直接访问 window.zcode。
 */
export declare function useDesktopZoomFactor(): number;
//# sourceMappingURL=useDesktopZoomFactor.d.ts.map