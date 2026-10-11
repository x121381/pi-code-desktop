import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Info, Workflow } from "lucide-react";
import { TID_WORKFLOW_LAUNCH_ARG, TID_WORKFLOW_LAUNCH_DIALOG, TID_WORKFLOW_LAUNCH_ERROR, TID_WORKFLOW_LAUNCH_SUBMIT, TID_WORKFLOW_LAUNCH_TARGET, testId, } from "@zcode/shared";
import { Button } from "../../components/ui/button.js";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, } from "../../components/ui/dialog.js";
import { Input } from "../../components/ui/input.js";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "../../components/ui/select.js";
import { Spinner } from "../../components/ui/spinner.js";
import { Switch } from "../../components/ui/switch.js";
import { cn } from "../../components/lib/utils.js";
import { useZCodeIntl } from "../../i18n/IntlProvider.js";
import { AutomationRunNowIcon } from "../../settings/AutomationDesignPrimitives.js";
import { SettingsFormTextarea } from "../../settings/SettingsFormTextarea.js";
import { findAutomationWorkspaceOptionByKey, reconcileAutomationWorkspaceSelectionKey, resolveAutomationWorkspaceSelectionKey, } from "../../settings/automationWorkspaceOptions.js";
import { buildSavedWorkflowArgFields, collectSavedWorkflowArgs, } from "../../settings/saved-workflows/savedWorkflowArgsForm.js";
/**
 * 实参窗：头部 = Workflow 图标 + 名字（mono）
 * + 作用域徽标 + 说明；「运行于」（全局档）；实参表；一句「将立即在 X 的新会话中运行」；主按钮
 * 「运行」。点「运行」= GUI 直接启动（无模型回合、无确认窗）：loading 期禁用，失败在行内错误区
 * 显示、窗口留着，成功由组关窗并切到新会话。无实参的项目档不弹本窗（组直接启动）。
 */
export function SavedWorkflowLaunchDialog({ entry, scope, projectLabel, onOpenChange, onSubmit, targets, defaultTargetKey, initialArgs, pending = false, error = null, }) {
    const { intl } = useZCodeIntl();
    const [fields, setFields] = useState([]);
    const [errors, setErrors] = useState({});
    const [targetKey, setTargetKey] = useState(null);
    useEffect(() => {
        setFields(buildSavedWorkflowArgFields(entry?.args, initialArgs));
        setErrors({});
    }, [entry, initialArgs]);
    // 候选变化时保留仍有效的选择，否则回落到默认项目、首个候选或 null（reconcile 同一套规则）。
    useEffect(() => {
        if (!targets) {
            setTargetKey(null);
            return;
        }
        const defaultOption = defaultTargetKey
            ? findAutomationWorkspaceOptionByKey(targets, defaultTargetKey)
            : undefined;
        setTargetKey((current) => reconcileAutomationWorkspaceSelectionKey(targets, current, defaultOption));
    }, [targets, defaultTargetKey]);
    const hasTargets = targets !== undefined;
    const noLocalProject = hasTargets && targets.length === 0;
    const selectedTarget = targets
        ? findAutomationWorkspaceOptionByKey(targets, targetKey)
        : undefined;
    // 「将立即在 {project} 的新会话中运行」：全局档用选中的「运行于」项目名，项目档用所属项目名。
    const noteProject = selectedTarget?.label ?? projectLabel;
    const scopeBadge = intl.formatMessage({
        id: scope === "global"
            ? "workflows.hub.launch.scope.global"
            : "workflows.hub.launch.scope.project",
    });
    const updateField = (name, value) => {
        setFields((current) => current.map((field) => (field.name === name ? { ...field, value } : field)));
        setErrors((current) => {
            if (!(name in current))
                return current;
            const next = { ...current };
            delete next[name];
            return next;
        });
    };
    const handleSubmit = () => {
        if (!entry)
            return;
        if (noLocalProject || pending)
            return;
        const collected = collectSavedWorkflowArgs(fields);
        if (!collected.ok) {
            setErrors(collected.errors);
            return;
        }
        onSubmit(entry, collected.args, selectedTarget);
    };
    return (_jsx(Dialog, { open: entry !== null, onOpenChange: onOpenChange, children: _jsxs(DialogContent, { className: "sm:max-w-[480px]", "data-testid": TID_WORKFLOW_LAUNCH_DIALOG, children: [_jsxs(DialogHeader, { children: [_jsxs(DialogTitle, { className: "flex items-center gap-2", children: [_jsx(Workflow, { className: "size-4 shrink-0 text-foreground-subtle", "aria-hidden": "true" }), _jsx("span", { className: "min-w-0 truncate font-mono", children: entry?.name }), _jsx("span", { className: "shrink-0 rounded-sm border border-border px-1.5 py-0.5 text-ui-xs font-normal leading-none text-foreground-subtlest", children: scopeBadge })] }), entry?.description ? (_jsx("p", { className: "text-ui-sm text-foreground-subtle", children: entry.description })) : null] }), _jsxs("form", { className: "flex flex-col gap-4", onSubmit: (event) => {
                        event.preventDefault();
                        handleSubmit();
                    }, children: [hasTargets ? (_jsxs("div", { className: "flex flex-col gap-1.5", children: [_jsx("span", { className: "text-ui-base font-medium text-foreground", children: intl.formatMessage({ id: "workflows.hub.launch.target" }) }), noLocalProject ? (_jsx("p", { className: "text-ui-sm text-foreground-subtle", children: intl.formatMessage({ id: "workflows.hub.launch.noLocalProject" }) })) : (_jsxs(Select, { value: targetKey ?? undefined, onValueChange: setTargetKey, children: [_jsx(SelectTrigger, { "data-testid": TID_WORKFLOW_LAUNCH_TARGET, children: _jsx(SelectValue, {}) }), _jsx(SelectContent, { children: targets.map((option) => {
                                                const key = resolveAutomationWorkspaceSelectionKey(option);
                                                return (_jsx(SelectItem, { value: key, children: option.label }, key));
                                            }) })] }))] })) : null, fields.map((field) => {
                            const fieldError = errors[field.name];
                            const inputId = `workflow-arg-${field.name}`;
                            const errorText = fieldError
                                ? intl.formatMessage({ id: `workflows.hub.launch.error.${fieldError}` })
                                : null;
                            return (_jsxs("div", { className: "flex flex-col gap-1.5", children: [_jsxs("div", { className: "flex items-center justify-between gap-3", children: [_jsxs("div", { className: "flex min-w-0 flex-col gap-0.5", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("label", { htmlFor: inputId, className: "font-mono text-ui-base font-medium text-foreground", children: field.name }), field.required ? (_jsx("span", { className: "rounded-sm border border-border px-1.5 py-0.5 text-ui-xs leading-none text-foreground-subtlest", children: intl.formatMessage({ id: "workflows.hub.launch.required" }) })) : null] }), field.description ? (_jsx("p", { className: "text-ui-sm text-foreground-subtle", children: field.description })) : null] }), field.type === "boolean" ? (_jsx(Switch, { id: inputId, "data-testid": testId(TID_WORKFLOW_LAUNCH_ARG, field.name), checked: field.value === "true", onCheckedChange: (checked) => updateField(field.name, checked ? "true" : "false") })) : null] }), field.type === "json" ? (_jsx(SettingsFormTextarea, { id: inputId, "data-testid": testId(TID_WORKFLOW_LAUNCH_ARG, field.name), className: cn("min-h-20 font-mono", fieldError && "border-destructive"), value: field.value, "aria-invalid": Boolean(fieldError), onChange: (event) => updateField(field.name, event.target.value) })) : field.type === "boolean" ? null : (_jsx(Input, { id: inputId, "data-testid": testId(TID_WORKFLOW_LAUNCH_ARG, field.name), type: field.type === "number" ? "number" : "text", inputMode: field.type === "number" ? "decimal" : undefined, className: cn("font-mono", fieldError && "border-destructive"), value: field.value, "aria-invalid": Boolean(fieldError), onChange: (event) => updateField(field.name, event.target.value) })), errorText ? _jsx("p", { className: "text-ui-sm text-destructive", children: errorText }) : null] }, field.name));
                        }), _jsxs("div", { className: "flex items-start gap-2 rounded-lg bg-surface px-3 py-2.5 text-ui-base text-foreground-subtle", children: [_jsx("span", { className: "flex size-5 shrink-0 items-center justify-center", children: _jsx(Info, { className: "size-4", "aria-hidden": "true" }) }), _jsx("p", { className: "min-w-0 leading-5", children: intl.formatMessage({ id: "workflows.hub.launch.note" }, { project: noteProject }) })] }), error ? (_jsxs("div", { "data-testid": TID_WORKFLOW_LAUNCH_ERROR, className: "flex flex-col gap-1.5 rounded-lg border border-destructive/40 px-3 py-2.5", children: [_jsx("p", { className: "text-ui-sm font-medium text-destructive", children: intl.formatMessage({ id: `workflows.hub.launch.error.${error.reason}` }) }), error.message ? (_jsx("pre", { className: "min-w-0 overflow-x-auto whitespace-pre-wrap break-words font-mono text-ui-sm text-foreground-subtle", children: error.message })) : null] })) : null, _jsxs(DialogFooter, { children: [_jsx(Button, { type: "button", variant: "outline", size: "lg", disabled: pending, onClick: () => onOpenChange(false), children: intl.formatMessage({ id: "workflows.hub.launch.cancel" }) }), _jsxs(Button, { type: "submit", size: "lg", "data-icon": "inline-start", "data-testid": TID_WORKFLOW_LAUNCH_SUBMIT, disabled: noLocalProject || pending, children: [pending ? (_jsx(Spinner, { className: "size-4" })) : (_jsx(AutomationRunNowIcon, { className: "size-4", "aria-hidden": "true" })), intl.formatMessage({ id: "workflows.hub.launch.submit" })] })] })] })] }) }));
}
//# sourceMappingURL=SavedWorkflowLaunchDialog.js.map