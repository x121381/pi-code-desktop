import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
import { Button } from "../components/ui/button.js";
import { Input } from "../components/ui/input.js";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "../components/ui/select.js";
import { useZCodeIntl } from "../i18n/IntlProvider.js";
import { PluginScopeMenu } from "../settings/PluginScopeMenu.js";
import { SettingsFormTextarea } from "../settings/SettingsFormTextarea.js";
import { SettingsFormActions } from "../settings/SettingsFormActions.js";
import { ChevronDown, ChevronUpIcon as ChevronUp, Trash2 } from "lucide-react";
import { EMPTY_FORM, formToJsonDraft, jsonDraftToForm, serverToForm, } from "./mcpSettingsShared.js";
function McpFormFieldLabel({ children }) {
    return (_jsx("label", { className: "mb-1 block text-ui-base font-medium text-foreground-subtle", children: children }));
}
function McpScopeMenu({ disabled, scopeKey, workspaceTabs, onChange, }) {
    const { intl } = useZCodeIntl();
    const scopeLabel = intl.formatMessage({ id: "settings.scope.label" });
    return (_jsxs("label", { className: "flex min-w-0 flex-wrap items-center justify-end gap-2", children: [_jsx("span", { className: "shrink-0 text-ui-base text-foreground-subtle", children: scopeLabel }), _jsx(PluginScopeMenu, { align: "end", disabled: disabled, selectedScopeKey: scopeKey, workspaceTabs: workspaceTabs, onScopeKeyChange: onChange })] }));
}
export function McpServerForm({ initial, editingId, editorMode, onEditorModeChange, onSave, onCancel, onDelete, scopeKey, workspaceTabs, onScopeKeyChange, }) {
    const { intl } = useZCodeIntl();
    const initialForm = initial
        ? serverToForm(initial)
        : {
            ...EMPTY_FORM,
            storageLevel: scopeKey === "user" ? "user" : "workspace",
        };
    const [form, setForm] = useState(initialForm);
    const [jsonDraft, setJsonDraft] = useState(() => formToJsonDraft(initialForm));
    const [jsonError, setJsonError] = useState(null);
    const [showEnv, setShowEnv] = useState(false);
    const formRef = useRef(form);
    const jsonDraftRef = useRef(jsonDraft);
    const previousEditorModeRef = useRef(editorMode);
    useEffect(() => {
        formRef.current = form;
    }, [form]);
    useEffect(() => {
        jsonDraftRef.current = jsonDraft;
    }, [jsonDraft]);
    useEffect(() => {
        const previousMode = previousEditorModeRef.current;
        if (previousMode === editorMode) {
            return;
        }
        if (editorMode === "json") {
            setJsonDraft(formToJsonDraft(formRef.current));
            setJsonError(null);
            previousEditorModeRef.current = editorMode;
            return;
        }
        try {
            const parsedForm = jsonDraftToForm(jsonDraftRef.current, formRef.current);
            setForm(parsedForm);
            setJsonError(null);
            previousEditorModeRef.current = editorMode;
        }
        catch (error) {
            setJsonError(error instanceof Error
                ? error.message
                : intl.formatMessage({ id: "settings.mcp.form.jsonParseError" }));
            onEditorModeChange(previousMode);
        }
    }, [editorMode, intl, onEditorModeChange]);
    function update(patch) {
        setForm((prev) => {
            const next = { ...prev, ...patch };
            if (editorMode === "json") {
                setJsonDraft(formToJsonDraft(next));
            }
            return next;
        });
    }
    function handleSaveClick() {
        if (editorMode === "json") {
            try {
                const parsedForm = jsonDraftToForm(jsonDraft, form);
                setForm(parsedForm);
                setJsonError(null);
                onSave(parsedForm, initial);
            }
            catch (error) {
                setJsonError(error instanceof Error
                    ? error.message
                    : intl.formatMessage({ id: "settings.mcp.form.jsonParseError" }));
            }
            return;
        }
        onSave(form, initial);
    }
    const canSave = (() => {
        if (editorMode !== "json") {
            return Boolean(form.name.trim() && (form.type === "stdio" ? form.command.trim() : form.url.trim()));
        }
        if (!jsonDraft.trim())
            return false;
        try {
            const parsedForm = jsonDraftToForm(jsonDraft, form);
            return Boolean(parsedForm.name.trim() &&
                (parsedForm.type === "stdio" ? parsedForm.command.trim() : parsedForm.url.trim()));
        }
        catch {
            return false;
        }
    })();
    const envToggleLabel = form.type === "stdio"
        ? intl.formatMessage({ id: "settings.mcp.form.envOptional" })
        : intl.formatMessage({ id: "settings.mcp.form.headersOptional" });
    const envValue = form.type === "stdio" ? form.env : form.headers;
    const envPlaceholder = form.type === "stdio"
        ? '{\n  "MY_API_KEY": "your-key"\n}'
        : '{\n  "Authorization": "Bearer your-token"\n}';
    const updateEnvValue = (value) => update(form.type === "stdio" ? { env: value } : { headers: value });
    // Radix Select 不接受空串 value；用 "auto" 作为哨兵值：表单里空串 = 未设置 = auto
    // （配置文件不落多余字段），用户显式选 auto 时同样写回空串。
    const updateProtocolVersion = (value) => update({ protocolVersion: value === "auto" ? "" : value });
    const scopeSelect = (_jsx(McpScopeMenu, { disabled: !!initial, scopeKey: scopeKey, workspaceTabs: workspaceTabs, onChange: (nextScopeKey) => {
            update({
                storageLevel: nextScopeKey === "user" ? "user" : "workspace",
            });
            onScopeKeyChange(nextScopeKey);
        } }));
    return (_jsxs("div", { className: "space-y-4 rounded-xl border border-border p-4", children: [editorMode === "json" ? (_jsxs("div", { className: "space-y-3", children: [_jsx("div", { className: "flex justify-end", children: scopeSelect }), _jsxs("div", { className: "space-y-1.5", children: [_jsx(McpFormFieldLabel, { children: intl.formatMessage({ id: "settings.mcp.form.fullConfig" }) }), _jsx(SettingsFormTextarea, { rows: 16, className: "font-mono text-ui-base", placeholder: '{\n  "my-mcp-server": {\n    "type": "http",\n    "url": "https://example.com/mcp"\n  }\n}', value: jsonDraft, onChange: (e) => {
                                    setJsonDraft(e.target.value);
                                    if (jsonError) {
                                        setJsonError(null);
                                    }
                                } }), _jsxs("p", { className: "text-ui-base text-foreground-subtle", children: [intl.formatMessage({ id: "settings.mcp.form.pasteHintPrefix" }), " ", _jsx("code", { children: `{"server-name": {...}}` }), " ", intl.formatMessage({ id: "settings.mcp.form.pasteHintMiddle" }), " ", _jsx("code", { children: `{"mcpServers": {"server-name": {...}}}` }), intl.formatMessage({ id: "settings.mcp.form.pasteHintSuffix" })] }), jsonError && _jsx("p", { className: "text-ui-base text-destructive", children: jsonError })] })] })) : (_jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex flex-wrap items-start justify-between gap-3", children: [_jsxs("div", { className: "w-full min-w-0 space-y-1.5 md:w-48", children: [_jsx(McpFormFieldLabel, { children: intl.formatMessage({ id: "settings.mcp.form.name" }) }), _jsx(Input, { size: "lg", placeholder: "my-mcp-server", value: form.name, disabled: !!editingId, onChange: (e) => update({ name: e.target.value }) })] }), _jsx("div", { children: scopeSelect })] }), _jsxs("div", { className: "space-y-1.5", children: [_jsx(McpFormFieldLabel, { children: intl.formatMessage({ id: "settings.mcp.form.type" }) }), _jsxs(Select, { value: form.type, onValueChange: (v) => update({ type: v }), children: [_jsx(SelectTrigger, { size: "lg", className: "w-48", children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "stdio", children: intl.formatMessage({ id: "settings.mcp.form.type.stdio" }) }), _jsx(SelectItem, { value: "http", children: "HTTP" }), _jsx(SelectItem, { value: "sse", children: intl.formatMessage({ id: "settings.mcp.form.type.sse" }) })] })] })] }), _jsxs("div", { className: "w-full space-y-1.5 md:w-48", children: [_jsx(McpFormFieldLabel, { children: intl.formatMessage({ id: "settings.mcp.form.timeoutMs" }) }), _jsx(Input, { size: "lg", type: "number", min: 1, inputMode: "numeric", placeholder: "30000", value: form.timeoutMs, onChange: (e) => update({ timeoutMs: e.target.value }) })] }), form.type !== "sse" && (_jsxs("div", { className: "w-full space-y-1.5 md:w-48", children: [_jsx(McpFormFieldLabel, { children: intl.formatMessage({ id: "settings.mcp.form.protocolVersion" }) }), _jsxs(Select, { value: form.protocolVersion || "auto", onValueChange: updateProtocolVersion, children: [_jsx(SelectTrigger, { size: "lg", className: "w-48", children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "auto", children: intl.formatMessage({ id: "settings.mcp.form.protocolVersion.auto" }) }), _jsx(SelectItem, { value: "legacy", children: intl.formatMessage({ id: "settings.mcp.form.protocolVersion.legacy" }) }), _jsx(SelectItem, { value: "2026-07-28", children: intl.formatMessage({ id: "settings.mcp.form.protocolVersion.modern" }) })] })] })] })), form.type === "stdio" ? (_jsxs(_Fragment, { children: [_jsxs("div", { className: "space-y-1.5", children: [_jsx(McpFormFieldLabel, { children: intl.formatMessage({ id: "settings.mcp.form.command" }) }), _jsx(Input, { size: "lg", placeholder: "npx", value: form.command, onChange: (e) => update({ command: e.target.value }) })] }), _jsxs("div", { className: "space-y-1.5", children: [_jsx(McpFormFieldLabel, { children: intl.formatMessage({ id: "settings.mcp.form.args" }) }), _jsx(Input, { size: "lg", placeholder: "-y @modelcontextprotocol/server-memory", value: form.args, onChange: (e) => update({ args: e.target.value }) })] })] })) : (_jsxs("div", { className: "space-y-1.5", children: [_jsx(McpFormFieldLabel, { children: "URL" }), _jsx(Input, { size: "lg", placeholder: "https://mcp.example.com/mcp", value: form.url, onChange: (e) => update({ url: e.target.value }) })] })), _jsxs("div", { children: [_jsxs("button", { type: "button", className: "flex items-center gap-1 text-ui-base text-foreground-subtle hover:text-foreground", onClick: () => setShowEnv((v) => !v), children: [showEnv ? _jsx(ChevronUp, { className: "size-3.5" }) : _jsx(ChevronDown, { className: "size-3.5" }), envToggleLabel] }), showEnv && (_jsx("div", { className: "mt-2 space-y-1.5", children: _jsx(SettingsFormTextarea, { rows: 4, className: "font-mono text-ui-base", placeholder: envPlaceholder, value: envValue, onChange: (e) => updateEnvValue(e.target.value) }) }))] })] })), _jsxs(SettingsFormActions, { leadingAction: initial && onDelete ? (_jsxs(Button, { type: "button", variant: "link", size: "lg", className: "px-0 text-destructive hover:text-destructive", onClick: () => onDelete(initial), children: [_jsx(Trash2, { className: "size-3.5", "aria-hidden": "true" }), intl.formatMessage({ id: "common.delete" })] })) : undefined, children: [_jsx(Button, { size: "lg", disabled: !canSave, onClick: handleSaveClick, children: intl.formatMessage({ id: "common.save" }) }), _jsx(Button, { variant: "ghost", size: "lg", onClick: onCancel, children: intl.formatMessage({ id: "common.cancel" }) })] })] }));
}
//# sourceMappingURL=McpServerForm.js.map