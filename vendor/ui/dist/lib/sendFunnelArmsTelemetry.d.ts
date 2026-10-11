import type { IPlatformService } from "@zcode/shared";
export declare const SEND_FUNNEL_ARMS_GROUP = "send_funnel";
export declare const SEND_FUNNEL_EVENT_INPUT_FOCUS = "send_input_focus";
export declare const SEND_FUNNEL_EVENT_SEND_CLICK = "send_click";
export declare const SEND_FUNNEL_EVENT_SEND_RESULT = "send_result";
type ArmsReporter = Pick<IPlatformService, "reportArmsCustomEvent">;
/** 发送落定的原因码。 */
export type SendFunnelReasonCode = "attachment_not_ready" | "blocked" | "rejected" | "stale" | "failed" | "render_timeout" | "transport_error" | "provider_not_ready" | "composer_error";
export declare function setSendFunnelArmsReporter(reporter: ArmsReporter | null): void;
export declare function clearSendFunnelArmsReporterForTest(): void;
/** 会话态 / 草稿态，用于区分「已有会话里发」和「新建任务首发」两类漏斗。 */
export declare function composerScopeOf(sessionId: string | null | undefined): "session" | "draft";
/** 点击输入框（仅用户真实聚焦，程序性自动聚焦由 composer 侧拦截）。 */
export declare function reportSendFunnelInputFocus(params: {
    sessionId: string | null;
    focusTime: number;
}): void;
/** 点击发送 / Enter 提交并通过发送门禁。 */
export declare function reportSendFunnelSendClick(params: {
    sessionId: string | null;
    sendClickId: string;
    sendTime: number;
    trigger: "button" | "shortcut";
    extraDetail: Record<string, string>;
}): void;
/**
 * 发送落定（成功与失败共用）。value 取 send_cost_ms，
 * 让 ARMS 可以直接对该事件做 avg/p50/p95/p99 并按 status / reason_code 切分。
 *
 * costMs 是**端到端**耗时：点击发送 → 用户消息呈现在对话历史里。
 * ackCostMs 单独留出「点击发送 → 收到 ACK」那一段，两者相减即「回流 + 渲染」耗时。
 */
export declare function reportSendFunnelSendResult(params: {
    sessionId: string | null;
    commandId?: string;
    sendClickId: string;
    status: "success" | "fail";
    ackStatus?: string;
    reasonCode?: SendFunnelReasonCode;
    costMs: number;
    ackCostMs?: number;
    queueConfirmed: boolean;
    extraDetail: Record<string, string>;
}): void;
export {};
//# sourceMappingURL=sendFunnelArmsTelemetry.d.ts.map