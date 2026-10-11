import { type RefObject } from "react";
/** 把 guest 已到边界的二维 wheel 续接到自由尺寸宿主画布。 */
export declare function useEmbeddedBrowserWheelChain({ browserRegionRef, isResponsiveMode, webview, }: {
    browserRegionRef: RefObject<HTMLDivElement | null>;
    isResponsiveMode: boolean;
    webview: ElectronWebviewTag | null;
}): void;
//# sourceMappingURL=useEmbeddedBrowserWheelChain.d.ts.map