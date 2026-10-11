import { shouldExposeE2EStoreBridge } from "../lib/e2eStoreBridge.js";
/** 仅 E2E build 的公开传输 seam 故障注入；只延迟真实命令/ACK，不伪造事件。 */
export async function sendWithConversationDelayE2E(envelope, send) {
    const host = typeof window === "undefined"
        ? undefined
        : window;
    const plan = shouldExposeE2EStoreBridge() && envelope.ttft ? host?.__zcodeTransportDelayE2E : undefined;
    if (!plan || plan.consumed)
        return send();
    plan.consumed = true;
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, Number.isFinite(ms) ? Math.min(10000, Math.max(0, ms)) : 0));
    await delay(plan.commandMs);
    const ack = await send();
    await delay(plan.ackMs);
    plan.ackReleased = true;
    return ack;
}
//# sourceMappingURL=conversationTransportDelayE2E.js.map