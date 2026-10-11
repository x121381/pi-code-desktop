import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { TID_WORKFLOW_MOVE_DIALOG, TID_WORKFLOW_MOVE_DIALOG_SUBMIT, TID_WORKFLOW_MOVE_DIALOG_TARGET, } from "@zcode/shared";
import { Button } from "../../components/ui/button.js";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, } from "../../components/ui/dialog.js";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "../../components/ui/select.js";
import { useZCodeIntl } from "../../i18n/IntlProvider.js";
import { findAutomationWorkspaceOptionByKey, reconcileAutomationWorkspaceSelectionKey, resolveAutomationWorkspaceSelectionKey, } from "../../settings/automationWorkspaceOptions.js";
/**
 * 「移到项目」窗：全局工作流搬回某个本地项目。
 * 一个项目选择器 + 提交；没有本地项目时禁用提交并提示。结构 / 样式沿用实参窗。
 */
export function SavedWorkflowMoveDialog({ open, entryName, targets, defaultTargetKey, busy = false, onOpenChange, onSubmit, }) {
    const { intl } = useZCodeIntl();
    const [targetKey, setTargetKey] = useState(null);
    // 候选变化时保留仍有效的选择，否则回落到默认项目、首个候选或 null。
    useEffect(() => {
        const defaultOption = defaultTargetKey
            ? findAutomationWorkspaceOptionByKey(targets, defaultTargetKey)
            : undefined;
        setTargetKey((current) => reconcileAutomationWorkspaceSelectionKey(targets, current, defaultOption));
    }, [targets, defaultTargetKey]);
    const noTargets = targets.length === 0;
    const handleSubmit = () => {
        if (noTargets || busy)
            return;
        const target = findAutomationWorkspaceOptionByKey(targets, targetKey);
        if (!target)
            return;
        onSubmit(target);
    };
    return (_jsx(Dialog, { open: open, onOpenChange: onOpenChange, children: _jsxs(DialogContent, { className: "sm:max-w-[480px]", "data-testid": TID_WORKFLOW_MOVE_DIALOG, children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: intl.formatMessage({ id: "workflows.hub.moveDialog.title" }) }), entryName ? (_jsx(DialogDescription, { children: intl.formatMessage({ id: "workflows.hub.launch.title" }, { name: entryName }) })) : null] }), _jsxs("form", { className: "flex flex-col gap-4", onSubmit: (event) => {
                        event.preventDefault();
                        handleSubmit();
                    }, children: [_jsxs("div", { className: "flex flex-col gap-1.5", children: [_jsx("span", { className: "text-ui-base font-medium text-foreground", children: intl.formatMessage({ id: "workflows.hub.detail.projectColumn" }) }), noTargets ? (_jsx("p", { className: "text-ui-sm text-foreground-subtle", children: intl.formatMessage({ id: "workflows.hub.moveDialog.noLocalProject" }) })) : (_jsxs(Select, { value: targetKey ?? undefined, onValueChange: setTargetKey, children: [_jsx(SelectTrigger, { "data-testid": TID_WORKFLOW_MOVE_DIALOG_TARGET, children: _jsx(SelectValue, {}) }), _jsx(SelectContent, { children: targets.map((option) => {
                                                const key = resolveAutomationWorkspaceSelectionKey(option);
                                                return (_jsx(SelectItem, { value: key, children: option.label }, key));
                                            }) })] }))] }), _jsxs(DialogFooter, { children: [_jsx(Button, { type: "button", variant: "outline", size: "lg", onClick: () => onOpenChange(false), children: intl.formatMessage({ id: "workflows.hub.launch.cancel" }) }), _jsx(Button, { type: "submit", size: "lg", "data-testid": TID_WORKFLOW_MOVE_DIALOG_SUBMIT, disabled: noTargets || busy, children: intl.formatMessage({ id: "workflows.hub.moveDialog.submit" }) })] })] })] }) }));
}
//# sourceMappingURL=SavedWorkflowMoveDialog.js.map