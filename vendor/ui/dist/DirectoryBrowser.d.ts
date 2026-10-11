import type { IServiceAccessor } from "@zcode/services";
import type { FileEntry } from "@zcode/shared";
export declare function createDirectoryBrowserReadParams(path: string, showHiddenDirectories: boolean): {
    path: string;
    includeHidden?: boolean;
};
export declare function filterDirectoryBrowserEntries(entries: FileEntry[]): FileEntry[];
export declare function getDirectoryBrowserEntryIconKind(entry: Pick<FileEntry, "isSymbolicLink" | "type">): "folder" | "folder-symlink";
export declare function createDirectoryBrowserRequestGuard(): {
    begin: () => number;
    isCurrent: (requestId: number) => boolean;
};
/**
 * 服务端目录浏览对话框。
 * 通过 fileService.readdir 浏览远程/本地服务器的目录结构，
 * 适用于 web 端无法调用系统原生文件选择器的场景。
 */
export declare function DirectoryBrowser({ services, onSelect, onCancel, onPathChange, embedded, }: {
    services: IServiceAccessor;
    onSelect: (path: string) => void;
    onCancel: () => void;
    onPathChange?: (path: string) => void;
    embedded?: boolean;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=DirectoryBrowser.d.ts.map