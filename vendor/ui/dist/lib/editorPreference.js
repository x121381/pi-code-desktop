const LAST_SELECTED_EDITOR_STORAGE_KEY = "zcode-last-editor-id";
function getBrowserStorage() {
    if (typeof window === "undefined") {
        return null;
    }
    try {
        return window.localStorage;
    }
    catch {
        return null;
    }
}
export function readLastSelectedEditorId(storage = getBrowserStorage()) {
    const rawValue = storage?.getItem(LAST_SELECTED_EDITOR_STORAGE_KEY);
    if (typeof rawValue !== "string" || rawValue.length === 0) {
        return null;
    }
    return rawValue;
}
export function persistLastSelectedEditorId(editorId, storage = getBrowserStorage()) {
    storage?.setItem(LAST_SELECTED_EDITOR_STORAGE_KEY, editorId);
}
//# sourceMappingURL=editorPreference.js.map