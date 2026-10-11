import { type CommandAck } from "@zcode/shared/zcode-protocol-v4";
export type WorkflowRunAction = "cancel" | "resume";
export interface WorkflowRunActionRejection {
    action: WorkflowRunAction;
    /** 词表内的 reason，或 `unsupported`（能力缺席）/ `generic`（词表外，文案带 code）。 */
    reason: string;
    /** 原始 reasonCode（缺席时是 ack.status），通用文案里展示，日志里也是它。 */
    code: string;
    /** ACK 携带的人可读细节（compile_failed 的有界诊断）。 */
    message?: string;
}
/** accepted / noop 不是拒绝 → undefined；其余按词表归一。 */
export declare function describeWorkflowRunActionRejection(action: WorkflowRunAction, ack: Pick<CommandAck, "status" | "reasonCode" | "message">): WorkflowRunActionRejection | undefined;
/** 文案 key：`chat.toolCall.workflow.run.rejection.<action>.<reason>`，两张词表 + unsupported + generic 全在 locale 里。 */
export declare function workflowRunActionRejectionMessageId(rejection: WorkflowRunActionRejection): string;
//# sourceMappingURL=workflowRunActionRejection.d.ts.map