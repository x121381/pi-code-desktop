const MAX_ACK_ENTRIES = 50;
export function recordV4CommandAck(summary) {
    if (typeof window === "undefined")
        return;
    const host = window;
    const buffer = (host.__zcodeV4CommandAcksE2E ??= []);
    buffer.push(summary);
    if (buffer.length > MAX_ACK_ENTRIES) {
        buffer.splice(0, buffer.length - MAX_ACK_ENTRIES);
    }
}
//# sourceMappingURL=commandAckObservability.js.map