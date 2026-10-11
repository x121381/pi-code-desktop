import { logger } from "@/logger.js";
export const SESSION_OPEN_ARMS_GROUP = "ui_perf";
export const SESSION_OPEN_EVENT_START = "perf_ui_session_open_start";
export const SESSION_OPEN_EVENT_RESULT = "perf_ui_session_open_result";
let reporter = null;
export function setSessionOpenArmsReporter(next) {
    reporter = next;
}
export function clearSessionOpenArmsReporterForTest() {
    reporter = null;
}
function roundedNonNegative(value) {
    if (typeof value !== "number" || !Number.isFinite(value) || value < 0)
        return undefined;
    return Math.round(value);
}
function positiveOrZeroInteger(value) {
    if (typeof value !== "number" || !Number.isFinite(value) || value < 0)
        return undefined;
    return Math.round(value);
}
function emit(payload, targetReporter = reporter) {
    if (!targetReporter)
        return;
    try {
        void Promise.resolve(targetReporter.reportArmsCustomEvent(payload)).catch((error) => {
            logger.warn("[session-open] ARMS 上报失败", { name: payload.name, error });
        });
    }
    catch (error) {
        logger.warn("[session-open] ARMS 上报异常", { name: payload.name, error });
    }
}
function identityProperties(identity) {
    return {
        session_open_id: identity.sessionOpenId,
        session_id: identity.sessionId,
        open_trigger: identity.openTrigger,
        open_kind: identity.openKind,
        client_mode: identity.clientMode,
    };
}
export function buildSessionOpenStartArmsPayload(identity) {
    return {
        name: SESSION_OPEN_EVENT_START,
        group: SESSION_OPEN_ARMS_GROUP,
        value: 1,
        properties: identityProperties(identity),
    };
}
export function buildSessionOpenResultArmsPayload(identity) {
    const properties = {
        ...identityProperties(identity),
        status: identity.status,
        error_phase: identity.errorPhase,
        error_code: identity.errorCode,
        total_ms: roundedNonNegative(identity.totalMs),
        renderer_prepare_ms: roundedNonNegative(identity.rendererPrepareMs),
        host_prepare_ms: roundedNonNegative(identity.hostPrepareMs),
        provider_registry_sync_ms: roundedNonNegative(identity.providerRegistrySyncMs),
        task_meta_read_ms: roundedNonNegative(identity.taskMetaReadMs),
        cli_request_ms: roundedNonNegative(identity.cliRequestMs),
        cli_bootstrap_ms: roundedNonNegative(identity.cliBootstrapMs),
        cli_session_restore_ms: roundedNonNegative(identity.cliSessionRestoreMs),
        initial_frame_encode_ms: roundedNonNegative(identity.initialFrameEncodeMs),
        initial_frame_transport_ms: roundedNonNegative(identity.initialFrameTransportMs),
        renderer_snapshot_apply_ms: roundedNonNegative(identity.rendererSnapshotApplyMs),
        react_render_ms: roundedNonNegative(identity.reactRenderMs),
        paint_to_interactive_ms: roundedNonNegative(identity.paintToInteractiveMs),
        cli_process_state: identity.cliProcessState,
        session_runtime_state: identity.sessionRuntimeState,
        attempt_count: positiveOrZeroInteger(identity.attemptCount),
        persisted_message_count: positiveOrZeroInteger(identity.persistedMessageCount),
        snapshot_row_count: positiveOrZeroInteger(identity.snapshotRowCount),
        snapshot_bytes: positiveOrZeroInteger(identity.snapshotBytes),
        plugin_count: positiveOrZeroInteger(identity.pluginCount),
        skill_count: positiveOrZeroInteger(identity.skillCount),
        mcp_server_count: positiveOrZeroInteger(identity.mcpServerCount),
        mcp_pending_at_interactive: identity.mcpPendingAtInteractive,
    };
    return {
        name: SESSION_OPEN_EVENT_RESULT,
        group: SESSION_OPEN_ARMS_GROUP,
        value: roundedNonNegative(identity.totalMs) ?? 0,
        properties,
    };
}
export function reportSessionOpenStart(identity, targetReporter) {
    emit(buildSessionOpenStartArmsPayload(identity), targetReporter);
}
export function reportSessionOpenResult(identity, targetReporter) {
    emit(buildSessionOpenResultArmsPayload(identity), targetReporter);
}
//# sourceMappingURL=sessionOpenArmsTelemetry.js.map