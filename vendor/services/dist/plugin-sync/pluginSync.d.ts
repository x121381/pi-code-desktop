import type { PluginSyncArchiveExportResult, PluginSyncCandidateListResult, PluginSyncImportResult, PluginSyncRemoteStatusResult, RemoteSyncWriteAccessResult } from "@zcode/shared";
export interface IPluginSyncService {
    listLocalUserPluginCandidates(): Promise<PluginSyncCandidateListResult>;
    listRemoteUserPluginStatuses(params: {
        plugins: Array<{
            pluginId: string;
            directoryName: string;
        }>;
    }): Promise<PluginSyncRemoteStatusResult>;
    exportPluginsArchive(params: {
        pluginIds: string[];
    }): Promise<PluginSyncArchiveExportResult>;
    exportMarketplaceSourceArchive(params: {
        marketplaceId: string;
        pluginNames: string[];
        source: Record<string, unknown>;
    }): Promise<{
        archive: Uint8Array;
        archiveBytes: number;
        marketplaceId: string;
        pluginNames: string[];
    }>;
    importPluginsArchive(params: {
        archive: Uint8Array;
        overwrite?: false;
    }): Promise<PluginSyncImportResult>;
    checkRemoteUserPluginWriteAccess(): Promise<RemoteSyncWriteAccessResult>;
    importMarketplaceSourceArchive(params: {
        archive: Uint8Array;
        overwrite?: false;
    }): Promise<{
        marketplaceId: string;
        path: string;
        status: "skipped" | "synced";
    }>;
}
export declare const IPluginSyncService: import("../descriptors.js").ServiceDescriptor<IPluginSyncService>;
//# sourceMappingURL=pluginSync.d.ts.map