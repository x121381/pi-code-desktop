import { Emitter, VSBuffer } from "@zcode/rpc";
export { ACKNOWLEDGED_WEB_REMOTE_CONTROL_RELAY_LIMITS, createAcknowledgedWebRemoteControlRelayProtocol, } from "./webRemoteControlAcknowledgedRelayProtocol.js";
function bytesToBase64(bytes) {
    let binary = "";
    const chunkSize = 0x8000;
    for (let offset = 0; offset < bytes.byteLength; offset += chunkSize) {
        const chunk = bytes.subarray(offset, offset + chunkSize);
        binary += String.fromCharCode(...chunk);
    }
    return btoa(binary);
}
function base64ToBytes(base64) {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index += 1) {
        bytes[index] = binary.charCodeAt(index);
    }
    return bytes;
}
export function createWebRemoteControlRelayProtocol({ bridgeSessionId, bridgeGeneration, recoveryId, sendFrame, maxBufferedFrames = 50, bufferedFrameTimeoutMs = 5_000, onBufferedFrameTimeout, onFrameGap, }) {
    const onMessage = new Emitter();
    let disposed = false;
    let degraded = false;
    let seq = 0;
    let inboundSeq = 0;
    let bufferedFrameTimer;
    const bufferedFrames = [];
    function clearBufferedFrameTimer() {
        if (!bufferedFrameTimer) {
            return;
        }
        clearTimeout(bufferedFrameTimer);
        bufferedFrameTimer = undefined;
    }
    function startBufferedFrameTimer() {
        if (bufferedFrameTimer || bufferedFrames.length === 0) {
            return;
        }
        if (bufferedFrameTimeoutMs === null) {
            return;
        }
        bufferedFrameTimer = setTimeout(() => {
            bufferedFrameTimer = undefined;
            const timedOutCount = bufferedFrames.length;
            bufferedFrames.length = 0;
            onBufferedFrameTimeout?.(timedOutCount);
        }, bufferedFrameTimeoutMs);
    }
    function bufferFrame(frame) {
        if (bufferedFrames.length >= maxBufferedFrames) {
            const droppedCount = bufferedFrames.length + 1;
            bufferedFrames.length = 0;
            clearBufferedFrameTimer();
            onBufferedFrameTimeout?.(droppedCount);
            return;
        }
        bufferedFrames.push(frame);
        startBufferedFrameTimer();
    }
    function trySendFrame(frame) {
        if (degraded) {
            return false;
        }
        return sendFrame(frame) !== false;
    }
    function flushPendingFrames() {
        if (disposed || degraded || bufferedFrames.length === 0) {
            return false;
        }
        while (bufferedFrames.length > 0) {
            const frame = bufferedFrames[0];
            if (!frame) {
                clearBufferedFrameTimer();
                return true;
            }
            if (!trySendFrame(frame)) {
                startBufferedFrameTimer();
                return false;
            }
            bufferedFrames.shift();
        }
        clearBufferedFrameTimer();
        return true;
    }
    function dropBufferedFrames() {
        const droppedCount = bufferedFrames.length;
        bufferedFrames.length = 0;
        clearBufferedFrameTimer();
        return droppedCount;
    }
    function markDegraded() {
        if (degraded) {
            return;
        }
        degraded = true;
        // Bugfix: 手机硬恢复期间旧 bridge 的 RPC frame 已经无法判断幂等性。
        // 这里进入 degraded 后立即丢弃旧 buffer，避免 paired/send-ready 恢复时把旧请求刷到新状态里。
        dropBufferedFrames();
    }
    const protocol = {
        onMessage: onMessage.event,
        send(buffer) {
            if (disposed) {
                return;
            }
            if (degraded) {
                return;
            }
            seq += 1;
            const frame = {
                zcode_type: "rpc-frame",
                bridgeSessionId,
                ...(bridgeGeneration !== undefined ? { bridgeGeneration } : {}),
                ...(recoveryId ? { recoveryId } : {}),
                seq,
                dataBase64: bytesToBase64(buffer.buffer),
            };
            if (bufferedFrames.length > 0) {
                bufferFrame(frame);
                flushPendingFrames();
                return;
            }
            // Bugfix: relay suspect 窗口内 sendFrame 可能返回 false。
            // RPC 帧不能静默丢弃，先短暂缓冲，等 transport 恢复 paired 后再按序 flush。
            if (!trySendFrame(frame)) {
                bufferFrame(frame);
            }
        },
        drain: () => Promise.resolve(),
    };
    return {
        protocol,
        flushPendingFrames,
        dropBufferedFrames,
        getBridgeSessionId: () => bridgeSessionId,
        isDegraded: () => degraded,
        markDegraded,
        acceptPayload(payload) {
            if (disposed ||
                degraded ||
                payload.zcode_type !== "rpc-frame" ||
                payload.bridgeSessionId !== bridgeSessionId) {
                return;
            }
            const expectedSeq = inboundSeq + 1;
            if (payload.seq <= inboundSeq) {
                return;
            }
            if (payload.seq !== expectedSeq) {
                markDegraded();
                onFrameGap?.({
                    bridgeSessionId,
                    seq: payload.seq,
                    expectedSeq,
                });
                return;
            }
            inboundSeq = payload.seq;
            onMessage.fire(VSBuffer.wrap(base64ToBytes(payload.dataBase64)));
        },
        dispose() {
            disposed = true;
            bufferedFrames.length = 0;
            clearBufferedFrameTimer();
            onMessage.dispose();
        },
    };
}
//# sourceMappingURL=webRemoteControlRelayProtocol.js.map