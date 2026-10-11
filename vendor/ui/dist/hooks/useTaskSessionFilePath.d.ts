/**
 * useWorkspaceActiveTaskState 的导出返回类型间接引用此接口，声明生成要求它可导出。
 * @lintignore
 */
export interface TaskSessionFilePathState {
    path: string | null;
    exists: boolean;
    loading: boolean;
    error: string | null;
}
/**
 * 读取当前 task 对应的持久化快照文件路径。
 *
 * UI 之前直接在浏览器里访问 crypto.subtle 计算 workspace hash，
 * 在 http 预览或远程访问这类非安全上下文里 subtle 可能不存在，副作用阶段会直接抛错。
 * 这里改成统一走 zcodeTaskService 解析最终路径，既不让 UI 猜目录规则，也能兼容 remote workspace 的远端 home 目录。
 */
export declare function useTaskSessionFilePath(workspacePath: string, taskId: string | null, workspaceIdentity?: string, options?: {
    enabled?: boolean;
}): TaskSessionFilePathState;
//# sourceMappingURL=useTaskSessionFilePath.d.ts.map