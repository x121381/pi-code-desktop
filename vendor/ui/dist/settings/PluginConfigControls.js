import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Eye, EyeOff, RotateCcw, Save, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button.js";
import { Input } from "@/components/ui/input.js";
import { Switch } from "@/components/ui/switch.js";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
import { SettingsScopeBadge } from "@/settings/SettingsScopeBadge.js";
export function PluginConfigControls({ getValue, isOptionClearPending, onClearOption, onSave, onSetDraft, operationId, plugin, scope, }) {
    const { intl } = useZCodeIntl();
    const [revealedSecrets, setRevealedSecrets] = useState({});
    const entries = Object.entries(plugin.userConfig ?? {});
    if (entries.length === 0)
        return null;
    const isSaving = operationId === `plugin:configure:${plugin.id}`;
    return (_jsxs("div", { className: "mt-3 border-t border-border pt-3", "data-testid": "plugin-store-config", "data-plugin-id": plugin.id, children: [_jsx("div", { className: "mb-2 text-ui-base font-medium text-foreground", children: intl.formatMessage({ id: "settings.plugins.config.title" }) }), _jsx("div", { className: "grid gap-2 sm:grid-cols-2", children: entries.map(([key, option]) => {
                    const label = option.title ?? key;
                    const value = getValue(plugin, key, option);
                    const clearPending = isOptionClearPending?.(plugin.id, key) ?? false;
                    const canClearOption = onClearOption !== undefined &&
                        (plugin.optionSources?.[key] === scope || clearPending) &&
                        (option.sensitive === true || scope === "workspace");
                    const clearLabel = option.sensitive
                        ? intl.formatMessage({
                            id: clearPending
                                ? "settings.plugins.config.undoClearSecret"
                                : "settings.plugins.config.clearSecret",
                        })
                        : intl.formatMessage({
                            id: clearPending
                                ? "settings.plugins.config.undoRestoreOption"
                                : "settings.plugins.config.restoreOption",
                        });
                    const clearButton = canClearOption ? (_jsx(Button, { type: "button", "data-testid": "plugin-store-config-clear", "data-plugin-id": plugin.id, "data-config-key": key, variant: clearPending ? "secondary" : "ghost", size: "icon-sm", "aria-label": clearLabel, "aria-pressed": clearPending, title: clearLabel, disabled: isSaving, onClick: () => onClearOption?.(plugin.id, key, !clearPending), children: clearPending ? (_jsx(RotateCcw, { className: "size-3.5", "aria-hidden": "true" })) : (_jsx(Trash2, { className: "size-3.5", "aria-hidden": "true" })) })) : null;
                    return (_jsxs("label", { className: "min-w-0 text-ui-base text-foreground", children: [_jsxs("span", { className: "mb-1 flex items-center gap-1 text-foreground-subtle", children: [_jsx("span", { className: "truncate", children: label }), option.required ? (_jsx("span", { className: "text-warning", children: intl.formatMessage({
                                            id: "settings.plugins.config.required",
                                        }) })) : null, _jsx(SettingsScopeBadge, { scope: plugin.optionSources?.[key] ?? "default" })] }), option.sensitive ? (_jsxs("div", { className: "flex items-center gap-1", children: [_jsx(Input, { type: revealedSecrets[key] ? "text" : "password", "data-testid": "plugin-store-config-input", "data-config-key": key, size: "sm", className: "h-8 min-w-0 flex-1 rounded-lg", value: String(value), disabled: isSaving, onChange: (event) => onSetDraft(plugin.id, key, event.target.value) }), _jsx(Button, { type: "button", variant: "ghost", size: "icon-sm", "aria-label": intl.formatMessage({
                                            id: revealedSecrets[key]
                                                ? "settings.plugins.config.hideSecret"
                                                : "settings.plugins.config.showSecret",
                                        }), title: intl.formatMessage({
                                            id: revealedSecrets[key]
                                                ? "settings.plugins.config.hideSecret"
                                                : "settings.plugins.config.showSecret",
                                        }), disabled: isSaving, onClick: () => setRevealedSecrets((current) => ({
                                            ...current,
                                            [key]: !current[key],
                                        })), children: revealedSecrets[key] ? (_jsx(EyeOff, { className: "size-3.5", "aria-hidden": "true" })) : (_jsx(Eye, { className: "size-3.5", "aria-hidden": "true" })) }), clearButton] })) : option.type === "boolean" ? (_jsxs("div", { className: "flex h-8 items-center", children: [_jsx(Switch, { "data-testid": "plugin-store-config-input", "data-config-key": key, checked: Boolean(value), disabled: isSaving, onCheckedChange: (checked) => onSetDraft(plugin.id, key, checked) }), clearButton] })) : (_jsxs("div", { className: "flex items-center gap-1", children: [_jsx(Input, { type: option.type === "number" ? "number" : "text", "data-testid": "plugin-store-config-input", "data-config-key": key, size: "sm", className: "h-8 min-w-0 flex-1 rounded-lg", value: String(value), disabled: isSaving, onChange: (event) => onSetDraft(plugin.id, key, event.target.value) }), clearButton] }))] }, key));
                }) }), entries.length > 0 ? (_jsx("div", { className: "mt-2 flex justify-end", children: _jsxs(Button, { type: "button", "data-testid": "plugin-store-config-save", "data-plugin-id": plugin.id, variant: "outline", size: "lg", disabled: isSaving, onClick: () => onSave(plugin), children: [_jsx(Save, { className: "size-3.5", "aria-hidden": "true" }), intl.formatMessage({ id: "settings.plugins.config.save" })] }) })) : null] }));
}
//# sourceMappingURL=PluginConfigControls.js.map