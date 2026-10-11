import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// ============================================================
// 「配置」弹层的两个字段
// ============================================================
// 从 WorkflowRunSettingsPopover.tsx 拆出：那边管表单状态、命令与后果句，这里只画两个受控字段——
// 子代理模型（composer 的模型菜单 + 思考档）与「最大并发数」步进器。props 全是烹熟的值。
import { useMemo, useRef, useState } from "react";
import { MinusIcon, PlusIcon } from "lucide-react";
import { ZCODE_AGENT_PROVIDER } from "@zcode/shared";
import { ThoughtLevelCycleControl } from "@/chat-input-toolbar/ThoughtLevelCycleControl.js";
import { cn } from "@/components/lib/utils.js";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput, } from "@/components/ui/input-group.js";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
import { MODEL_CONFIG_SELECT_BADGE_CLASS_NAME, ModelConfigSelect, } from "@/ModelConfigSelect.js";
import { clampWorkflowRunSettingsBound } from "./workflowRunSettings.js";
const MODEL_ITEM_NEVER_LOCKED = () => false;
/** 字段标签：12px、次要色，控件上方 4px。 */
function FieldLabel({ children }) {
    return _jsx("div", { className: "text-ui-sm text-foreground-subtle", children: children });
}
/**
 * 子代理模型：composer 的同一份模型菜单，「会话模型」排第一；所选模型有思考档时，触发器旁边是
 * 设置页子代理那一格用的同一个思考档控件。清单为空时整格换成一句话（上限仍可调）。
 */
export function WorkflowRunSettingsModelField({ badge, disabled, groups, leadingItem, noCatalog, onLevelChange, onValueChange, thoughtOption, triggerLabel, value, }) {
    const { intl } = useZCodeIntl();
    const levelTriggerRef = useRef(null);
    const [levelOpen, setLevelOpen] = useState(false);
    const label = intl.formatMessage({ id: "chat.toolCall.workflow.run.settings.model" });
    // ModelConfigSelect 是 memo 组件：内联数组每次渲染都是新引用，会让它的 memo 形同虚设。
    const leadingItems = useMemo(() => [leadingItem], [leadingItem]);
    if (noCatalog) {
        return (_jsxs("div", { className: "flex flex-col gap-1", "data-testid": "workflow-run-settings-model", children: [_jsx(FieldLabel, { children: label }), _jsx("p", { className: "text-ui-sm text-foreground-subtle", children: intl.formatMessage({ id: "chat.toolCall.workflow.run.settings.model.noCatalog" }) })] }));
    }
    return (_jsxs("div", { className: "flex flex-col gap-1", "data-testid": "workflow-run-settings-model", children: [_jsx(FieldLabel, { children: label }), _jsxs("div", { className: "flex min-w-0 items-center gap-1.5", children: [_jsx("span", { className: "inline-flex min-w-0 flex-1", "data-model-current-value": value, children: _jsx(ModelConfigSelect, { modelGroups: groups, normalizedValue: value, triggerLabel: triggerLabel, showManageModelsAction: false, lockReasonMessage: "", isItemLocked: MODEL_ITEM_NEVER_LOCKED, onValueChange: onValueChange, leadingItems: leadingItems, contentSide: "bottom", contentAlign: "start", focusSelectorOnClose: null, labelVisibilityClassName: "inline-flex min-w-0", triggerClassName: "h-7 w-full min-w-0 justify-between rounded-md border border-input-border bg-input px-2 text-foreground hover:border-input-border-hover hover:bg-input focus-visible:border-input-border-focused focus-visible:bg-input-focused", triggerLabelClassName: "inline-flex min-w-0 flex-1 truncate text-left", triggerTestId: "workflow-run-settings-model-trigger", ...(badge === undefined
                                ? {}
                                : {
                                    triggerBadge: (_jsx("span", { className: cn(MODEL_CONFIG_SELECT_BADGE_CLASS_NAME, badge.tone === "warning" && "text-warning"), "data-testid": "workflow-run-settings-model-badge", children: badge.text })),
                                }), disabled: disabled }) }), thoughtOption === null ? null : (_jsx(ThoughtLevelCycleControl, { intl: intl, option: thoughtOption, provider: ZCODE_AGENT_PROVIDER, onCurrentValueCommit: onLevelChange, showInvalidCurrentValue: true, disabled: disabled, open: disabled ? false : levelOpen, onOpenChange: setLevelOpen, triggerRef: levelTriggerRef, restoreFocusSelector: null, labelVisibilityClassName: "inline-flex", triggerClassName: "h-7 shrink-0 rounded-md border border-input-border bg-input px-2 text-foreground hover:border-input-border-hover hover:bg-input", onValueChange: onLevelChange }))] })] }));
}
/**
 * 「最大并发数」步进器：减、等宽数字、加，从 1 起、**没有上限**——默认并发 D 是起点不是天花板
 * （docs/dynamic-workflow/presentation.md「The settings popover」）。提示写「默认 N」，停在 D 上即
 * 「本 run 没有自己的界」，提示改写成「= 默认」。D 未知（老 CLI）时没有提示，数字照样可以直接敲。
 */
export function WorkflowRunSettingsBoundField({ bound, defaultConcurrency, disabled, onChange, }) {
    const { intl } = useZCodeIntl();
    const hint = defaultConcurrency === undefined
        ? undefined
        : bound === defaultConcurrency
            ? intl.formatMessage({ id: "chat.toolCall.workflow.run.settings.limit.atDefault" })
            : intl.formatMessage({ id: "chat.toolCall.workflow.run.settings.limit.default" }, { n: defaultConcurrency });
    return (_jsxs("div", { className: "flex flex-col gap-1", "data-testid": "workflow-run-settings-bound", children: [_jsx(FieldLabel, { children: intl.formatMessage({ id: "chat.toolCall.workflow.run.settings.limit" }) }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsxs(InputGroup, { className: "w-auto shrink-0", children: [_jsx(InputGroupAddon, { align: "inline-start", children: _jsx(InputGroupButton, { "aria-label": intl.formatMessage({
                                        id: "chat.toolCall.workflow.run.settings.limit.decrease",
                                    }), "data-testid": "workflow-run-settings-bound-decrease", disabled: disabled || bound === null || bound <= 1, onClick: () => bound !== null && onChange(clampWorkflowRunSettingsBound(bound - 1)), size: "icon-xs", children: _jsx(MinusIcon, { className: "size-3.5" }) }) }), _jsx(InputGroupInput, { "aria-label": intl.formatMessage({ id: "chat.toolCall.workflow.run.settings.limit" }), className: "h-7 w-9 px-0 text-center font-mono tabular-nums", "data-testid": "workflow-run-settings-bound-value", disabled: disabled, inputMode: "numeric", onChange: (event) => {
                                    const parsed = Number.parseInt(event.target.value, 10);
                                    if (Number.isFinite(parsed))
                                        onChange(clampWorkflowRunSettingsBound(parsed));
                                }, placeholder: "\u2014", value: bound === null ? "" : String(bound) }), _jsx(InputGroupAddon, { align: "inline-end", children: _jsx(InputGroupButton, { "aria-label": intl.formatMessage({
                                        id: "chat.toolCall.workflow.run.settings.limit.increase",
                                    }), "data-testid": "workflow-run-settings-bound-increase", disabled: disabled || bound === null, onClick: () => bound !== null && onChange(clampWorkflowRunSettingsBound(bound + 1)), size: "icon-xs", children: _jsx(PlusIcon, { className: "size-3.5" }) }) })] }), hint === undefined ? null : (_jsx("span", { className: "min-w-0 truncate text-ui-sm text-foreground-subtle", children: hint }))] })] }));
}
//# sourceMappingURL=WorkflowRunSettingsFields.js.map