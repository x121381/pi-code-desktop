import { type BrowserViewScreenshotSurfacePreparePayload } from "@zcode/shared";
/** 在后台合成层中等候两个稳定帧，确认 guest id 与自然 viewport 同时仍然有效。 */
export declare function useBrowserScreenshotSurfaceReady({ request, webview, }: {
    request: BrowserViewScreenshotSurfacePreparePayload | null;
    webview: ElectronWebviewTag | null;
}): void;
//# sourceMappingURL=useBrowserScreenshotSurfaceReady.d.ts.map