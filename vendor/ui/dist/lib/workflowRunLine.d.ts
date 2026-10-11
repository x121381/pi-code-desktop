import type { SessionWorkflowActivity, SessionWorkflowPhaseSummary, SessionWorkflowRunSummary } from "@zcode/shared/zcode-protocol-v4";
/** 一个会话最多画的运行行数；其余折成「+n」。 */
export declare const WORKFLOW_RUN_LINE_MAX_LINES = 2;
export interface WorkflowRunRailStation {
    name: string;
    status: SessionWorkflowPhaseSummary["status"];
    /** 进入本站的那一段轨道是否已被控制流走过（强色段）。 */
    reached: boolean;
    /**
     * 进入本站的那一段是**双线段**：本站与前一站同属一条带、却在不同轨道上，控制流没有从那站
     * 走到这站——两者是并行的。
     * 标志挂在**站**上而不是段上，所以它能活过下面的窗口折叠。
     */
    twin?: true;
    /** 这一站是还开着的留白：虚线 6px 灯，等待时警示色（docs/dynamic-workflow/presentation.md「Holes on the timeline」）。 */
    hole?: "open" | "waiting";
}
export interface WorkflowRunRail {
    stations: WorkflowRunRailStation[];
    /** 被折叠掉、不画的站点数（「+n」尾）；0 时不画尾。 */
    hidden: number;
    /** 脚本没有阶段词汇表：画一个隐含站点「Workflow」。 */
    implicit: boolean;
}
/**
 * 迷你轨道的折叠：≤ 6 站全画；更多时以运行站为中心（没有运行站就取最后一个到过的站，再没有就取首站）
 * 保留 ±2 共 5 站，其余合成「+n」尾。这是**固定窗口**而不是滚动：侧栏没有横向手势。
 */
export declare function foldWorkflowRunRail(phases: readonly SessionWorkflowPhaseSummary[]): WorkflowRunRail;
/** 并行阶段之间的连接词：同时在跑的几站并排，而不是排队。 */
export declare const WORKFLOW_RUN_PARALLEL_SEPARATOR = " \u2225 ";
/**
 * 同时在跑的站名，连成 tooltip 里的一段。并行时「当前阶段」不再是一个站——谁都不比谁更当前，
 * 所以那一段换成全部在跑的站名。
 *
 * 只有一个（或零个）站在跑时返回 `undefined`：调用方退回 `currentPhase`，文案一字不变。
 */
export declare function workflowRunParallelPhaseLabel(phases: readonly SessionWorkflowPhaseSummary[]): string | undefined;
interface WorkflowRunLineSelection {
    lines: SessionWorkflowRunSummary[];
    /** 没画出来的行数（「+n」词）。 */
    overflow: number;
}
/**
 * 选出要画的行：在跑的永远画；已结束的只在**未确认**时画（确认 = 会话被打开过）。
 * 输入顺序已由投影排好（在跑的按启动序在前，其后最近结束的），这里只过滤与截断。
 */
export declare function selectWorkflowRunLines(activity: SessionWorkflowActivity | undefined, isAcknowledged: (runId: string) => boolean): WorkflowRunLineSelection;
/** 已结束（可被确认）的 run id：打开会话时整批确认。 */
export declare function settledWorkflowRunIds(activity: SessionWorkflowActivity | undefined): string[];
/** 在跑的 run 数（收起的项目组头旁的脉冲灯与数量）。 */
export declare function countLiveWorkflowRuns(activity: SessionWorkflowActivity | undefined): number;
export {};
//# sourceMappingURL=workflowRunLine.d.ts.map