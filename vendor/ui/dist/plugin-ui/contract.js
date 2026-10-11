import { buildPluginSandboxScopeId } from "@zcode/shared/mcp-apps";
export const PLUGIN_UI_CARD_DEFAULT_HEIGHT_PX = 240;
export const PLUGIN_UI_CARD_MIN_HEIGHT_PX = 80;
export const PLUGIN_UI_CARD_MAX_HEIGHT_PX = 1200;
/**
 * 侧栏面板头部（AnimatedSidePanePanel 的 TabsList，`!h-12` = 48px）。fullscreen 时经 hostContext.titleBar
 * 告诉插件页面视口上方被宿主占用的高度；页面视口本身不与它重叠，所以 inset 都是 0。
 */
export const PLUGIN_UI_SIDE_PANE_TITLE_BAR = {
    height: 48,
    leftInset: 0,
    viewportLeftInset: 0,
};
/** 请求 / tab 的作用域：surfaceId 优先，否则 toolCallId；两者都缺视为非法请求。 */
export function readPluginUiScopeRef(input) {
    if (input.surfaceId)
        return { kind: "surface", surfaceId: input.surfaceId };
    if (input.toolCallId)
        return { kind: "toolCall", toolCallId: input.toolCallId };
    return null;
}
export function buildPluginUiSessionKey(target) {
    return JSON.stringify([
        target.workspaceIdentity?.trim() || target.workspacePath,
        target.sessionId,
    ]);
}
export function buildPluginUiSurfaceKey(target, scope) {
    // 修复：surfaceId 由插件自行命名，必须同时隔离工作区、会话和插件。
    return JSON.stringify([
        buildPluginUiSessionKey(target),
        target.pluginId,
        target.serverName ?? "",
        target.resourceUri ?? "",
        buildPluginSandboxScopeId(scope),
    ]);
}
export function buildPluginUiSidePaneTabId(request) {
    const scope = readPluginUiScopeRef(request);
    if (!scope)
        throw new Error("plugin-ui side tab needs toolCallId or surfaceId");
    return [
        "plugin-ui",
        request.workspaceIdentity?.trim() || request.workspacePath,
        request.parentSessionId,
        request.pluginId,
        request.serverName ?? "",
        request.resourceUri,
        ...(scope.kind === "toolCall" ? [scope.toolCallId] : ["surface", scope.surfaceId]),
    ]
        .map(encodeURIComponent)
        .join(":");
}
//# sourceMappingURL=contract.js.map