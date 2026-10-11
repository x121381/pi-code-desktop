/* eslint-disable max-lines -- physical assembly 的 ordinal、预算、校验与释放必须保持单一原子状态机。 */
// V4 incremental physical assembler：ownership 过滤后逐片接纳，只在
// checksum/UTF-8/JSON/schema 全部通过后产出一个 logical frame。
import { z } from "zod";
import { PROTOCOL_V4_LIMITS } from "./core.js";
import { crc32WireBytes, decodeWireBase64 } from "./wire-binary.js";
import { measureTopicNotificationEnvelopeBytes } from "./wire-codec.js";
import { WIRE_FAULT_INVALID_PAYLOAD } from "./wire-fault.js";
const COMPLETE_WIRE_KEYS = new Set([
    "wireVersion",
    "kind",
    "deliveryKind",
    "logicalFrameId",
    "logicalFrameOrdinal",
    "topic",
    "subscriptionId",
    "frame",
]);
const FRAGMENT_WIRE_KEYS = new Set([
    "wireVersion",
    "kind",
    "deliveryKind",
    "logicalFrameId",
    "logicalFrameOrdinal",
    "topic",
    "subscriptionId",
    "fragmentIndex",
    "fragmentCount",
    "logicalBytes",
    "checksum",
    "dataBase64",
]);
const CHECKSUM_KEYS = new Set(["algorithm", "value"]);
function hasOnlyKeys(value, allowed) {
    return Object.keys(value).every((key) => allowed.has(key));
}
function parseDeliveryKind(value) {
    return value === "initial" || value === "online" || value === "recovery" ? value : null;
}
function hasValidFragmentInner(wire) {
    if (!hasOnlyKeys(wire, FRAGMENT_WIRE_KEYS) ||
        typeof wire.fragmentIndex !== "number" ||
        typeof wire.fragmentCount !== "number" ||
        typeof wire.logicalBytes !== "number" ||
        typeof wire.dataBase64 !== "string" ||
        typeof wire.checksum !== "object" ||
        wire.checksum === null ||
        Array.isArray(wire.checksum) ||
        !hasOnlyKeys(wire.checksum, CHECKSUM_KEYS)) {
        return false;
    }
    const checksum = wire.checksum;
    return typeof checksum.algorithm === "string" && typeof checksum.value === "string";
}
function routeKey(topic, subscriptionId) {
    return `${topic}\0${subscriptionId}`;
}
function bytesEqual(left, right) {
    if (left.byteLength !== right.byteLength)
        return false;
    for (let index = 0; index < left.byteLength; index += 1) {
        if (left[index] !== right[index])
            return false;
    }
    return true;
}
function frameMatchesEnvelope(frame, wire) {
    if (typeof frame !== "object" || frame === null)
        return false;
    const value = frame;
    return value.topic === wire.topic && value.subscriptionId === wire.subscriptionId;
}
function hardBound(value, maximum, name) {
    const resolved = value ?? maximum;
    if (!Number.isFinite(resolved) || resolved <= 0) {
        throw new RangeError(`${name} must be a positive finite number`);
    }
    return Math.min(Math.floor(resolved), maximum);
}
export class TopicWireFrameAssembler {
    frameSchema;
    assemblies = new Map();
    /** 每 route 的单调 ordinal tombstone；不会像 bounded id LRU 一样淘汰后复活旧帧。 */
    settledByRoute = new Map();
    stagedDecodedBytes = 0;
    maxAssemblyBytes;
    maxFragments;
    maxConcurrentAssemblies;
    maxStagedDecodedBytes;
    timeoutMs;
    maxPhysicalFrameBytes;
    constructor(frameSchema, options = {}) {
        this.frameSchema = frameSchema;
        this.maxAssemblyBytes = hardBound(options.maxAssemblyBytes, PROTOCOL_V4_LIMITS.logicalFrameAssemblyMaxBytes, "maxAssemblyBytes");
        this.maxFragments = hardBound(options.maxFragments, PROTOCOL_V4_LIMITS.logicalFrameAssemblyMaxFragments, "maxFragments");
        this.maxConcurrentAssemblies = hardBound(options.maxConcurrentAssemblies, PROTOCOL_V4_LIMITS.logicalFrameAssemblyMaxConcurrent, "maxConcurrentAssemblies");
        this.maxStagedDecodedBytes = hardBound(options.maxStagedDecodedBytes, PROTOCOL_V4_LIMITS.logicalFrameAssemblyMaxStagedBytes, "maxStagedDecodedBytes");
        this.timeoutMs = hardBound(options.timeoutMs, PROTOCOL_V4_LIMITS.logicalFrameAssemblyTimeoutMs, "timeoutMs");
        this.maxPhysicalFrameBytes = hardBound(options.maxPhysicalFrameBytes, PROTOCOL_V4_LIMITS.maxFrameBytes, "maxPhysicalFrameBytes");
    }
    accept(wire, now = Date.now()) {
        const events = this.expire(now);
        const key = routeKey(wire.topic, wire.subscriptionId);
        if (!Number.isSafeInteger(wire.logicalFrameOrdinal) ||
            wire.logicalFrameOrdinal < 1) {
            events.push(this.fault(wire, "proto.frameAssemblyMetadataMismatch"));
            return events;
        }
        // ordinal 淘汰检查必须早于 envelope/base64：迟到旧坏片不得释放正在组装的新帧。
        const settled = this.settledByRoute.get(key);
        if (settled) {
            if (wire.logicalFrameOrdinal < settled.logicalFrameOrdinal)
                return events;
            if (wire.logicalFrameOrdinal === settled.logicalFrameOrdinal) {
                if (wire.logicalFrameId !== settled.logicalFrameId) {
                    events.push(this.fault(wire, "proto.frameAssemblyOrdinalConflict"));
                }
                return events;
            }
        }
        const deliveryKind = parseDeliveryKind(wire.deliveryKind);
        if (deliveryKind === "recovery") {
            // accept() 先 expire 再接当前 wire。若旧 online 恰在 recovery 首片到达的
            // 同次调用超时，向 consumer 上报旧 fault 会关掉 route 并丢失已接 recovery
            // fragment。更高 ordinal 的权威 recovery 已取代旧 assembly，过滤该旧 fault；
            // recovery 自身若坏，后续仍会产生带 recovery kind 的 typed fault。
            for (let index = events.length - 1; index >= 0; index -= 1) {
                const event = events[index];
                if (event?.kind === "fault" &&
                    event.fault.topic === wire.topic &&
                    event.fault.subscriptionId === wire.subscriptionId &&
                    event.fault.logicalFrameOrdinal < wire.logicalFrameOrdinal) {
                    events.splice(index, 1);
                }
            }
        }
        const current = this.assemblies.get(key);
        if (current) {
            if (wire.logicalFrameOrdinal < current.logicalFrameOrdinal)
                return events;
            if (wire.logicalFrameOrdinal === current.logicalFrameOrdinal) {
                if (wire.logicalFrameId !== current.logicalFrameId) {
                    this.release(key, current);
                    this.settle(key, current);
                    events.push(this.fault(wire, "proto.frameAssemblyOrdinalConflict"));
                    return events;
                }
            }
            else {
                this.release(key, current);
                this.settle(key, current);
                // same-sub recovery 本来就是权威替换残缺旧帧；若仍把旧 online
                // assembly 作为同批 fault 上报，decoder 会 fail-close 并丢掉紧随其后的完整
                // recovery，flight 永远无法收口。只有权威 recovery 可无 fault supersede。
                if (deliveryKind !== "recovery") {
                    events.push(this.fault(current, "proto.frameAssemblySuperseded"));
                }
            }
        }
        if (deliveryKind === null) {
            this.releaseAndSettle(key, wire);
            events.push(this.fault(wire, "proto.frameAssemblyMetadataMismatch"));
            return events;
        }
        if (wire.kind === "complete") {
            if (!hasOnlyKeys(wire, COMPLETE_WIRE_KEYS) ||
                !Object.prototype.hasOwnProperty.call(wire, "frame")) {
                this.releaseAndSettle(key, wire);
                events.push(this.fault(wire, "proto.frameAssemblyMetadataMismatch"));
                return events;
            }
            if (measureTopicNotificationEnvelopeBytes(wire).maxBytes > this.maxPhysicalFrameBytes) {
                this.releaseAndSettle(key, wire);
                events.push(this.fault(wire, "proto.frameEnvelopeTooLarge"));
                return events;
            }
            const active = this.assemblies.get(key);
            if (active) {
                this.release(key, active);
                this.settle(key, active);
                events.push(this.fault(active, "proto.frameAssemblyMetadataMismatch"));
                return events;
            }
            const logicalBytes = new TextEncoder().encode(JSON.stringify(wire.frame)).byteLength;
            if (logicalBytes > this.maxAssemblyBytes) {
                this.settle(key, wire);
                events.push(this.fault(wire, "proto.frameAssemblyTooLarge"));
                return events;
            }
            if (!frameMatchesEnvelope(wire.frame, wire)) {
                this.settle(key, wire);
                events.push(this.fault(wire, "proto.frameAssemblyMetadataMismatch"));
                return events;
            }
            const parsed = this.frameSchema.safeParse(wire.frame);
            if (!parsed.success) {
                this.settle(key, wire);
                events.push(this.fault(wire, WIRE_FAULT_INVALID_PAYLOAD));
                return events;
            }
            this.settle(key, wire);
            events.push({ kind: "complete", frame: parsed.data, deliveryKind });
            return events;
        }
        if (!hasValidFragmentInner(wire)) {
            this.releaseAndSettle(key, wire);
            events.push(this.fault(wire, "proto.frameAssemblyMetadataMismatch"));
            return events;
        }
        if (measureTopicNotificationEnvelopeBytes(wire).maxBytes > this.maxPhysicalFrameBytes) {
            this.releaseAndSettle(key, wire);
            events.push(this.fault(wire, "proto.frameEnvelopeTooLarge"));
            return events;
        }
        if (wire.fragmentCount > this.maxFragments) {
            this.releaseAndSettle(key, wire);
            events.push(this.fault(wire, "proto.frameFragmentCountExceeded"));
            return events;
        }
        if (wire.logicalBytes > this.maxAssemblyBytes) {
            this.releaseAndSettle(key, wire);
            events.push(this.fault(wire, "proto.frameAssemblyTooLarge"));
            return events;
        }
        if (!Number.isInteger(wire.fragmentCount) ||
            wire.fragmentCount < 1 ||
            !Number.isInteger(wire.fragmentIndex) ||
            wire.fragmentIndex < 0 ||
            wire.fragmentIndex >= wire.fragmentCount ||
            !Number.isInteger(wire.logicalBytes) ||
            wire.logicalBytes < 1 ||
            wire.fragmentCount > wire.logicalBytes ||
            wire.checksum.algorithm !== "crc32" ||
            !/^[0-9a-f]{8}$/u.test(wire.checksum.value)) {
            this.releaseAndSettle(key, wire);
            events.push(this.fault(wire, "proto.frameAssemblyMetadataMismatch"));
            return events;
        }
        const decoded = decodeWireBase64(wire.dataBase64);
        if (!decoded) {
            this.releaseAndSettle(key, wire);
            events.push(this.fault(wire, "proto.frameAssemblyInvalidBase64"));
            return events;
        }
        let assembly = this.assemblies.get(key);
        if (assembly) {
            if (assembly.fragmentCount !== wire.fragmentCount ||
                assembly.deliveryKind !== deliveryKind ||
                assembly.logicalBytes !== wire.logicalBytes ||
                assembly.checksum.algorithm !== wire.checksum.algorithm ||
                assembly.checksum.value !== wire.checksum.value) {
                this.release(key, assembly);
                this.settle(key, assembly);
                events.push(this.fault(wire, "proto.frameAssemblyMetadataMismatch"));
                return events;
            }
        }
        else {
            if (this.assemblies.size >= this.maxConcurrentAssemblies) {
                this.settle(key, wire);
                events.push(this.fault(wire, "proto.frameAssemblyConcurrentLimit"));
                return events;
            }
            if (this.stagedDecodedBytes + decoded.byteLength > this.maxStagedDecodedBytes) {
                this.settle(key, wire);
                events.push(this.fault(wire, "proto.frameAssemblyBudgetExceeded"));
                return events;
            }
            assembly = {
                deliveryKind,
                logicalFrameId: wire.logicalFrameId,
                logicalFrameOrdinal: wire.logicalFrameOrdinal,
                topic: wire.topic,
                subscriptionId: wire.subscriptionId,
                fragmentCount: wire.fragmentCount,
                logicalBytes: wire.logicalBytes,
                checksum: { algorithm: "crc32", value: wire.checksum.value },
                fragments: Array.from({ length: wire.fragmentCount }, () => undefined),
                receivedCount: 0,
                decodedBytes: 0,
                firstSeenAt: now,
            };
            this.assemblies.set(key, assembly);
        }
        const previous = assembly.fragments[wire.fragmentIndex];
        if (previous) {
            if (!bytesEqual(previous, decoded)) {
                this.release(key, assembly);
                this.settle(key, assembly);
                events.push(this.fault(wire, "proto.frameAssemblyFragmentConflict"));
            }
            return events;
        }
        if (this.stagedDecodedBytes + decoded.byteLength > this.maxStagedDecodedBytes) {
            this.release(key, assembly);
            this.settle(key, assembly);
            events.push(this.fault(wire, "proto.frameAssemblyBudgetExceeded"));
            return events;
        }
        if (assembly.decodedBytes + decoded.byteLength > assembly.logicalBytes) {
            this.release(key, assembly);
            this.settle(key, assembly);
            events.push(this.fault(wire, "proto.frameAssemblyLengthMismatch"));
            return events;
        }
        assembly.fragments[wire.fragmentIndex] = decoded;
        assembly.receivedCount += 1;
        assembly.decodedBytes += decoded.byteLength;
        this.stagedDecodedBytes += decoded.byteLength;
        if (assembly.receivedCount !== assembly.fragmentCount)
            return events;
        this.release(key, assembly);
        if (assembly.decodedBytes !== assembly.logicalBytes) {
            this.settle(key, assembly);
            events.push(this.fault(assembly, "proto.frameAssemblyLengthMismatch"));
            return events;
        }
        const logical = new Uint8Array(assembly.decodedBytes);
        let offset = 0;
        for (const fragment of assembly.fragments) {
            if (!fragment) {
                this.settle(key, assembly);
                events.push(this.fault(assembly, "proto.frameAssemblyLengthMismatch"));
                return events;
            }
            logical.set(fragment, offset);
            offset += fragment.byteLength;
        }
        if (crc32WireBytes(logical) !== assembly.checksum.value) {
            this.settle(key, assembly);
            events.push(this.fault(assembly, "proto.frameAssemblyChecksumMismatch"));
            return events;
        }
        let json;
        try {
            json = new TextDecoder("utf-8", { fatal: true }).decode(logical);
        }
        catch {
            this.settle(key, assembly);
            events.push(this.fault(assembly, "proto.frameAssemblyInvalidUtf8"));
            return events;
        }
        let value;
        try {
            value = JSON.parse(json);
        }
        catch {
            this.settle(key, assembly);
            events.push(this.fault(assembly, "proto.frameAssemblyInvalidJson"));
            return events;
        }
        if (!frameMatchesEnvelope(value, assembly)) {
            this.settle(key, assembly);
            events.push(this.fault(assembly, "proto.frameAssemblyMetadataMismatch"));
            return events;
        }
        const parsed = this.frameSchema.safeParse(value);
        if (!parsed.success) {
            this.settle(key, assembly);
            events.push(this.fault(assembly, WIRE_FAULT_INVALID_PAYLOAD));
            return events;
        }
        this.settle(key, assembly);
        events.push({ kind: "complete", frame: parsed.data, deliveryKind: assembly.deliveryKind });
        return events;
    }
    expire(now = Date.now()) {
        const events = [];
        for (const [key, assembly] of this.assemblies) {
            if (now - assembly.firstSeenAt < this.timeoutMs)
                continue;
            this.release(key, assembly);
            this.settle(key, assembly);
            events.push(this.fault(assembly, "proto.frameAssemblyTimedOut"));
        }
        return events;
    }
    discard(topic, subscriptionId) {
        const key = routeKey(topic, subscriptionId);
        const assembly = this.assemblies.get(key);
        if (assembly)
            this.release(key, assembly);
        this.settledByRoute.delete(key);
    }
    /** fault 后释放该 route 的 active bytes，但保留 ordinal tombstone 防旧 replay 复活。 */
    abort(topic, subscriptionId) {
        const key = routeKey(topic, subscriptionId);
        const assembly = this.assemblies.get(key);
        if (!assembly)
            return;
        this.release(key, assembly);
        this.settle(key, assembly);
    }
    clear() {
        this.assemblies.clear();
        this.settledByRoute.clear();
        this.stagedDecodedBytes = 0;
    }
    getStats() {
        return { assemblies: this.assemblies.size, stagedDecodedBytes: this.stagedDecodedBytes };
    }
    get nextExpiryAt() {
        let next = null;
        for (const assembly of this.assemblies.values()) {
            const expiresAt = assembly.firstSeenAt + this.timeoutMs;
            if (next === null || expiresAt < next)
                next = expiresAt;
        }
        return next;
    }
    release(key, assembly) {
        if (this.assemblies.get(key) !== assembly)
            return;
        this.assemblies.delete(key);
        this.stagedDecodedBytes -= assembly.decodedBytes;
    }
    settle(key, frame) {
        const previous = this.settledByRoute.get(key);
        if (previous && previous.logicalFrameOrdinal > frame.logicalFrameOrdinal)
            return;
        this.settledByRoute.set(key, {
            logicalFrameId: frame.logicalFrameId,
            logicalFrameOrdinal: frame.logicalFrameOrdinal,
        });
    }
    releaseAndSettle(key, frame) {
        const active = this.assemblies.get(key);
        if (active &&
            active.logicalFrameOrdinal === frame.logicalFrameOrdinal &&
            active.logicalFrameId === frame.logicalFrameId) {
            this.release(key, active);
        }
        this.settle(key, frame);
    }
    fault(source, reasonCode) {
        const deliveryKind = parseDeliveryKind(source.deliveryKind);
        return {
            kind: "fault",
            fault: {
                ...(deliveryKind === null ? {} : { deliveryKind }),
                reasonCode,
                logicalFrameId: source.logicalFrameId,
                logicalFrameOrdinal: source.logicalFrameOrdinal,
                topic: source.topic,
                subscriptionId: source.subscriptionId,
            },
        };
    }
}
//# sourceMappingURL=wire-assembler.js.map