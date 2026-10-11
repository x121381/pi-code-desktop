import { type SavedWorkflowStartRejectionReason } from "@zcode/shared/zcode-protocol-v4";
import { type WorkspaceConnectionAgentService } from "@/v4/workspaceConnectionRegistry.js";
/** 目标项目坐标（工作流所属项目，绝不取活动项目；不变式 7）；remoteSessionId 决定连接 endpoint。 */
export interface SavedWorkflowLaunchTarget {
    workspacePath: string;
    workspaceIdentity?: string;
    remoteSessionId?: string;
}
/** 启动请求：name 由解析结果保证（不变式 6），scope 定向查找，args 已由实参窗收齐。 */
interface SavedWorkflowLaunchRequest {
    name: string;
    scope: "project" | "global";
    args: Record<string, unknown>;
}
/** 错误原因 = 拒绝词表 ∪ 能力缺席 ∪ 兜底；直接映射 i18n key `workflows.hub.launch.error.<reason>`。 */
export type SavedWorkflowLaunchErrorReason = SavedWorkflowStartRejectionReason | "unsupported" | "generic";
export interface SavedWorkflowLaunchError {
    reason: SavedWorkflowLaunchErrorReason;
    /** 原始 fault code / ACK 状态；仅用于日志与排障，不直接展示。 */
    code: string;
    /** 服务端人可读原因（编译诊断合并后已有界截断）；有则在行内 mono 块展示。 */
    message?: string;
}
type SavedWorkflowLaunchResult = {
    ok: true;
    sessionId: string;
    runId: string;
    toolCallId: string;
} | {
    ok: false;
    error: SavedWorkflowLaunchError;
};
interface UseSavedWorkflowLauncherResult {
    launch: (target: SavedWorkflowLaunchTarget, request: SavedWorkflowLaunchRequest) => Promise<SavedWorkflowLaunchResult>;
    /** 正在启动：实参窗主按钮 loading + 禁用，防重复点击。 */
    pending: boolean;
    /** 最近一次启动失败（成功 / 新启动前清空）。 */
    error: SavedWorkflowLaunchError | null;
    clearError: () => void;
}
/** createSession 的 workspaceId 与 conversation 连接口径一致：identity 优先，否则路径。 */
export declare function launchWorkspaceId(target: SavedWorkflowLaunchTarget): string;
/**
 * 按目标项目取连接租约（remoteSessionId 决定 endpoint）。直接启动器与「提升为全局」
 * （useSavedWorkflowPromote）共用：两者都在目标项目里建会话，只是首条命令不同。
 */
export declare function acquireLaunchLease(target: SavedWorkflowLaunchTarget, agentService: WorkspaceConnectionAgentService): import("@/v4/workspaceConnectionRegistry.js").WorkspaceConnectionLease;
/**
 * 中枢启动器 hook。载体 `agentService` 由调用组解析（项目组 = 目标项目的解析 service；
 * 全局组 = 本机 base service，目标 = 「运行于」选中的本地项目）。`onNavigate` 在 accepted
 * 后切到新会话（`handleSelectTaskInChat` 镜像，含 `showChatMainView`）。
 */
export declare function useSavedWorkflowLauncher(params: {
    agentService: WorkspaceConnectionAgentService;
    onNavigate?: (target: SavedWorkflowLaunchTarget, sessionId: string) => void;
}): UseSavedWorkflowLauncherResult;
export {};
//# sourceMappingURL=useSavedWorkflowLauncher.d.ts.map