import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CodeBlock } from "../components/ai-elements/code-block.js";
import { Card, CardContent } from "../components/ui/card.js";
import { CODE_PREVIEW_THEME_OPTIONS, SETTINGS_PREVIEW_CODE } from "../lib/codePreviewPreferences.js";
import { useZCodeIntl } from "../i18n/IntlProvider.js";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "../components/ui/select.js";
import { cn } from "../components/lib/utils.js";
/**
 * Settings 与同级管理页在窗口框架内共享同一内容列。
 * Automations 曾在 shell 与页面内各自居中、加 padding，导致它与 Skills 等
 * Settings 功能的标题起点、顶部基线和内容宽度不一致。
 */
export const SETTINGS_FRAME_CONTENT_CLASSNAME = "mx-auto w-full max-w-4xl px-4 pb-8 pt-0 lg:px-8 lg:pb-10";
export function ThemeSelect({ value, onValueChange, }) {
    return (_jsxs(Select, { value: value, onValueChange: (nextValue) => onValueChange(nextValue), children: [_jsx(SelectTrigger, { size: "lg", className: "w-64 min-w-0 justify-between", children: _jsx(SelectValue, {}) }), _jsx(SelectContent, { children: CODE_PREVIEW_THEME_OPTIONS.map((option) => (_jsx(SelectItem, { value: option.value, children: option.label }, option.value))) })] }));
}
export function ThemePreviewCard({ mode, title, themeName, theme, isActive, showLineNumbers, wrapLongLines, fontSizePx, }) {
    const { intl } = useZCodeIntl();
    const previewSurfaceClassName = mode === "light" ? "ring-1 ring-black/5" : "ring-1 ring-white/8";
    const previewThemeStyle = {
        "--color-background": mode === "light" ? "#f8f8f8" : "#161616",
        "--color-card": mode === "light" ? "#f8f8f8" : "#161616",
        "--color-foreground": mode === "light" ? "#0d0d0d" : "#ffffff",
    };
    return (_jsxs("div", { className: "overflow-hidden rounded-xl border border-border bg-card", children: [_jsxs("div", { className: "flex items-center justify-between gap-3 border-b border-border px-4 py-3", children: [_jsxs("div", { children: [_jsx("div", { className: "text-ui-base font-semibold text-foreground", children: title }), _jsx("div", { className: "text-ui-base text-foreground-subtle", children: themeName })] }), _jsx("span", { className: `rounded-md px-2.5 py-1 text-ui-xs font-medium ${isActive ? "bg-selected text-foreground" : "bg-surface text-foreground-subtle"}`, children: intl.formatMessage({
                            id: isActive ? "settings.previewBadge.active" : `settings.previewBadge.${mode}`,
                        }) })] }), _jsx("div", { className: "p-2", children: _jsx(CodeBlock, { code: SETTINGS_PREVIEW_CODE, language: "typescript", theme: theme, showLineNumbers: showLineNumbers, wrapLongLines: wrapLongLines, fontSizePx: fontSizePx, 
                    // Light/Dark Preview 是预览目标主题，不应继承当前应用主题的 background token。
                    // CodeBlock 内部会把 @pierre/diffs 背景映射到 card，这里同时固定 background/card。
                    className: `overflow-hidden border-0 bg-background ${previewSurfaceClassName}`, style: previewThemeStyle }) })] }));
}
export function SettingsRow({ label, description, control, detail, controlLayout = "default", }) {
    return (_jsxs("div", { className: "border-t border-border px-4 py-3 first:border-t-0", children: [_jsxs("div", { className: cn("grid items-center gap-4", controlLayout === "wide"
                    ? "grid-cols-1 sm:grid-cols-[minmax(0,1fr)_280px]"
                    : "grid-cols-[minmax(0,1fr)_192px]"), children: [_jsxs("div", { className: "min-w-0", children: [_jsx("div", { className: "text-ui-base font-medium text-foreground", children: label }), description ? (_jsx("div", { className: "mt-1 text-ui-base leading-6 text-foreground-subtle", children: description })) : null] }), _jsxs("div", { className: "flex w-full flex-nowrap items-center justify-end gap-2", children: [controlLayout === "wide" ? detail : null, control] })] }), detail && controlLayout !== "wide" ? _jsx("div", { className: "mt-3", children: detail }) : null] }));
}
export function SettingsGroupCard({ children }) {
    return (_jsx(Card, { className: "overflow-hidden rounded-xl border border-border bg-card py-0 shadow-none", children: _jsx(CardContent, { className: "space-y-0 px-0", children: children }) }));
}
export function SettingsBadge({ children }) {
    return (_jsx("span", { className: "rounded-md bg-surface px-2.5 py-1 text-ui-base font-medium text-foreground-subtle", children: children }));
}
export function SettingsRangeControl({ value, min, max, step, onChange, valueLabel, valueLabelClassName, }) {
    return (_jsxs("div", { className: "flex w-[280px] min-w-0 items-center gap-3", children: [_jsx("input", { type: "range", min: min, max: max, step: step, value: value, onChange: (event) => onChange(Number(event.currentTarget.value)), className: "h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-secondary accent-primary" }), _jsx("span", { className: cn("min-w-10 text-right text-ui-base font-medium tabular-nums text-foreground", valueLabelClassName), children: valueLabel })] }));
}
export function getThemeOptionLabel(value) {
    return CODE_PREVIEW_THEME_OPTIONS.find((option) => option.value === value)?.label ?? value;
}
//# sourceMappingURL=SettingsPageParts.js.map