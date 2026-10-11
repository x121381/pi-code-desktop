export interface WslUncWorkspacePath {
    distro: string;
    linuxPath: string;
    originalPath: string;
}
export declare function parseWslUncWorkspacePath(path: string): WslUncWorkspacePath | null;
export declare function isWslUncWorkspacePath(path: string): boolean;
//# sourceMappingURL=wslUncWorkspace.d.ts.map