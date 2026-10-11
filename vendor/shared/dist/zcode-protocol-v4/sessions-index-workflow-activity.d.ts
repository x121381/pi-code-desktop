import { z } from "zod";
import type { BackgroundWorkSummary } from "./snapshot.js";
import { type WorkflowRunState, type WorkflowRunsState } from "./workflow-runs.js";
/** 每会话最多下发的 run 数：在跑的按启动序在前，其后是最近结束的。 */
export declare const SESSION_WORKFLOW_ACTIVITY_MAX_RUNS = 4;
/**
 * 站点灯的四态，与卡片时间线同一词汇（`STATUS_DOT`）。控制流给出骨架：在跑时当前 phase
 * running、已进入 done、其余 pending；completed 已进入 done；errored 当前 failed；stopped 当前 pending。
 *
 * 成员节点再补一条：run 在跑时，
 * **出生在这一站**且此刻真在跑的节点把它点亮。并行阶段因此能同时烧——控制流只记得最后一个标记，
 * 而 A 的子代理在 B 的标记之后仍在干活。节点只会说「还在跑」，绝不把 done / failed / pending
 * 改成别的：失败词留给控制流。
 */
export declare const sessionWorkflowPhaseStatusSchema: z.ZodEnum<{
    pending: "pending";
    running: "running";
    failed: "failed";
    done: "done";
}>;
export type SessionWorkflowPhaseStatus = z.infer<typeof sessionWorkflowPhaseStatusSchema>;
export declare const sessionWorkflowPhaseSummarySchema: z.ZodObject<{
    name: z.ZodString;
    status: z.ZodEnum<{
        pending: "pending";
        running: "running";
        failed: "failed";
        done: "done";
    }>;
    alongside: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    hole: z.ZodOptional<z.ZodEnum<{
        waiting: "waiting";
        open: "open";
    }>>;
}, z.core.$strip>;
export type SessionWorkflowPhaseSummary = z.infer<typeof sessionWorkflowPhaseSummarySchema>;
export declare const sessionWorkflowRunSummarySchema: z.ZodObject<{
    runId: z.ZodString;
    toolCallId: z.ZodOptional<z.ZodString>;
    name: z.ZodOptional<z.ZodString>;
    status: z.ZodEnum<{
        pending: "pending";
        running: "running";
        completed: "completed";
        stopped: "stopped";
        errored: "errored";
    }>;
    stopReason: z.ZodOptional<z.ZodEnum<{
        interrupted: "interrupted";
        model: "model";
        user: "user";
        provider: "provider";
        superseded: "superseded";
    }>>;
    startedAt: z.ZodOptional<z.ZodNumber>;
    phases: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        status: z.ZodEnum<{
            pending: "pending";
            running: "running";
            failed: "failed";
            done: "done";
        }>;
        alongside: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
        hole: z.ZodOptional<z.ZodEnum<{
            waiting: "waiting";
            open: "open";
        }>>;
    }, z.core.$strip>>;
    currentPhase: z.ZodOptional<z.ZodString>;
    agentsWorking: z.ZodNumber;
    waitingHole: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type SessionWorkflowRunSummary = z.infer<typeof sessionWorkflowRunSummarySchema>;
export declare const sessionWorkflowActivitySchema: z.ZodObject<{
    runs: z.ZodArray<z.ZodObject<{
        runId: z.ZodString;
        toolCallId: z.ZodOptional<z.ZodString>;
        name: z.ZodOptional<z.ZodString>;
        status: z.ZodEnum<{
            pending: "pending";
            running: "running";
            completed: "completed";
            stopped: "stopped";
            errored: "errored";
        }>;
        stopReason: z.ZodOptional<z.ZodEnum<{
            interrupted: "interrupted";
            model: "model";
            user: "user";
            provider: "provider";
            superseded: "superseded";
        }>>;
        startedAt: z.ZodOptional<z.ZodNumber>;
        phases: z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            status: z.ZodEnum<{
                pending: "pending";
                running: "running";
                failed: "failed";
                done: "done";
            }>;
            alongside: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
            hole: z.ZodOptional<z.ZodEnum<{
                waiting: "waiting";
                open: "open";
            }>>;
        }, z.core.$strip>>;
        currentPhase: z.ZodOptional<z.ZodString>;
        agentsWorking: z.ZodNumber;
        waitingHole: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type SessionWorkflowActivity = z.infer<typeof sessionWorkflowActivitySchema>;
export declare function isSessionWorkflowRunLive(status: SessionWorkflowRunSummary["status"]): boolean;
/**
 * 站点表的唯一推导。侧栏运行行（经 `summarizeRun`）与任务岛的 run 行都读它，所以两处的灯
 * 永远对同一件事说同一句话；任务岛不另写第二套。
 */
export declare function deriveSessionWorkflowPhases(run: WorkflowRunState): SessionWorkflowPhaseSummary[];
/**
 * 从同一 snapshot 的 `workflowRuns` + `backgroundWorks` 派生会话的工作流运行摘要。
 * 在跑的 run（pending / running）按 `runs[]` 序（= 启动序）在前；其后是已结束的，按后台工作的
 * `endedAt` 倒序、无 endedAt 时按 `runs[]` 倒序（越晚建的越新）。总数裁到 4。
 * 会话一个 run 都没有 → `undefined`（键整个缺席，旧 CLI 因此什么都不变）。
 */
export declare function deriveSessionWorkflowActivity(input: {
    workflowRuns: WorkflowRunsState | undefined;
    backgroundWorks: readonly BackgroundWorkSummary[];
}): SessionWorkflowActivity | undefined;
//# sourceMappingURL=sessions-index-workflow-activity.d.ts.map