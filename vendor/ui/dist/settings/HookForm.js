import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/* eslint-disable max-lines -- Hook 表单集中维护 runner 类型、Scope 与高级兼容字段。 */
import { useCallback, useState } from "react";
import { ChevronRight, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button.js";
import { Input } from "@/components/ui/input.js";
import { Label } from "@/components/ui/label.js";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select.js";
import { Switch } from "@/components/ui/switch.js";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
import { SettingsFormTextarea } from "@/settings/SettingsFormTextarea.js";
import { SettingsFormActions } from "@/settings/SettingsFormActions.js";
import { PluginScopeMenu, getPluginWorkspaceKey } from "@/settings/PluginScopeMenu.js";
const HOOK_EVENTS = [
    "SessionStart",
    "UserPromptSubmit",
    "PreToolUse",
    "PermissionRequest",
    "PostToolUse",
    "PostToolUseFailure",
    "Stop",
];
function formatCustomJson(custom) {
    return custom && Object.keys(custom).length > 0 ? JSON.stringify(custom, null, 2) : "";
}
function HookScopeMenu({ disabled, scopeKey, workspaceTabs, onChange, }) {
    const { intl } = useZCodeIntl();
    return (_jsxs("label", { className: "flex min-w-0 flex-wrap items-center justify-end gap-2", children: [_jsx("span", { className: "shrink-0 text-ui-base text-foreground-subtle", children: intl.formatMessage({ id: "settings.scope.label" }) }), _jsx(PluginScopeMenu, { align: "end", disabled: disabled, selectedScopeKey: scopeKey, workspaceTabs: workspaceTabs, onScopeKeyChange: onChange })] }));
}
export function HookForm({ hook, workspaceAvailable = false, defaultStorageLevel = "user", onSave, onCancel, onDelete, isEditing = false, workspaceTabs = [], selectedScopeKey, onScopeKeyChange, }) {
    const { intl } = useZCodeIntl();
    const initialStorageLevel = hook?.location?.scope === "project" ? "project" : "user";
    const [storageLevel, setStorageLevel] = useState(workspaceAvailable ? (hook ? initialStorageLevel : defaultStorageLevel) : "user");
    const initialWorkspaceKey = workspaceTabs[0] ? getPluginWorkspaceKey(workspaceTabs[0]) : "user";
    const scopeKey = selectedScopeKey ?? (storageLevel === "project" ? initialWorkspaceKey : "user");
    const [event, setEvent] = useState(hook?.event ?? "PreToolUse");
    const [type, setType] = useState(hook?.type ?? "process");
    const [matcher, setMatcher] = useState(hook?.matcher ?? "");
    const [command, setCommand] = useState(hook?.command ?? "");
    const [args, setArgs] = useState((hook?.args ?? []).join("\n"));
    const [asyncCommand, setAsyncCommand] = useState(hook?.async ?? false);
    const [shell, setShell] = useState(typeof hook?.shell === "string" ? hook.shell : "");
    const [statusMessage, setStatusMessage] = useState(hook?.statusMessage ?? "");
    const [timeout, setTimeout] = useState(String(hook?.timeout ?? 60));
    const [customJson, setCustomJson] = useState(formatCustomJson(hook?.custom));
    const [customError, setCustomError] = useState(null);
    const customJsonValid = (() => {
        if (!customJson.trim())
            return true;
        try {
            const parsed = JSON.parse(customJson);
            return Boolean(parsed && typeof parsed === "object" && !Array.isArray(parsed));
        }
        catch {
            return false;
        }
    })();
    const canSave = Boolean(command.trim() && customJsonValid);
    const handleSave = useCallback(() => {
        if (!command.trim())
            return;
        let custom;
        if (customJson.trim()) {
            try {
                const parsed = JSON.parse(customJson);
                if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
                    setCustomError(intl.formatMessage({ id: "settings.hooks.customJsonObjectError" }));
                    return;
                }
                custom = parsed;
            }
            catch {
                setCustomError(intl.formatMessage({ id: "settings.hooks.customJsonParseError" }));
                return;
            }
        }
        setCustomError(null);
        onSave({
            event,
            matcher: matcher.trim() || undefined,
            type,
            command: command.trim(),
            ...(type === "process"
                ? {
                    args: args
                        .split("\n")
                        .map((arg) => arg.trim())
                        .filter(Boolean),
                }
                : {
                    async: asyncCommand,
                    shell: shell.trim() || (hook?.shell === true ? true : undefined),
                }),
            statusMessage: statusMessage.trim() || undefined,
            timeout: Number.parseInt(timeout, 10) || 60,
            enabled: hook?.enabled ?? true,
            custom,
            storageLevel,
        });
    }, [
        args,
        asyncCommand,
        command,
        customJson,
        event,
        hook?.enabled,
        intl,
        matcher,
        onSave,
        shell,
        statusMessage,
        storageLevel,
        timeout,
        type,
    ]);
    return (_jsxs("div", { className: "space-y-4", "data-testid": "hooks-form", children: [_jsxs("div", { className: "space-y-1", children: [_jsx("h3", { className: "text-ui-xl font-semibold text-foreground", children: intl.formatMessage({
                            id: isEditing ? "settings.hooks.edit" : "settings.hooks.add",
                        }) }), _jsx("p", { className: "text-ui-base text-foreground-subtle", children: intl.formatMessage({ id: "settings.hooks.description" }) })] }), _jsxs("div", { className: "space-y-3 rounded-xl border border-border p-4", children: [_jsxs("div", { className: "flex flex-wrap items-start justify-between gap-3", children: [_jsxs("div", { className: "grid w-full min-w-0 gap-3 sm:grid-cols-2 md:w-auto", children: [_jsx(Field, { label: intl.formatMessage({ id: "settings.hooks.event" }), htmlFor: "hook-event", children: _jsxs(Select, { value: event, onValueChange: (value) => setEvent(value), children: [_jsx(SelectTrigger, { id: "hook-event", size: "lg", className: "w-full md:w-48", children: _jsx(SelectValue, {}) }), _jsx(SelectContent, { children: HOOK_EVENTS.map((hookEvent) => (_jsx(SelectItem, { value: hookEvent, children: hookEvent }, hookEvent))) })] }) }), _jsx(Field, { label: intl.formatMessage({ id: "settings.hooks.type" }), htmlFor: "hook-runner", children: _jsxs(Select, { value: type, onValueChange: (value) => setType(value), children: [_jsx(SelectTrigger, { id: "hook-runner", size: "lg", className: "w-full md:w-48", children: _jsx(SelectValue, {}) }), _jsx(SelectContent, { children: ["process", "command"].map((hookType) => (_jsx(SelectItem, { value: hookType, children: intl.formatMessage({
                                                            id: `settings.hooks.type.${hookType}`,
                                                        }) }, hookType))) })] }) })] }), _jsx(HookScopeMenu, { disabled: Boolean(hook), scopeKey: scopeKey, workspaceTabs: workspaceAvailable ? workspaceTabs : [], onChange: (nextScopeKey) => {
                                    setStorageLevel(nextScopeKey === "user" ? "user" : "project");
                                    onScopeKeyChange?.(nextScopeKey);
                                } })] }), _jsxs("div", { className: "grid gap-3 sm:grid-cols-2", children: [_jsxs(Field, { label: intl.formatMessage({ id: "settings.hooks.matcher" }), htmlFor: "matcher", children: [_jsx(Input, { id: "matcher", size: "lg", value: matcher, onChange: (event) => setMatcher(event.target.value), placeholder: intl.formatMessage({
                                            id: "settings.hooks.matcherPlaceholder",
                                        }) }), _jsx("p", { className: "text-ui-base text-foreground-subtlest", children: intl.formatMessage({ id: "settings.hooks.matcherHint" }) })] }), _jsx(Field, { label: intl.formatMessage({ id: "settings.hooks.command" }), htmlFor: "command", children: _jsx(Input, { id: "command", size: "lg", value: command, onChange: (event) => setCommand(event.target.value), placeholder: intl.formatMessage({
                                        id: "settings.hooks.commandPlaceholder",
                                    }), className: "font-mono" }) })] }), type === "process" ? (_jsxs(Field, { label: intl.formatMessage({ id: "settings.hooks.args" }), htmlFor: "args", children: [_jsx(SettingsFormTextarea, { id: "args", value: args, onChange: (event) => setArgs(event.target.value), placeholder: intl.formatMessage({
                                    id: "settings.hooks.argsPlaceholder",
                                }), rows: 4, className: "resize-y font-mono" }), _jsx("p", { className: "text-ui-base text-foreground-subtlest", children: intl.formatMessage({ id: "settings.hooks.argsHint" }) })] })) : (_jsxs("div", { className: "grid gap-5 sm:grid-cols-2", children: [_jsx(Field, { label: intl.formatMessage({ id: "settings.hooks.shell" }), htmlFor: "hook-shell", children: _jsx(Input, { id: "hook-shell", size: "lg", value: shell, onChange: (event) => setShell(event.target.value), placeholder: intl.formatMessage({
                                        id: "settings.hooks.shellPlaceholder",
                                    }), className: "font-mono" }) }), _jsxs("div", { className: "flex items-end justify-between gap-4 pb-1", children: [_jsx(Label, { htmlFor: "hook-async-command", children: intl.formatMessage({ id: "settings.hooks.async" }) }), _jsx(Switch, { id: "hook-async-command", checked: asyncCommand, onCheckedChange: setAsyncCommand })] })] })), _jsxs("details", { className: "group/advanced border-t border-border pt-3", children: [_jsxs("summary", { className: "flex cursor-pointer list-none items-center gap-1 text-ui-base font-medium text-foreground-subtle", children: [_jsx(ChevronRight, { className: "size-3.5 transition-transform group-open/advanced:rotate-90", "aria-hidden": "true" }), intl.formatMessage({ id: "settings.hooks.advanced" })] }), _jsxs("div", { className: "mt-3 space-y-3", children: [_jsxs("div", { className: "grid gap-3 sm:grid-cols-2", children: [_jsxs(Field, { label: intl.formatMessage({ id: "settings.hooks.timeout" }), htmlFor: "timeout", children: [_jsx(Input, { id: "timeout", size: "lg", type: "number", min: 1, value: timeout, onChange: (event) => setTimeout(event.target.value), className: "w-28" }), _jsx("p", { className: "text-ui-base text-foreground-subtlest", children: intl.formatMessage({ id: "settings.hooks.timeoutHint" }) })] }), _jsx(Field, { label: intl.formatMessage({
                                                    id: "settings.hooks.statusMessage",
                                                }), htmlFor: "hook-status-message", children: _jsx(Input, { id: "hook-status-message", size: "lg", value: statusMessage, onChange: (event) => setStatusMessage(event.target.value), placeholder: intl.formatMessage({
                                                        id: "settings.hooks.statusMessagePlaceholder",
                                                    }) }) })] }), _jsxs(Field, { label: intl.formatMessage({ id: "settings.hooks.customJson" }), htmlFor: "hook-custom-json", children: [_jsx(SettingsFormTextarea, { id: "hook-custom-json", value: customJson, onChange: (event) => setCustomJson(event.target.value), rows: 5, className: "resize-y font-mono text-ui-base", placeholder: '{\n  "customKey": "value"\n}' }), customError ? _jsx("p", { className: "text-ui-base text-destructive", children: customError }) : null] })] })] }), _jsxs(SettingsFormActions, { leadingAction: hook && onDelete ? (_jsxs(Button, { type: "button", variant: "link", size: "lg", className: "px-0 text-destructive hover:text-destructive", onClick: () => onDelete(hook), children: [_jsx(Trash2, { className: "size-3.5", "aria-hidden": "true" }), intl.formatMessage({ id: "common.delete" })] })) : undefined, children: [_jsx(Button, { size: "lg", onClick: handleSave, disabled: !canSave, children: intl.formatMessage({ id: "common.save" }) }), _jsx(Button, { variant: "ghost", size: "lg", onClick: onCancel, children: intl.formatMessage({ id: "common.cancel" }) })] })] })] }));
}
function Field({ children, htmlFor, label, }) {
    return (_jsxs("div", { className: "flex min-w-0 flex-col gap-1.5", children: [_jsx(Label, { htmlFor: htmlFor, className: "text-foreground-subtle", children: label }), children] }));
}
//# sourceMappingURL=HookForm.js.map