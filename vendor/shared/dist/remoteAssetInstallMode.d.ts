export declare const REMOTE_ASSET_INSTALL_MODES: readonly ["local-download-upload", "remote-download"];
export type RemoteAssetInstallMode = (typeof REMOTE_ASSET_INSTALL_MODES)[number];
export declare const DEFAULT_REMOTE_ASSET_INSTALL_MODE: RemoteAssetInstallMode;
export declare function normalizeRemoteAssetInstallMode(mode?: RemoteAssetInstallMode | null): RemoteAssetInstallMode;
//# sourceMappingURL=remoteAssetInstallMode.d.ts.map