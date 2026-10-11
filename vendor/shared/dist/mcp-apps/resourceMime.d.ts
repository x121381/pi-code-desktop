/**
 * 页面发起的 `resources/read`（`mcp/uiReadResource`）单次结果总大小上限，以及 mimeType 白名单。
 * 白名单项以 `/` 结尾表示前缀匹配（如 `text/`），否则精确匹配（忽略参数与大小写）。
 */
export declare const MCP_APPS_UI_READ_RESOURCE_MAX_BYTES: number;
export declare const MCP_APPS_UI_READ_RESOURCE_MIME_ALLOWLIST: readonly string[];
export declare function isMcpAppsUiReadResourceMimeAllowed(mimeType: string): boolean;
//# sourceMappingURL=resourceMime.d.ts.map