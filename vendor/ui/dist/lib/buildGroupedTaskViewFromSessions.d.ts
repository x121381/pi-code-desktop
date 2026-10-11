import type { ZCodeGroupedTaskView, ZCodeGroupedTaskViewStructure } from "@zcode/services";
import type { ZCodeTaskMeta } from "@zcode/shared";
export interface BuildGroupedTaskViewParams {
    structure: ZCodeGroupedTaskViewStructure;
    /** tasks-index active/pinned/archived 三个持久分区的 task 行并集。 */
    taskIndexItems: ZCodeTaskMeta[];
    /** sessions-index 派生的会话 activity/detail，只 enrich 命中的持久行。 */
    sessions: ZCodeTaskMeta[];
    /** 服务端权威 pin/archive id 集（grouped 视图口径 = 非 pinned 非 archived）。 */
    pinnedIds: ReadonlySet<string>;
    archivedIds: ReadonlySet<string>;
    /** tasks-index 持久删除 tombstone；优先于所有 task row/session detail。 */
    deletedIds?: ReadonlySet<string>;
}
/** 客户端 join：分组结构 + task rows + session details → 与旧 listGroupedTaskView 同形的视图。 */
export declare function buildGroupedTaskViewFromSessions(params: BuildGroupedTaskViewParams): ZCodeGroupedTaskView;
//# sourceMappingURL=buildGroupedTaskViewFromSessions.d.ts.map