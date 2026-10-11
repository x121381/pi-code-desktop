/**
 * MCP Apps 宿主侧契约的第二半：ui/download-file 项、tool-input / tool-result 载荷、宿主提供的 titleBar 与样式变量。
 * hostInfo / hostCapabilities / hostContext 直接用官方 SDK 的 `McpUiHostCapabilities` / `McpUiHostContext`，不再重复定义。
 */
/** 单次 ui/download-file 的项数上限与单个文件解码后上限（与桌面 saveFile 的 50 MiB 同值）。 */
export const MCP_APPS_DOWNLOAD_FILE_MAX_ITEMS = 16;
export const MCP_APPS_DOWNLOAD_FILE_MAX_BYTES = 50 * 1024 * 1024;
//# sourceMappingURL=hostContract.js.map