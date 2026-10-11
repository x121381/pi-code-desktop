import { type WorkflowRunsState } from "./workflow-runs.js";
/**
 * 按旧界裁剪；裁过的 run 置 `truncated: true`（读面据它显示「仅展示 N/M 步的详情」）。
 *
 * **不裁别的**：旧消费者认不出的新可选键是无害的（容器非 strict，多余的键被剥掉而已），
 * 而为了"干净"去剥它们反而要维护第二份字段表——那正是 2026-09-04 事故的形状。
 *
 * 无需裁剪时返回**同一个对象**：这个函数在每次 flush 上都会跑一遍，白白造一份新状态会让
 * 下游所有按引用 memo 的地方失效。
 */
export declare function clampWorkflowRunsForLegacy(state: WorkflowRunsState): WorkflowRunsState;
//# sourceMappingURL=workflow-runs-legacy.d.ts.map