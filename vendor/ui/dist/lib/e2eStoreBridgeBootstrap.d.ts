import { useSkillStore } from "@/store/skillStore.js";
import { useSubagentsStore } from "@/store/subagentsStore.js";
import { useWhiteboardStore } from "@/store/whiteboardStore.js";
import { useZCodeSessionStore } from "@/store/zcodeSessionStore.js";
declare global {
    interface Window {
        __skillStoreE2E?: typeof useSkillStore;
        __subagentsStoreE2E?: typeof useSubagentsStore;
        __whiteboardStoreE2E?: typeof useWhiteboardStore;
        __zcodeSessionStoreE2E?: typeof useZCodeSessionStore;
    }
}
export declare function registerE2EStoreBridges(): void;
//# sourceMappingURL=e2eStoreBridgeBootstrap.d.ts.map