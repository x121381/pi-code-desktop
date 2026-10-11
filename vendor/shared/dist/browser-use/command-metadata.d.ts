import { z } from "zod";
/** 内置自由尺寸与 Agent viewport API 共用同一组 CSS px 安全边界。 */
export declare const BROWSER_VIEWPORT_LIMITS: {
    readonly minWidth: 320;
    readonly maxWidth: 3840;
    readonly minHeight: 320;
    readonly maxHeight: 2160;
};
/** Agent 创建或打开的新页面使用的固定逻辑 viewport；不属于人类浏览器显示偏好。 */
export declare const DEFAULT_AGENT_BROWSER_VIEWPORT: {
    readonly width: 1280;
    readonly height: 720;
};
export declare const browserViewportSizeSchema: z.ZodObject<{
    width: z.ZodNumber;
    height: z.ZodNumber;
}, z.core.$strict>;
export type BrowserViewportSize = z.infer<typeof browserViewportSizeSchema>;
/** setViewportSize 输入边界；实际自然 viewport 可能大于自由尺寸画布上限。 */
export declare const browserViewportInputSchema: z.ZodObject<{
    width: z.ZodNumber;
    height: z.ZodNumber;
}, z.core.$strict>;
export declare const BROWSER_VIEWPORT_ZOOM_OPTIONS: readonly ["fit", "50", "75", "100", "125", "150", "200"];
export declare const browserViewportZoomSchema: z.ZodEnum<{
    50: "50";
    fit: "fit";
    75: "75";
    100: "100";
    125: "125";
    150: "150";
    200: "200";
}>;
export type BrowserViewportZoom = z.infer<typeof browserViewportZoomSchema>;
export declare const DEFAULT_BROWSER_VIEWPORT_ZOOM: BrowserViewportZoom;
/** 仅用于人类用户主动打开 Browser tab 的显示偏好；Agent viewport 运行态不得读写。 */
export declare const embeddedBrowserViewportPreferenceSchema: z.ZodObject<{
    mode: z.ZodEnum<{
        normal: "normal";
        responsive: "responsive";
    }>;
    viewport: z.ZodObject<{
        width: z.ZodNumber;
        height: z.ZodNumber;
    }, z.core.$strict>;
    zoom: z.ZodEnum<{
        50: "50";
        fit: "fit";
        75: "75";
        100: "100";
        125: "125";
        150: "150";
        200: "200";
    }>;
}, z.core.$strict>;
export type EmbeddedBrowserViewportPreference = z.infer<typeof embeddedBrowserViewportPreferenceSchema>;
export declare const DEFAULT_EMBEDDED_BROWSER_VIEWPORT_PREFERENCE: EmbeddedBrowserViewportPreference;
/** browser-use 的统一命令方法集，各分支由 BrowserCommand 的 method 判别。 */
export declare const browserCommandMethodSchema: z.ZodEnum<{
    fill: "fill";
    type: "type";
    check: "check";
    back: "back";
    snapshot: "snapshot";
    navigate: "navigate";
    forward: "forward";
    reload: "reload";
    click: "click";
    press: "press";
    cuaKeypress: "cuaKeypress";
    scroll: "scroll";
    cuaScroll: "cuaScroll";
    domCuaScroll: "domCuaScroll";
    hover: "hover";
    select: "select";
    drag: "drag";
    cuaDrag: "cuaDrag";
    screenshot: "screenshot";
    getState: "getState";
    elementInfo: "elementInfo";
    evaluate: "evaluate";
    getDialog: "getDialog";
    handleDialog: "handleDialog";
    waitFor: "waitFor";
    playwright: "playwright";
    playwrightWaitForTimeout: "playwrightWaitForTimeout";
    capabilities: "capabilities";
    browserVisibilityGet: "browserVisibilityGet";
    browserVisibilitySet: "browserVisibilitySet";
    browserViewportSet: "browserViewportSet";
    browserViewportReset: "browserViewportReset";
    recordingStart: "recordingStart";
    recordingStatus: "recordingStatus";
    recordingCancel: "recordingCancel";
    activateTab: "activateTab";
    newTab: "newTab";
    finalize: "finalize";
    finalizeTabs: "finalizeTabs";
    listUserTabs: "listUserTabs";
    claimTab: "claimTab";
    markDeliverable: "markDeliverable";
    markHandoff: "markHandoff";
    nameSession: "nameSession";
    turnEnded: "turnEnded";
    closeSession: "closeSession";
    cancelRequest: "cancelRequest";
    close: "close";
    list: "list";
}>;
export type BrowserCommandMethod = z.infer<typeof browserCommandMethodSchema>;
/** 客户端模式；决定桌面 continuous 与手机 replayable 的边界处理。 */
export declare const browserClientModeSchema: z.ZodEnum<{
    "desktop-continuous": "desktop-continuous";
    "web-remote-replayable": "web-remote-replayable";
}>;
export type BrowserClientMode = z.infer<typeof browserClientModeSchema>;
/** 每条命令携带的会话上下文。 */
export declare const browserCommandContextSchema: z.ZodObject<{
    workspaceKey: z.ZodString;
    sessionId: z.ZodString;
    tabId: z.ZodOptional<z.ZodString>;
    requestId: z.ZodString;
    clientMode: z.ZodEnum<{
        "desktop-continuous": "desktop-continuous";
        "web-remote-replayable": "web-remote-replayable";
    }>;
}, z.core.$strict>;
export type BrowserCommandContext = z.infer<typeof browserCommandContextSchema>;
/** 结构化错误码：不静默兜底，明确失败原因给模型。 */
export declare const browserErrorCodeSchema: z.ZodEnum<{
    cancelled: "cancelled";
    timeout: "timeout";
    backend_unavailable: "backend_unavailable";
    capability_unsupported: "capability_unsupported";
    duplicate_request_id: "duplicate_request_id";
    ref_not_found: "ref_not_found";
    navigation_blocked: "navigation_blocked";
    renderer_unreachable: "renderer_unreachable";
    execution_error: "execution_error";
}>;
export type BrowserErrorCode = z.infer<typeof browserErrorCodeSchema>;
/** 页面基础状态（getState / 导航后回传）。 */
export declare const browserPageStateSchema: z.ZodObject<{
    url: z.ZodString;
    title: z.ZodString;
    canGoBack: z.ZodBoolean;
    canGoForward: z.ZodBoolean;
    scrollX: z.ZodOptional<z.ZodNumber>;
    scrollY: z.ZodOptional<z.ZodNumber>;
    viewportWidth: z.ZodOptional<z.ZodNumber>;
    viewportHeight: z.ZodOptional<z.ZodNumber>;
}, z.core.$strict>;
export type BrowserPageState = z.infer<typeof browserPageStateSchema>;
//# sourceMappingURL=command-metadata.d.ts.map