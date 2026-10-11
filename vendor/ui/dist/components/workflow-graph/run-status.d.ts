import type { WorkflowRunActor, WorkflowRunNode, WorkflowRunState } from "@zcode/shared/zcode-protocol-v4";
import { type StepRunStatus, type StepStatusTable, type WorkflowCausalityGraphData } from "./types.js";
/**
 * 实时叠加视图（live view v1）的纯选择器。
 *
 * 这个视图刻意**不展开**成实例图：它就是提交时那张静态因果图，加一层状态装饰。由此得到的最强性质是
 * **运行期间图的节点与边集合绝不变化**——rank 单调、无重排按构造成立，因为叠加从不摆卡片。
 * 代价只有一个，而且只有这一个：一个静态 step 对应 N 个运行时实例（循环 / fan-out），
 * 所以状态必须坍缩，「第 3 轮失败了、第 4 轮在跑」是单张卡片说不出的那句话。
 */
export interface WorkflowRunOverlay {
    /**
     * 按图上的 step id 索引的状态。偏表：没有观察到实例的 step **没有条目**。「每个 step 都有值」
     * 曾是给 React Flow 板面的承诺（每张卡都要装饰）；板面退役后没有消费者需要它，而它让
     * 「从没跑过」与「排队中」共用一个 `pending`。
     */
    statuses: StepStatusTable;
    /** 从 running 的 step 出发的排序边是否动画。 */
    animatedEdges: boolean;
}
/**
 * 引擎相位 → 四值 `StepRunStatus`。
 *
 * 词汇表按**引擎实际发出的**事件写：queued / dispatched / executing / waiting / repairing / nudged /
 * settled。`executing` / `waiting` 是 driver 的观察：
 * 模型请求真的发出去了 / 在等进程级槽位或退避。
 *
 * queued / dispatched / waiting 归入 pending 是有意的：这三段都是「还没有请求在 provider 那里跑」——
 * FIFO 与 per-run 上限的等待、会话就绪但首个请求尚未准入、闸门排队或退避。真正在动由 executing 说。
 */
export declare function statusOfRunNode(node: WorkflowRunNode): StepRunStatus;
/**
 * 唯一的折叠：实例状态的多重集 → 一个状态。
 *
 *   - 空集 → `undefined`。缺席不是状态，折叠不凭空造一个；由消费者按控制流解缺席。
 *   - 任一 running → running。**刻意优先于 failed**：读者最需要知道的是「还在动吗」。
 *   - 既有已结算又有排队 → running：开始了、没结束。旧规则把它读成 pending（「还没开始」），
 *     是同一个混淆换了件衣服。
 *   - 全部排队 → pending。
 *   - 全部结算：任一 failed → failed，否则 done。
 *
 * 四条都是 any 判定，所以先按站点折、再按参与者折与直接按实例折结果相同——两级折叠不会漂移。
 * 输入既可以是实例状态（`statusOfRunNode`），也可以是站点状态（本函数的输出），词汇表相同。
 */
export declare function aggregateRunStatuses(statuses: readonly StepRunStatus[]): StepRunStatus | undefined;
export declare function workflowRunOverlay(run: WorkflowRunState | undefined, graph: WorkflowCausalityGraphData): WorkflowRunOverlay;
/**
 * 车道 → 该车道上的 actor 实例（phase 5 的 transcript 下钻：单实例直接开，多实例弹选择器）。
 *
 * 车道 site id 是身份，显示名只是展示（沿用 causality-graph 的命名契约）。
 * `workspace` 与 `unknown` 是合成车道，上面没有会话，所以恒返回空——world-read step
 * 因此只有选中态、没有下钻。
 */
export declare function workflowRunActorsForLane(run: WorkflowRunState | undefined, laneId: string): WorkflowRunActor[];
//# sourceMappingURL=run-status.d.ts.map