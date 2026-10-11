import type { IFileService } from "./file.js";
import { type WorkspaceFileSearchFilter } from "./workspaceFileMentionFilter.js";
export declare function isSkippableWorkspaceFileListError(error: unknown): boolean;
export declare class FileExistenceCache {
    private readonly entries;
    get size(): number;
    get(path: string): boolean | undefined;
    set(path: string, exists: boolean): void;
}
export interface CreateFileServiceOptions {
    workspaceFileSearchFilter?: WorkspaceFileSearchFilter;
}
export declare function createFileService(options?: CreateFileServiceOptions): IFileService;
//# sourceMappingURL=fileService.d.ts.map