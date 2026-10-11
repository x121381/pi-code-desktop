import { type PluginUiSessionScope } from "@/plugin-ui/contract.js";
import type { PluginUiModelContext } from "@/plugin-ui/domain/pluginUiModelContext.js";
export declare function registerPluginUiModelContextReceiver(scope: PluginUiSessionScope, receive: (context: PluginUiModelContext) => void): () => void;
/** 修复：window 事件只按 sessionId 过滤，会把相同 session 的上下文投给其它 workspace。 */
export declare function dispatchPluginUiModelContextAdd(scope: PluginUiSessionScope, context: PluginUiModelContext): boolean;
export declare function usePluginUiModelContexts(input: Omit<PluginUiSessionScope, "sessionId"> & {
    sessionId: string | null;
}): {
    contexts: readonly PluginUiModelContext[];
    hasContexts: boolean;
    removeContext: (id: string) => void;
    clearContexts: () => void;
};
//# sourceMappingURL=pluginUiModelContextEvents.d.ts.map