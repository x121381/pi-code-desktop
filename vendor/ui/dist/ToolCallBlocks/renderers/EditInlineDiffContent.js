import { jsx as _jsx } from "react/jsx-runtime";
import { memo, useMemo } from "react";
import { buildHighlightedLightweightDiffCode, getHighlightedLightweightDiffLine, HighlightedLightweightDiffPreview, } from "@/components/ui/highlighted-lightweight-diff-preview.js";
import { inferCodeLanguage } from "@/lib/codeViewer.js";
import { getPlainTextPatchPreviewLines } from "@/lib/patchDiffPreview.js";
import { DEFAULT_CODE_PREVIEW_SETTINGS } from "@/lib/codePreviewSettings.js";
export { buildHighlightedLightweightDiffCode as buildInlineDiffHighlightCode, getHighlightedLightweightDiffLine as getInlineDiffHighlightLine, };
function resolveInlineDiffHighlightTheme(theme, codePreviewSettings) {
    if (theme === "system") {
        if (typeof window !== "undefined") {
            return window.matchMedia("(prefers-color-scheme: dark)").matches
                ? codePreviewSettings.darkTheme
                : codePreviewSettings.lightTheme;
        }
        return codePreviewSettings.lightTheme;
    }
    return theme === "dark" || theme === "zai-dark"
        ? codePreviewSettings.darkTheme
        : codePreviewSettings.lightTheme;
}
export const EditInlineDiffContent = memo(function EditInlineDiffContent({ preview, theme = "system", codePreviewSettings = DEFAULT_CODE_PREVIEW_SETTINGS, }) {
    const previewLines = useMemo(() => getPlainTextPatchPreviewLines(preview.patch), [preview.patch]);
    const highlightLanguage = useMemo(() => inferCodeLanguage(preview.path ?? preview.title, preview.patch), [preview.patch, preview.path, preview.title]);
    const highlightTheme = useMemo(() => resolveInlineDiffHighlightTheme(theme, codePreviewSettings), [codePreviewSettings, theme]);
    return (_jsx("div", { className: "space-y-3", children: _jsx("div", { className: "mb-2 max-h-60 overflow-auto rounded-xl border border-border bg-card", "data-inline-diff-preview": true, children: _jsx(HighlightedLightweightDiffPreview, { className: "h-full bg-card", codePreviewSettings: codePreviewSettings, "data-inline-diff-highlight-language": highlightLanguage, "data-inline-diff-highlight-theme": highlightTheme, language: highlightLanguage, lines: previewLines, path: preview.path ?? preview.title, theme: highlightTheme }) }) }));
});
EditInlineDiffContent.displayName = "EditInlineDiffContent";
//# sourceMappingURL=EditInlineDiffContent.js.map