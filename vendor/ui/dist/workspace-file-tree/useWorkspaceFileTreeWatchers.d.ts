import type { IFileWatcherService } from "@zcode/services";
export declare function useWorkspaceFileTreeWatchers({ fileWatcherService, watchedDirectoryPaths, onDirectoryChange, }: {
    fileWatcherService: IFileWatcherService;
    watchedDirectoryPaths: Set<string>;
    onDirectoryChange: (path: string) => void;
}): void;
//# sourceMappingURL=useWorkspaceFileTreeWatchers.d.ts.map