interface StorageLike {
    getItem(key: string): string | null;
    setItem(key: string, value: string): void;
    removeItem(key: string): void;
}
export declare function getComposerDraftStorageKey(workspacePath: string, workspaceIdentity?: string): string;
export declare function clearPersistedComposerDraft(workspacePath: string, taskId: string | null, workspaceIdentity?: string, storage?: StorageLike | null): void;
export {};
//# sourceMappingURL=chatComposerDraftStorage.d.ts.map