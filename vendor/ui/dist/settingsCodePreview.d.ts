import type { Theme } from "@/useTheme.js";
import type { CodePreviewSettings } from "@/store/index.js";
export declare function AppearanceSectionContent({ codePreviewSettings, setCodePreviewSettings, theme, setTheme, uiFontSizePx, setUiFontSizePx, }: {
    codePreviewSettings: CodePreviewSettings;
    setCodePreviewSettings: (settings: Partial<CodePreviewSettings>) => void;
    theme: Theme;
    setTheme: (theme: Theme) => void;
    uiFontSizePx: number;
    setUiFontSizePx: (fontSizePx: number) => void;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=settingsCodePreview.d.ts.map