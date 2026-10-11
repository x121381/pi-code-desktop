function asRecord(value) {
    return typeof value === "object" && value !== null && !Array.isArray(value)
        ? value
        : null;
}
function readText(record, key) {
    const value = record?.[key];
    return typeof value === "string" && value.trim() ? value.trim() : null;
}
function readOpenTarget(input) {
    const url = readText(asRecord(asRecord(input)?.app), "url");
    if (!url)
        return null;
    try {
        const parsed = new URL(url);
        const leaf = decodeURIComponent(parsed.pathname.split("/").filter(Boolean).at(-1) ?? "");
        return leaf.trim() || null;
    }
    catch {
        return null;
    }
}
const MAC_KEY_SYMBOLS = {
    cmd: "⌘",
    command: "⌘",
    meta: "⌘",
    shift: "⇧",
    alt: "⌥",
    option: "⌥",
    ctrl: "⌃",
    control: "⌃",
};
function formatShortcut(value) {
    const parts = value
        .split("+")
        .map((part) => part.trim())
        .filter(Boolean);
    if (parts.length === 0)
        return value;
    return parts.map((part) => MAC_KEY_SYMBOLS[part.toLowerCase()] ?? part.toUpperCase()).join("");
}
export function readCuaActionDetail(toolName, input) {
    const record = asRecord(input);
    if (toolName === "open_application")
        return readOpenTarget(input);
    if (toolName === "key" || toolName === "hold_key") {
        const shortcut = readText(record, "key") ?? readText(record, "text");
        return shortcut ? formatShortcut(shortcut) : null;
    }
    return null;
}
//# sourceMappingURL=cuaActionDetail.js.map