import { RENDERER_ACTION_TRACE_MAX_BATCH_BYTES, RENDERER_ACTION_TRACE_MAX_BATCH_SPANS, } from "@zcode/shared";
import { resolveUserActionCatalogEntry, } from "../lib/userActionTraceCatalog.js";
const RENDERER_ACTION_TRACE_MAX_QUEUE_SPANS = 256;
const RENDERER_ACTION_TRACE_FLUSH_DELAY_MS = 2_000;
const NOOP_ACTION_HANDLE = {
    complete() { },
    fail() { },
    reject() { },
    cancel() { },
    noop() { },
};
export class RendererUserActionTelemetry {
    config;
    resource;
    sendBatch;
    clock;
    random;
    randomHex;
    completedQueue = [];
    activeActions = new Set();
    flushTimer;
    flushPromise;
    droppedSinceLastFlush = 0;
    sequence = 0;
    constructor(options) {
        this.config = options.config;
        this.resource = options.resource;
        this.sendBatch = options.sendBatch;
        this.clock = options.clock ?? { now: defaultNow };
        this.random = options.random ?? Math.random;
        this.randomHex = options.randomHex ?? randomHex;
    }
    updateConfig(config) {
        this.config = config;
    }
    start(input) {
        const entry = resolveUserActionCatalogEntry(input.featureId, input.action);
        if (!entry ||
            !this.config.enabled ||
            !this.config.enabledGroups.includes(entry.group) ||
            this.random() >= this.config.sampleRatio) {
            return NOOP_ACTION_HANDLE;
        }
        const active = {
            actionId: crypto.randomUUID(),
            entry,
            input,
            spanId: this.randomHex(8),
            startedAt: this.clock.now(),
            timeout: setTimeout(() => {
                this.finish(active, "abandoned", {});
            }, input.timeoutMs ?? entry.timeoutMs),
            traceId: this.randomHex(16),
        };
        this.activeActions.add(active);
        return {
            complete: (result) => this.finish(active, "completed", result ?? {}),
            fail: (failure) => this.finish(active, "failed", failure),
            reject: (result) => this.finish(active, "rejected", result ?? {}),
            cancel: () => this.finish(active, "cancelled", {}),
            noop: () => this.finish(active, "noop", {}),
        };
    }
    flush() {
        if (this.flushPromise)
            return this.flushPromise;
        this.flushPromise = Promise.resolve()
            .then(() => this.flushImpl())
            .finally(() => {
            this.flushPromise = undefined;
            if (this.completedQueue.length > 0 && this.flushTimer === undefined) {
                this.flushTimer = setTimeout(() => {
                    this.flushTimer = undefined;
                    void this.flush();
                }, RENDERER_ACTION_TRACE_FLUSH_DELAY_MS);
            }
        });
        return this.flushPromise;
    }
    async flushImpl() {
        if (this.flushTimer !== undefined) {
            clearTimeout(this.flushTimer);
            this.flushTimer = undefined;
        }
        while (this.completedQueue.length > 0) {
            const spans = this.takeNextBatch();
            if (spans.length === 0)
                break;
            const batch = {
                version: 1,
                rendererInstanceId: this.resource.rendererInstanceId,
                sequence: this.sequence++,
                droppedSinceLastFlush: this.droppedSinceLastFlush,
                resource: this.resource,
                spans,
            };
            this.droppedSinceLastFlush = 0;
            try {
                await this.sendBatch(batch);
            }
            catch {
                // Telemetry 是严格旁路；传输失败不能回压或改变用户操作结果。
            }
        }
    }
    async shutdown() {
        for (const active of this.activeActions) {
            this.finish(active, "abandoned", {});
        }
        await this.flush();
    }
    finish(active, outcome, result) {
        if (!this.activeActions.delete(active))
            return;
        clearTimeout(active.timeout);
        const endedAt = this.clock.now();
        const attributes = {
            feature_id: active.entry.featureId,
            action: active.entry.action,
            catalog_group: active.entry.group,
            operation_kind: active.entry.operationKind,
            surface: active.input.surface ?? active.entry.surface,
            trigger: active.input.trigger,
            outcome,
            action_id: active.actionId,
            ...(result.resultSource ? { result_source: result.resultSource } : {}),
            ...(result.failureStage ? { failure_stage: result.failureStage } : {}),
            ...(result.stateAfter ? { state_after: result.stateAfter } : {}),
            ...(result.configured !== undefined ? { configured: result.configured } : {}),
            ...(result.requiresRestart !== undefined ? { requires_restart: result.requiresRestart } : {}),
            ...(result.sectionId ? { section_id: result.sectionId } : {}),
            ...(result.valueAfter ? { value_after: result.valueAfter } : {}),
            ...(active.input.workspaceKind ? { workspace_kind: active.input.workspaceKind } : {}),
            ...(active.input.remoteKind ? { remote_kind: active.input.remoteKind } : {}),
            ...(result.admissionResult ? { admission_result: result.admissionResult } : {}),
            ...(active.input.automationKind ? { automation_kind: active.input.automationKind } : {}),
        };
        const span = {
            traceId: active.traceId,
            spanId: active.spanId,
            name: "ui_action",
            startTimeUnixMs: active.startedAt,
            endTimeUnixMs: Math.max(endedAt, active.startedAt),
            status: outcome === "failed" || outcome === "rejected" ? "error" : "ok",
            attributes,
        };
        if (this.completedQueue.length >= RENDERER_ACTION_TRACE_MAX_QUEUE_SPANS) {
            this.droppedSinceLastFlush += 1;
            return;
        }
        this.completedQueue.push(span);
        if (this.completedQueue.length >= RENDERER_ACTION_TRACE_MAX_BATCH_SPANS) {
            void this.flush();
        }
        else if (this.flushTimer === undefined) {
            this.flushTimer = setTimeout(() => {
                this.flushTimer = undefined;
                void this.flush();
            }, RENDERER_ACTION_TRACE_FLUSH_DELAY_MS);
        }
    }
    takeNextBatch() {
        const spans = [];
        while (spans.length < RENDERER_ACTION_TRACE_MAX_BATCH_SPANS && this.completedQueue.length > 0) {
            const candidate = this.completedQueue[0];
            if (!candidate)
                break;
            const next = [...spans, candidate];
            const estimatedBytes = JSON.stringify(next).length * 2;
            if (estimatedBytes > RENDERER_ACTION_TRACE_MAX_BATCH_BYTES) {
                if (spans.length === 0) {
                    this.completedQueue.shift();
                    this.droppedSinceLastFlush += 1;
                    continue;
                }
                break;
            }
            spans.push(candidate);
            this.completedQueue.shift();
        }
        return spans;
    }
}
let activeUserActionTelemetry = {
    start: () => NOOP_ACTION_HANDLE,
};
export function setUserActionTelemetry(telemetry) {
    activeUserActionTelemetry = telemetry ?? { start: () => NOOP_ACTION_HANDLE };
}
export function startUserAction(input) {
    return activeUserActionTelemetry.start(input);
}
export async function runUserActionAsync(options) {
    const handle = startUserAction(options.input);
    try {
        const value = await options.operation();
        handle.complete(typeof options.completed === "function" ? options.completed(value) : options.completed);
        return value;
    }
    catch (error) {
        handle.fail({ failureStage: options.failureStage });
        throw error;
    }
}
export function runUserAction(options) {
    const handle = startUserAction(options.input);
    try {
        const value = options.operation();
        handle.complete(typeof options.completed === "function" ? options.completed(value) : options.completed);
        return value;
    }
    catch (error) {
        handle.fail({ failureStage: options.failureStage });
        throw error;
    }
}
function defaultNow() {
    return typeof performance !== "undefined"
        ? performance.timeOrigin + performance.now()
        : Date.now();
}
function randomHex(bytes) {
    const values = new Uint8Array(bytes);
    crypto.getRandomValues(values);
    return Array.from(values, (value) => value.toString(16).padStart(2, "0")).join("");
}
//# sourceMappingURL=userActionTelemetry.js.map