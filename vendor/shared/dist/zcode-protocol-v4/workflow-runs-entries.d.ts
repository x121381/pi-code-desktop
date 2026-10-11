import { type WorkflowRunActor } from "./workflow-runs.js";
/**
 * 一个 actor 条目的铸造。两处调用必须**逐字同形**：`actor-created`，以及带出生事实的
 * `node-dispatched`（workflow-runs-eviction.ts 的 activation）——同一个子代理按到达路径长出
 * 两种条目，就是两条会在冷回放里对不上的记录。
 *
 * `status` 落的是占位值：紧接着的 `withDerivedWorkflowActorStatuses` 会按节点与 run 终态重算。
 */
export declare function workflowActorEntry(ref: {
    siteId: string;
    ordinal: number;
}, name: unknown, phaseName: string | undefined, sessionId: string | undefined, model: unknown): WorkflowRunActor;
/** 子代理展示名的线上界（见文件头那次订阅失效）。 */
export declare function boundedActorName(name: string | undefined): string | undefined;
/**
 * 实例出生阶段名的线上界（docs/dynamic-workflow/presentation.md）。与 {@link boundedActorName}
 * 同族、同理由，但**直接截断、不加省略号**——这个字段不是给人读的文本而是一个关联键，
 * UI 的 `phaseNameMatches` 正是按前缀把截断的名字关联回 display 阶段。
 */
export declare function boundedPhaseName(name: string | undefined): string | undefined;
/**
 * 会话 id 的线上读法：界内的非空串原样收下，其余一律当缺席。**不截断**——与子代理模型串同理，
 * 一个被砍短的 id 指向的是另一条会话，宁可不认。
 */
export declare function boundedSessionId(value: unknown): string | undefined;
/** 空串按缺席处理：协议线上只有「键在场」与「键缺席」两态。 */
export declare function nonEmptyString(value: unknown): string | undefined;
/** 引擎的 `InstanceRef` / `ActorRef` 同构：站点 id × 序号。缺任一即无法定位，返回 null。 */
export declare function workflowInstanceRef(value: unknown): {
    siteId: string;
    ordinal: number;
} | null;
//# sourceMappingURL=workflow-runs-entries.d.ts.map