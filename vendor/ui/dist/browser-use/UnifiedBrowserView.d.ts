import type { BrowserViewScreenshotSurfacePreparePayload, EmbeddedBrowserViewportPreference } from "@zcode/shared";
import type { HumanBrowserViewportPreferenceChangeSource } from "@/browser-use/useResponsiveBrowserViewportControl.js";
/**
 * UnifiedBrowserView —— 统一浏览器视图（`<webview>` + CDP-on-guest 架构）。
 *
 * 网页像素由 renderer 内的 `<webview>` guest 直接渲染（DOM 内合成，可被 DOM 浮层覆盖，
 * 彻底解决 WebContentsView 原生层遮挡菜单的问题）。human 的导航/前进后退/刷新/元素拾取
 * 直接调用 webview 方法（低延迟、无握手依赖）；chrome 状态由 webview 事件驱动。
 *
 * 同时在 did-attach 时把 guest 的 webContentsId 上报给 main（browserViewAttachGuest），
 * 让 main 能给该 guest 挂 CDP（webContents.debugger），供 agent 通过协议控制这个 tab。
 *
 * chrome 复用 EmbeddedBrowserPaneParts 的 BrowserToolbar；
 * URL 归一化 / 未挂载兜底复用 embeddedBrowserHelpers。
 */
export declare function UnifiedBrowserView({ browserKey, onOpenPermissionSettings, isResidencyRestore, isVisible, isSelected, isCurrentTask, initialUrl, faviconUrl, navigationRequest, onUrlChange, onPageMetadataChange, onNavigationRequestHandled, workspacePath, workspaceIdentity, workspaceKey, remoteSessionId, sessionId, residencyGeneration, browserUseOperationUntil, browserResizeBaselineVersion, screenshotSurfaceRequest, deferEmptyGuest, initialHumanViewportPreference, onHumanViewportPreferenceChange, }: {
    /** 受控视图 key（= tab.id / sessionId，agent 定位该 tab 用）。 */
    browserKey: string;
    /** 地址栏站点设置入口：打开该站点的权限设置标签页。 */
    onOpenPermissionSettings?: (origin: string) => void;
    /** 预算恢复时 guest 创建后立即撤销 bootstrap src，首次有效导航由 main 独占。 */
    isResidencyRestore?: boolean;
    /** pane 是否可见（激活 + 展开）。隐藏时仅从布局里移除，不卸载 webview，保住网页与历史。 */
    isVisible: boolean;
    /** tab strip 选中态与 panel 展示态正交；折叠时仍保留 selected。 */
    isSelected?: boolean;
    /** 当前 task 的 tab 用于 main 的 eviction tier。 */
    isCurrentTask?: boolean;
    /** 挂载时导航到的初始/恢复 URL（human tab 恢复态）。 */
    initialUrl?: string | null;
    /** tab shell 当前 favicon；随 residency report 持久化。 */
    faviconUrl?: string | null;
    /** 外部请求把该 tab 导航到某 URL（{id,url}）；消费后回执 onNavigationRequestHandled。 */
    navigationRequest?: {
        id: string;
        url: string;
    } | null;
    /** 当前 URL 变化回传（human tab URL 持久化）。 */
    onUrlChange?: (url: string) => void;
    /** 页面标题/favicon 变化回传（驱动 tab 标签）。 */
    onPageMetadataChange?: (metadata: {
        title?: string;
        faviconUrl?: string | null;
    }) => void;
    /** navigationRequest 消费完回执。 */
    onNavigationRequestHandled?: (requestId: string) => void;
    /** 元素选择加入聊天所需的工作区路径（human 分支传入；agent 分支可不传）。 */
    workspacePath?: string;
    /** 元素选择上下文归属的工作区标识（human 分支传入）。 */
    workspaceIdentity?: string;
    /** browser-use tab 创建时冻结的身份 scope；存在时优先于当前 workspace ambient props。 */
    workspaceKey?: string;
    remoteSessionId?: string;
    /** tab 创建时冻结的对话归属；不得用 dom-ready 到达时的 active task 回填。 */
    sessionId?: string;
    residencyGeneration?: number;
    /** 与 tab 鼠标图标共用的 operation deadline；仅 browser-use tab 传入。 */
    browserUseOperationUntil?: number;
    browserResizeBaselineVersion?: number;
    /** 截图前临时保持后台 guest 的真实布局；不改变任何 active/focus 语义。 */
    screenshotSurfaceRequest?: BrowserViewScreenshotSurfacePreparePayload | null;
    /** human 空白 tab 延迟创建 guest；agent/browser-use 必须保持创建期 attach。 */
    deferEmptyGuest?: boolean;
    /** 仅 human Browser surface 传入；Agent Browser Use 必须保持 undefined。 */
    initialHumanViewportPreference?: EmbeddedBrowserViewportPreference;
    /** 只接收 human UI 主动变更；Agent viewport event 不得调用。 */
    onHumanViewportPreferenceChange?: (preference: EmbeddedBrowserViewportPreference, source: HumanBrowserViewportPreferenceChangeSource) => void;
}): React.JSX.Element;
//# sourceMappingURL=UnifiedBrowserView.d.ts.map