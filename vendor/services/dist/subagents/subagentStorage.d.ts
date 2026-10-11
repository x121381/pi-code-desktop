export interface SubagentStorageOptions {
    homeDir?: string;
}
export declare function resolveUserHomeDir(options?: SubagentStorageOptions): string;
export declare function resolveUserSubagentRoot(options?: SubagentStorageOptions): Promise<string>;
export declare function resolveWorkspaceSubagentRoot(workspacePath: string): string;
export declare function resolveSubagentStateFile(options?: SubagentStorageOptions): Promise<string>;
export declare function resolveZCodeStorageRoot(options?: SubagentStorageOptions): Promise<string>;
export declare function resolveConfigPath(path: string, options?: SubagentStorageOptions): string;
//# sourceMappingURL=subagentStorage.d.ts.map