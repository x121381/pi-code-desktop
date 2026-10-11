const DEFAULT_BACKGROUND_SESSION_EVENT_COALESCE_MS = 1_500;
const DEFAULT_BACKGROUND_SESSION_EVENT_MAX_ITEMS = 96;
const SESSION_EVENT_KEY_SEPARATOR = "\u0000";
const COALESCIBLE_MODEL_STREAMING_KINDS = new Set([
    "text_delta",
    "reasoning_delta",
    "tool_input_delta",
]);
function asRecord(value) {
    return typeof value === "object" && value !== null && !Array.isArray(value)
        ? value
        : {};
}
function stringField(record, key) {
    const value = record[key];
    return typeof value === "string" ? value : undefined;
}
function getBackgroundSessionEventCoalesceKey(event) {
    const payload = asRecord(event.payload);
    if (event.type === "model.streaming") {
        const kind = stringField(payload, "kind");
        if (!kind || !COALESCIBLE_MODEL_STREAMING_KINDS.has(kind)) {
            return null;
        }
        if (stringField(payload, "delta") === undefined) {
            return null;
        }
        return [
            event.type,
            event.sessionId,
            event.turnId ?? "",
            kind,
            stringField(payload, "inputId") ?? "",
            stringField(payload, "assistantMessageId") ?? "",
            stringField(payload, "toolCallId") ?? "",
            stringField(payload, "parentToolUseId") ?? "",
            stringField(payload, "parentToolCallId") ?? "",
        ].join(SESSION_EVENT_KEY_SEPARATOR);
    }
    if (event.type === "tool.updated" && stringField(payload, "kind") === "progress") {
        return [
            event.type,
            event.sessionId,
            event.turnId ?? "",
            stringField(payload, "inputId") ?? "",
            stringField(payload, "toolCallId") ?? "",
        ].join(SESSION_EVENT_KEY_SEPARATOR);
    }
    if (event.type === "streamRecovery.updated") {
        return [
            event.type,
            event.sessionId,
            event.turnId ?? "",
            stringField(payload, "inputId") ?? "",
            event.traceId ?? "",
        ].join(SESSION_EVENT_KEY_SEPARATOR);
    }
    return null;
}
function mergeBackgroundSessionEvents(current, next) {
    if (current.type === "model.streaming" && next.type === "model.streaming") {
        const currentPayload = asRecord(current.payload);
        const nextPayload = asRecord(next.payload);
        const currentDelta = stringField(currentPayload, "delta") ?? "";
        const nextDelta = stringField(nextPayload, "delta") ?? "";
        return {
            ...next,
            payload: {
                ...nextPayload,
                delta: `${currentDelta}${nextDelta}`,
            },
        };
    }
    // 性能优化：后台工具 progress 只用于“还在跑”的可见摘要，保留最新状态即可。
    return next;
}
export function createBackgroundSessionEventCoalescer(params) {
    const flushDelayMs = params.flushDelayMs ?? DEFAULT_BACKGROUND_SESSION_EVENT_COALESCE_MS;
    const maxItems = params.maxItems ?? DEFAULT_BACKGROUND_SESSION_EVENT_MAX_ITEMS;
    let pendingEvents = [];
    let flushTimer = null;
    let disposed = false;
    function clearFlushTimer() {
        if (!flushTimer) {
            return;
        }
        clearTimeout(flushTimer);
        flushTimer = null;
    }
    function flushPending() {
        if (pendingEvents.length === 0) {
            clearFlushTimer();
            return;
        }
        const events = pendingEvents.map((item) => item.event);
        pendingEvents = [];
        clearFlushTimer();
        for (const event of events) {
            params.emit(event);
        }
    }
    function scheduleFlush() {
        if (disposed || flushTimer || flushDelayMs <= 0) {
            return;
        }
        flushTimer = setTimeout(() => {
            flushTimer = null;
            if (!disposed) {
                flushPending();
            }
        }, flushDelayMs);
    }
    function acceptSessionEvent(event) {
        const key = getBackgroundSessionEventCoalesceKey(event.event);
        if (!key) {
            // 后台降频只能影响可重组的增量。权限、终态、tool result 等结构化事件
            // 必须先落完已有摘要再立即投递，否则会破坏 task 的交互边界。
            flushPending();
            params.emit(event);
            return;
        }
        const existing = pendingEvents.find((item) => item.key === key);
        if (existing) {
            existing.event = {
                type: "session.event",
                event: mergeBackgroundSessionEvents(existing.event.event, event.event),
            };
        }
        else {
            pendingEvents.push({ key, event });
        }
        if (pendingEvents.length >= maxItems || flushDelayMs <= 0) {
            flushPending();
            return;
        }
        scheduleFlush();
    }
    return {
        accept(event) {
            if (disposed) {
                return;
            }
            if (event.type !== "session.event") {
                flushPending();
                params.emit(event);
                return;
            }
            acceptSessionEvent(event);
        },
        flush() {
            flushPending();
        },
        dispose() {
            // desktop continuous 后台订阅被前台接管时会 dispose。
            // 待 flush 的 text/reasoning delta 仍是用户可见正文，不能按普通清理丢弃；
            // 否则切回 session 后运行中消息会从下一段 delta 才开始显示。
            flushPending();
            disposed = true;
            clearFlushTimer();
        },
    };
}
//# sourceMappingURL=zcodeSessionEventCoalescer.js.map