/** 仅用于创建尚未提交首个 navigation entry 的 residency restore guest。 */
export const BROWSER_VIEW_RESTORE_BOOTSTRAP_URL = "zcode-browser-restore://pending";
export const LOCAL_MEDIA_PREVIEW_SCHEME = "zcode-media";
export function buildLocalMediaPreviewUrl(path) {
    const url = new URL(`${LOCAL_MEDIA_PREVIEW_SCHEME}://local/preview`);
    url.searchParams.set("path", path);
    return url.toString();
}
// 旧默认预算 1500ms 在慢机器或后台窗口中不足以等待连续稳定帧；main 与 renderer
// 共用这个默认值，并由 prepare payload 传递实际覆盖值，避免两端 deadline 再次漂移。
export const BROWSER_SCREENSHOT_SURFACE_PREPARE_TIMEOUT_MS = 3_000;
export function createOpenInEditorRemoteTarget(target) {
    switch (target.kind) {
        case "ssh":
            // openInEditor 只需要构造 VS Code Remote-SSH URI 的连接标识，
            // 不应该把 password/privateKeyPassphrase 等凭据字段继续穿过 renderer/preload/main IPC。
            return {
                kind: "ssh",
                host: target.host,
                port: target.port,
                username: target.username,
                ...(target.sshConfigAlias?.trim() ? { sshConfigAlias: target.sshConfigAlias.trim() } : {}),
            };
        case "wsl": {
            const user = target.user?.trim();
            return {
                kind: "wsl",
                distro: target.distro,
                ...(user ? { user } : {}),
            };
        }
        case "docker":
            return {
                kind: "docker",
                container: target.container,
            };
        case "server":
            return undefined;
    }
}
export const DesktopCommandIds = {
    NewTask: "newTask",
    OpenWorkspace: "openWorkspace",
    CloseActiveContext: "closeActiveContext",
    CloseWindow: "closeWindow",
    MinimizeWindow: "minimizeWindow",
    ToggleMaximizeWindow: "toggleMaximizeWindow",
    ToggleFullScreen: "toggleFullScreen",
    ResetWindowSize: "resetWindowSize",
    ResetZoom: "resetZoom",
    ZoomIn: "zoomIn",
    ZoomOut: "zoomOut",
    ShowAbout: "showAbout",
    OpenChangelog: "openChangelog",
    CheckForUpdates: "checkForUpdates",
    RelaunchApp: "relaunchApp",
    OpenFeedback: "openFeedback",
    OpenCommunity: "openCommunity",
    ExportLogs: "exportLogs",
    ToggleDevTools: "toggleDevTools",
    OpenResourceManager: "openResourceManager",
    ToggleZCodeStdioTapDevProxy: "toggleZCodeStdioTapDevProxy",
    SetZCodeEndpointProduction: "setZCodeEndpointProduction",
    SetZCodeEndpointTest: "setZCodeEndpointTest",
    SetZCodeEndpointCustom: "setZCodeEndpointCustom",
    ResetZCodeEndpoint: "resetZCodeEndpoint",
    ClearAllData: "clearAllData",
    ClearCodingPlanWebviewStorage: "clearCodingPlanWebviewStorage",
    GetCuaOsSupport: "getCuaOsSupport",
};
//# sourceMappingURL=platform.js.map