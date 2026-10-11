export const REMOTE_ASSET_INSTALL_MODES = ["local-download-upload", "remote-download"];
export const DEFAULT_REMOTE_ASSET_INSTALL_MODE = "local-download-upload";
export function normalizeRemoteAssetInstallMode(mode) {
    return mode === "remote-download" ? mode : DEFAULT_REMOTE_ASSET_INSTALL_MODE;
}
//# sourceMappingURL=remoteAssetInstallMode.js.map