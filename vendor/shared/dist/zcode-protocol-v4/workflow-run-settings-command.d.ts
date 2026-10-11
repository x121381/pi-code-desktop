import { z } from "zod";
/**
 * 命令载荷。两项设置守工具的同一条三态规则：省略 = 沿用，`null` = 回到默认（会话模型 / 默认并发），
 * 值 = 设定。GUI 只发用户改过的那几项。刻意不携 baseRevision：与 cancelBackgroundWork /
 * resumeWorkflowRun 同类（workflowRuns 面免 revision）。
 */
export declare const amendWorkflowRunSettingsPayloadSchema: z.ZodObject<{
    workId: z.ZodString;
    subagentModel: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    maxConcurrency: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
}, z.core.$strip>;
export type AmendWorkflowRunSettingsPayload = z.infer<typeof amendWorkflowRunSettingsPayloadSchema>;
/**
 * accepted ACK 的结果。`runId` / `toolCallId` 指**新** run（toolCallId = `settings-<uuid>`，
 * 联接设置轮的 run 卡与详情页）；`supersededRunId` 只在旧 run 仍在飞、被这次调整停下时在场。
 */
export declare const amendWorkflowRunSettingsResultSchema: z.ZodObject<{
    type: z.ZodLiteral<"amendWorkflowRunSettings">;
    runId: z.ZodString;
    toolCallId: z.ZodString;
    supersededRunId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
/**
 * 拒绝词表。所有拒绝都发生在停下或新建任何东西之前：
 * not_found / not_configurable / unchanged / script_missing / model_unavailable / compile_failed
 * 是命令自己的检查，missing_boundaries 是端口预检，start_failed 是端口缺席或抛错。
 */
export declare const workflowRunSettingsRejectionReasonSchema: z.ZodEnum<{
    not_found: "not_found";
    unchanged: "unchanged";
    script_missing: "script_missing";
    compile_failed: "compile_failed";
    not_configurable: "not_configurable";
    model_unavailable: "model_unavailable";
    missing_boundaries: "missing_boundaries";
    start_failed: "start_failed";
}>;
export type WorkflowRunSettingsRejectionReason = z.infer<typeof workflowRunSettingsRejectionReasonSchema>;
/** 完整 fault code = 前缀 + reason；与 workflowRunResumeRejected 同族。 */
export declare const WORKFLOW_RUN_SETTINGS_REJECTED_FAULT_PREFIX: "fault.command.workflowRunSettingsRejected.";
//# sourceMappingURL=workflow-run-settings-command.d.ts.map