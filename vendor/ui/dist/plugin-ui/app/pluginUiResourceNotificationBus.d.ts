import type { McpAppInstance } from "@zcode/shared/mcp-apps";
import type { PluginUiInstanceDelta } from "@zcode/shared/zcode-protocol-v4";
import type { PluginUiResourceNotificationTarget } from "../contract.js";
import type { PluginUiHostControllerDeps, PluginUiHostScope } from "./pluginUiHostController.js";
export declare function registerPluginUiResourceTarget(sessionKey: string, pluginId: string, scopeId: string, generation: number, target: PluginUiResourceNotificationTarget, instance: McpAppInstance): () => void;
/** 返回实际投递到的实例数（单测与日志用）。 */
export declare function dispatchPluginUiResourceDelta(sessionKey: string, delta: PluginUiInstanceDelta): number;
/** 给 controller 的登记入口：实例身份（会话 / 插件 / 作用域）固定，代际由 controller 在端口到达时给出。 */
export declare function createPluginUiResourceNotificationRegistrar(scope: PluginUiHostScope, pluginId: string): NonNullable<PluginUiHostControllerDeps["resourceNotifications"]>;
export declare function resetPluginUiResourceTargetsForTest(): void;
//# sourceMappingURL=pluginUiResourceNotificationBus.d.ts.map