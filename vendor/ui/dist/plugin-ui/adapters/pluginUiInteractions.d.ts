import type { PluginUiHostControllerDeps } from "@/plugin-ui/app/pluginUiHostController.js";
import type { PluginUiScopeRef } from "@zcode/shared/mcp-apps";
import { type PluginUiSessionScope } from "@/plugin-ui/contract.js";
export interface PluginUiInteractionScope extends PluginUiSessionScope {
    sessionId: string;
    pluginId: string;
    /** 工具卡片或面板；决定 widgetState 的 surfaceKey 以及来源标记 / 上下文 id。 */
    scope: PluginUiScopeRef;
}
/**
 * 第二、三批宿主回调：
 * - sendFollowUpMessage：有用户手势直接以用户身份发送；无手势弹可编辑确认框，取消回 -32000。
 *   ：structuredContent 以 ```json 块拼在文本后面；来源只进 metadata `source`。
 * - updateModelContext：投递到当前会话 composer 的插件上下文块；没有 composer 接住回 -32601。
 * widgetState 由窗口页面管理器唯一写入。
 */
export declare function createPluginUiInteractions(input: PluginUiInteractionScope): Pick<PluginUiHostControllerDeps, "onSendFollowUpMessage" | "onUpdateModelContext">;
//# sourceMappingURL=pluginUiInteractions.d.ts.map