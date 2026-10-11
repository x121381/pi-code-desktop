import type { IPlatformService, RemoteWorkspaceIdentityKind } from "@zcode/shared";
import type { ConversationTelemetryFact } from "@zcode/shared/zcode-protocol-v4";
import { type ChatErrorBannerSurface } from "@/lib/chatErrorBannerTelemetry.js";
import { type PromptMessageSource } from "@/lib/messageTelemetry.js";
import { type SendFunnelReasonCode } from "@/lib/sendFunnelArmsTelemetry.js";
import type { ZCodeUiError } from "@/lib/zcodeUiError.js";
type TelemetryPlatform = Pick<IPlatformService, "reportArmsCustomEvent" | "reportTelemetryEvent">;
export interface ConversationPromptTelemetrySeed {
    localTtft?: import("@zcode/shared").LocalTtftContext;
    /** 用户触发原始发送动作的 renderer 时钟。 */
    sendTime: number;
    /** 发送瞬间冻结的旧版模型/模式/套餐字段。 */
    extraDetail: Record<string, string>;
    /**
     * 发送漏斗关联 ID，配对 send_click ↔ send_result。仅 composer 真实点击产生；
     * 后台任务（off_peak / automation）seed 无此字段，落定时直接跳过不报。
     */
    sendClickId?: string;
    /** 是否中途经过队列二次确认弹窗（该子集的 send_cost_ms 含用户停留时间）。 */
    queueConfirmed?: boolean;
}
/** 发送落定的失败原因，取值口径见 docs/monitoring/composer-send-funnel-telemetry.md。 */
export type ConversationSendFailureReason = SendFunnelReasonCode;
export interface AcceptedConversationPromptTelemetrySeed extends ConversationPromptTelemetrySeed {
    /** CLI 会话记录的开关；缺失保持未知，不能用实时设置补齐。 */
    memoryEnabled?: boolean;
    sessionId: string;
    sourceCommandId: string;
    /** 独立 background wake 的 completion 来源在 TurnStarted admission 时冻结。 */
    completionMessageSource?: PromptMessageSource;
}
/** 从点击发送起算，超过这个时长仍未渲染出用户消息就判超时。 */
export declare const SEND_RENDER_WAIT_TIMEOUT_MS = 30000;
/**
 * ACK 的处置：要么转入待渲染等待（命令被受理，但用户消息还没画出来），
 * 要么立即落定为失败。返回 null 表示本次两者都不做。
 */
export type ConversationSendAckOutcome = {
    kind: "awaitRender";
    ackStatus: string;
} | {
    kind: "settle";
    status: "fail";
    ackStatus: string;
    reasonCode: ConversationSendFailureReason;
};
/**
 * 把 CommandAck 折算成 send_result 的处置口径，返回 null 表示本次不落定。
 * 抽成纯函数是为了让 dispatchCommand 只负责调用，分支逻辑可单测。
 */
export declare function resolveSendAckSettlement(ack: {
    status: string;
    reasonCode?: string;
}): ConversationSendAckOutcome | null;
export interface ConversationTelemetryWorkspaceDetail {
    workspace_kind: "local" | "remote";
    remote_kind: RemoteWorkspaceIdentityKind | "";
}
/**
 * renderer workspace 级 live telemetry 状态机。
 *
 * 它不读取 rows/snapshot，也不跟随 pane lease 销毁；React 只负责 attachment 和
 * foreground 引用，所有高频 fact 都进入这个命令式对象，避免 streaming 触发渲染。
 */
export declare class ConversationTelemetrySupervisor {
    private readonly platform;
    private readonly workspaceTelemetryDetail;
    private readonly workspaceScopeKey;
    private readonly now;
    private readonly eventIds;
    private readonly acceptedCommandIds;
    private readonly settledSendClickIds;
    private readonly terminalKeys;
    private readonly compactionKeys;
    private readonly foregroundOwnerSessions;
    private readonly foregroundSessionCounts;
    private readonly lifecyclesByCommandId;
    private readonly activeCommandBySessionId;
    private readonly commandIdByTurnKey;
    private readonly pendingFactsByCommandId;
    private readonly foregroundSubagentUsageByChildSession;
    /** 每个在飞 run 已登记的子代理会话（run-settled 时逐个结算）。 */
    private readonly workflowActorsByRun;
    private readonly backgroundSubagentTelemetryByChildSession;
    private readonly deferredTerminalsByCommandId;
    private readonly pendingSendRenderWaits;
    private reportTail;
    private disposed;
    constructor(options: {
        platform: TelemetryPlatform;
        workspaceScopeKey: string;
        workspaceTelemetryDetail?: ConversationTelemetryWorkspaceDetail;
        now?: () => number;
    });
    recordComposerFocus(): void;
    recordComposerTextChange(nextText: string): void;
    /**
     * 用户真实点击/聚焦输入框。程序性自动聚焦（新建任务、切会话、挂载回焦、上下文块移除后回焦）
     * 由 composer 侧拦截，不得进入本方法，否则「点击输入框」会被切会话动作污染。
     * 与 recordComposerFocus 是两条独立链路：后者只写时间戳喂 send_btn，本方法只负责上报。
     */
    recordComposerFocusClick(input: {
        sessionId: string | null;
    }): void;
    /**
     * 用户点击发送键 / Enter 提交并通过发送门禁的瞬间。返回补齐 sendClickId 的 seed，
     * 调用方需把它一路带到落定处，保证 send_click 与 send_result 严格 1:1。
     * 队列二次确认复用既有 seed 时不得再调本方法（否则一次点击报两条）。
     */
    recordSendClick(input: {
        sessionId: string | null;
        seed: ConversationPromptTelemetrySeed;
        trigger: "button" | "shortcut";
    }): ConversationPromptTelemetrySeed;
    /**
     * 发送落定（用户消息渲染完成、ACK 失败、产品 guard 拒绝、传输异常、等待渲染超时）。
     * 按 sendClickId first-wins 去重：ACK 与 catch 可能对同一次点击各调一次，只认最先到达的结果。
     */
    settleSendResult(input: {
        seed: ConversationPromptTelemetrySeed;
        sessionId: string | null;
        commandId?: string;
        status: "success" | "fail";
        ackStatus?: string;
        reasonCode?: ConversationSendFailureReason;
        /** 「点击发送 → 收到 ACK」那一段；未拿到 ACK 的失败路径不传。 */
        ackCostMs?: number;
        /** 覆盖端到端耗时；只有超时兜底会用（此时 now 已越过 30s 上限，需钉死在阈值上）。 */
        costMs?: number;
    }): void;
    /**
     * ACK 已 accepted/duplicate：命令被 Host 收下了，但用户消息还没画到屏幕上。
     * 登记待渲染并挂超时定时器，等 notifyUserInputRendered 或超时任一先到再落定。
     */
    awaitSendRender(input: {
        seed: ConversationPromptTelemetrySeed;
        sessionId: string | null;
        commandId: string;
        ackStatus: string;
    }): void;
    /**
     * 用户消息已渲染进对话历史（投影回流出 userInput row，且 React 完成 commit）。
     * 没登记过的 commandId 直接忽略——历史消息回填、切会话重载都会推一堆 row 过来。
     */
    notifyUserInputRendered(commandId: string): void;
    /** ACK=accepted 后才建立 seed；duplicate/retry/promotion 不会重复上报 send_btn。 */
    acceptPromptSeed(seed: AcceptedConversationPromptTelemetrySeed, options?: {
        reportSendButton?: boolean;
    }): void;
    /** 同一 session 多 pane 可见仍只记一份 foreground；不同 session 可同时可见。 */
    attachForeground(owner: object, sessionId: string): () => void;
    handleFact(fact: ConversationTelemetryFact): void;
    private handleSubagentLifecycle;
    private handleForegroundSubagentFact;
    private syncForegroundSubagentToolAttribution;
    private handleBackgroundSubagentFact;
    /**
     * 动态工作流子代理的登记与结算。与后台子代理共用同一本
     * detached 账本，差异只在登记事实、终态时机与 step 上的归属字段。
     */
    private handleWorkflowLifecycle;
    private reportBackgroundAgentUsage;
    private handleBackgroundToolLifecycle;
    private reportBackgroundFinalizedSteps;
    private cleanupBackgroundSubagentTelemetry;
    private maybeCleanupBackgroundSubagentTelemetry;
    private reportPendingForegroundSubagentSteps;
    private applyForegroundSubagentAttribution;
    private flushDeferredTerminal;
    reportVisibleChatError(params: {
        surface?: ChatErrorBannerSurface;
        errorKey?: string | null;
        displayMessage: string;
        error: ZCodeUiError;
    }): void;
    /** 仅供有界缓存单测观察；业务逻辑不依赖此值。 */
    getPendingCommandCountForTest(): number;
    /** 仅供 focused tests 等待串行 reporter 清空。 */
    flushReportsForTest(): Promise<void>;
    dispose(): void;
    private enqueueReport;
    private withWorkspaceTelemetryDetail;
    private taskKey;
    private isForeground;
    private shouldIgnoreBackgroundMirror;
    private detachForeground;
    private decrementForeground;
    private resolveCommandId;
    private bufferFact;
    private drainPendingFacts;
    private hasDeferredTerminalForTask;
    private drainPromptBlockedByDeferredTerminal;
    private processPromptFact;
    private handleToolLifecycle;
    private handleTerminal;
    private reportCompletionArms;
    private reportFinalizedSteps;
    private handleCompaction;
}
export {};
//# sourceMappingURL=conversationTelemetrySupervisor.d.ts.map