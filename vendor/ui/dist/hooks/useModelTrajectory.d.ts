import type { ZCodeModelTrajectory } from "@zcode/services";
export interface ModelTrajectoryState {
    loading: boolean;
    data: ZCodeModelTrajectory | null;
    error: string | null;
}
/**
 * 读取某个 task/session 的模型调用轨迹（model-io）。
 *
 * 路径解析与文件读取都收口在 zcodeTaskService.getModelTrajectory（host 侧），
 * 桌面读本机、手机远控读远端 host，UI 只消费结构化结果。
 */
export declare function useModelTrajectory(workspacePath: string, taskId: string | null, workspaceIdentity?: string): ModelTrajectoryState & {
    refresh: () => void;
};
//# sourceMappingURL=useModelTrajectory.d.ts.map