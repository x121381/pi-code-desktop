/**
 * 订阅“打开模型调用轨迹”请求并交给当前 workspace 的侧边栏控制器。
 *
 * 触发入口在任务右键菜单 / Header 菜单深处，通过单例 store 发起请求；这里按 workspaceKey
 * 匹配后调用 onOpen 打开侧边栏 tab，再消费请求，避免多 workspace 实例串开。
 */
export declare function useModelTrajectoryOpenBridge(ownWorkspaceKey: string, onOpen: (params: {
    taskId: string;
    title?: string | null;
}) => void): void;
//# sourceMappingURL=useModelTrajectoryOpenBridge.d.ts.map