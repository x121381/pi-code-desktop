import type { ConversationDelta, WorkflowRunHeaderKey, WorkflowRunRemovedDelta, WorkflowRunUpdatedDelta } from "./delta.js";
import { type WorkflowRunState, type WorkflowRunsState } from "./workflow-runs.js";
/** header = run 减去两张按 (siteId, ordinal) 增量同步的表。顺序仍是 schema 声明序。 */
export declare const WORKFLOW_RUN_HEADER_KEYS: readonly WorkflowRunHeaderKey[];
/** 两张实例表的去重键。`\0` 分隔的理由与 reducer 的派生 actor 状态逐字相同：("a",12) 与 ("a1",2) 不能撞车。 */
export declare function workflowRunEntryKey(entry: {
    siteId: string;
    ordinal: number;
}): string;
/**
 * 按规范键序重建一个 run 对象（浅重建：嵌套值原样搬运引用，它们本来就来自同一份事实）。
 *
 * `undefined` 值的键按缺席处理，与 `JSON.stringify` 的语义对齐——协议线上只有「键在场」与
 * 「键缺席」两态，没有第三态。schema 之外的键按原序缀在尾部：本模块没有资格替调用方丢数据。
 */
export declare function canonicalWorkflowRun(run: WorkflowRunState): WorkflowRunState;
/**
 * JSON 值的结构相等。reducer 的幂等判据（原来是整条 run 的 `JSON.stringify` 比对，每事件
 * O(N) 字节）与 diff 的「这个键/条目变了吗」共用这一份，两处判据不会再各说各话。
 *
 * 与 `JSON.stringify` 的差别只有两处，两处都是**更**准确：键序不参与判定；`undefined` 值的键
 * 与缺席等同（stringify 也会丢掉它们）。
 */
export declare function jsonValueEqual(a: unknown, b: unknown): boolean;
/** reducer 的幂等判据：同一条事件重放后内容无变化即不产 delta、不抬 revision。 */
export declare function workflowRunUnchanged(previous: WorkflowRunState, next: WorkflowRunState): boolean;
/**
 * 一条 header 够不够格让**未知 run 出生**：必填键一个不缺。
 *
 * 只有 diff 的「诞生」分支会造出完整 header——已有 run 的增量里 `runId` 永远不变、因此永远不在
 * patch 里，于是若干条增量合并（coalesce 规则 6）也**拼不出**一条完整 header。这条不变量是
 * 合并规则得以成立的支点：合并不会把两条对未知 run 的 no-op 变成一次凭空出生。
 */
export declare function isCompleteWorkflowRunHeader(header: unknown): boolean;
/**
 * 两个 workflowRuns 状态之间的键级增量。
 *
 * 退路只有一条：认不出的结构变化（条目被删或被重排，见文件头第 1 条）或「没有任何 op 却
 * revision 动了」时，整键重发一条 `state.updated`。它在协议上完全合法（键级整体替换），
 * 在 coalesce 里是一道屏障，代价只是退回改造前的字节数。
 */
export declare function diffWorkflowRunsState(prior: WorkflowRunsState | undefined, next: WorkflowRunsState): ConversationDelta[];
/**
 * `workflowRun.updated` 的应用。
 *
 * 容器 revision 取 **max**：coalesce 允许把靠后的 op 合并到靠前的位置上（规则 6），于是输出序列
 * 的最后一条不一定携带最高 revision。revision 按契约单调，max 让「合并前后终态逐字节一致」这条
 * 定律不依赖 op 的位置。
 *
 * 身份：未改动的 run 与未改动的条目保持引用不变，变化的那条 run 与容器是新对象——GUI 正是按
 * 这两级引用做 memo。
 */
export declare function applyWorkflowRunUpdated(state: WorkflowRunsState | undefined, delta: WorkflowRunUpdatedDelta): WorkflowRunsState;
/** `workflowRun.removed` 的应用：把这条 run 摘掉。未知 runId 只让 revision 跟上。 */
export declare function applyWorkflowRunRemoved(state: WorkflowRunsState | undefined, delta: WorkflowRunRemovedDelta): WorkflowRunsState;
/**
 * 一条 `workflowRun.updated` 的四张条目表都在线上界之内吗。
 *
 * 真正会超界的是**两张删除表**。合并出来的 upsert 表自己就有界：按合并规则，先者 upsert 的键
 * 凡被后者删掉的都已去掉，所以留下的每一个键在这条 op 施加完之后都还在表里，而表本身 ≤ 界。
 * 删除表没有这条护栏——合并分不出「窗口里刚出生又被淘汰的键」和「客户端早就拿着的键」，
 * 每次淘汰都让出一个位子，一个够宽的 flush 窗口里被删掉的不同键因此可以多于 1024 条。
 * 淘汰之前这不可能：表只增不减，一世之内被碰过的不同键最多就是表界那么多。
 *
 * 超界的载荷不会被剥掉一个键，它让整个 patch 解析失败、整帧被丢、那条订阅从此静默
 * （workflow-runs.ts 记的那次事故的形状），而 publisher 的两道兜底（500 op / 1 MiB）在这个
 * 量级上都不会响。四张表都查是因为这道闸很便宜，而且不该依赖上面那条论证一直成立。
 *
 * 合并是**优化**，所以拒绝合并永远是安全的：两条 op 各自都在界内，逐条投递的终态一个字节都不差。
 */
export declare function workflowRunUpdateWithinWireBounds(delta: WorkflowRunUpdatedDelta, limits?: WorkflowRunWireBounds): boolean;
/**
 * 条目表的线上界。只为测试留的注入口（默认就是 {@link WORKFLOW_RUNS_LIMITS}）：真界是 1024，
 * 而「合并被拒」这条路径在小界下才走得到，property 测试需要它真的被走到。
 */
export interface WorkflowRunWireBounds {
    readonly maxActors: number;
    readonly maxNodes: number;
}
/** 合并两条同 run 的 `workflowRun.updated`（coalesce 规则 6 的载荷部分，规则本身在 coalesce.ts）。 */
export declare function mergeWorkflowRunUpdates(earlier: WorkflowRunUpdatedDelta, later: WorkflowRunUpdatedDelta): WorkflowRunUpdatedDelta;
//# sourceMappingURL=workflow-runs-delta.d.ts.map