/**
 * MCP Apps 协议契约：agent、host、renderer 与 main 共用的常量、工具 UI 元数据类型、沙箱句柄与登记载荷。
 * 页面 ↔ 宿主的线协议（`ui/*` 方法、握手、版本协商、JSON-RPC）由官方 `@modelcontextprotocol/ext-apps` 定义，
 * 这里只保留 ZCode 自己的扩展键与限额。只放类型与常量；归一化与 schema 在同目录其他文件，经 index.ts 导出。
 */
/** MCP 扩展标识（规范「Extension Identifier」）；与官方 SDK `EXTENSION_ID` 一致。 */
export const MCP_APPS_EXTENSION_ID = "io.modelcontextprotocol/ui";
/** UI 资源 mimeType（规范 MUST）；与官方 SDK `RESOURCE_MIME_TYPE` 一致。 */
export const MCP_APPS_RESOURCE_MIME_TYPE = "text/html;profile=mcp-app";
/** 弃用的扁平键 `_meta["ui/resourceUri"]`；规范要求宿主 MUST 同时兼容，与官方 SDK `RESOURCE_URI_META_KEY` 一致。 */
export const MCP_APPS_LEGACY_RESOURCE_URI_META_KEY = "ui/resourceUri";
/** agent 对每个 MCP server 宣告的能力片段；放进 `Client` 构造参数的 `capabilities.extensions`。 */
export function buildMcpAppsClientCapabilities() {
    return { extensions: { [MCP_APPS_EXTENSION_ID]: { mimeTypes: [MCP_APPS_RESOURCE_MIME_TYPE] } } };
}
/** 宿主 hostInfo.name；hostInfo.version 只供页面 feature detect，与应用版本无关。 */
export const MCP_APPS_HOST_NAME = "zcode";
export const MCP_APPS_HOST_VERSION = "1";
/** `ui/initialize` 握手超时（端口到达起算）与卸载前 `ui/resource-teardown` 的等待上限。 */
export const MCP_APPS_HANDSHAKE_TIMEOUT_MS = 15_000;
export const MCP_APPS_TEARDOWN_TIMEOUT_MS = 500;
export const MCP_APPS_DEFAULT_TOOL_VISIBILITY = ["model", "app"];
/**
 * 资源级 `_meta["zcode/csp"]`：宿主缺省按规范块（只有 'self' 'unsafe-inline'），不放行 `'unsafe-eval'` /
 * `'wasm-unsafe-eval'`；需要 eval / WebAssembly 的资源在这里显式声明。宿主经
 * `hostCapabilities.experimental["zcode/csp"].flags` 宣告支持的键。
 */
export const MCP_APPS_CSP_RELAXATION_META_KEY = "zcode/csp";
export const MCP_APPS_CSP_RELAXATION_FLAGS = ["unsafeEval", "wasmUnsafeEval"];
export function buildMcpAppsCspExperimentalCapability() {
    return { [MCP_APPS_CSP_RELAXATION_META_KEY]: { flags: [...MCP_APPS_CSP_RELAXATION_FLAGS] } };
}
/**
 * 资源可声明的浏览器权限（规范草案 `UIResourceMeta.permissions` 的四键），顺序即归一化顺序。
 * 宿主：未声明一律拒绝；camera / microphone / geolocation 首次使用时原生弹框确认，clipboardWrite 按声明放行。
 */
export const MCP_APPS_RESOURCE_PERMISSIONS = [
    "camera",
    "microphone",
    "geolocation",
    "clipboardWrite",
];
/** 规范权限键 → 插件 iframe `allow` 的 Permissions Policy 特性名。 */
export const MCP_APPS_IFRAME_ALLOW_TOKENS = {
    camera: "camera",
    microphone: "microphone",
    geolocation: "geolocation",
    clipboardWrite: "clipboard-write",
};
/** 与官方 SDK `buildAllowAttribute` 同形：`"camera; clipboard-write"`；没有声明返回空串。 */
export function buildMcpAppsIframeAllow(permissions) {
    if (!permissions?.length)
        return "";
    return MCP_APPS_RESOURCE_PERMISSIONS.filter((key) => permissions.includes(key))
        .map((key) => MCP_APPS_IFRAME_ALLOW_TOKENS[key])
        .join("; ");
}
/** `_meta.ui.surface` / 清单 surface id 的长度与字符集（与 sandboxId 同源：可进 CSP host-source）。 */
export const MCP_APPS_SURFACE_ID_MAX_CHARS = 128;
export const MCP_APPS_SURFACE_ID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9_.-]*$/;
export const MCP_APPS_UI_RESOURCE_SCHEME = "ui://";
export const MCP_APPS_RESOURCE_URI_MAX_CHARS = 2048;
/**
 * `display.ui.structuredContent` / `widgetMeta` / `content` 的持久化上限（JSON 文本的 UTF-8 字节）。
 * 超限不截断字符串（半截 JSON 没有意义）：字段整个省略，`truncated: true` 且 `truncatedBytes` 记被丢弃的字节数；
 * 页面侧 `toolOutput` 为 null、`toolResponseMetadata["zcode/truncated"] = { bytes }`，可用 tools/call 重取。
 */
export const MCP_APPS_STRUCTURED_CONTENT_MAX_BYTES = 64 * 1024;
export const MCP_APPS_WIDGET_META_MAX_BYTES = 16 * 1024;
export const MCP_APPS_CONTENT_MAX_BYTES = 32 * 1024;
export const MCP_APPS_TRUNCATED_META_KEY = "zcode/truncated";
/** host 侧接受的 `ui://` HTML 上限与 mimeType 白名单（规范只认带 profile 的；无 profile 的 text/html 是有意的宽松超集）。 */
// 官方 pdf-server 示例的单文件页面（内联 pdf.js）就有 4.3 MB，4 MiB 会把它拒掉；放到 16 MiB。
export const MCP_APPS_HTML_MAX_BYTES = 16 * 1024 * 1024;
export const MCP_APPS_HTML_MIME_TYPES = [MCP_APPS_RESOURCE_MIME_TYPE, "text/html"];
/**
 * 页面经 ui/update-model-context 与 ui/message 送来的 image 块：白名单三种位图，单张解码后 ≤ 4 MiB；
 * 不在白名单或超限整个请求 -32602 `unsupported_content`。
 */
export const MCP_APPS_IMAGE_MIME_TYPES = ["image/png", "image/jpeg", "image/webp"];
export const MCP_APPS_IMAGE_MAX_BYTES = 4 * 1024 * 1024;
export { MCP_APPS_UI_READ_RESOURCE_MAX_BYTES, MCP_APPS_UI_READ_RESOURCE_MIME_ALLOWLIST, isMcpAppsUiReadResourceMimeAllowed, } from "./resourceMime.js";
/**
 * `hostCapabilities.experimental` 里 ZCode 扩展的键。官方 SDK 的 zod 会剥掉标准位之外的未知能力键，
 * 扩展一律放 experimental（规范预留位），页面按键 feature detect。
 */
export const MCP_APPS_WIDGET_STATE_EXPERIMENTAL_KEY = "zcode/widgetState";
export const MCP_APPS_RESOURCE_SUBSCRIBE_EXPERIMENTAL_KEY = "zcode/resourceSubscribe";
export const MCP_APPS_SURFACE_EXPERIMENTAL_KEY = "zcode/surface";
/**
 * ZCode 扩展方法 `ui/set-widget-state { widgetState }`（MCP Apps 无 widgetState）：页面把界面状态交给宿主
 * renderer 内存保存（不持久化，会话内重挂载可恢复）；初值经 hostContext 的 `zcode/widgetState` 键随握手下发。
 */
export const MCP_APPS_SET_WIDGET_STATE_METHOD = "ui/set-widget-state";
export const MCP_APPS_WIDGET_STATE_CONTEXT_KEY = "zcode/widgetState";
/** 宿主 renderer ↔ relay shell 之间唯一一条 MessageChannel 的名字；上面跑原始 JSON-RPC（官方 AppBridge / App）。 */
export const PLUGIN_SANDBOX_PORT_NAME = "plugin-sandbox-rpc";
export function buildPluginSandboxScopeId(scope) {
    return scope.kind === "toolCall" ? `tool:${scope.toolCallId}` : `surface:${scope.surfaceId}`;
}
//# sourceMappingURL=contract.js.map