import { type HTMLAttributes } from "react";
import type { BundledTheme } from "shiki";
import type { CodePreviewSettings } from "@/store/index.js";
export declare function getHighlightedLightweightDiffLine(line: string): {
    code: string;
    marker: string;
};
export declare function buildHighlightedLightweightDiffCode(lines: readonly string[]): string;
export interface HighlightedLightweightDiffPreviewProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
    codePreviewSettings: Pick<CodePreviewSettings, "fontSizePx" | "showLineNumbers" | "wrapLongLines">;
    language: string;
    lines: readonly string[];
    path?: string;
    theme: BundledTheme;
}
export declare function HighlightedLightweightDiffPreview({ codePreviewSettings, language, lines, path, theme, ...props }: HighlightedLightweightDiffPreviewProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=highlighted-lightweight-diff-preview.d.ts.map