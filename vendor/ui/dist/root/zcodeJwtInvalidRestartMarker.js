const ZCODE_JWT_INVALID_RESTART_MARKER_KEY = "zcode:auth:jwt-invalid-restart";
function resolveStorage(storage) {
    if (storage) {
        return storage;
    }
    try {
        return globalThis.localStorage;
    }
    catch {
        return null;
    }
}
export function markZcodeJwtInvalidRestart(storage) {
    resolveStorage(storage)?.setItem(ZCODE_JWT_INVALID_RESTART_MARKER_KEY, "1");
}
export function consumeZcodeJwtInvalidRestartMarker(storage) {
    const resolved = resolveStorage(storage);
    if (!resolved || resolved.getItem(ZCODE_JWT_INVALID_RESTART_MARKER_KEY) !== "1") {
        return false;
    }
    // 该标记只服务于本次重启；如果不在读取时删除，后续正常启动仍会被强制带回登录页。
    resolved.removeItem(ZCODE_JWT_INVALID_RESTART_MARKER_KEY);
    return true;
}
//# sourceMappingURL=zcodeJwtInvalidRestartMarker.js.map