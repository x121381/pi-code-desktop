import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
// ============================================================
// 确认窗两句设置的零件（docs/dynamic-workflow/presentation.md「The confirmation window」）
// ============================================================
// 从 WorkflowAskSettingsLines.tsx 拆出（max-lines 门）：两句共用的类名与「· 原为 X ↺」尾巴、上界那一句、
// 以及块缺席（旧 agent）时的纯文本条件行。状态都在 WorkflowAskSettings 里，这里的组件只收烹熟的值。
import { MinusIcon, PlusIcon, Undo2Icon } from "lucide-react";
import { cn } from "@/components/lib/utils.js";
import { Button } from "@/components/ui/button.js";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput, } from "@/components/ui/input-group.js";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
import { clampWorkflowRunSettingsBound } from "./workflowRunSettings.js";
/** 句中的值画成一枚芯片：平时是一小块 surface，悬停才出边框与输入底色（composer 模型触发器的语汇）。 */
export const WORKFLOW_ASK_CHIP_CLASS_NAME = "h-6 min-w-0 max-w-[260px] gap-1 rounded-md border border-transparent bg-surface pl-[7px] pr-1 text-ui-sm text-foreground hover:border-border-hover hover:bg-input focus-visible:border-input-border-focused data-[state=open]:border-border-hover data-[state=open]:bg-input [&_svg]:size-3";
export const WORKFLOW_ASK_LINE_CLASS_NAME = "flex min-h-6 min-w-0 flex-wrap items-center gap-x-1.5 gap-y-1 text-ui-sm text-foreground-subtle";
export const WORKFLOW_ASK_TAIL_CLASS_NAME = "text-foreground-subtlest";
/** 「· 原为 X ↺」：改过的那一行才有；↺ 把这一行放回起点。 */
export function WorkflowAskWasTail({ disabled, onReset, testId, value, }) {
    const { intl } = useZCodeIntl();
    const resetLabel = intl.formatMessage({ id: "chat.permission.workflow.settings.reset" });
    // 按钮只有图标：aria-label 给读屏，title 给悬停（spec：「恢复原值」）。
    return (_jsxs("span", { className: cn("inline-flex min-w-0 items-center gap-0.5", WORKFLOW_ASK_TAIL_CLASS_NAME), children: [_jsxs("span", { className: "min-w-0 truncate", "data-testid": `${testId}-was`, children: ["\u00B7 ", intl.formatMessage({ id: "chat.permission.workflow.settings.was" }, { value })] }), _jsx(Button, { "aria-label": resetLabel, className: "text-foreground-subtlest hover:text-foreground", "data-testid": `${testId}-reset`, disabled: disabled, onClick: onReset, size: "icon-xs", title: resetLabel, type: "button", variant: "ghost", children: _jsx(Undo2Icon, { className: "size-3" }) })] }));
}
export function WorkflowAskBoundLine({ bound, changed, defaultConcurrency, disabled, initial, onChange, onReset, }) {
    const { intl } = useZCodeIntl();
    const format = intl.formatMessage.bind(intl);
    const tail = defaultConcurrency === undefined
        ? bound === null
            ? format({ id: "chat.permission.workflow.settings.limit.none" })
            : undefined
        : bound === defaultConcurrency
            ? format({ id: "chat.toolCall.workflow.run.settings.limit.atDefault" })
            : format({ id: "chat.toolCall.workflow.run.settings.limit.default" }, { n: defaultConcurrency });
    const initialText = initial === null
        ? format({ id: "chat.permission.workflow.settings.limit.none" })
        : String(initial);
    return (_jsxs("div", { className: WORKFLOW_ASK_LINE_CLASS_NAME, "data-changed": changed ? "true" : undefined, "data-testid": "workflow-permission-settings-bound", children: [_jsx("span", { children: format({ id: "chat.permission.workflow.settings.limit.lead" }) }), _jsxs(InputGroup, { className: "h-6 w-auto shrink-0", children: [_jsx(InputGroupAddon, { align: "inline-start", children: _jsx(InputGroupButton, { "aria-label": format({ id: "chat.toolCall.workflow.run.settings.limit.decrease" }), "data-testid": "workflow-permission-settings-bound-decrease", disabled: disabled || bound === null || bound <= 1, onClick: () => bound !== null && onChange(clampWorkflowRunSettingsBound(bound - 1)), size: "icon-xs", children: _jsx(MinusIcon, { className: "size-3" }) }) }), _jsx(InputGroupInput, { "aria-label": format({ id: "chat.toolCall.workflow.run.settings.limit" }), className: cn("h-6 w-[30px] px-0 text-center font-mono text-ui-sm tabular-nums", changed && "font-medium"), "data-testid": "workflow-permission-settings-bound-value", disabled: disabled, inputMode: "numeric", onChange: (event) => {
                            const parsed = Number.parseInt(event.target.value, 10);
                            if (Number.isFinite(parsed))
                                onChange(clampWorkflowRunSettingsBound(parsed));
                        }, placeholder: "\u2014", value: bound === null ? "" : String(bound) }), _jsx(InputGroupAddon, { align: "inline-end", children: _jsx(InputGroupButton, { "aria-label": format({ id: "chat.toolCall.workflow.run.settings.limit.increase" }), "data-testid": "workflow-permission-settings-bound-increase", disabled: disabled || bound === null, onClick: () => bound !== null && onChange(clampWorkflowRunSettingsBound(bound + 1)), size: "icon-xs", children: _jsx(PlusIcon, { className: "size-3" }) }) })] }), _jsx("span", { children: format({ id: "chat.permission.workflow.settings.limit.trail" }) }), tail === undefined ? null : (_jsxs("span", { className: WORKFLOW_ASK_TAIL_CLASS_NAME, "data-testid": "workflow-permission-settings-bound-tail", children: ["\u00B7 ", tail] })), changed ? (_jsx(WorkflowAskWasTail, { disabled: disabled, onReset: onReset, testId: "workflow-permission-settings-bound", value: initialText })) : null] }));
}
/**
 * 块缺席时的纯文本条件行（旧 agent）：只有调用设了的字段，模型在上、上界在下，`text-ui-xs` 最淡色。
 * 与可调的两行同一个次序，好让新旧两种窗读起来是同一件事。模型说解析好的名字，规范串只进 tooltip。
 */
export function WorkflowAskPlainSettings({ maxConcurrency, scriptNamesModels = false, subagentModel, }) {
    const { intl } = useZCodeIntl();
    if (maxConcurrency === undefined && subagentModel === undefined)
        return null;
    return (_jsxs("div", { className: "space-y-1", children: [subagentModel === undefined ? null : (_jsx("p", { className: "min-w-0 text-ui-xs text-foreground-subtlest", "data-testid": "workflow-permission-subagent-model", title: subagentModel.tooltip, children: intl.formatMessage({
                    id: scriptNamesModels
                        ? "chat.permission.workflow.subagentModelDefault"
                        : "chat.permission.workflow.subagentModel",
                }, { model: subagentModel.text }) })), maxConcurrency === undefined ? null : (_jsx("p", { className: "min-w-0 text-ui-xs text-foreground-subtlest", "data-testid": "workflow-permission-max-concurrency", children: intl.formatMessage({ id: "chat.permission.workflow.maxConcurrency" }, { count: String(maxConcurrency) }) }))] }));
}
//# sourceMappingURL=WorkflowAskSettingsParts.js.map