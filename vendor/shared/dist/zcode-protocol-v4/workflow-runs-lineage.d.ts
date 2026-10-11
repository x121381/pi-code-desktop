import type { WorkflowRunState } from "./workflow-runs.js";
/** 载荷上的 run id 字段：非空字符串才算在场。 */
export declare function readRunIdField(value: unknown): string | undefined;
/** 载荷上的停止原因：白名单之外（老 CLI 不认识的新词、或损坏的载荷）读作缺席，而不是整帧被丢。 */
export declare function readWorkflowRunStopReason(value: unknown): WorkflowRunState["stopReason"];
//# sourceMappingURL=workflow-runs-lineage.d.ts.map