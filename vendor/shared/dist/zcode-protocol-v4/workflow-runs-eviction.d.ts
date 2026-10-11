import { type WorkflowRunActor, type WorkflowRunNode, type WorkflowRunState } from "./workflow-runs.js";
/**
 * 归约要用到的三条条目界。本包的默认值就是 {@link WORKFLOW_RUNS_LIMITS}；单独定义成接口是为了
 * 让测试能注入小界——1024 条要三千多条事件才撞得到，而这里的规则与界的**大小**无关。
 */
export interface WorkflowRunEntryLimits {
    readonly maxActors: number;
    readonly maxNodes: number;
    readonly maxPhases: number;
}
interface InstanceRef {
    siteId: string;
    ordinal: number;
}
/** 一条节点事件的入座结果。 */
export interface WorkflowNodeSeating {
    /** 腾过位（可能已淘汰若干条目）、并且 actor 已就位的 run。 */
    run: WorkflowRunState;
    /** 这条实例可以进节点表吗（false = 照旧拒新，调用方按被拒计数）。 */
    admitNew: boolean;
    /** 这一次把一条**表外**实例放回了节点表（调用方据此把 nodesUnlisted 减 1）。 */
    activated: boolean;
}
/**
 * 这条事件可以往表里放一个**新键**吗——以及同理，可以给 `nodesUsed` 加一步吗。
 *
 * **只有溢出过的 run（`truncated`）才收紧**，`live` 传的是那条收紧后的条件（抬过水位的出生
 * 事件，或下面的 activation）。界之下一律放行，与腾位改造之前逐字相同。
 *
 * 为什么收紧：腾位是第一件让表**变短**的事，于是一个空出来的位子可能把一条早已计进
 * `nodesUnlisted` 的实例放回来（重放的事件，或者 `queued` 被拒之后才到的中间相位），那条实例
 * 就既列又计，总数说假话。
 *
 * 为什么不把它推广到所有 run：归约**照常施加**水位之下的事件（它只是不肯把水位拉回去），而
 * CLI 的冷物化把 journal 重放与在线事件喂进同一个归约。真要是在线事件先给一条 run 开了头，
 * 它整段 journal 前缀就全在水位之下——无差别收紧会让那条 run 的卡片空着。这两处窟窿都以
 * 「此前发生过拒绝或淘汰」为前提，也就是 `truncated`，所以按它收口不动界下的任何一条路径。
 */
export declare function admitsNewEntry(run: WorkflowRunState, live: boolean): boolean;
/**
 * actor 表满时给一个**活的新人**腾位：淘汰一个已完成组。表没满、新人其实已在表里、或者一个
 * 已完成组都没有时，原样返回（调用方随后照旧 upsert，触界仍然是拒新）。
 *
 * 出生只挤得动**已完成**的：一个还排着队的新人凭什么把另一个还排着队的挤掉——两个都没开工，
 * 换谁上表都是同一条没有信息量的记录。空闲组只在 activation（真的开工了）面前让位。
 */
export declare function withRoomForActor(run: WorkflowRunState, ref: InstanceRef, limits?: WorkflowRunEntryLimits): WorkflowRunState;
/**
 * 一条节点事件的入座：腾位、B2 的拒绝、以及带出生事实的派发（activation）三件事的唯一入口。
 *
 * 归约主文件因此只需要把事件原样交过来，不必自己判「这条该不该入座」——那条判据有三支，
 * 每一支都有一个只在溢出之后才存在的理由。
 */
export declare function seatWorkflowNode(run: WorkflowRunState, seat: {
    eventType: string;
    ref: InstanceRef;
    actorRef: InstanceRef | null;
    /** 带出生事实的 `node-dispatched` 才有：按那份事实铸好的 actor 条目。 */
    actor: WorkflowRunActor | null;
    /** 这条事件是这个实例的出生事件（`node-queued`，或缓存命中的 `node-settled`）。 */
    born: boolean;
    advancesWaterMark: boolean;
}, limits?: WorkflowRunEntryLimits): WorkflowNodeSeating;
/**
 * 一个**被拒的** `actor-created`：run 级没有 actor 计数器，它唯一的痕迹就是自己那一格。
 * 这一格随后可加可减——它说的是「此刻不在表上的子代理数」，不是历史累计。
 */
export declare function absorbRefusedActor(run: WorkflowRunState, phaseName: string | undefined, limits?: WorkflowRunEntryLimits): WorkflowRunState;
/**
 * 一条**出生即结算**的节点被拒之表外（缓存命中的 `node-settled`，它自己就是出生事件）：
 * 记进它出生阶段那一格，并按孤儿规则把它那个一条已列节点都没有的 actor 一起摘掉。
 *
 * actor 本来就不在表上时**只**记节点那一格：那个子代理早已作为 `actors` 计在**它自己**的出生
 * 阶段上，而节点的阶段戳未必是同一个；何况一个有两次缓存命中的子代理会因此被记两次「已结束」。
 * 记不准的归属不如不记——它仍然是个未列出的子代理，读面把它算作 pending，直到它重新上表。
 * run 级两个计数器不在这里加——那是 `countUnlistedInstance` 的活，两处加会翻倍。
 */
export declare function absorbRefusedSettledNode(run: WorkflowRunState, node: WorkflowRunNode, limits?: WorkflowRunEntryLimits): WorkflowRunState;
/**
 * 新一世的两张表。**溢出过的 run 从空表重开**：重臂会把整段脚本前缀再发一遍，而只有空表才能
 * 让每条实例在这一世要么被列、要么被计，恰好一次。留着一张缺过条目的表则两头都算——前缀里
 * 那条被淘汰的实例先进了 `nodesUnlisted`，重发时又落回表里。
 *
 * 没溢出过的 run 原样保留（连引用都不换）：普通 resume 的历史不该被抹掉。
 */
export declare function workflowRunTablesForNewLife(run: WorkflowRunState): {
    actors: WorkflowRunActor[];
    nodes: WorkflowRunNode[];
};
export {};
//# sourceMappingURL=workflow-runs-eviction.d.ts.map