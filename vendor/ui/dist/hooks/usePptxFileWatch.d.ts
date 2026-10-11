import type { IFileWatcherService } from "@zcode/services";
import type { FileWatchEvent } from "@zcode/shared";
export declare function shouldReloadPptxPreviewForWatchEvent(event: FileWatchEvent, filePath: string): boolean;
export declare function usePptxFileWatch({ filePath, fileWatcherService, }: {
    filePath: string | null;
    fileWatcherService: IFileWatcherService;
}): {
    ready: boolean;
    reloadGeneration: number;
};
//# sourceMappingURL=usePptxFileWatch.d.ts.map