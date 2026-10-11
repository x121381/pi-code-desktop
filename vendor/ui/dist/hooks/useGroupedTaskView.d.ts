import type { ZCodeGroupedTaskView, ZCodeTaskGroup, ZCodeTaskGroupColor } from "@zcode/services";
import type { WorkspaceTabState } from "@/store/tabStore.js";
import { type WorkspaceOptimisticTaskOverlay } from "@/hooks/workspaceTaskListOptimisticOverlay.js";
export declare function mergeGroupedTaskViewWithOptimistic(params: {
    view: ZCodeGroupedTaskView;
    optimisticOverlays: Iterable<WorkspaceOptimisticTaskOverlay>;
    visibleMissingTaskKeys: ReadonlySet<string>;
}): ZCodeGroupedTaskView;
export declare function shouldHideGroupedTaskContent(params: {
    initialized: boolean;
    loading: boolean;
    hasNodes: boolean;
    /**
     * 门禁只该拦首屏。已经画出过列表之后再回到隐藏态，就是用户看到的
     * 「grouped 整块闪一下」——祖先重挂载和后台刷新都会走到这里。
     * 画过一次之后一律继续渲染上一份列表：旧数据优于空白。
     */
    hasPaintedOnce?: boolean;
}): boolean;
export declare function isGroupedTaskViewInitialized(params: {
    remoteDataInitialized: boolean;
    hydratingEndpointKeys: readonly string[];
    /**
     * 这个门禁只负责首屏。以前它直接读当前的 hydrating 状态，运行中任务每输出一次 tool
     * 结果都会让 Controller 列表重查一轮（loading=true），门禁随之关门、grouped 主体整棵卸载再
     * 重挂载——表现为左侧分组列表抖动。就绪一次之后永久保持就绪，后台刷新不再回到首屏态。
     */
    previouslyInitialized?: boolean;
}): boolean;
/**
 * grouped structure/membership 的按 key 单飞缓存。
 *
 * 切换到分组视图时，hook 挂载和 sessions-index 首帧会并发 refresh；旧缓存只保存
 * 已完成结果，所有 cache miss 都各自请求一遍全部 workspace，导致 RPC 风暴并让 loading 不断换代。
 * 这里同时保存进行中的 Promise，并用 generation/sequence 阻止失效或旧 key 的迟到结果回填缓存。
 */
export declare class GroupedRemoteDataSingleFlight<T> {
    private generation;
    private requestSequence;
    private completed;
    private readonly inFlightByKey;
    load(key: string, fetchValue: () => Promise<T>): Promise<T>;
    isCurrent(key: string, value: T): boolean;
    invalidate(): void;
}
export declare function prependTaskGroupToView(view: ZCodeGroupedTaskView, group: ZCodeTaskGroup): ZCodeGroupedTaskView;
export declare function reconcileGroupedOptimisticTaskKeys(params: {
    view: ZCodeGroupedTaskView;
    optimisticOverlays: Iterable<WorkspaceOptimisticTaskOverlay>;
    previousVisibleMissingTaskKeys: ReadonlySet<string>;
}): Set<string>;
export declare function clearCachedGroupedViewsForTest(): void;
export declare function useGroupedTaskView(params: {
    workspaceTabs: WorkspaceTabState[];
}): {
    view: ZCodeGroupedTaskView;
    setView: import("react").Dispatch<import("react").SetStateAction<ZCodeGroupedTaskView>>;
    loading: boolean;
    initialized: boolean;
    saving: boolean;
    refresh: () => Promise<void>;
    createGroup: () => Promise<ZCodeTaskGroup>;
    renameGroup: (groupId: string, title: string) => Promise<void>;
    updateGroupColor: (groupId: string, color: ZCodeTaskGroupColor) => Promise<void>;
    ungroupGroup: (groupId: string) => Promise<void>;
    applyOrder: (nextView: ZCodeGroupedTaskView) => Promise<void>;
};
//# sourceMappingURL=useGroupedTaskView.d.ts.map