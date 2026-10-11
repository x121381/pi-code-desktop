import type { ZCodeProvider } from "@zcode/shared";
/**
 * useWorkspaceActiveTaskState 的导出返回类型间接引用此接口，声明生成要求它可导出。
 * @lintignore
 */
export interface TaskNativeSessionLogFileState {
    provider: ZCodeProvider | null;
    path: string | null;
    exists: boolean;
    loading: boolean;
    error: string | null;
}
export declare function supportsTaskNativeSessionLogFile(_provider: ZCodeProvider | null | undefined): boolean;
/**
 * 读取当前 task 对应的原生会话日志路径。
 *
 * 路径规则统一通过 zcodeTaskService 解析，避免 UI 层猜 provider 自己的目录结构。
 */
export declare function useTaskNativeSessionLogFile(workspacePath: string, taskId: string | null, providerHint?: ZCodeProvider | null, workspaceIdentity?: string, options?: {
    enabled?: boolean;
}): TaskNativeSessionLogFileState;
//# sourceMappingURL=useTaskNativeSessionLogFile.d.ts.map