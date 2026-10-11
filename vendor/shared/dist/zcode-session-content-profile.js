const ELIDED_DATA_URL = "data:,";
function elidePartForIndex(part) {
    switch (part.type) {
        case "reasoning":
            return part.text ? { ...part, text: "" } : part;
        case "file":
            return part.url.startsWith("data:") && part.url !== ELIDED_DATA_URL
                ? { ...part, url: ELIDED_DATA_URL }
                : part;
        case "tool": {
            const state = part.state;
            switch (state.status) {
                case "pending":
                    return { ...part, state: { ...state, input: {}, raw: "" } };
                case "running":
                    return {
                        ...part,
                        state: { ...state, input: {}, ...(state.metadata ? { metadata: {} } : {}) },
                    };
                case "completed":
                    return { ...part, state: { ...state, input: {}, output: "", metadata: {} } };
                case "error":
                    return {
                        ...part,
                        state: { ...state, input: {}, error: "", ...(state.metadata ? { metadata: {} } : {}) },
                    };
                default:
                    return part;
            }
        }
        default:
            return part;
    }
}
function elideMessageForIndex(message) {
    let changed = false;
    const parts = message.parts.map((part) => {
        const next = elidePartForIndex(part);
        if (next !== part)
            changed = true;
        return next;
    });
    return changed ? { ...message, parts } : message;
}
/** 生成 task index 专用的轻量 snapshot；不修改入参（CLI 侧 messages 可能来自共享缓存）。 */
export function elideSessionSnapshotForIndex(snapshot) {
    return { ...snapshot, messages: snapshot.messages.map(elideMessageForIndex) };
}
//# sourceMappingURL=zcode-session-content-profile.js.map