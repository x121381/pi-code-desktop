import { type ZCodeSessionStoreState } from "./zcodeSessionStoreTypes.js";
export declare const useZCodeSessionStore: import("zustand").UseBoundStore<import("zustand").StoreApi<ZCodeSessionStoreState>>;
type ZCodeSessionStoreE2EBridge = typeof useZCodeSessionStore;
declare global {
    interface Window {
        __zcodeSessionStoreE2E?: ZCodeSessionStoreE2EBridge;
    }
}
export * from "./zcodeSessionStoreTypes.js";
export * from "./zcodeSessionStoreSelectors.js";
export type { TaskNavigationHistory, TaskNavEntry, WorkspaceNavEntry, } from "@/lib/taskNavigationHistory.js";
//# sourceMappingURL=zcodeSessionStore.d.ts.map