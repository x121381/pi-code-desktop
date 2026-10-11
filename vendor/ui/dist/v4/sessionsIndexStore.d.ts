import { type SessionSummary, type SessionsIndexTopicFrame, type TopicFrameDeliveryKind } from "@zcode/shared/zcode-protocol-v4";
import type { SessionsIndexTransport } from "@/v4/agentSessionsIndexTransport.js";
export interface SessionsIndexState {
    /** workspaceId → 已知；null = 尚无 snapshot。 */
    workspaceId: string | null;
    logEpoch: string | null;
    /** 帧区间水位（= 最近一帧 toSeq）。 */
    seq: number;
    /** 会话摘要，按 sessionId 索引（conflated）。 */
    sessions: Map<string, SessionSummary>;
}
export declare const EMPTY_SESSIONS_INDEX_STATE: SessionsIndexState;
export type SessionsIndexStoreStatus = "idle" | "dormant" | "connecting" | "live" | "error";
export interface ApplySessionsIndexResult {
    state: SessionsIndexState;
    /** true = 帧区间断档（fromSeq 与水位不衔接），调用方应重订阅。 */
    gap: boolean;
}
/** 纯 apply：snapshot 全量替换；deltas 仅在衔接时逐条 upsert/remove。 */
export declare function applySessionsIndexFrame(current: SessionsIndexState, frame: SessionsIndexTopicFrame): ApplySessionsIndexResult;
/**
 * useSyncExternalStore 兼容的只读 store：subscribe + getState 返回稳定引用。
 * 状态本体与纯 applyFrame 可独立单测；传输绑定（connect/handleFrame/close）
 * 负责订阅生命周期与断档重订阅。
 */
export declare class SessionsIndexStore {
    private state;
    private readonly listeners;
    /** 缓存的有序列表（getSessions 稳定引用，避免每次 new array 触发重渲染）。 */
    private cachedList;
    private transport;
    private frameUnsub;
    private faultUnsub;
    private restartUnsub;
    private lifecycleUnsub;
    private subscriptionId;
    private awaitingInitial;
    private subscriptionHasAppliedBase;
    private recovery;
    private status;
    private generation;
    private closed;
    private runtimeRestartReconnectTimer;
    private runtimeRestartBurstCount;
    private lastRuntimeRestartAt;
    private subscribeRetryTimer;
    private errorRecoveryRetryTimer;
    private errorRecoveryRetryAttempt;
    subscribe: (listener: () => void) => (() => void);
    getState: () => SessionsIndexState;
    getStatus(): SessionsIndexStoreStatus;
    /**
     * 绑定传输并发起订阅：注册帧监听 + subscribe（水位不变量：仅当真持有一致状态才带 base）。
     * 断档帧 → 丢 base 重订阅（handleFrame 触发）。close 后可再次 connect（React
     * effect 卸载/重挂载——StrictMode 双调——走同一路径复活）。
     */
    connect(transport: SessionsIndexTransport, options?: {
        forceSnapshot?: boolean;
        initialOverflowRetry?: boolean;
        subscribeRetryAttempt?: number;
        errorRecoveryRetryAttempt?: number;
    }): Promise<void>;
    /**
     * 远程 RPC proxy 换代时原地替换 transport。
     *
     * 先同步解除旧 transport 的本地监听，再对新 transport 强制取 snapshot；远端退订只做
     * best-effort，不能阻塞新 proxy 接管。服务端按 subscriptionId 精确退订，迟到 cleanup
     * 不会删除新代际。并发换代由 store generation 失效旧结果，store 身份和最后一份投影保持不变。
     */
    replaceTransport(transport: SessionsIndexTransport): Promise<void>;
    /** 帧路由入口（initial / online notification）。断档 → 重订阅。 */
    handleFrame(frame: SessionsIndexTopicFrame, delivery?: {
        deliveryKind: TopicFrameDeliveryKind;
    }): void;
    private handleAssemblyFault;
    private requestRecovery;
    private issueRecovery;
    private markRecoveryFrameSeen;
    private settleRecovery;
    private clearRecoveryDeadline;
    private discardRecovery;
    private clearSubscribeRetry;
    private clearErrorRecoveryRetry;
    /**
     * 内容确定性失败：终态 code 与传输失败区分，且**不排退避重订阅**——重订阅会拿到同一份读不懂的
     * 内容，本 store 的退避会因此变成永不收敛的循环（清空投影 → 重订阅 → 再被拒 → …）。自愈仍有
     * 路径：runtime 换代、fresh connect、用户重连都会重新订阅；被拿掉的只是那个循环。
     *
     * `contentEligible: false` 给**超时**终态用：deadline 没等到 recovery 帧是传输症状，不该被重标
     * 成 contentRejected，更不该因此取消那次仍然有意义的重试。
     */
    private failRecovery;
    /**
     * recovery/subscribe 失败时撤销旧 projection 的 live 证明，并用有界退避重新取权威
     * snapshot。error 仍对外可观测；重试仅在 transport/runtime 仍属于当前代际时执行。
     *
     * `scheduleRetry: false` 只给确定性失败用：重试必然得到同一结果时不该排它。
     */
    private failAndScheduleRecovery;
    private handleRuntimeRestart;
    private handleRuntimeAvailable;
    private handleRuntimeUnavailable;
    /** 释放订阅与监听（组件卸载 / workspace 切换）。 */
    close(): void;
    private detachTransport;
    /** 应用一帧；断档返回 true（调用方重订阅）。 */
    applyFrame(frame: SessionsIndexTopicFrame): boolean;
    /** 断档/重连时清空，等待新 snapshot。 */
    reset(): void;
    /** 会话列表（默认按 lastActivityAt 降序；分组/pin 是更上层逻辑）。 */
    getSessions(): SessionSummary[];
    private emit;
}
//# sourceMappingURL=sessionsIndexStore.d.ts.map