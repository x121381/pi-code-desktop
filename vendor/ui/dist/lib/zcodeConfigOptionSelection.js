function readCurrentSelectValue(options, category) {
    const option = options.find((candidate) => candidate.category === category && candidate.type === "select");
    const value = typeof option?.currentValue === "string" ? option.currentValue.trim() : "";
    return value || null;
}
export function readCurrentAgentModel(options) {
    return readCurrentSelectValue(options, "model");
}
export function readCurrentAgentThoughtLevel(options) {
    return readCurrentSelectValue(options, "thought_level");
}
export function isAgentThoughtLevelAvailable(options, thoughtLevel) {
    const normalized = thoughtLevel?.trim();
    if (!normalized)
        return false;
    const option = options.find((candidate) => candidate.category === "thought_level" && candidate.type === "select");
    return Boolean(option?.options?.some((candidate) => candidate.value === normalized));
}
//# sourceMappingURL=zcodeConfigOptionSelection.js.map