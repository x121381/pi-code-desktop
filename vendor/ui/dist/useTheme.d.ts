export type Theme = "light" | "dark" | "zai-light" | "zai-dark" | "system";
export type ResolvedTheme = "light" | "dark";
export declare function resolveTheme(theme: Theme): ResolvedTheme;
export declare function normalizeThemePreference(theme: Theme): Theme;
export declare function applyTheme(theme: Theme): void;
export declare function useTheme(): {
    readonly theme: Theme;
    readonly setTheme: (t: Theme) => void;
};
//# sourceMappingURL=useTheme.d.ts.map