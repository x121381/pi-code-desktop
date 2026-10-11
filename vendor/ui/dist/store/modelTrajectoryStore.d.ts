/**
 * 打开“模型调用轨迹”侧边栏的请求桥接 store。
 *
 * 背景：触发入口在任务右键菜单 / Header 菜单里，挂载位置很深；而侧边栏 tab 状态由
 * 每个 workspace 的 useAppPanels 持有。为避免把一个新回调贯穿整棵任务列表树，
 * 这里用一个轻量单例 store 作为桥：菜单写入 pending 请求，目标 workspace 的
 * useAppPanels 订阅并消费（按 workspaceKey 匹配，避免多 workspace 实例串开）。
 */
export interface ModelTrajectoryOpenRequest {
    /** 唯一请求 id，保证同一 task 连续点击也能触发消费。 */
    requestId: string;
    taskId: string;
    /** workspaceIdentity?.trim() || workspacePath，用于定位目标 workspace 侧边栏。 */
    workspaceKey: string;
    title?: string | null;
}
interface ModelTrajectoryStoreState {
    pendingRequest: ModelTrajectoryOpenRequest | null;
    requestOpen: (request: Omit<ModelTrajectoryOpenRequest, "requestId">) => void;
    consumeRequest: (requestId: string) => void;
}
declare global {
    interface Window {
        __zcodeModelTrajectoryStoreE2E?: typeof useModelTrajectoryStore;
    }
}
export declare const useModelTrajectoryStore: import("zustand").UseBoundStore<import("zustand").StoreApi<ModelTrajectoryStoreState>>;
export {};
//# sourceMappingURL=modelTrajectoryStore.d.ts.map