import { type ZCodeSavedWorkflowEntry, type ZCodeSavedWorkflowInvalidEntry, type ZCodeSavedWorkflowRun } from "@zcode/shared";
import type { IZCodeAgentService, ZCodeAgentSavedWorkflowTarget } from "@zcode/services";
/**
 * 声明输出需要：useSavedWorkflowGlobalGroup 的返回类型引用它，tsc -d 要求可命名；
 * knip 看不到这种用法，故标 public。
 * @public
 */
export interface SavedWorkflowWorkspaceState {
    entries: ZCodeSavedWorkflowEntry[];
    invalid: ZCodeSavedWorkflowInvalidEntry[];
    runs: ZCodeSavedWorkflowRun[];
    /** 扫过的目录（本地绝对路径），全局组据此 watch；未加载或列表未回时为 null。 */
    dir: string | null;
    loading: boolean;
    loaded: boolean;
    error: string | null;
    /** 列表调用的 JSON-RPC 错误码（有则填）；全局组用 -32602 区分「旧 agent 不支持」与其他错误。 */
    errorCode: number | null;
}
interface SavedWorkflowStoreState {
    byWorkspaceKey: Record<string, SavedWorkflowWorkspaceState>;
    load: (target: ZCodeAgentSavedWorkflowTarget, agentService: IZCodeAgentService, options?: {
        bypassCache?: boolean;
    }) => Promise<void>;
}
export declare const useSavedWorkflowStore: import("zustand").UseBoundStore<import("zustand").StoreApi<SavedWorkflowStoreState>>;
export declare function selectSavedWorkflowState(state: SavedWorkflowStoreState, target: ZCodeAgentSavedWorkflowTarget | null): SavedWorkflowWorkspaceState;
/** 测试用：清掉 in-flight 去重表。 */
export declare function resetSavedWorkflowStoreForTests(): void;
export {};
//# sourceMappingURL=savedWorkflowStore.d.ts.map