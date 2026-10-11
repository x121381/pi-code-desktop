export declare const DEFAULT_UI_FONT_SIZE_PX = 14;
export declare const MIN_UI_FONT_SIZE_PX = 12;
export declare const MAX_UI_FONT_SIZE_PX = 20;
export declare const UI_FONT_SIZE_STORAGE_KEY = "zcode-ui-font-size-px";
export declare function normalizeUiFontSizePx(value: unknown): number;
export declare function loadUiFontSizePx(): number;
export declare function applyUiFontSizePx(fontSizePx: number): void;
export declare function subscribeToUiFontSizeStorageChanges(): () => void;
//# sourceMappingURL=uiFontSize.d.ts.map