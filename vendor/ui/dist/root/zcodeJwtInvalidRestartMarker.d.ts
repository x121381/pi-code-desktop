interface RestartMarkerStorage {
    getItem(key: string): string | null;
    removeItem(key: string): void;
    setItem(key: string, value: string): void;
}
export declare function markZcodeJwtInvalidRestart(storage?: RestartMarkerStorage): void;
export declare function consumeZcodeJwtInvalidRestartMarker(storage?: RestartMarkerStorage): boolean;
export {};
//# sourceMappingURL=zcodeJwtInvalidRestartMarker.d.ts.map