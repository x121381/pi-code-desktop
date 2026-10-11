import type { SkillSyncArchiveExportResult, SkillSyncCandidateListResult, SkillSyncImportResult, SkillSyncRemoteStatusResult, RemoteSyncWriteAccessResult } from "@zcode/shared";
export interface ISkillSyncService {
    listLocalUserSkillCandidates(): Promise<SkillSyncCandidateListResult>;
    listRemoteUserSkillStatuses(params: {
        directoryNames: string[];
        skills?: Array<{
            directoryName: string;
            name: string;
        }>;
    }): Promise<SkillSyncRemoteStatusResult>;
    exportSkillsArchive(params: {
        skillIds: string[];
    }): Promise<SkillSyncArchiveExportResult>;
    checkRemoteUserSkillWriteAccess(): Promise<RemoteSyncWriteAccessResult>;
    importSkillsArchive(params: {
        archive: Uint8Array;
        overwrite?: false;
    }): Promise<SkillSyncImportResult>;
}
export declare const ISkillSyncService: import("../descriptors.js").ServiceDescriptor<ISkillSyncService>;
//# sourceMappingURL=skillSync.d.ts.map