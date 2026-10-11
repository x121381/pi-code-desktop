export interface OptimisticReorderController {
    readonly renderedIds: readonly string[];
    commit(ids: readonly string[]): Promise<void>;
}
export declare function useOptimisticReorder({ authoritativeIds, persist, }: {
    authoritativeIds: readonly string[];
    persist: (ids: readonly string[]) => Promise<void>;
}): OptimisticReorderController;
//# sourceMappingURL=useOptimisticReorder.d.ts.map