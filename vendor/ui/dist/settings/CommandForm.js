import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import {} from "@zcode/shared";
import { Button } from "../components/ui/button.js";
import { Input } from "../components/ui/input.js";
import { useZCodeIntl } from "../i18n/IntlProvider.js";
import { SettingsFormTextarea } from "../settings/SettingsFormTextarea.js";
import { SettingsFormActions } from "../settings/SettingsFormActions.js";
import { PluginScopeMenu } from "../settings/PluginScopeMenu.js";
const NAME_REGEX = /^[a-zA-Z0-9_-]+$/;
const MIN_NAME_LENGTH = 1;
const MAX_NAME_LENGTH = 50;
function CommandFormFieldLabel({ children }) {
    return (_jsx("label", { className: "mb-1 block text-ui-base font-medium text-foreground-subtle", children: children }));
}
function CommandScopeMenu({ disabled, scopeKey, workspaceTabs, onChange, }) {
    const { intl } = useZCodeIntl();
    const scopeLabel = intl.formatMessage({ id: "settings.scope.label" });
    return (_jsxs("label", { className: "flex min-w-0 flex-wrap items-center justify-end gap-2", children: [_jsx("span", { className: "shrink-0 text-ui-base text-foreground-subtle", children: scopeLabel }), _jsx(PluginScopeMenu, { align: "end", disabled: disabled, selectedScopeKey: scopeKey, workspaceTabs: workspaceTabs, onScopeKeyChange: onChange })] }));
}
export function CommandForm({ initial, scopeKey, workspaceTabs, onScopeKeyChange, onSave, onCancel, onDelete, saving, }) {
    const { intl } = useZCodeIntl();
    const supportsArgumentHint = true;
    const initialName = initial?.name?.replace(/^\//, "") ?? "";
    const [name, setName] = useState(initialName);
    const [description, setDescription] = useState(initial?.description ?? "");
    const [argumentHint, setArgumentHint] = useState(initial?.argumentHint ?? "");
    const [prompt, setPrompt] = useState(initial?.prompt ?? "");
    const [nameError, setNameError] = useState(null);
    const [promptError, setPromptError] = useState(null);
    const trimmedName = name.trim();
    const canSave = Boolean(prompt.trim() &&
        (initial ||
            (trimmedName.length >= MIN_NAME_LENGTH &&
                trimmedName.length <= MAX_NAME_LENGTH &&
                NAME_REGEX.test(trimmedName))));
    const validate = () => {
        let valid = true;
        const trimmedName = name.trim();
        const nameRegex = NAME_REGEX;
        // 命令表单字段曾直接硬编码英文，导致中文界面下校验错误仍显示英文。
        if (initial) {
            setNameError(null);
        }
        else if (trimmedName.length < MIN_NAME_LENGTH || trimmedName.length > MAX_NAME_LENGTH) {
            setNameError(intl.formatMessage({ id: "settings.commands.form.validation.nameLength" }, {
                min: String(MIN_NAME_LENGTH),
                max: String(MAX_NAME_LENGTH),
            }));
            valid = false;
        }
        else if (!nameRegex.test(trimmedName)) {
            setNameError(intl.formatMessage({
                id: "settings.commands.form.validation.nameCharacters",
            }));
            valid = false;
        }
        else {
            setNameError(null);
        }
        if (!prompt.trim()) {
            setPromptError(intl.formatMessage({
                id: "settings.commands.form.validation.promptRequired",
            }));
            valid = false;
        }
        else {
            setPromptError(null);
        }
        return valid;
    };
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validate()) {
            return;
        }
        const config = {
            name: name.trim(),
            prompt: prompt.trim(),
            description: description.trim() || undefined,
            argumentHint: supportsArgumentHint ? argumentHint.trim() || undefined : undefined,
        };
        await onSave(config, scopeKey);
    };
    const scopeSelect = (_jsx(CommandScopeMenu, { disabled: Boolean(initial), scopeKey: scopeKey, workspaceTabs: workspaceTabs, onChange: onScopeKeyChange }));
    return (_jsxs("form", { onSubmit: handleSubmit, className: "space-y-3 rounded-xl border border-border p-4", children: [_jsxs("div", { className: "flex flex-wrap items-start justify-between gap-3", children: [_jsxs("div", { className: "w-full min-w-0 space-y-1.5 md:w-48", children: [_jsx(CommandFormFieldLabel, { children: intl.formatMessage({ id: "settings.commands.form.name.label" }) }), _jsx(Input, { type: "text", size: "lg", value: name, onChange: (event) => setName(event.target.value), placeholder: intl.formatMessage({
                                    id: "settings.commands.form.name.placeholder",
                                }), disabled: !!initial })] }), _jsx("div", { children: scopeSelect })] }), nameError ? _jsx("p", { className: "-mt-1 text-ui-base text-destructive", children: nameError }) : null, _jsxs("div", { className: "space-y-1.5", children: [_jsx(CommandFormFieldLabel, { children: intl.formatMessage({
                            id: "settings.commands.form.description.label",
                        }) }), _jsx(Input, { type: "text", size: "lg", value: description, onChange: (event) => setDescription(event.target.value), placeholder: intl.formatMessage({
                            id: "settings.commands.form.description.placeholder",
                        }) })] }), supportsArgumentHint ? (_jsxs("div", { className: "space-y-1.5", children: [_jsx(CommandFormFieldLabel, { children: intl.formatMessage({
                            id: "settings.commands.form.argumentHint.label",
                        }) }), _jsx(Input, { type: "text", size: "lg", value: argumentHint, onChange: (event) => setArgumentHint(event.target.value), placeholder: intl.formatMessage({
                            id: "settings.commands.form.argumentHint.placeholder",
                        }) })] })) : null, _jsxs("div", { className: "space-y-1.5", children: [_jsx(CommandFormFieldLabel, { children: intl.formatMessage({ id: "settings.commands.form.prompt.label" }) }), _jsx(SettingsFormTextarea, { value: prompt, onChange: (event) => setPrompt(event.target.value), rows: 5, className: "min-h-28 text-ui-base", placeholder: intl.formatMessage({
                            id: "settings.commands.form.prompt.placeholder",
                        }) }), promptError ? _jsx("p", { className: "text-ui-base text-destructive", children: promptError }) : null] }), _jsxs(SettingsFormActions, { leadingAction: initial && onDelete ? (_jsxs(Button, { type: "button", variant: "link", size: "lg", className: "px-0 text-destructive hover:text-destructive", onClick: () => onDelete(initial), disabled: saving, children: [_jsx(Trash2, { className: "size-3.5", "aria-hidden": "true" }), intl.formatMessage({ id: "common.delete" })] })) : undefined, children: [_jsx(Button, { type: "submit", variant: "default", size: "lg", disabled: !canSave || saving, children: saving
                            ? intl.formatMessage({ id: "common.saving" })
                            : intl.formatMessage({ id: "common.save" }) }), _jsx(Button, { type: "button", variant: "ghost", size: "lg", onClick: onCancel, disabled: saving, children: intl.formatMessage({ id: "common.cancel" }) })] })] }));
}
//# sourceMappingURL=CommandForm.js.map