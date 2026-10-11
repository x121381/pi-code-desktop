import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { resolveTheme } from "./useTheme.js";
import { Card, CardContent } from "./components/ui/card.js";
import { Input } from "./components/ui/input.js";
import { Switch } from "./components/ui/switch.js";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "./components/ui/select.js";
import { getThemeOptionLabel, SettingsRow, ThemePreviewCard, ThemeSelect, } from "./settings/SettingsPageParts.js";
import { getCodePreviewTheme } from "./lib/codePreviewPreferences.js";
import { useZCodeIntl } from "./i18n/IntlProvider.js";
import { THEME_MODES } from "./settings/settingsPageConfig.js";
import { MAX_UI_FONT_SIZE_PX, MIN_UI_FONT_SIZE_PX } from "./lib/uiFontSize.js";
function FontSizeInput({ value, min, max, ariaLabel, onChange, }) {
    const [draft, setDraft] = useState(String(value));
    const commit = () => {
        const parsed = draft.trim() === "" ? Number.NaN : Number(draft);
        const nextValue = Number.isFinite(parsed)
            ? Math.min(max, Math.max(min, Math.round(parsed)))
            : value;
        setDraft(String(nextValue));
        if (nextValue !== value) {
            onChange(nextValue);
        }
    };
    return (_jsxs("div", { className: "relative w-28", children: [_jsx(Input, { type: "number", inputMode: "numeric", min: min, max: max, step: 1, value: draft, "aria-label": ariaLabel, onChange: (event) => setDraft(event.currentTarget.value), onBlur: commit, onKeyDown: (event) => {
                    if (event.key === "Enter") {
                        event.currentTarget.blur();
                    }
                    else if (event.key === "Escape") {
                        event.preventDefault();
                        setDraft(String(value));
                    }
                }, className: "pr-8 text-right tabular-nums [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" }), _jsx("span", { className: "pointer-events-none absolute inset-y-0 right-2 flex items-center text-ui-lg text-foreground-subtle", children: "px" })] }));
}
export function AppearanceSectionContent({ codePreviewSettings, setCodePreviewSettings, theme, setTheme, uiFontSizePx, setUiFontSizePx, }) {
    const { intl } = useZCodeIntl();
    const activePreviewMode = resolveTheme(theme);
    return (_jsxs(_Fragment, { children: [_jsxs("div", { className: "min-w-0 space-y-3", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-ui-lg font-semibold text-foreground", children: intl.formatMessage({ id: "settings.appearance.interfaceTitle" }) }), _jsx("p", { className: "mt-1 text-ui-base leading-6 text-foreground-subtle", children: intl.formatMessage({
                                    id: "settings.appearance.interfaceDescription",
                                }) })] }), _jsx(Card, { className: "border border-border bg-card py-0 shadow-none", children: _jsxs(CardContent, { className: "space-y-0 px-0", children: [_jsx(SettingsRow, { label: intl.formatMessage({ id: "settings.themeMode" }), description: intl.formatMessage({
                                        id: "settings.themeModeDescription",
                                    }), control: _jsxs(Select, { value: theme, onValueChange: (value) => setTheme(value), children: [_jsx(SelectTrigger, { size: "lg", className: "w-[260px] min-w-0 justify-between", children: _jsx(SelectValue, {}) }), _jsx(SelectContent, { children: THEME_MODES.map(({ mode, icon: Icon }) => (_jsx(SelectItem, { value: mode, children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Icon, { className: "size-4" }), intl.formatMessage({
                                                                id: `settings.themeMode.${mode}`,
                                                            })] }) }, mode))) })] }) }), _jsx(SettingsRow, { label: intl.formatMessage({ id: "settings.uiFontSize" }), description: intl.formatMessage({
                                        id: "settings.uiFontSizeDescription",
                                    }), control: _jsx(FontSizeInput, { min: MIN_UI_FONT_SIZE_PX, max: MAX_UI_FONT_SIZE_PX, value: uiFontSizePx, onChange: setUiFontSizePx, ariaLabel: intl.formatMessage({ id: "settings.uiFontSize" }) }, uiFontSizePx) })] }) })] }), _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "min-w-0 space-y-3", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-ui-lg font-semibold text-foreground", children: intl.formatMessage({ id: "settings.appearance.codeTitle" }) }), _jsx("p", { className: "mt-1 text-ui-base leading-6 text-foreground-subtle", children: intl.formatMessage({
                                            id: "settings.appearance.codeDescription",
                                        }) })] }), _jsx(Card, { className: "border border-border bg-card py-0 shadow-none [&_[data-slot=select-trigger]]:w-full", children: _jsxs(CardContent, { className: "space-y-0 px-0", children: [_jsx(SettingsRow, { label: intl.formatMessage({ id: "settings.lightTheme" }), description: intl.formatMessage({
                                                id: "settings.lightThemeDescription",
                                            }), control: _jsx(ThemeSelect, { value: codePreviewSettings.lightTheme, onValueChange: (value) => setCodePreviewSettings({ lightTheme: value }) }) }), _jsx(SettingsRow, { label: intl.formatMessage({ id: "settings.darkTheme" }), description: intl.formatMessage({
                                                id: "settings.darkThemeDescription",
                                            }), control: _jsx(ThemeSelect, { value: codePreviewSettings.darkTheme, onValueChange: (value) => setCodePreviewSettings({ darkTheme: value }) }) }), _jsx(SettingsRow, { label: intl.formatMessage({ id: "settings.showLineNumbers" }), description: intl.formatMessage({
                                                id: "settings.showLineNumbersDescription",
                                            }), control: _jsx(Switch, { checked: codePreviewSettings.showLineNumbers, onCheckedChange: (checked) => setCodePreviewSettings({ showLineNumbers: checked }) }) }), _jsx(SettingsRow, { label: intl.formatMessage({ id: "settings.wrapLongLines" }), description: intl.formatMessage({
                                                id: "settings.wrapLongLinesDescription",
                                            }), control: _jsx(Switch, { checked: codePreviewSettings.wrapLongLines, onCheckedChange: (checked) => setCodePreviewSettings({ wrapLongLines: checked }) }) }), _jsx(SettingsRow, { label: intl.formatMessage({ id: "settings.fontSize" }), description: intl.formatMessage({
                                                id: "settings.fontSizeDescription",
                                            }), control: _jsx(FontSizeInput, { min: 12, max: 20, value: codePreviewSettings.fontSizePx, onChange: (fontSizePx) => setCodePreviewSettings({ fontSizePx }), ariaLabel: intl.formatMessage({ id: "settings.fontSize" }) }, codePreviewSettings.fontSizePx) })] }) })] }), _jsxs("div", { className: "min-w-0 space-y-4", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-ui-base font-semibold text-foreground", children: intl.formatMessage({ id: "settings.previewSectionTitle" }) }), _jsx("p", { className: "mt-1 text-ui-base leading-6 text-foreground-subtle", children: intl.formatMessage({ id: "settings.previewDescription" }) })] }), _jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [_jsx(ThemePreviewCard, { mode: "light", title: intl.formatMessage({ id: "settings.previewLight" }), themeName: getThemeOptionLabel(codePreviewSettings.lightTheme), theme: getCodePreviewTheme("light", codePreviewSettings), isActive: activePreviewMode === "light", showLineNumbers: codePreviewSettings.showLineNumbers, wrapLongLines: codePreviewSettings.wrapLongLines, fontSizePx: codePreviewSettings.fontSizePx }), _jsx(ThemePreviewCard, { mode: "dark", title: intl.formatMessage({ id: "settings.previewDark" }), themeName: getThemeOptionLabel(codePreviewSettings.darkTheme), theme: getCodePreviewTheme("dark", codePreviewSettings), isActive: activePreviewMode === "dark", showLineNumbers: codePreviewSettings.showLineNumbers, wrapLongLines: codePreviewSettings.wrapLongLines, fontSizePx: codePreviewSettings.fontSizePx })] })] })] })] }));
}
//# sourceMappingURL=settingsCodePreview.js.map