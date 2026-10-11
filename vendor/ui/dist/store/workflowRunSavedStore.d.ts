import type { ZCodeSavedWorkflowEntry, ZCodeWorkflowsForRunCandidate, ZCodeWorkflowsForRunResult } from "@zcode/shared";
/**
 * `unsupported` 是**能力**而不是错误：老 agent 根本没有这个方法（JSON-RPC -32601），
 * 卡片据此只留「让 ZCode 帮我提炼保存」那条路。其余失败都按 `error` 处理——查不出来不等于没保存，
 * 所以卡片此时既不画芯片也不画「再次运行」，但「保存」照常可点。
 */
export type WorkflowRunSavedStatus = "loading" | "ready" | "unsupported" | "error";
export interface WorkflowRunSavedState {
    status: WorkflowRunSavedStatus;
    /** 命中的定义；缺席即这次 run 还没有对应的已保存工作流。 */
    entry?: ZCodeSavedWorkflowEntry;
    match?: ZCodeWorkflowsForRunResult["match"];
    /** 这次 run 跑时用的实参，供「再次运行」预填实参窗。 */
    runArgs?: Record<string, unknown>;
}
interface WorkflowRunSavedStoreState {
    /** 作废代（invalidate 递增）：hook 把它放进依赖，一次作废让所有在场的卡片重查。 */
    generation: number;
    byKey: Record<string, WorkflowRunSavedState>;
    load: (key: string, loader: () => Promise<ZCodeWorkflowsForRunResult>) => Promise<void>;
    /**
     * 自己刚写成的那一份：这一张卡立刻翻面（保留已查到的实参），其余一律作废重查——同名覆盖
     * 可能同时改变别的 run 的答案（按名字命中的那条规则）。
     */
    applySaved: (key: string, entry: ZCodeSavedWorkflowEntry) => void;
    /** 保存 / 删除 / 中枢刷新之后作废：下一次渲染重查。 */
    invalidate: () => void;
    reset: () => void;
}
export declare const useWorkflowRunSavedStore: import("zustand").UseBoundStore<import("zustand").StoreApi<WorkflowRunSavedStoreState>>;
/** 缓存键：工作区 + run + 候选签名。候选变了（对话里刚存过一次）就是另一个问题，必须重查。 */
export declare function workflowRunSavedKey(workspaceKey: string, runId: string, candidates: readonly ZCodeWorkflowsForRunCandidate[] | undefined): string;
export declare function selectWorkflowRunSavedState(state: WorkflowRunSavedStoreState, key: string | null): WorkflowRunSavedState | undefined;
/** 测试用。 */
export declare function resetWorkflowRunSavedStoreForTests(): void;
export {};
//# sourceMappingURL=workflowRunSavedStore.d.ts.map