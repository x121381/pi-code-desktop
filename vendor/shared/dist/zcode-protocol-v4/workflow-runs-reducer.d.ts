import { type WorkflowRunsState } from "./workflow-runs.js";
import { type WorkflowRunEntryLimits } from "./workflow-runs-eviction.js";
/**
 * 一条 workflow run 进度事件的**结构化**入参。字段与 contracts 的
 * `DynamicWorkflowRunProgressPayload` 同形，但这里全部可缺省：本模块不做 schema 校验，
 * 而是对残缺输入按「能归约多少算多少」处理（runId / eventType 缺席即整条无效）。
 *
 * `actorSessionId` 是 run service 挂在 payload **之外**的派生字段
 * （见 dynamic-workflow-run-launch.ts 的 toProgressPayload）：确定性铸造的 actor
 * 会话 id。它不是引擎的可观察事实，但缺了下游只能自己重造一份契约。
 */
export interface WorkflowRunProgressEnvelope {
    runId?: string;
    toolCallId?: string;
    sequence?: number;
    eventType?: string;
    payload?: Record<string, unknown>;
    actorSessionId?: string;
}
/**
 * 把一条进度事件归约进 `workflowRuns` 状态键。
 *
 * 返回 `null` 表示**语义无变化**：无效事件（缺 runId / eventType），或同一条事件重放后
 * 内容逐字节相同。调用方据此决定不发 `state.updated` / 不刷 UI——revision 因此只在真有
 * 变化时抬升（幂等重放不抬 revision）。
 *
 * `previous` 缺席等价于空态 `{ revision: 0, runs: [] }`。`limits` 只为测试留的注入口，默认就是
 * {@link WORKFLOW_RUNS_LIMITS}（生产上没有第二套界）。
 */
export declare function reduceWorkflowRunsState(previous: WorkflowRunsState | undefined, envelope: WorkflowRunProgressEnvelope, limits?: WorkflowRunEntryLimits): WorkflowRunsState | null;
//# sourceMappingURL=workflow-runs-reducer.d.ts.map