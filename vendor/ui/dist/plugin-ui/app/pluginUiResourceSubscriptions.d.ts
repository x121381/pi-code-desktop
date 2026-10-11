import type { IPluginUiBridgeService, PluginUiPluginScope } from "@zcode/services";
import type { PluginUiHostBridge } from "./pluginUiHostBridge.js";
/**
 * 一个沙箱实例发起的 MCP 资源请求（read / list / templates / subscribe / unsubscribe）接到官方 AppBridge：
 * 同插件 server，归属由 agent 校验。订阅登记按 uri → Agent 代际记账：同实例重复订阅（含在途）合并；
 * 迟到成功（实例已销毁或 guest 已换代）立即补退订；`unsubscribeAll` 在 guest 换代与 dispose 时逐 uri 退订
 * （best effort，agent 会话关闭兜底）。
 */
export interface PluginUiResourceSubscriptionsDeps {
    bridge: Pick<IPluginUiBridgeService, "readResource" | "listResources" | "listResourceTemplates" | "subscribeResource" | "unsubscribeResource">;
    pluginScope(): PluginUiPluginScope;
    scopeId: string;
    /** 当前 Agent 代际；实例未准备时 undefined。 */
    currentGeneration(): number | undefined;
    isDisposed(): boolean;
}
export interface PluginUiResourceSubscriptions {
    /** 给当前 AppBridge 挂 resources/read、list、templates/list、subscribe、unsubscribe 处理器。 */
    install(bridge: PluginUiHostBridge): void;
    /** 本实例是否订阅了该 uri（通知只投递给已订阅的）。 */
    has(uri: string): boolean;
    unsubscribeAll(): void;
}
export declare function createPluginUiResourceSubscriptions(deps: PluginUiResourceSubscriptionsDeps): PluginUiResourceSubscriptions;
//# sourceMappingURL=pluginUiResourceSubscriptions.d.ts.map