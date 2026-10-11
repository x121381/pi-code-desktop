interface StorageLike {
    getItem(key: string): string | null;
    setItem(key: string, value: string): void;
}
export declare function getPromptHistoryStorageKey(workspacePath: string): string;
export declare function readPromptHistoryEntries(workspacePath: string, storage?: StorageLike | null): string[];
export declare function persistPromptHistoryEntries(workspacePath: string, entries: readonly string[], storage?: StorageLike | null): void;
export {};
//# sourceMappingURL=promptHistoryStorage.d.ts.map