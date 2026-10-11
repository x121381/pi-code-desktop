import type { IServiceAccessor } from "@zcode/services";
import type { ZCodeConfigOption } from "@zcode/shared";
import { useZCodeSessionStore } from "@/store/zcodeSessionStore.js";
import type { useTabStoreApi } from "@/store/TabStoreProvider.js";
export declare function syncBotTaskConfigOptionsToStore(params: {
    zcodeSessionStore: Pick<ReturnType<typeof useZCodeSessionStore.getState>, "setTaskConfigOptions">;
    workspacePath: string;
    workspaceIdentity?: string;
    taskId: string;
    configOptions: ZCodeConfigOption[];
}): void;
export declare function shouldRefreshBotTaskList(event: string, hasTaskMeta: boolean): boolean;
export declare function shouldMirrorBotTaskStreamToStore(params: {
    activeTaskId: string | null;
    taskId: string;
    workspaceIdentity?: string;
}): boolean;
export declare function useBotBroadcastEffects(services: IServiceAccessor, tabStoreApi: ReturnType<typeof useTabStoreApi>): void;
//# sourceMappingURL=useBotBroadcastEffects.d.ts.map