export const DEVELOPER_TOOLS_STORAGE_KEYS = [
    "zcode:developer-tools:enabled",
    "zcode:token-debug:enabled",
];
const DISABLED_VALUES = new Set(["0", "false", "off", "no"]);
export function isDeveloperToolsStorageValueEnabled(value) {
    if (value === null) {
        return false;
    }
    const normalized = value.trim().toLowerCase();
    return !DISABLED_VALUES.has(normalized);
}
export function readDeveloperToolsEnabled(storage = getLocalStorage()) {
    if (!storage) {
        return false;
    }
    return DEVELOPER_TOOLS_STORAGE_KEYS.some((key) => {
        try {
            return isDeveloperToolsStorageValueEnabled(storage.getItem(key));
        }
        catch {
            return false;
        }
    });
}
function getLocalStorage() {
    if (typeof window === "undefined") {
        return undefined;
    }
    try {
        return window.localStorage;
    }
    catch {
        return undefined;
    }
}
//# sourceMappingURL=developerToolsPreference.js.map