import { type ConversationDelta, type ConversationRow, type ConversationSnapshot, type ConversationOpenTiming, type ConversationTopicFrame, type SessionModelTransition, type ToolCallRow, type TopicFrameDeliveryKind } from "@zcode/shared/zcode-protocol-v4";
import type { ConversationTurnNavigatorHydrationResult } from "@/v4/conversationTurnNavigatorHelpers.js";
import type { ConversationTransport } from "@/v4/transport.js";
import { ConversationRowPool } from "@/v4/conversationRowSharing.js";
/**
 * accepted ACK 后等待权威输入投影的宽限期。
 *
 * Core admission 的 ACK 不等待 TurnStarted/QueueItem/userInput 投影；正常情况下这两条
 * 路径只相差一个 renderer/network round-trip。把窗口设为 2s 可以覆盖正常 desktop/mobile
 * 延迟，又能尽快从“CLI 继续工作、订阅完全静默”的半开通道自愈。超时只恢复订阅，不重放命令。
 */
export declare const ACCEPTED_INPUT_PROJECTION_GRACE_MS = 2000;
export type ConversationStoreStatus = "connecting" | "live" | "error" | "closed";
/** optimistic overlay 条目：命令已上行、服务端尚未在投影中确认。 */
export interface OptimisticCommand {
    commandId: string;
    type: string;
    issuedAt: number;
}
export interface ConversationStoreState {
    status: ConversationStoreStatus;
    snapshot: ConversationSnapshot | null;
    subscriptionId: string | null;
    lastError: string | null;
    /** 首次 conversation subscribe 的低频 Host/CLI timing；不进入 snapshot 事实。 */
    openTiming?: ConversationOpenTiming;
    /** Renderer 首帧 timing；与 snapshot 一起通知，避免 UI 读取到半更新的诊断状态。 */
    rendererTiming?: SessionOpenRendererTiming;
    optimisticCommands: readonly OptimisticCommand[];
    /** loadOlder 在途标记（自动预取防重入）。 */
    loadingOlder: boolean;
    /** CLI 完整有效 projection 返回的终态计划目录。 */
    sessionPlans: readonly ToolCallRow[];
    /** 只用于触发计划目录只读 query，不属于 conversation 协议事实。 */
    planDirectoryRevision: number;
    plansLoading: boolean;
    /**
     * 问题导航目录（turn navigator）的失效代际。
     * not-enough-queries 终态过去只以 logEpoch 判定有效，但
     * "是否已有 ≥2 条可导航 query"是随增量变化的派生条件，logEpoch 表示日志代际而非
     * 内容静止。real-user query 增删（row.appended/row.upserted 命中 realUser userInput，
     * 或 row.removed 截断分支）与 snapshot 整体替换时递增此 revision，使终态缓存失效。
     */
    turnNavigatorDirectoryRevision: number;
}
export interface SessionOpenRendererTiming {
    rendererPrepareMs?: number;
    initialFrameTransportMs?: number;
    rendererSnapshotApplyMs?: number;
    snapshotAppliedAt?: number;
}
/**
 * 还有更早历史可拉 ⇔ 窗口首行不是全序首行（firstRowId 判定）。
 * 纯函数供 store/组件共用；快照缺失/空窗口/未知 firstRowId 一律 false。
 */
export declare function hasOlderRows(snapshot: ConversationSnapshot | null): boolean;
/**
 * 冷快照尾窗是否从一个 turn 的中间截断。turnHeader 是完整 turn 的权威起点；首行允许是
 * lightBoundary，因此不能只判断首行 kind，必须检查首个 turn 在当前窗口里是否已有 header。
 */
export declare function shouldAutoLoadIncompleteLeadingTurn(snapshot: ConversationSnapshot | null, loadingOlder: boolean): boolean;
/**
 * rows/range 结果并入本地窗口（合并规范）：按 rowId 键控、只收
 * 窗口首行之前的行、去重后前插；顺序键 = rowId 升序（全序保证）。
 * 返回 null 表示无可并入行（窗口无变化，调用方不换引用）。
 */
export declare function mergeOlderRows(window: readonly ConversationRow[], fetched: readonly ConversationRow[]): ConversationRow[] | null;
export declare class ConversationProjectionStore {
    readonly topic: string;
    private readonly transport;
    private readonly rowPool;
    private state;
    private readonly listeners;
    private readonly modelTransitionListeners;
    /** live-only 增量（插件资源通知）的旁路监听；只在 delta 帧应用后触发，快照帧不触发。 */
    private readonly liveDeltaListeners;
    private observedModelTransitionEventId;
    private generation;
    private connectInFlight;
    /**
     * subscribe ACK mode 持久到该代首个 logical frame；不能只依赖同步 activate 栈，
     * 因为 notification 可在 ACK Promise resolve 后异步到达。
     */
    private awaitingInitial;
    /** 当前 subscription 是否已由旧 applied base 或本代 logical frame 证明水位有效。 */
    private subscriptionHasAppliedBase;
    private recovery;
    private readonly offAssemblyFault;
    private readonly offRuntimeRestart;
    private readonly offRuntimeLifecycle;
    private runtimeRecycleRetryTimer;
    private runtimeRecycleRetryAttempt;
    private sessionOpenRendererTiming;
    private initialSubscribeAckAt;
    private planQueryInFlight;
    private planQueryPending;
    /** accepted input 的 projection confirmation watchdog；不承载命令，也不生成本地事实。 */
    private readonly acceptedInputProjectionTimers;
    private turnNavigatorHydrationTerminal;
    private closed;
    constructor(topic: string, transport: ConversationTransport, rowPool?: ConversationRowPool);
    getState(): ConversationStoreState;
    getSessionOpenRendererTiming(): SessionOpenRendererTiming;
    subscribe(listener: () => void): () => void;
    /**
     * 订阅每一帧应用后的增量列表。用途是 live-only 的 `pluginUi.*` 增量（它们不改行、不进快照），
     * 常规行状态仍以 subscribe + getState 为准。
     */
    onLiveDeltas(listener: (deltas: readonly ConversationDelta[]) => void): () => void;
    onOnlineModelTransition(listener: (transition: SessionModelTransition) => void): () => void;
    private setState;
    /**
     * 发起/重发订阅。base 取自当前 snapshot 水位（水位不变量：仅当真持有该时刻
     * 一致状态才携带）；forceSnapshot 用于 resume 续传帧仍断档的兜底，丢 base 要全量。
     */
    connect(options?: {
        forceSnapshot?: boolean;
        initialOverflowRetry?: boolean;
        rendererPrepareStartedAt?: number;
    }): Promise<void>;
    private clearRuntimeRecycleRetry;
    /**
     * runtime 换代导致的 subscribe 失败：保持 connecting 并有界退避重连。
     * 返回 true 表示已接管本次失败，调用方不应再落 error。
     */
    private scheduleRuntimeRecycleRetry;
    /**
     * 有界退避重连。重订阅走 start-if-needed（zcodeAgentService.subscribeConversationV4），
     * 自身即可把懒启动的 runtime 拉起来——这是 available 永不到达时唯一的自愈路径。
     * 返回 true 表示已接管，调用方不应再落 error。
     */
    private scheduleRuntimeRecycleReconnect;
    /** workspace-dispose 当场：旧 runtime 已死，新的尚不存在，不可重订阅。 */
    private handleRuntimeUnavailable;
    /** 新 runtime 就绪：与 onRuntimeRestart 同义，携原水位重订阅。 */
    private handleRuntimeAvailable;
    /** 订阅失败后的手动重试入口（pane 层「重新连接」按钮落点）。 */
    retry(): Promise<void>;
    /** row command/query 的 epoch/entity authority 失效，复用 same-sub recovery 收敛。 */
    recoverFromStaleAuthority(): void;
    /** SessionDataLayer 帧路由入口。 */
    handleFrame(frame: ConversationTopicFrame, delivery?: {
        deliveryKind: TopicFrameDeliveryKind;
    }): void;
    private applyFrame;
    /**
     * Bug 原因：整份 snapshot 的行全是新反序列化对象，历史 snapshot 被闭包链留住时每份各持
     * 一套大字符串（同一 inputText 上百份）。这里把值相等的行 / 子值换回池中旧引用。
     */
    /** rows/range 补拉的历史行与池中仍存活的旧行共享（冷打开后往上翻时常见）。 */
    private shareRows;
    private shareSnapshotRows;
    /** row.upserted / row.appended 的新行做共享；row.delta 只登记，避免流式逐帧深比较。 */
    private shareDeltaRows;
    private observeModelTransition;
    /** physical assembly fault：旧 projection 保持可见，active sub 上 single-flight 恢复。 */
    handleAssemblyFault(subscriptionId: string, deliveryKind?: TopicFrameDeliveryKind, reasonCode?: string): void;
    private requestRecovery;
    private issueRecovery;
    private markRecoveryFrameSeen;
    private settleRecovery;
    private clearRecoveryDeadline;
    private discardRecovery;
    /**
     * `contentEligible: false` 给**超时**终态用：deadline 没等到 recovery 帧是传输症状，即使本次
     * flight 起因是内容失败，也不该被重标成 contentRejected——那会连带取消一次仍然有意义的重试。
     */
    private failRecovery;
    private handleRuntimeRestart;
    /**
     * loadOlder：以窗口首行为游标向上拉一窗历史行并前插。
     * - 单飞：在途期间重复调用 no-op（loadingOlder 防重入）；
     * - 陈旧读防护：atLogEpoch ≠ 当前快照 epoch 的结果整体丢弃（跨 CLI 重启）；
     * - 合并以 rowId 为键：与订阅流的 row.upserted/removed 天然一致，
     *   在途期间到达的 delta 帧不受影响（它们只动 ≥ 窗口首行的行）。
     */
    loadOlder(limit?: number): Promise<void>;
    /**
     * 完整问题目录：沿既有 rows/range 游标把当前有效分支一次补齐。
     *
     * 问题导航过去直接扫描 renderer 的 tail window，因此 1000 轮会话只显示
     * 已加载的几十轮。这里按协议上限分页读取，但等全部页成功后只换一次 snapshot，
     * 避免每 200 行重建一次 timeline render units 与两个 virtualizer。
     */
    loadAllOlder(): Promise<ConversationTurnNavigatorHydrationResult>;
    /**
     * 按本地失效 revision 合并并发的计划目录查询。
     * 旧计划可能早于 snapshot tail；同时 edit/retry 的 row.removed 会让在途
     * query 立刻过期，必须以 revision + epoch 双重校验，不能把旧分支计划重新写回 UI。
     */
    refreshPlans(): Promise<void>;
    /** 命令上行前登记 overlay（pending/stopping 展示用）。 */
    markCommandPending(command: OptimisticCommand): void;
    /**
     * ACK accepted/duplicate 后登记“必须能在权威投影中看见”的输入命令。
     *
     * command RPC 与 conversation topic 是两条独立通路；只有收到后续
     * delta 才能发现 gap，若 topic 在 ACK 后完全静默，CLI 继续工作但 UI 永远等不到 user row。
     * 这里不伪造消息，只在有限窗口后复用既有 same-sub recovery；权威 projection 一旦出现
     * queue/user row，watchdog 立即收口。
     */
    expectAcceptedInputProjection(commandId: string): void;
    private clearAcceptedInputProjectionWatch;
    /** 命令被拒/失败等本地收口时移除 overlay。 */
    settleCommand(commandId: string): void;
    private reconcileOptimistic;
    private reconcileAcceptedInputProjection;
    /** 内存诊断：当前 rows.window 行数；只读。 */
    countProjectionRows(): number;
    /** 退订并终结本 store（仅 SessionDataLayer 调用）。 */
    close(): Promise<void>;
}
//# sourceMappingURL=conversationProjectionStore.d.ts.map