export type CommandCenterSearchScope = "all" | "commands" | "conversations" | "files";
export interface CommandCenterSearchHistoryEntry {
    query: string;
    scope: CommandCenterSearchScope;
    updatedAt: number;
}
export declare function readCommandCenterSearchHistory(workspaceKey: string): CommandCenterSearchHistoryEntry[];
export declare function writeCommandCenterSearchHistory(workspaceKey: string, entries: CommandCenterSearchHistoryEntry[]): void;
export declare function pushCommandCenterSearchHistory(params: {
    workspaceKey: string;
    query: string;
    scope: CommandCenterSearchScope;
}): CommandCenterSearchHistoryEntry[];
export declare function clearCommandCenterSearchHistory(workspaceKey: string): void;
//# sourceMappingURL=commandCenterSearchHistory.d.ts.map