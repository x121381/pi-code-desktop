interface StorageLike {
    getItem(key: string): string | null;
    setItem(key: string, value: string): void;
}
export declare function readLastSelectedEditorId(storage?: StorageLike | null): string | null;
export declare function persistLastSelectedEditorId(editorId: string, storage?: StorageLike | null): void;
export {};
//# sourceMappingURL=editorPreference.d.ts.map