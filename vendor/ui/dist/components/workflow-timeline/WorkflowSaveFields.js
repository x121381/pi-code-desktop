import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { FolderIcon, GlobeIcon } from "lucide-react";
import { Button } from "../../components/ui/button.js";
import { Input } from "../../components/ui/input.js";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "../../components/ui/select.js";
import { Spinner } from "../../components/ui/spinner.js";
import { cn } from "../../components/lib/utils.js";
import { useZCodeIntl } from "../../i18n/IntlProvider.js";
import { SettingsFormTextarea } from "../../settings/SettingsFormTextarea.js";
import { SAVED_WORKFLOW_NAME_MAX_CHARS } from "./workflowRunSave.js";
export function WorkflowSaveFields({ draft, failure, nameInvalid, nameRef, onDirectSave, pathPreview, saving, scopeLocked, shadowing, showDivider, submitDisabled, submitLabel, taken, update, }) {
    const { intl } = useZCodeIntl();
    const format = (id, values) => intl.formatMessage({ id }, values);
    return (_jsxs(_Fragment, { children: [showDivider ? (_jsxs("div", { className: "flex items-center gap-2 text-ui-xs text-foreground-subtlest", children: [_jsx("span", { "aria-hidden": true, className: "h-px flex-1 bg-border" }), _jsx("span", { children: format("chat.toolCall.workflow.saveRun.or") }), _jsx("span", { "aria-hidden": true, className: "h-px flex-1 bg-border" })] })) : null, _jsxs("div", { className: "flex flex-col gap-1", children: [_jsx("label", { className: "text-ui-sm text-foreground-subtle", htmlFor: "workflow-save-name", children: format("chat.toolCall.workflow.saveRun.name") }), _jsxs("div", { className: "relative", children: [_jsx(Input, { "aria-invalid": nameInvalid, className: "pr-16 font-mono", "data-testid": "workflow-save-name", disabled: saving, id: "workflow-save-name", maxLength: SAVED_WORKFLOW_NAME_MAX_CHARS, onChange: (event) => update({ name: event.target.value }), placeholder: format("chat.toolCall.workflow.saveRun.name.placeholder"), ref: nameRef, value: draft.name }), _jsx("span", { className: "pointer-events-none absolute inset-y-0 right-2 flex items-center font-mono text-ui-xs text-foreground-subtlest", children: ".dwf.ts" })] }), _jsx("p", { className: cn("text-ui-xs", nameInvalid ? "text-destructive" : "text-foreground-subtlest"), "data-testid": "workflow-save-name-helper", children: format(nameInvalid
                            ? "chat.toolCall.workflow.saveRun.name.invalid"
                            : "chat.toolCall.workflow.saveRun.name.helper") })] }), _jsxs("div", { className: "flex flex-col gap-1", children: [_jsx("span", { className: "text-ui-sm text-foreground-subtle", children: format("chat.toolCall.workflow.save.scope.label") }), _jsxs(Select, { disabled: scopeLocked || saving, onValueChange: (value) => update({ scope: value }), value: draft.scope, children: [_jsx(SelectTrigger, { className: "w-full", "data-testid": "workflow-save-scope", children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsxs(SelectItem, { value: "project", children: [_jsx(FolderIcon, { "aria-hidden": true, className: "size-3.5 text-foreground-subtle" }), format("chat.toolCall.workflow.save.scope.project")] }), _jsxs(SelectItem, { value: "global", children: [_jsx(GlobeIcon, { "aria-hidden": true, className: "size-3.5 text-foreground-subtle" }), format("chat.toolCall.workflow.save.scope.global")] })] })] }), scopeLocked ? (_jsx("p", { className: "text-ui-xs text-foreground-subtlest", children: format("chat.toolCall.workflow.saveRun.scope.remoteOnly") })) : null] }), _jsxs("div", { className: "flex flex-col gap-1", children: [_jsx("label", { className: "text-ui-sm text-foreground-subtle", htmlFor: "workflow-save-description", children: format("chat.toolCall.workflow.saveRun.description") }), _jsx(SettingsFormTextarea, { className: "min-h-14", "data-testid": "workflow-save-description", disabled: saving, id: "workflow-save-description", onChange: (event) => update({ description: event.target.value }), value: draft.description }), _jsx("p", { className: "text-ui-xs text-foreground-subtlest", children: format("chat.toolCall.workflow.saveRun.description.helper") })] }), _jsx(WorkflowSaveConsequence, { failure: failure, pathPreview: pathPreview, scope: draft.scope, shadowing: shadowing, taken: taken }), _jsx("div", { className: "flex justify-end", children: _jsxs(Button, { "data-testid": "workflow-save-submit", disabled: submitDisabled, onClick: onDirectSave, type: "button", variant: "outline", children: [saving ? _jsx(Spinner, { className: "size-3.5" }) : null, submitLabel] }) })] }));
}
/**
 * 同一个位置的三选一：agent 的拒绝 → 覆盖警告 → 一句后果。拒绝在场时弹层不关，因为一个字节
 * 都没写；覆盖警告与后果句都会在另一个作用域也占着这个名字时补上遮蔽那一句（与 SaveWorkflow
 * 卡同一句话）——遮蔽与覆盖是两件事，只说其中一件会让用户以为另一件不会发生。
 */
function WorkflowSaveConsequence({ failure, pathPreview, scope, shadowing, taken, }) {
    const { intl } = useZCodeIntl();
    const format = (id, values) => intl.formatMessage({ id }, values);
    // 遮蔽那一句借 SaveWorkflow 卡的原词（它本身不带句号），句号随语言由词条补上。
    const shadowingText = shadowing
        ? format("chat.toolCall.workflow.saveRun.shadowing", {
            text: format(scope === "global"
                ? "chat.toolCall.workflow.save.scope.hiddenByProject"
                : "chat.toolCall.workflow.save.scope.hidesGlobal"),
        })
        : null;
    if (failure !== undefined) {
        return (_jsxs("div", { className: "text-ui-xs text-warning", "data-testid": "workflow-save-failure", role: "status", children: [_jsx("span", { children: format(`chat.toolCall.workflow.saveRun.error.${failure.reason}`) }), failure.detail === undefined ? null : (_jsx("pre", { className: "mt-1 max-h-24 overflow-auto whitespace-pre-wrap font-mono text-ui-xs text-foreground-subtle", children: failure.detail }))] }));
    }
    if (taken) {
        return (_jsxs("div", { className: "rounded-lg border border-warning/40 bg-warning/10 px-2.5 py-2 text-ui-sm leading-snug text-foreground-subtle", "data-testid": "workflow-save-overwrite", children: [format("chat.toolCall.workflow.saveRun.overwrite"), shadowingText === null ? null : ` ${shadowingText}`] }));
    }
    // 路径是技术值，要等宽排印（DESIGN.md 把 font-mono 留给技术值）；词条引擎只收字符串，所以
    // 用一个不会出现在文案里的占位符把句子切成前后两段，再把路径以 <code> 嵌回去。
    const [before, after = ""] = format("chat.toolCall.workflow.saveRun.consequence", {
        path: PATH_SLOT,
    }).split(PATH_SLOT);
    return (_jsxs("p", { className: "text-ui-sm leading-snug text-foreground-subtle", "data-testid": "workflow-save-consequence", children: [before, _jsx("code", { className: "font-mono text-ui-xs", children: pathPreview }), after, shadowingText === null ? null : ` ${shadowingText}`] }));
}
/** 路径在句子里的占位：NUL 不会出现在任何词条里。 */
const PATH_SLOT = "\u0000";
//# sourceMappingURL=WorkflowSaveFields.js.map