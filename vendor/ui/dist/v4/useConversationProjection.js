import { useSyncExternalStore } from "react";
const CLOSED_STATE = {
    status: "closed",
    snapshot: null,
    subscriptionId: null,
    lastError: null,
    optimisticCommands: [],
    loadingOlder: false,
    sessionPlans: [],
    planDirectoryRevision: 0,
    plansLoading: false,
    turnNavigatorDirectoryRevision: 0,
};
/** 订阅 per-session projection store（useSyncExternalStore，row 级 selector 在组件内再做）。 */
export function useConversationProjection(lease) {
    const store = lease?.store ?? null;
    return useSyncExternalStore((listener) => store?.subscribe(listener) ?? (() => { }), () => store?.getState() ?? CLOSED_STATE, () => CLOSED_STATE);
}
//# sourceMappingURL=useConversationProjection.js.map