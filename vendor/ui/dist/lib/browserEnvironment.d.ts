export interface BrowserReadableStorageLike {
    getItem(key: string): string | null;
}
export interface BrowserStorageLike extends BrowserReadableStorageLike {
    setItem(key: string, value: string): void;
}
export declare function getSafeReadableLocalStorage(): BrowserReadableStorageLike | null;
export declare function getSafeLocalStorage(): BrowserStorageLike | null;
export declare function readSafeLocalStorage(key: string): string | null;
export declare function writeSafeLocalStorage(key: string, value: string): void;
export declare function readNavigatorLanguage(): string | null;
//# sourceMappingURL=browserEnvironment.d.ts.map