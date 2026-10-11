import type { ZCodeSavedWorkflowRun, ZCodeSavedWorkflowRunStatus } from "@zcode/shared";
/** 每个名字下 `updatedAt` 最新的一行（服务端按 time_updated 倒序，这里只取首见）。 */
export declare function lastRunByWorkflowName(runs: readonly ZCodeSavedWorkflowRun[]): Map<string, ZCodeSavedWorkflowRun>;
type SavedWorkflowRunBadgeKind = "completed" | "errored" | "running" | "stopped" | "never";
/**
 * 卡片「上次运行」徽标的四态 + 「尚未运行」。pending 与 running 同画成活动态。
 * 终态词汇为 errored / stopped；老 CLI 仍可能发
 * `failed` / `cancelled`，按同一语义折进去而不是让徽标缺席。
 */
export declare function savedWorkflowRunBadgeKind(status: ZCodeSavedWorkflowRunStatus | "errored" | "stopped" | "failed" | "cancelled" | undefined): SavedWorkflowRunBadgeKind;
/** 运行历史行的实参芯片：`key=value`，值按 JSON 压缩。 */
export declare function formatSavedWorkflowRunArgs(args: Record<string, unknown> | undefined): string[];
/** 一次 run 的时长（毫秒）；非终态按 now 计。 */
export declare function savedWorkflowRunDurationMs(run: ZCodeSavedWorkflowRun, now: number): number;
export declare function formatSavedWorkflowTokens(spent: number): string;
export {};
//# sourceMappingURL=savedWorkflowRunHistory.d.ts.map