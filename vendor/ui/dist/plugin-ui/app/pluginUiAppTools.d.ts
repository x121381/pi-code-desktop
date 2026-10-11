import type { McpUiAppCapabilities } from "@modelcontextprotocol/ext-apps/app-bridge";
import type { IPluginUiAppToolsService, PluginUiPluginScope } from "@zcode/services";
import { type McpAppsAppToolCallRequest } from "@zcode/shared/mcp-apps";
import type { PluginUiHostBridge } from "./pluginUiHostBridge.js";
/**
 * 认领与回传按 callId 幂等：传输失败重试；`accepted: false` 是 agent 的明确裁决，不重试。
 * 总等待（0.5 s + 1 s）留在 5 s 认领期限内。
 */
export declare const PLUGIN_UI_APP_TOOL_RPC_ATTEMPTS = 3;
export declare const PLUGIN_UI_APP_TOOL_RPC_RETRY_DELAY_MS = 500;
export interface PluginUiAppTools {
    isBusy(): boolean;
    /** 新端口到达：注销上一个页面实例的登记（新实例握手后按自己的能力重新登记）。 */
    resetForAttach(): void;
    /** 握手完成：页面声明了 appCapabilities.tools 才发现并登记，声明 listChanged 时监听变更。 */
    onInitialized(active: PluginUiHostBridge, capabilities: McpUiAppCapabilities | undefined, isCurrent: () => boolean): void;
    /** 信箱投递到达：认领并让页面执行（按 callId 去重）。 */
    execute(active: PluginUiHostBridge, call: McpAppsAppToolCallRequest): void;
    /** 实例销毁：注销登记（best effort）。 */
    dispose(): void;
}
/**
 * App-Provided Tools 的渲染端：发现页面工具并登记到 agent；模型发起的调用经实例信箱到达后
 * 认领 → 页面 tools/call → 回传。登记表与调用态都由 agent 持有，这里只记本实例已经开始处理的 callId。
 */
export declare function createPluginUiAppTools(deps: {
    bridge: IPluginUiAppToolsService;
    pluginScope: () => PluginUiPluginScope;
    scopeId: string;
    /** 当前实例代际；端口未到达时 undefined。 */
    currentGeneration: () => number | undefined;
    setTimer: (callback: () => void, ms: number) => () => void;
    now?: () => number;
    onBusyChange?(): void;
    log?: (message: string, detail?: Record<string, unknown>) => void;
}): PluginUiAppTools;
//# sourceMappingURL=pluginUiAppTools.d.ts.map