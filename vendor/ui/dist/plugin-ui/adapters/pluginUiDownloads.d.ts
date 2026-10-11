import type { PluginUiHostScope } from "@/plugin-ui/app/pluginUiHostController.js";
import type { PluginUiInteractionCallbacks } from "@/plugin-ui/app/pluginUiInteractionPorts.js";
import type { PluginUiPresentation } from "@/plugin-ui/contract.js";
import type { IPluginUiBridgeService, PluginUiReadResourceResult } from "@zcode/services";
import type { IPlatformService, SaveFileRequest, SaveFileResult } from "@zcode/shared";
import type { McpAppsDownloadFileItem } from "@zcode/shared/mcp-apps";
export interface PluginUiDownloadHandlerDeps {
    /** 桌面 IPlatformService.saveFile：原生另存为对话框；main 侧再做一次 50 MiB 与文件名校验。 */
    saveFile(payload: SaveFileRequest): Promise<SaveFileResult>;
    /** 只有 uri 的项（ResourceLink / 无内容的 EmbeddedResource）先经同插件 server 读取。 */
    readResource(uri: string): Promise<PluginUiReadResourceResult>;
}
/**
 * `ui/download-file { contents }` 的宿主实现。逐项解析内容 → 逐个弹保存框（多项多次），
 * 不要求用户手势（已拍板：保存框本身就是确认）。任一项取消 / 写入失败 → `{ isError: true }`（官方 SDK 语义），
 * 参数级错误（超 50 MiB、blob 非法、链接资源无内容）→ -32602；读资源失败按 -32603 抛给页面。
 */
/**
 * 宿主实例的 downloadFile 交互：平台有原生 saveFile（桌面）才提供；链接项经本插件 server 的 readResource 读取。
 * 返回 undefined 表示本实例不声明 downloadFile 能力，端口回 -32601（与其它交互回调同一规则）。
 */
export declare function createPluginUiDownloadInteraction(input: {
    platform: Pick<IPlatformService, "saveFile"> | null;
    bridge: Pick<IPluginUiBridgeService, "readResource">;
    scope: PluginUiHostScope;
    getInstance(): import("@zcode/shared/mcp-apps").McpAppInstance;
    presentation: Pick<PluginUiPresentation, "pluginId" | "serverName">;
}): Required<Pick<PluginUiInteractionCallbacks, "onDownloadFile">> | undefined;
export declare function createPluginUiDownloadHandler(deps: PluginUiDownloadHandlerDeps): (contents: McpAppsDownloadFileItem[]) => Promise<{
    isError?: boolean;
}>;
//# sourceMappingURL=pluginUiDownloads.d.ts.map