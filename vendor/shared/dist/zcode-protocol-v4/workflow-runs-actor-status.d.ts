import type { WorkflowRunState } from "./workflow-runs.js";
/**
 * 三态推导（docs/dynamic-workflow/concurrency.md「Protocol state」）：
 *   running   有节点在 executing / repairing / nudged（模型请求已发出、正在跑）
 *   waiting   有 live 节点（queued / dispatched / waiting），或尚无任何节点且 run 未终态
 *   completed 其余：全部节点已结算，或 run 已终态（终态压过一切：一个终态 run 里没有任何人
 *             还在跑或在等，哪怕某个节点的 settled 事件没来得及落下）
 * `dispatched` 归 waiting 而不是 running：它是「会话就绪、首个请求尚未准入」的短暂相位，
 * 真正在跑由 node-executing 说。
 *
 * 状态没变的 actor 保持**引用不变**——键级增量按引用先判一遍"这条变了吗"，这里每次都造新对象
 * 会让每条节点事件都把整张 actors 表搬上线。
 */
export declare function withDerivedWorkflowActorStatuses(run: WorkflowRunState): WorkflowRunState;
//# sourceMappingURL=workflow-runs-actor-status.d.ts.map