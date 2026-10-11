export declare function openFolderFromWorkspaceEntry({ selectDirectory, openDirectoryBrowser, preferDirectoryBrowser, onSelectProject, }: {
    selectDirectory?: () => Promise<string | null>;
    openDirectoryBrowser?: () => void;
    preferDirectoryBrowser?: boolean;
    onSelectProject: (path: string) => void;
}): Promise<void>;
//# sourceMappingURL=openWorkspaceFolderEntry.d.ts.map