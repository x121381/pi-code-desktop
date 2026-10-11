import { Emitter, VSBuffer } from "@zcode/rpc";
import { WebRemoteControlRpcTransportAssembler, WebRemoteControlRpcTransportEncodingError, encodeWebRemoteControlRpcTransportMessage, measureWebRemoteControlRpcRelayEnvelopeBytes, parseWebRemoteControlRpcTransportPayload, } from "@zcode/shared";
import { AcknowledgedRelayBatchQueue } from "./webRemoteControlAcknowledgedRelayBatchQueue.js";
import { AcknowledgedRelayDeadline } from "./webRemoteControlAcknowledgedRelayDeadline.js";
import { ACKNOWLEDGED_WEB_REMOTE_CONTROL_RELAY_LIMITS, isRawTransportCandidate, measureAcknowledgedRelayBatchBytes, rawIdentityMatches, resolveAcknowledgedRelayLimits, } from "./webRemoteControlAcknowledgedRelayProtocolTypes.js";
export { ACKNOWLEDGED_WEB_REMOTE_CONTROL_RELAY_LIMITS, } from "./webRemoteControlAcknowledgedRelayProtocolTypes.js";
class AcknowledgedRelayProtocol {
    identity;
    sendFrame;
    measureFrameBytes;
    highWaterMarkBytes;
    lowWaterMarkBytes;
    replayBufferMaxBytes;
    assemblyTimeoutMs;
    now;
    deadline;
    onMessageEmitter = new Emitter();
    saturatedEmitter = new Emitter();
    drainedEmitter = new Emitter();
    degradedEmitter = new Emitter();
    assembler;
    outboundBatches = new AcknowledgedRelayBatchQueue();
    queuedInbound = [];
    pendingAckMessageSeq = null;
    pendingAckQueuedAt = null;
    nextPhysicalSeq = 1;
    nextMessageSeq = 1;
    highestFullySentMessageSeq = 0;
    lastAckedMessageSeq = 0;
    unacknowledgedByteCount = 0;
    saturated = false;
    disposed = false;
    degraded = false;
    flushing = false;
    outboundCallDepth = 0;
    assemblyTimer;
    onSaturated = this.saturatedEmitter.event;
    onDrained = this.drainedEmitter.event;
    onDegraded = this.degradedEmitter.event;
    protocol = {
        onMessage: this.onMessageEmitter.event,
        send: (buffer) => this.reserveMessage(buffer.buffer),
        drain: () => Promise.resolve(),
    };
    constructor(options) {
        this.identity = {
            bridgeSessionId: options.bridgeSessionId,
            ...(options.bridgeGeneration === undefined
                ? {}
                : { bridgeGeneration: options.bridgeGeneration }),
            ...(options.recoveryId === undefined ? {} : { recoveryId: options.recoveryId }),
        };
        this.sendFrame = options.sendFrame;
        this.measureFrameBytes =
            options.measureFrameBytes ?? measureWebRemoteControlRpcRelayEnvelopeBytes;
        const limits = resolveAcknowledgedRelayLimits(options);
        this.highWaterMarkBytes = limits.highWaterMarkBytes;
        this.lowWaterMarkBytes = limits.lowWaterMarkBytes;
        this.replayBufferMaxBytes = limits.replayBufferMaxBytes;
        this.assemblyTimeoutMs = limits.assemblyTimeoutMs;
        this.now = options.now ?? Date.now;
        this.deadline = new AcknowledgedRelayDeadline(limits.replayBufferGraceMs, this.now, () => {
            const oldest = this.outboundBatches.oldest;
            return {
                oldestData: oldest
                    ? { queuedAt: oldest.queuedAt, messageSeq: oldest.messageSeq }
                    : null,
                pendingAck: this.pendingAckQueuedAt === null || this.pendingAckMessageSeq === null
                    ? null
                    : { queuedAt: this.pendingAckQueuedAt, messageSeq: this.pendingAckMessageSeq },
            };
        }, (fault) => this.enterDegraded(fault));
        this.assembler = this.createAssembler();
    }
    get unacknowledgedBytes() {
        return this.unacknowledgedByteCount;
    }
    getBridgeSessionId() {
        return this.identity.bridgeSessionId;
    }
    isDegraded() {
        return this.degraded;
    }
    markDegraded(reasonCode = "remote.rpcFrame.manuallyDegraded") {
        this.enterDegraded({ reasonCode, terminal: true });
    }
    createAssembler() {
        return new WebRemoteControlRpcTransportAssembler({
            identity: this.identity,
            timeoutMs: this.assemblyTimeoutMs,
            now: this.now,
        });
    }
    reserveMessage(bytes) {
        if (this.disposed || this.degraded || this.deadline.check())
            return;
        let frames;
        try {
            frames = encodeWebRemoteControlRpcTransportMessage(bytes, {
                ...this.identity,
                firstPhysicalSeq: this.nextPhysicalSeq,
                messageSeq: this.nextMessageSeq,
            });
        }
        catch (error) {
            this.enterDegraded({
                reasonCode: error instanceof WebRemoteControlRpcTransportEncodingError
                    ? error.reasonCode
                    : "remote.rpcFrame.encodingFailed",
                terminal: true,
            });
            return;
        }
        let outerBytes = 0;
        try {
            outerBytes = measureAcknowledgedRelayBatchBytes(frames, this.measureFrameBytes);
        }
        catch {
            this.enterDegraded({ reasonCode: "remote.rpcFrame.outerMeterFailed", terminal: true });
            return;
        }
        if (this.unacknowledgedByteCount + outerBytes > this.replayBufferMaxBytes) {
            // Bugfix：必须在首片发送前对整批 final outer bytes 做 admission，不能给对端留下半条 RPC。
            this.enterDegraded({
                reasonCode: "remote.rpcFrame.replayBufferExceeded",
                terminal: true,
                messageSeq: this.nextMessageSeq,
            });
            return;
        }
        const messageSeq = this.nextMessageSeq;
        const lastFrame = frames.at(-1);
        this.outboundBatches.append({
            messageSeq,
            frames,
            outerBytes,
            queuedAt: this.now(),
            nextFrameIndex: 0,
        });
        this.unacknowledgedByteCount += outerBytes;
        this.nextMessageSeq += 1;
        this.nextPhysicalSeq = lastFrame.seq + 1;
        this.updateSaturationAfterReserve();
        this.deadline.refresh();
        this.flushPendingFrames();
    }
    updateSaturationAfterReserve() {
        if (!this.saturated && this.unacknowledgedByteCount > this.highWaterMarkBytes) {
            this.saturated = true;
            this.saturatedEmitter.fire();
        }
    }
    invokeSend(payload) {
        this.outboundCallDepth += 1;
        try {
            return this.sendFrame(payload) !== false;
        }
        catch {
            this.enterDegraded({ reasonCode: "remote.rpcFrame.sendFailed", terminal: true });
            return false;
        }
        finally {
            this.outboundCallDepth -= 1;
        }
    }
    flushPendingFrames() {
        if (this.disposed || this.degraded || this.deadline.check())
            return false;
        if (this.flushing)
            return false;
        this.flushing = true;
        let locallyDrained = true;
        try {
            while (!this.disposed && !this.degraded) {
                if (this.deadline.check()) {
                    locallyDrained = false;
                    break;
                }
                if (this.pendingAckMessageSeq !== null) {
                    const ackMessageSeq = this.pendingAckMessageSeq;
                    const accepted = this.invokeSend({
                        zcode_type: "rpc-frame-ack",
                        ...this.identity,
                        ackMessageSeq,
                    });
                    if (!accepted || this.degraded || this.disposed) {
                        locallyDrained = false;
                        break;
                    }
                    if (this.pendingAckMessageSeq === ackMessageSeq) {
                        this.pendingAckMessageSeq = null;
                        this.pendingAckQueuedAt = null;
                        this.deadline.refresh();
                    }
                    this.drainQueuedInbound();
                    continue;
                }
                const batch = this.outboundBatches.nextUnsent;
                if (!batch)
                    break;
                const frame = batch.frames[batch.nextFrameIndex];
                const accepted = this.invokeSend(frame);
                if (!accepted || this.degraded || this.disposed) {
                    locallyDrained = false;
                    break;
                }
                batch.nextFrameIndex += 1;
                if (batch.nextFrameIndex === batch.frames.length) {
                    this.highestFullySentMessageSeq = Math.max(this.highestFullySentMessageSeq, batch.messageSeq);
                    this.outboundBatches.advanceUnsent();
                }
                this.drainQueuedInbound();
            }
        }
        finally {
            this.flushing = false;
        }
        if (!this.disposed && !this.degraded)
            this.drainQueuedInbound();
        return locallyDrained && this.pendingAckMessageSeq === null;
    }
    replayUnacknowledged() {
        if (this.disposed || this.degraded || this.deadline.check())
            return false;
        this.outboundBatches.resetReplay();
        return this.flushPendingFrames();
    }
    acceptPayload(payload) {
        if (this.disposed || this.degraded || !isRawTransportCandidate(payload))
            return false;
        if (!rawIdentityMatches(this.identity, payload))
            return false;
        if (this.deadline.check())
            return true;
        if (this.outboundCallDepth > 0) {
            this.queuedInbound.push(payload);
            return true;
        }
        this.processInbound(payload);
        return true;
    }
    drainQueuedInbound() {
        if (this.outboundCallDepth > 0 || this.disposed || this.degraded)
            return;
        while (this.queuedInbound.length > 0 && !this.disposed && !this.degraded) {
            this.processInbound(this.queuedInbound.shift());
        }
    }
    processInbound(candidate) {
        const payload = parseWebRemoteControlRpcTransportPayload(candidate);
        if (!payload) {
            this.enterDegraded({ reasonCode: "remote.rpcFrame.invalidPayload", terminal: true });
            return;
        }
        if (payload.zcode_type === "rpc-frame-ack") {
            this.processAck(payload.ackMessageSeq);
            return;
        }
        const result = this.assembler?.accept(payload, this.now());
        if (!result)
            return;
        if (result.kind === "fault") {
            if (result.fault.terminal)
                this.enterDegraded(result.fault);
            return;
        }
        if (result.kind === "incomplete") {
            this.scheduleAssemblyTimer();
            return;
        }
        if (result.kind === "duplicate") {
            if (result.ackMessageSeq !== null)
                this.queueAck(result.ackMessageSeq);
            return;
        }
        this.clearAssemblyTimer();
        try {
            this.onMessageEmitter.fire(VSBuffer.wrap(result.bytes));
        }
        catch {
            this.enterDegraded({
                reasonCode: "remote.rpcFrame.deliveryFailed",
                terminal: true,
                messageSeq: result.messageSeq,
            });
            return;
        }
        this.queueAck(result.messageSeq);
    }
    queueAck(messageSeq) {
        if (this.disposed || this.degraded)
            return;
        if (this.pendingAckMessageSeq === null) {
            this.pendingAckMessageSeq = messageSeq;
            this.pendingAckQueuedAt = this.now();
            this.deadline.refresh();
        }
        else if (messageSeq > this.pendingAckMessageSeq) {
            this.pendingAckMessageSeq = messageSeq;
        }
        this.flushPendingFrames();
    }
    processAck(ackMessageSeq) {
        if (ackMessageSeq <= this.lastAckedMessageSeq)
            return;
        if (ackMessageSeq > this.highestFullySentMessageSeq) {
            this.enterDegraded({
                reasonCode: "remote.rpcFrame.futureAck",
                terminal: true,
                messageSeq: ackMessageSeq,
            });
            return;
        }
        const { releasedBytes } = this.outboundBatches.releaseThrough(ackMessageSeq);
        this.unacknowledgedByteCount = Math.max(0, this.unacknowledgedByteCount - releasedBytes);
        this.lastAckedMessageSeq = ackMessageSeq;
        this.deadline.refresh();
        if (this.saturated && this.unacknowledgedByteCount <= this.lowWaterMarkBytes) {
            this.saturated = false;
            this.drainedEmitter.fire();
        }
    }
    scheduleAssemblyTimer() {
        if (this.assemblyTimer || !this.assembler?.nextExpiryAt)
            return;
        const deadline = this.assembler.nextExpiryAt;
        this.assemblyTimer = setTimeout(() => {
            this.assemblyTimer = undefined;
            const result = this.assembler?.expire(this.now());
            if (result?.kind === "fault")
                this.enterDegraded(result.fault);
        }, Math.max(0, deadline - this.now()));
    }
    clearAssemblyTimer() {
        if (this.assemblyTimer)
            clearTimeout(this.assemblyTimer);
        this.assemblyTimer = undefined;
    }
    enterDegraded(fault) {
        if (this.disposed || this.degraded)
            return;
        this.degraded = true;
        this.deadline.dispose();
        this.clearAssemblyTimer();
        this.outboundBatches.clear();
        this.queuedInbound = [];
        this.pendingAckMessageSeq = null;
        this.pendingAckQueuedAt = null;
        this.unacknowledgedByteCount = 0;
        this.saturated = false;
        this.assembler = null;
        this.degradedEmitter.fire(fault);
    }
    dispose() {
        if (this.disposed)
            return;
        this.disposed = true;
        this.deadline.dispose();
        this.clearAssemblyTimer();
        this.outboundBatches.clear();
        this.queuedInbound = [];
        this.pendingAckMessageSeq = null;
        this.pendingAckQueuedAt = null;
        this.unacknowledgedByteCount = 0;
        this.assembler = null;
        this.onMessageEmitter.dispose();
        this.saturatedEmitter.dispose();
        this.drainedEmitter.dispose();
        this.degradedEmitter.dispose();
    }
}
export function createAcknowledgedWebRemoteControlRelayProtocol(options) {
    return new AcknowledgedRelayProtocol(options);
}
//# sourceMappingURL=webRemoteControlAcknowledgedRelayProtocol.js.map