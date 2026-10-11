import type { BundledTheme } from "shiki";
import type { CodePreviewSettings } from "@/store/index.js";
interface CodePreviewThemeOption {
    value: BundledTheme;
    label: string;
}
export declare const CODE_PREVIEW_THEME_OPTIONS: CodePreviewThemeOption[];
export declare function isDarkCodePreviewTheme(theme: BundledTheme): boolean;
export declare const SETTINGS_PREVIEW_CODE = "const themePreview: ThemeConfig = {\n  surface: \"sidebar\",\n  accent: \"#339CFF\",\n  contrast: 45,\n};";
export declare function getCodePreviewTheme(mode: "light" | "dark", settings: CodePreviewSettings): BundledTheme;
export {};
//# sourceMappingURL=codePreviewPreferences.d.ts.map