import type { WorkflowRunState, WorkflowRunUnlistedPhase } from "./workflow-runs.js";
/** 往一格上加的增量。`actors` 可以是负数（子代理回表），其余只会是正数。 */
export interface WorkflowRunUnlistedDelta {
    actors?: number;
    actorsSettled?: number;
    actorsFailed?: number;
    settled?: number;
}
/**
 * 往某个出生阶段那一格上加数。
 *
 * **格子表满了就丢归属**（返回原表）：一个站点可以少一个它本来就没有的数字，run 级计数不可以
 * 说假话——后者由调用方照加不误。表长比 `maxPhases` 多一格：多出来的那格是「无阶段」，它与
 * 具名阶段共用同一张表。
 *
 * 返回 `undefined` 恒等于「一格都没有」（键缺席），所以减到全零的最后一格会把整张表收掉。
 */
export declare function addToUnlistedBucket(buckets: readonly WorkflowRunUnlistedPhase[] | undefined, phaseName: string | undefined, delta: WorkflowRunUnlistedDelta, maxPhases: number): WorkflowRunUnlistedPhase[] | undefined;
/**
 * 把一张格子表落回 run 上：**空表摘键**（而不是留一个空数组）。
 *
 * 「零条 ⇒ 键缺席」是这个字段的协议约定（见 schema 注释），也是幂等的支点：一次什么都没改的
 * 归约要得到逐字节相同的 run 对象，顶层的结构比对才会返回 null。
 */
export declare function withUnlistedBuckets(run: WorkflowRunState, buckets: readonly WorkflowRunUnlistedPhase[] | undefined): WorkflowRunState;
//# sourceMappingURL=workflow-runs-unlisted.d.ts.map