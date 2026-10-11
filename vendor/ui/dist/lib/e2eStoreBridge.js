function readE2EStoreBridgeImportMetaEnv() {
    return (import.meta.env ??
        {});
}
export function shouldExposeE2EStoreBridge(env = readE2EStoreBridgeImportMetaEnv()) {
    return typeof window !== "undefined" && env.VITE_ZCODE_E2E_STORE_BRIDGE === "1";
}
//# sourceMappingURL=e2eStoreBridge.js.map