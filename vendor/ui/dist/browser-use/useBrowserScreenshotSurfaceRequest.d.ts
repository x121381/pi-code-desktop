import type { BrowserViewScreenshotSurfacePreparePayload } from "@zcode/shared";
import type { BrowserUseSidePaneTab, WorkspaceSidePaneTab } from "@/lib/workspaceSidePane.js";
export declare function findScreenshotSurfaceTab(tabs: readonly WorkspaceSidePaneTab[], payload: BrowserViewScreenshotSurfacePreparePayload): BrowserUseSidePaneTab | undefined;
/**
 * prepare 已经被当前 renderer 接收后，browserGeneration 可能随 attach/restore 继续更新。
 * 此时仍需把同一个瞬时请求送到原 tab；main 会用请求中的 generation 做最终 stale 防护。
 */
export declare function findScreenshotSurfaceTabForRender(tabs: readonly WorkspaceSidePaneTab[], payload: BrowserViewScreenshotSurfacePreparePayload): BrowserUseSidePaneTab | undefined;
/**
 * prepare 接收匹配：严格 scope 命中优先；跨进程恢复的 tab 其 registry scope 元数据
 * 停留在旧进程值（见 matchesTabLoose 注释），必须降级匹配才能收到 prepare。
 */
export declare function findScreenshotSurfaceTabForPrepare(tabs: readonly WorkspaceSidePaneTab[], payload: BrowserViewScreenshotSurfacePreparePayload): BrowserUseSidePaneTab | undefined;
/**
 * 只保存已经匹配到当前 renderer tab registry 的瞬时准备请求。请求不进入 workspace store，
 * 从而不会把桌面合成同步扩散到 remote/replayable 的 task 状态。
 */
export declare function useBrowserScreenshotSurfaceRequest(tabs: readonly WorkspaceSidePaneTab[]): BrowserViewScreenshotSurfacePreparePayload | null;
//# sourceMappingURL=useBrowserScreenshotSurfaceRequest.d.ts.map