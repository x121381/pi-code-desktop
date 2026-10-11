import type { WorkflowRunActor } from "./workflow-runs.js";
interface ActorRef {
    siteId: string;
    ordinal: number;
}
/**
 * 一条节点事件之后，它点名的子代理的 actor 表（没变即原引用）。
 *
 * 只有两种 ask 事件说「这个子代理的转录在哪条会话里」：
 *   - **缓存命中的结算**：载荷带 `sourceSessionId` 即答案读自前驱的那条会话（导入命中，或修订
 *     run resume 时对一条导入行的重放）；不带即答案在本 run 里产生过，信封上的 `actorSessionId`
 *     （本 run 的会话）就是它；
 *   - **派发**：子代理开始 live 跑，本 run 的会话此刻已经建好——导入过前缀的已经播了种。
 *
 * 最后一条说了算。同一个子代理的 ask 按序结算，而导入分歧是单调的：导入命中在前、指向前驱的
 * 会话；从第一次 live 派发起，本 run 的会话持有全部，抄进来的前缀也在里面。其余事件、没有
 * actor ref 的事件（world-read）、两个 id 都读不出的老载荷、以及不在表上的子代理：一律不动。
 */
export declare function actorsWithTranscriptSession(actors: WorkflowRunActor[], eventType: string, payload: Record<string, unknown>, actorRef: ActorRef | null, envelopeSessionId: string | undefined): WorkflowRunActor[];
export {};
//# sourceMappingURL=workflow-runs-actor-session.d.ts.map