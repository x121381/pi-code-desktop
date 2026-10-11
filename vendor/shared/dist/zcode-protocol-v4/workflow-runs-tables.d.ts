import type { WorkflowRunPendingQuestion } from "./workflow-runs.js";
/** 一次有界 upsert 的结果。`truncated` = 这条记录**没能进表**（而不是「表里已有、原地更新」）。 */
export interface BoundedUpsert<T> {
    list: T[];
    truncated: boolean;
}
/**
 * 按 (siteId, ordinal) upsert 进有界列表（actors / nodes / reports 三张表的去重键都是它）。
 *
 * `admitNew: false` 把「不收新条目」这件事从界扩到别的理由（重放的事件、一条表外实例的中间
 * 相位；见归约里节点分支的 `born`），产出与触界被拒**逐字相同**——因为它说的是同一件事：
 * 这条实例不在表里。调用方据此照常计数。
 */
export declare function upsertBoundedByInstance<T extends {
    siteId: string;
    ordinal: number;
}>(list: readonly T[], entry: T, limit: number, options?: {
    admitNew?: boolean;
}): BoundedUpsert<T>;
/**
 * 按 `qid` upsert 进有界的停驻问题表。
 *
 * 与 {@link upsertBoundedByInstance} 是同一条触界语义（拒新、仍更新已有），只是键不同：升级没有
 * 站点实例身份，qid 才是它的键。没有把两者合并成一个泛型函数，是因为键的**取法**正是这里
 * 唯一要说的事——合并之后调用点要传一个取键函数，读者反而看不出"这张表按什么去重"。
 */
export declare function upsertBoundedByQid(list: readonly WorkflowRunPendingQuestion[], entry: WorkflowRunPendingQuestion, limit: number): BoundedUpsert<WorkflowRunPendingQuestion>;
//# sourceMappingURL=workflow-runs-tables.d.ts.map