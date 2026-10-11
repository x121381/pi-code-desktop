import type { WorkspaceFileEntry } from "@zcode/shared";
interface UseWorkspaceFileSearchFilterOptions {
    requireQuery?: boolean;
    limit?: number;
}
interface WorkspaceFileSearchFilterState {
    /** 按 query 过滤并映射回的原始 entry 列表（有序）。 */
    items: WorkspaceFileEntry[];
    /**
     * 当前 query 的过滤是否仍在途（Worker 异步）。调用方在 miss 判定等场景
     * 应把在途状态视为"结果未知"，避免用短暂的空列表触发误动作。
     */
    filtering: boolean;
}
/**
 * 工作区文件搜索过滤的共享入口：候选打分在 Web Worker 执行（降级为主线程同步），
 * 返回映射回的 entry 列表。@ 文件候选与文件树搜索共用同一语义。
 *
 * 时序契约：
 * - entries 变化（索引重建）先清空 items 再异步过滤，旧结果不会泄漏到新索引；
 * - query 变化触发的过期结果由 backend 的 seq 机制丢弃（resolve null）；
 * - 主线程不做全量 Map/候选构建（曾在 37 万 entries 下实测 ~630ms 同步阻塞，
 *   已全部移入 worker），组件卸载 dispose worker。
 */
export declare function useWorkspaceFileSearchFilterEntries(packed: string, query: string, options: UseWorkspaceFileSearchFilterOptions, rootPath: string): WorkspaceFileSearchFilterState;
export {};
//# sourceMappingURL=useWorkspaceFileSearchFilter.d.ts.map