import { type PluginUiSessionScope } from "@/plugin-ui/contract.js";
import type { ConversationProjectionStore } from "@/v4/conversationProjectionStore.js";
export declare function attachPluginUiResourceDeltaFeed(store: ConversationProjectionStore, scope: PluginUiSessionScope): () => void;
export declare function usePluginUiResourceDeltaFeed(store: ConversationProjectionStore | null | undefined, scope: PluginUiSessionScope | null): void;
//# sourceMappingURL=pluginUiResourceDeltaFeed.d.ts.map