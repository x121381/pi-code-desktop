function getLocalStorageCandidate() {
    try {
        return typeof window !== "undefined"
            ? window.localStorage
            : typeof localStorage !== "undefined"
                ? localStorage
                : undefined;
    }
    catch {
        return undefined;
    }
}
function isBrowserReadableStorageLike(storage) {
    return (Boolean(storage) &&
        typeof storage.getItem === "function");
}
function isBrowserStorageLike(storage) {
    return (isBrowserReadableStorageLike(storage) &&
        typeof storage.setItem === "function");
}
export function getSafeReadableLocalStorage() {
    const storage = getLocalStorageCandidate();
    if (!isBrowserReadableStorageLike(storage)) {
        return null;
    }
    return storage;
}
export function getSafeLocalStorage() {
    const storage = getLocalStorageCandidate();
    if (!isBrowserStorageLike(storage)) {
        return null;
    }
    return storage;
}
export function readSafeLocalStorage(key) {
    try {
        return getSafeReadableLocalStorage()?.getItem(key) ?? null;
    }
    catch {
        return null;
    }
}
export function writeSafeLocalStorage(key, value) {
    try {
        getSafeLocalStorage()?.setItem(key, value);
    }
    catch {
        // SSR/测试环境或隐私模式下 localStorage 可能存在但不可写。
        // 写入失败不应阻断 UI 渲染，真实偏好下次仍可从 settingService 或默认值恢复。
    }
}
export function readNavigatorLanguage() {
    if (typeof navigator === "undefined" || typeof navigator.language !== "string") {
        return null;
    }
    return navigator.language;
}
//# sourceMappingURL=browserEnvironment.js.map