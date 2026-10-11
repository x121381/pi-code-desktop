const MAX_STAGED_FRAMES = 1024;
const MAX_STAGED_BYTES = 32 * 1024 * 1024;
const STAGING_OVERFLOW_REASON = "fault.subscription.initialFrameStagingOverflow";
function encodedBytes(value) {
    return new TextEncoder().encode(JSON.stringify(value)).byteLength;
}
/** transport-local physical-wire barrier；同 topic 并发 pending 各自等 ACK 决定 owner。 */
export function createAckActivationBarrier(deliver) {
    const pendingByTopic = new Map();
    const pendingBySubscriptionId = new Map();
    const activeByTopic = new Map();
    const topicByActiveSubscription = new Map();
    const removePending = (pending) => {
        const group = pendingByTopic.get(pending.topic);
        group?.delete(pending);
        if (group?.size === 0)
            pendingByTopic.delete(pending.topic);
        if (pending.subscriptionId) {
            pendingBySubscriptionId.delete(pending.subscriptionId);
        }
        pending.frames.length = 0;
        pending.stagedBytes = 0;
    };
    return {
        begin(topic) {
            const pending = {
                topic,
                subscriptionId: null,
                frames: [],
                stagedBytes: 0,
                overflowReason: null,
            };
            const group = pendingByTopic.get(topic) ?? new Set();
            group.add(pending);
            pendingByTopic.set(topic, group);
            return pending;
        },
        bind(token, subscriptionId) {
            const pending = token;
            if (pending.overflowReason) {
                const reason = pending.overflowReason;
                removePending(pending);
                throw new Error(reason);
            }
            pending.subscriptionId = subscriptionId;
            pendingBySubscriptionId.set(subscriptionId, pending);
        },
        cancel(token) {
            removePending(token);
        },
        activate(subscriptionId) {
            const pending = pendingBySubscriptionId.get(subscriptionId);
            if (!pending)
                return;
            const previous = activeByTopic.get(pending.topic);
            if (previous && previous !== subscriptionId) {
                topicByActiveSubscription.delete(previous);
            }
            activeByTopic.set(pending.topic, subscriptionId);
            topicByActiveSubscription.set(subscriptionId, pending.topic);
            const frames = pending.frames.filter((frame) => frame.subscriptionId === subscriptionId);
            removePending(pending);
            for (const frame of frames)
                deliver(frame);
            return {
                topic: pending.topic,
                previousSubscriptionId: previous ?? null,
            };
        },
        forget(subscriptionId) {
            const pending = pendingBySubscriptionId.get(subscriptionId);
            if (pending)
                removePending(pending);
            const topic = topicByActiveSubscription.get(subscriptionId);
            if (topic && activeByTopic.get(topic) === subscriptionId) {
                activeByTopic.delete(topic);
            }
            topicByActiveSubscription.delete(subscriptionId);
        },
        accept(frame) {
            if (activeByTopic.get(frame.topic) === frame.subscriptionId) {
                deliver(frame);
                return;
            }
            const group = pendingByTopic.get(frame.topic);
            if (!group)
                return;
            const bytes = encodedBytes(frame);
            for (const pending of group) {
                if (pending.overflowReason)
                    continue;
                if (bytes > MAX_STAGED_BYTES ||
                    pending.frames.length + 1 > MAX_STAGED_FRAMES ||
                    pending.stagedBytes + bytes > MAX_STAGED_BYTES) {
                    // 通过 shift 头部来“维持上限”会留下一个看似可激活、
                    // 实际缺片的 physical batch。越界必须整批清空并让 subscribe 明确失败。
                    pending.frames.length = 0;
                    pending.stagedBytes = 0;
                    pending.overflowReason = STAGING_OVERFLOW_REASON;
                    continue;
                }
                pending.frames.push(frame);
                pending.stagedBytes += bytes;
            }
        },
        clear() {
            for (const group of pendingByTopic.values()) {
                for (const pending of group) {
                    pending.frames.length = 0;
                    pending.stagedBytes = 0;
                }
            }
            pendingByTopic.clear();
            pendingBySubscriptionId.clear();
            activeByTopic.clear();
            topicByActiveSubscription.clear();
        },
    };
}
//# sourceMappingURL=ackActivationBarrier.js.map