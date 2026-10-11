import type { ZCodeMcpReadResourceResult, ZCodeMcpUiCallToolResult, ZCodeMcpUiCancelCallResult, ZCodeMcpUiListResourceTemplatesResult, ZCodeMcpUiListResourcesResult, ZCodeMcpUiReadResourceResult, ZCodePluginsListUiSurfacesResult } from "@zcode/shared";
import type { McpAppResourceMeta, PluginSandboxHandle, PluginSandboxRegisterInput } from "@zcode/shared/mcp-apps";
import type { IPluginUiBridgeService, PluginUiCallToolParams, PluginUiCancelToolCallParams, PluginUiListResourcesParams, PluginUiPrepareSandboxParams, PluginUiReadResourceParams, PluginUiResourceSubscriptionParams, PluginUiWorkspaceTarget } from "./contract.js";
export interface PluginUiBridgeServiceDependencies {
    recycleInstance?: (params: import("./contract.js").PluginUiPluginScope) => Promise<boolean>;
    validateInstance?: (params: import("./contract.js").PluginUiPluginScope) => Promise<void>;
    openInstance?: (params: PluginUiPrepareSandboxParams) => Promise<import("@zcode/shared/mcp-apps").McpAppInstance>;
    closeInstance?: (params: import("./contract.js").PluginUiPluginScope) => Promise<void>;
    readMcpResource?: (params: {
        workspacePath: string;
        workspaceIdentity?: string;
        sessionId: string;
        pluginId: string;
        serverName: string;
        uri: string;
        instance: import("@zcode/shared/mcp-apps").McpAppInstance;
    }) => Promise<ZCodeMcpReadResourceResult>;
    callMcpToolForUi?: (params: PluginUiCallToolParams, options?: {
        signal?: AbortSignal;
    }) => Promise<ZCodeMcpUiCallToolResult>;
    /** 取消带 callId 的进行中调用。 */
    cancelMcpToolCallForUi?: (params: PluginUiCancelToolCallParams) => Promise<ZCodeMcpUiCancelCallResult>;
    /** 页面发起的 `resources/read`，agent 侧 `mcp/uiReadResource` 做归属与 mimeType 校验。 */
    readMcpResourceForUi?: (params: PluginUiReadResourceParams) => Promise<ZCodeMcpUiReadResourceResult>;
    /** 资源列表 / 模板 / 订阅代理；缺省（web / 远程）时对应方法抛 unavailable。 */
    listMcpResourcesForUi?: (params: PluginUiListResourcesParams) => Promise<ZCodeMcpUiListResourcesResult>;
    listMcpResourceTemplatesForUi?: (params: PluginUiListResourcesParams) => Promise<ZCodeMcpUiListResourceTemplatesResult>;
    subscribeMcpResourceForUi?: (params: PluginUiResourceSubscriptionParams) => Promise<unknown>;
    unsubscribeMcpResourceForUi?: (params: PluginUiResourceSubscriptionParams) => Promise<unknown>;
    registerSandbox?: (input: PluginSandboxRegisterInput) => Promise<PluginSandboxHandle>;
    /** 工作区级 `plugins/listUiSurfaces`。 */
    listPluginUiSurfaces?: (params: PluginUiWorkspaceTarget) => Promise<ZCodePluginsListUiSurfacesResult>;
}
export declare class PluginUiBridgeError extends Error {
    readonly code: "unavailable" | "resource_not_found" | "resource_too_large" | "unsupported_mime_type" | "invalid_server_uri";
    constructor(code: "unavailable" | "resource_not_found" | "resource_too_large" | "unsupported_mime_type" | "invalid_server_uri", message: string);
}
/**
 * `ui://` 资源 URI 的 server 归属由 agent 侧 catalog 校验；这里只负责把 URI 拆成 server 名。
 * 约定：`ui://<plugin-name>/<path>` 对应 namespaced server 由 params.serverName 显式给出，
 * 不从 URI 猜测。
 */
export declare function createPluginUiBridgeService(dependencies?: PluginUiBridgeServiceDependencies): IPluginUiBridgeService;
/**
 * 8 MiB 总量守卫：结果经 MessagePort 结构化克隆进沙箱，
 * agent 侧已按同一常量限流，这里再算一次解码后大小（text 按 UTF-8、blob 按 base64 解码长度）防止旧 agent 漏检。
 */
export declare function assertUiReadResourceSize(result: ZCodeMcpUiReadResourceResult, uri: string): void;
/** 兼容旧调用：只要 HTML 文本。 */
export declare function pickHtmlContent(result: ZCodeMcpReadResourceResult, uri: string): string;
/**
 * 选中实际使用的 HTML 项：遍历 contents，取第一个 mimeType 在 HTML 白名单内的项
 * （同 uri 的优先）；从**该项**的 `_meta` 读资源级 csp / prefersBorder / 尺寸提示。
 * blob、超限一律拒绝，不降级、不截断；没有任何 HTML 项时按第一项的 mimeType 报错。
 */
export declare function pickHtmlResource(result: ZCodeMcpReadResourceResult, uri: string): {
    html: string;
    meta: McpAppResourceMeta | null;
};
//# sourceMappingURL=pluginUiBridgeService.d.ts.map