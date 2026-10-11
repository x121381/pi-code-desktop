/**
 * 工作流一族工具的**按名字**识别，三处原本各自一份同款匹配器的合并：
 * - 可复用工作流：`SaveWorkflow` / `ListSavedWorkflows`；
 * - 升级问答：`escalate` / `ResolveWorkflowQuestion`；
 * - 观察与恢复：`GetWorkflowRun` / `ListWorkflowRuns` / `EvalWorkflowSnippet` 与 `ResumeWorkflowRun`；
 * - 模型目录：`ListModels`。
 *
 * 为什么不走 `resolveToolCallIdentity`：这些工具名都不在 `packages/shared` 的
 * `ZCODE_KNOWN_TOOL_NAMES` 里，identity 对它们只会回 `unknown`，分流会掉进 raw JSON 兜底卡。
 *
 * 而且这些判定必须排在 family 分流**之前**：`workflow` family 的兜底分支是 CreateWorkflow
 * 卡（`resolveRenderer.ts`）与运行确认块（`PermissionDialog.tsx`），一旦有人把这些名字登记
 * 进 workflow family，保存与列举就会静默渲染成「创建工作流」——保存确认窗甚至会长出
 * 因果图与 Refine 选项。按名字先判定让登记前后两种世界都成立。
 */
interface WorkflowToolNameSource {
    toolName?: string | null;
    kind?: string | null;
    title?: string | null;
    raw?: unknown;
}
export declare function isSaveWorkflowToolCall(source: WorkflowToolNameSource): boolean;
export declare function isListSavedWorkflowsToolCall(source: WorkflowToolNameSource): boolean;
export declare function isEscalateToolCall(source: WorkflowToolNameSource): boolean;
export declare function isResolveWorkflowQuestionToolCall(source: WorkflowToolNameSource): boolean;
export declare function isGetWorkflowRunToolCall(source: WorkflowToolNameSource): boolean;
export declare function isListWorkflowRunsToolCall(source: WorkflowToolNameSource): boolean;
export declare function isEvalWorkflowSnippetToolCall(source: WorkflowToolNameSource): boolean;
export declare function isResumeWorkflowRunToolCall(source: WorkflowToolNameSource): boolean;
/**
 * 模型目录。同款按名判定：
 * `ListModels` 也不在已知工具表里，兜底卡会把那段以 providerId 开头的模型面文本原样摊开。
 */
export declare function isListModelsToolCall(source: WorkflowToolNameSource): boolean;
/**
 * 创建入口。渲染分流仍走 `workflow` family（它的兜底就是创建卡）；这个按名判定只给不经过分流的读者用：
 * 编译反馈的稿号联接要在行窗口里认出
 * 每一次创建，而 family 会把修订也算进来。
 */
export declare function isCreateWorkflowToolCall(source: WorkflowToolNameSource): boolean;
/**
 * 修订入口。它**已登记**进 workflow
 * family（确认窗按 family 选运行确认块），但工具行仍按名先判：同一个 create-workflow 渲染器换
 * 一套修订词汇，而不是让 family 兜底把它画成一张普通的「创建工作流」卡。
 */
export declare function isAmendWorkflowToolCall(source: WorkflowToolNameSource): boolean;
/**
 * 留白补全（docs/dynamic-workflow/launch.md「The `FillWorkflowHole` tool」）。与修订同一条路：已登记进
 * workflow family（确认窗按 family 选运行确认块），工具行由 create-workflow 渲染器换一套留白词汇
 * ——「正在补全留白 / 留白补全草稿 / 留白已补全」（docs/dynamic-workflow/presentation.md「The fill row」）。
 */
export declare function isFillWorkflowHoleToolCall(source: WorkflowToolNameSource): boolean;
export {};
//# sourceMappingURL=workflowToolNames.d.ts.map