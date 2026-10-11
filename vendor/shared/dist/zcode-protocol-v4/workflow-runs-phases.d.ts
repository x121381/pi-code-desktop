import { type WorkflowRunState } from "./workflow-runs.js";
/**
 * `phase-entered` 的归约：控制流经过了
 * 一个 `phase("…")` 标记。住在 reducer 主文件之外与并发观察同一个理由——主文件的 max-lines 门。
 *
 * 不碰 nodes / actors——标记不是一步工作。`rounds` 取 **max** 而不是 +1：引擎在 resume 重跑时会
 * 把前缀再发一遍（标记没有 journal 行可去重），单调归约让重放逐条无变化；ordinal 缺席（旧 CLI /
 * 残缺载荷）按 1 记。触界语义与 actors / nodes 同族：拒绝新条目、已有条目照常更新，超界事实仍在
 * journal 里；`currentPhase` 不受上限约束——「控制流在哪」是事实，进不了表也要说。
 */
/**
 * `run-launched` 的归约：锚点（inputId）
 * 是事件归属的事，状态不装它；这里只搬运脚本声明的阶段表 `phaseNames`，按声明序、裁到与 `phases`
 * 同一对界。缺席或空表 → 原样返回（只抬水位），键不建：UI 据缺席画一个隐含站点。
 * 同一世只记一次，所以 resume 的 `run-started` 不清它、重放逐条无变化。
 *
 * 「同时在跑」表 `phaseAlongside` 搭它的车（下标指向的正是被接受的那张 `phaseNames`），所以
 * 只在名字表立住之后才读，且按那张表的长度裁齐——见 {@link readPhaseAlongside}。
 */
export declare function reduceRunLaunched(run: WorkflowRunState, payload: Record<string, unknown>): WorkflowRunState;
export declare function reducePhaseEntered(run: WorkflowRunState, payload: Record<string, unknown>): WorkflowRunState;
//# sourceMappingURL=workflow-runs-phases.d.ts.map