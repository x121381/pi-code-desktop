export declare const PLUGIN_SYNC_METADATA_ARCHIVE_PATH = ".zcode-plugin-sync.json";
export type PluginSyncArchiveEntry = {
    sourcePath: string;
    archivePath: string;
} | {
    content: string | Uint8Array;
    archivePath: string;
    mode?: number;
    mtimeMs?: number;
};
export interface PluginSyncArchiveMetadata {
    plugins: Array<{
        name: string;
        pluginId: string;
        directoryName: string;
        enabled?: boolean;
    }>;
    marketplaceSources?: Array<{
        marketplaceId: string;
        directoryName: string;
    }>;
}
export interface PluginSyncArchiveExtractOptions {
    maxExtractedBytes?: number;
}
export declare function createPluginSyncArchive(params: {
    entries: readonly PluginSyncArchiveEntry[];
    metadata: PluginSyncArchiveMetadata;
}): Promise<Uint8Array>;
export declare function extractPluginSyncArchive(archive: Uint8Array, targetDir: string, options?: PluginSyncArchiveExtractOptions): Promise<void>;
//# sourceMappingURL=pluginSyncArchive.d.ts.map