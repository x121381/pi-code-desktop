import type { ZCodeImportableSessionCandidate } from "@zcode/shared";
export declare class ClaudeNativeSessionImportRepo {
    private getNativeProjectsRoots;
    private findSessionFile;
    private collectJsonlFiles;
    private getRelativeProjectsPath;
    scanImportableSessions(params: {
        workspacePath?: string;
        modifiedSince?: number;
        limit?: number;
    }): Promise<ZCodeImportableSessionCandidate[]>;
    findImportableSession(params: {
        workspacePath?: string;
        sessionId: string;
    }): Promise<ZCodeImportableSessionCandidate | null>;
    copySessionFileToWorkspace(params: {
        workspacePath: string;
        workspaceIdentity?: string;
        sourcePath: string;
    }): Promise<{
        outputPath: string;
        createdOutputPaths: string[];
    }>;
}
export declare const claudeNativeSessionImportRepo: ClaudeNativeSessionImportRepo;
//# sourceMappingURL=claudeNativeSessionImportRepo.d.ts.map