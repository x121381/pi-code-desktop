import { z } from "zod";
export declare const savedWorkflowStartRejectionReasonSchema: z.ZodEnum<{
    not_found: "not_found";
    invalid_name: "invalid_name";
    compile_failed: "compile_failed";
    start_failed: "start_failed";
    invalid_args: "invalid_args";
    session_busy: "session_busy";
}>;
export type SavedWorkflowStartRejectionReason = z.infer<typeof savedWorkflowStartRejectionReasonSchema>;
export declare const SAVED_WORKFLOW_START_REJECTED_FAULT_PREFIX: "fault.command.savedWorkflowStartRejected.";
export declare const WORKFLOW_RUN_RESUME_REJECTED_FAULT_PREFIX: "fault.command.workflowRunResumeRejected.";
//# sourceMappingURL=workflow-command-rejections.d.ts.map