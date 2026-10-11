import { ZCODE_OFFICIAL_PLUGIN_MARKETPLACE_ID, } from "@zcode/shared";
export async function trackDraftSuggestedPluginOperation(operation, pending) {
    operation.pending = pending;
    try {
        return await pending;
    }
    finally {
        if (operation.pending === pending)
            delete operation.pending;
    }
}
export function resolveDraftSuggestedPluginFlowStage(result) {
    const { status } = result;
    if ((status === "ready" || status === "disabled" || status === "missing") &&
        (result.marketplace !== ZCODE_OFFICIAL_PLUGIN_MARKETPLACE_ID ||
            result.sourceTrust !== "official" ||
            !result.pluginName)) {
        return "unavailable";
    }
    if (status === "missing" || status === "disabled")
        return status;
    return status === "ready" ? "checking" : "unavailable";
}
export function resolveSuggestedPluginClientBoundary(isWebRemoteControl) {
    const profile = isWebRemoteControl
        ? "web-remote-replayable"
        : "desktop-continuous";
    return { clientMode: profile, deliveryKind: profile };
}
//# sourceMappingURL=ConversationDraftSuggestedPluginFlow.js.map