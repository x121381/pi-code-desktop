import type { ZCodeTaskMeta } from "@zcode/shared";
import type { SessionSummary } from "@zcode/shared/zcode-protocol-v4";
import { type TaskListMetaWithActivity } from "@/v4/taskListRowActivity.js";
export interface MapSessionSummaryOptions {
    workspacePath: string;
    workspaceIdentity?: string;
    /** 本地已有 meta（保留手动标题/provider 等旧值，避免被列表刷新冲掉）。 */
    previous?: ZCodeTaskMeta;
}
/**
 * SessionSummary → 实时 detail ZCodeTaskMeta。sessions-index 不携带的字段
 * （traceId/mode/provider）取合理默认或沿用 previous；真实持久字段以 join 时的 task 行为准。
 */
export declare function mapSessionSummaryToTaskMeta(summary: SessionSummary, options: MapSessionSummaryOptions): TaskListMetaWithActivity;
//# sourceMappingURL=mapSessionSummaryToTaskMeta.d.ts.map