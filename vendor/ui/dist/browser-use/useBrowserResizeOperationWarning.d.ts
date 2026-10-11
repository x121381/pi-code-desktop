/**
 * 在与 tab 鼠标图标相同的 Browser Use active 周期内监听浏览器区域尺寸。
 * 这里只产生 renderer 本地弱提示，不取消工具、不修改 snapshot，也不把状态写入协议层。
 */
export declare function useBrowserResizeOperationWarning({ browserKey, isVisible, operationUntil, resizeBaselineVersion, }: {
    browserKey: string;
    isVisible: boolean;
    operationUntil?: number;
    resizeBaselineVersion?: number;
}): {
    browserRegionRef: import("react").RefObject<HTMLDivElement | null>;
    notifyBrowserViewportResize: () => void;
    prepareForAgentViewportChange: (willChangeResponsiveMode: boolean) => void;
    showResizeWarning: boolean;
};
//# sourceMappingURL=useBrowserResizeOperationWarning.d.ts.map