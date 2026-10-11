import { type WorkflowRunNode, type WorkflowRunState } from "./workflow-runs.js";
/** 一次 ask 的任务与进度读数，即本模块负责的那四个键。 */
type NodeProgressFields = Pick<WorkflowRunNode, "instructionsHead" | "turn" | "toolCalls" | "lastTool">;
/**
 * 生命周期事件（`node-queued` … `node-settled`）上这四个键的取值。
 *
 * 三个计数只向前携带（由 {@link reduceNodeProgress} 写入），**两条出生事件上清空**——见文件头
 * 第 2 条。`instructionsHead` 只在 `node-queued` 的载荷上到达（那一刻的 instructions 是作者原文，
 * 引擎的尾注由 driver 稍后追加），其余事件向前携带。
 *
 * 任务摘要与三个计数在缓存命中的结算上**刻意不同步**：完结缓存按输入哈希命中，所以那条 ask 的
 * 指令与上一世逐字相同，继承摘要说的是同一件事；而计数描述的是一次**这一世没有发生**的执行。
 * 重新 queue 则连摘要也只认新载荷：那是一条可能被修订过的新指令。
 */
export declare function carryNodeProgress(eventType: string, payload: Record<string, unknown>, previousNode: WorkflowRunNode | undefined): Partial<NodeProgressFields>;
/**
 * `node-progress` 的归约：一个已解析轮次的读数落到**已在表里**的那个节点上。
 *
 * **只动这三个键**——不改相位、不计步、不动 actor 状态：一个轮次解析完不是生命周期跃迁，
 * 相位仍由 `node-executing` / `node-waiting` 那几条事件说了算。表里没有的实例（触界被拒，
 * 或进度早于它的 `node-queued`）整条忽略、不建条目，与其他节点事件对未知实例同族。
 *
 * 读不出的单个字段**保持已知值**而不是擦掉：一条只报 toolCalls 的事件不该让轮次数消失。
 * 写入是**后来者覆盖**而不是取 max（与 `phases[].rounds` 相反），理由见文件头第 2 条。
 */
export declare function reduceNodeProgress(run: WorkflowRunState, ref: {
    siteId: string;
    ordinal: number;
}, payload: Record<string, unknown>): WorkflowRunState;
export {};
//# sourceMappingURL=workflow-runs-node-progress.d.ts.map