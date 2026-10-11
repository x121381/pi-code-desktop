const CANONICAL_SESSION_MODES = new Set([
    "default",
    "yolo",
    "guarded",
    "plan",
    "edit",
    "acceptEdits",
    "auto",
    "dontAsk",
    "bypassPermissions",
    "autoEdit",
    "build",
]);
function readTrimmedString(value) {
    if (typeof value !== "string") {
        return undefined;
    }
    const normalized = value.trim();
    return normalized.length > 0 ? normalized : undefined;
}
function getModeConfigOption(options) {
    return options.find((option) => option.category === "mode" && option.type === "select");
}
function normalizePersistedSessionMode(modeId, _provider) {
    const trimmedModeId = readTrimmedString(modeId);
    if (!trimmedModeId) {
        return undefined;
    }
    if (CANONICAL_SESSION_MODES.has(trimmedModeId)) {
        return trimmedModeId;
    }
    switch (trimmedModeId) {
        // Bugfix: provider 原生 modeId 和本地持久化的 session mode 不是一套枚举。
        // 下发前需要把本地语义映射回 provider options 中真实存在的值。
        case "read-only":
        case "read_only":
            return "plan";
        case "auto_edit":
        case "auto-edit":
        case "autoEdit":
        case "accept_edits":
        case "accept-edits":
            return "acceptEdits";
        case "full-auto":
        case "full_auto":
            return "yolo";
        case "agent":
            // 该 modeId 专属于已下线的第三方 provider；不再映射到任何本地 mode。
            return undefined;
        case "agent-full-access":
        case "agent_full_access":
        case "full-access":
        case "full_access":
            return "bypassPermissions";
        default:
            return undefined;
    }
}
export function resolveProviderModeIdFromConfigOptions(params) {
    const requestedMode = readTrimmedString(params.modeId);
    if (!requestedMode) {
        return undefined;
    }
    const modeOption = getModeConfigOption(params.configOptions);
    const candidates = modeOption?.options ?? [];
    const exactMatch = candidates.find((candidate) => candidate.value === requestedMode);
    if (exactMatch) {
        return exactMatch.value;
    }
    const requestedPersistedMode = normalizePersistedSessionMode(requestedMode, params.provider);
    if (!requestedPersistedMode) {
        return undefined;
    }
    const semanticMatch = candidates.find((candidate) => normalizePersistedSessionMode(candidate.value, params.provider) === requestedPersistedMode);
    return semanticMatch?.value;
}
//# sourceMappingURL=sessionModeOptions.js.map