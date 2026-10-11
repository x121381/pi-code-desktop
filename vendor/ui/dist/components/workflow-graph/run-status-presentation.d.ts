import type { WorkflowRunState } from "@zcode/shared/zcode-protocol-v4";
import type { StepRunStatus } from "@/components/workflow-graph/types.js";
/**
 * 状态灯的全部形与色。消费方自带尺寸与
 * `rounded-full`；这里只给形状差异（脉冲 / 实点 / 晕圈 / 空环）与颜色。时间线的站灯、侧栏
 * 清单、run 目录、任务列表共用——一个特性只有一套「运行中」的画法。
 *
 * running 用 warning（活动色）而不是 primary：primary 跨主题反色（亮色下近黑），读作「强调」
 * 而非「在动」；活动色让给真正在动的东西（灯、行进虚线、转圈）。
 */
export declare const STATUS_DOT: Record<StepRunStatus, string>;
/**
 * 编译反馈行的空环灯。形状与「compiled」、
 * 待启动的站同为空环：什么都没跑。颜色只说注意力是否还悬着——`open` 是该谱系最新的一稿（循环还在、
 * 或模型停在这里），`settled` 是后面已有更新的一稿。绝不用 destructive：这个特性里红色只属于出错的 run。
 */
export declare const DRAFT_FEEDBACK_DOT: {
    readonly open: "border-[1.5px] border-warning bg-transparent";
    readonly settled: string;
};
/**
 * run **整体**状态的视觉词汇表（五值），从四值 `STATUS_DOT` 派生
 * （终态 = completed / errored / stopped）。
 * `stopped` 走中性色而不是 destructive：停下（用户取消、进程亡故、模型侧错误）是可恢复的
 * 状态，不是脚本故障；只有 `errored` 才是 destructive。
 */
export declare const RUN_STATUS_DOT: Record<WorkflowRunState["status"], string>;
/** 状态词的语义色。与状态点同一套判断，只是换成文字通道（状态永远有词，不只靠颜色）。 */
export declare const RUN_STATUS_TEXT: Record<WorkflowRunState["status"], string>;
/**
 * `stopped` 的原因词（复用取消态的呈现 + 一行原因）。读侧对象可能是投影 run、发现查询摘要或工具卡 display——三者的 schema 由不同的
 * 协议层各自演进，所以这里按结构读一个可选键，而不是绑死某一个类型。
 */
export declare const WORKFLOW_RUN_STOP_REASONS: readonly ["user", "model", "provider", "interrupted", "superseded"];
export type WorkflowRunStopReason = (typeof WORKFLOW_RUN_STOP_REASONS)[number];
export declare function readWorkflowRunStopReason(run: {
    status?: string;
    stopReason?: unknown;
}): WorkflowRunStopReason | undefined;
/** 原因词的 i18n key（`chat.toolCall.workflow.run.stopReason.*`）。 */
export declare function workflowRunStopReasonMessageId(reason: WorkflowRunStopReason): string;
/** run 是否被一次修订停下并替代：卡与详情页据此换种类词、藏 Resume 位、画指向后继的链接。 */
export declare function isWorkflowRunSuperseded(run: {
    status?: string;
    stopReason?: unknown;
}): boolean;
//# sourceMappingURL=run-status-presentation.d.ts.map