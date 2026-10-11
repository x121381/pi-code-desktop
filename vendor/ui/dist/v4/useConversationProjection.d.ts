import type { ConversationStoreState } from "@/v4/conversationProjectionStore.js";
import type { SessionLease } from "@/v4/sessionDataLayer.js";
/** 订阅 per-session projection store（useSyncExternalStore，row 级 selector 在组件内再做）。 */
export declare function useConversationProjection(lease: SessionLease | null): ConversationStoreState;
//# sourceMappingURL=useConversationProjection.d.ts.map