import { WEB_REMOTE_CONTROL_RPC_TRANSPORT_LIMITS, } from "@zcode/shared";
export const ACKNOWLEDGED_WEB_REMOTE_CONTROL_RELAY_LIMITS = {
    saturationHighWaterMarkBytes: 1024 * 1024,
    saturationLowWaterMarkBytes: 256 * 1024,
    replayBufferMaxBytes: 8 * 1024 * 1024,
    replayBufferGraceMs: 45_000,
    assemblyTimeoutMs: WEB_REMOTE_CONTROL_RPC_TRANSPORT_LIMITS.assemblyTimeoutMs,
};
export function requirePositiveSafeInteger(value, name) {
    if (!Number.isSafeInteger(value) || value <= 0) {
        throw new Error(`${name} must be a positive safe integer`);
    }
    return value;
}
export function requireNonnegativeSafeInteger(value, name) {
    if (!Number.isSafeInteger(value) || value < 0) {
        throw new Error(`${name} must be a nonnegative safe integer`);
    }
    return value;
}
export function rawIdentityMatches(identity, candidate) {
    if (typeof candidate !== "object" || candidate === null)
        return false;
    const value = candidate;
    return (value.bridgeSessionId === identity.bridgeSessionId &&
        value.bridgeGeneration === identity.bridgeGeneration &&
        value.recoveryId === identity.recoveryId);
}
export function isRawTransportCandidate(candidate) {
    if (typeof candidate !== "object" || candidate === null)
        return false;
    const type = candidate.zcode_type;
    return type === "rpc-frame" || type === "rpc-frame-ack";
}
export function measureAcknowledgedRelayBatchBytes(frames, measureFrameBytes) {
    let total = 0;
    for (const frame of frames) {
        const frameBytes = measureFrameBytes(frame);
        if (!Number.isSafeInteger(frameBytes) ||
            frameBytes <= 0 ||
            frameBytes > WEB_REMOTE_CONTROL_RPC_TRANSPORT_LIMITS.maxPhysicalFrameBytes) {
            throw new Error("invalid final envelope byte count");
        }
        total += frameBytes;
    }
    return total;
}
export function resolveAcknowledgedRelayLimits(options) {
    const highWaterMarkBytes = requirePositiveSafeInteger(options.saturationHighWaterMarkBytes ??
        ACKNOWLEDGED_WEB_REMOTE_CONTROL_RELAY_LIMITS.saturationHighWaterMarkBytes, "saturationHighWaterMarkBytes");
    const lowWaterMarkBytes = requireNonnegativeSafeInteger(options.saturationLowWaterMarkBytes ??
        ACKNOWLEDGED_WEB_REMOTE_CONTROL_RELAY_LIMITS.saturationLowWaterMarkBytes, "saturationLowWaterMarkBytes");
    if (lowWaterMarkBytes > highWaterMarkBytes) {
        throw new Error("saturationLowWaterMarkBytes must not exceed high watermark");
    }
    return {
        highWaterMarkBytes,
        lowWaterMarkBytes,
        replayBufferMaxBytes: Math.min(requirePositiveSafeInteger(options.replayBufferMaxBytes ??
            ACKNOWLEDGED_WEB_REMOTE_CONTROL_RELAY_LIMITS.replayBufferMaxBytes, "replayBufferMaxBytes"), ACKNOWLEDGED_WEB_REMOTE_CONTROL_RELAY_LIMITS.replayBufferMaxBytes),
        replayBufferGraceMs: Math.min(requirePositiveSafeInteger(options.replayBufferGraceMs ??
            ACKNOWLEDGED_WEB_REMOTE_CONTROL_RELAY_LIMITS.replayBufferGraceMs, "replayBufferGraceMs"), ACKNOWLEDGED_WEB_REMOTE_CONTROL_RELAY_LIMITS.replayBufferGraceMs),
        assemblyTimeoutMs: Math.min(requirePositiveSafeInteger(options.assemblyTimeoutMs ??
            ACKNOWLEDGED_WEB_REMOTE_CONTROL_RELAY_LIMITS.assemblyTimeoutMs, "assemblyTimeoutMs"), ACKNOWLEDGED_WEB_REMOTE_CONTROL_RELAY_LIMITS.assemblyTimeoutMs),
    };
}
//# sourceMappingURL=webRemoteControlAcknowledgedRelayProtocolTypes.js.map