import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// ============================================================
// 「配置」弹层
// ============================================================
// run 卡的 Configure 钮、详情页的 Configure 钮与详情页摘要行的模型段打开同一个弹层：两个字段、
// 一句后果、Apply。Apply 就是一次 GUI 修订——`amendWorkflowRunSettings` 命令，不经模型轮、不开
// 确认窗；那一下点击就是
// 同意，与中枢的「运行」同一条规则。
//
// 一个弹层、多个触发点：锚点是**打开它的那个元素**（虚拟锚），所以详情页上两个入口各自对齐。
// 表单只在打开时挂载——模型清单的订阅也随之只活在打开期间。
import { useCallback, useRef, useState } from "react";
import { Button } from "@/components/ui/button.js";
import { Popover, PopoverAnchor, PopoverContent, PopoverTitle } from "@/components/ui/popover.js";
import { Spinner } from "@/components/ui/spinner.js";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
import { logger } from "@/logger.js";
import { WorkflowRunSettingsBoundField, WorkflowRunSettingsModelField, } from "./WorkflowRunSettingsFields.js";
import { useWorkflowSettingsModelChoices, } from "./useWorkflowSettingsModelChoices.js";
import { describeWorkflowRunSettingsRejection, initialWorkflowRunSettingsDraft, workflowRunDefaultConcurrency, workflowRunSettingsChange, workflowRunSettingsConsequenceId, workflowRunSettingsRejectionDetail, workflowRunSettingsRejectionMessageId, } from "./workflowRunSettings.js";
/** 触发点的开关与锚点：点同一个触发点再点一次是关，点另一个是移过去重开。 */
export function useWorkflowRunSettingsPopoverState() {
    const anchorRef = useRef(null);
    const [open, setOpen] = useState(false);
    const toggleFrom = useCallback((element) => {
        if (open && anchorRef.current === element) {
            setOpen(false);
            return;
        }
        anchorRef.current = element;
        setOpen(true);
    }, [open]);
    return { anchorRef, open, setOpen, toggleFrom };
}
export function WorkflowRunSettingsPopover({ anchorRef, host, onAccepted, onOpenChange, open, run, }) {
    return (_jsxs(Popover, { open: open, onOpenChange: onOpenChange, children: [_jsx(PopoverAnchor, { virtualRef: anchorRef }), _jsx(PopoverContent, { align: "end", className: "gap-2.5", "data-testid": "workflow-run-settings-popover", 
                // 弹层 portal 在外，但 React 事件仍沿组件树冒泡：不拦的话，点弹层空白处会让 run 卡以为
                // 点了卡身而收起（卡身整张是折叠开关），数字框里的回车也会被卡当成 Enter 切换。
                onClick: (event) => event.stopPropagation(), onKeyDown: (event) => {
                    if (event.key === "Enter" || event.key === " ")
                        event.stopPropagation();
                }, 
                // 点打开它的那个触发点本身不算「点在外面」：否则先被关掉、再被那一下点击重新打开。
                onInteractOutside: (event) => {
                    const target = event.target;
                    if (target instanceof Node && anchorRef.current?.contains(target))
                        event.preventDefault();
                }, children: _jsx(WorkflowRunSettingsForm, { host: host, onClose: () => onOpenChange(false), run: run, ...(onAccepted === undefined ? {} : { onAccepted }) }) })] }));
}
function WorkflowRunSettingsForm({ host, onAccepted, onClose, run, }) {
    const { intl } = useZCodeIntl();
    const format = useCallback((id, values) => intl.formatMessage({ id }, values), [intl]);
    // 清单、会话模型那一项、触发器文案、换模型的思考档规则：与确认窗共用一份
    // （useWorkflowSettingsModelChoices.ts）。
    const choices = useWorkflowSettingsModelChoices(host);
    // 起点在打开那一刻定下：run 状态在弹层开着时变了，也不该把用户正在改的表单拽回去。
    const [initial] = useState(() => initialWorkflowRunSettingsDraft(run));
    const [draft, setDraft] = useState(initial);
    const [pending, setPending] = useState(false);
    const [rejection, setRejection] = useState(undefined);
    const defaultConcurrency = workflowRunDefaultConcurrency(run);
    const change = workflowRunSettingsChange(initial, draft, defaultConcurrency);
    const updateDraft = (next) => {
        setDraft(next);
        setRejection(undefined);
    };
    const draftModel = draft.model;
    const face = choices.describe(draftModel);
    const handleModelChange = (value) => {
        updateDraft({ ...draft, model: choices.pick(value, draftModel) });
    };
    const handleApply = () => {
        if (change === undefined)
            return;
        setPending(true);
        setRejection(undefined);
        host.apply(change).then((ack) => {
            const next = describeWorkflowRunSettingsRejection(ack);
            if (next !== undefined) {
                logger.warn("[workflow-run] 调整设置被拒绝", {
                    reasonCode: ack.reasonCode,
                    runId: run.runId,
                    status: ack.status,
                });
                setRejection(next);
                setPending(false);
                return;
            }
            const result = ack.result;
            if (result?.type === "amendWorkflowRunSettings") {
                onAccepted?.({ runId: result.runId, toolCallId: result.toolCallId });
            }
            onClose();
        }, (error) => {
            logger.warn("[workflow-run] 调整设置命令失败", { runId: run.runId, error: String(error) });
            setRejection({
                reason: "generic",
                code: error instanceof Error ? error.message : String(error),
            });
            setPending(false);
        });
    };
    const rejectionDetail = rejection === undefined ? undefined : workflowRunSettingsRejectionDetail(rejection);
    const consequenceId = workflowRunSettingsConsequenceId(run.status, change);
    return (_jsxs(_Fragment, { children: [_jsx(PopoverTitle, { children: format("chat.toolCall.workflow.run.settings.title") }), _jsx(WorkflowRunSettingsModelField, { disabled: pending || choices.loading, groups: choices.groups, leadingItem: choices.sessionModelItem, noCatalog: choices.noCatalog, onLevelChange: (level) => {
                    if (draftModel.kind !== "model" || level === draftModel.level)
                        return;
                    updateDraft({ ...draft, model: { ...draftModel, level } });
                }, onValueChange: handleModelChange, thoughtOption: face.thoughtOption, triggerLabel: face.triggerLabel, value: face.value, ...(draftModel.kind === "session"
                    ? { badge: { text: choices.sessionBadge, tone: "subtle" } }
                    : face.unavailable
                        ? {
                            badge: {
                                text: format("chat.toolCall.workflow.run.settings.model.unavailable"),
                                tone: "warning",
                            },
                        }
                        : {}) }), _jsx(WorkflowRunSettingsBoundField, { bound: draft.bound, defaultConcurrency: defaultConcurrency, disabled: pending, onChange: (bound) => updateDraft({ ...draft, bound }) }), _jsx("p", { className: "min-h-lh text-ui-sm text-foreground-subtle", "data-testid": "workflow-run-settings-consequence", children: consequenceId === undefined ? null : format(consequenceId) }), rejection === undefined ? null : (_jsxs("div", { className: "text-ui-xs text-warning", "data-testid": "workflow-run-settings-rejection", role: "status", children: [_jsx("span", { children: format(workflowRunSettingsRejectionMessageId(rejection), {
                            code: rejection.code,
                            message: rejection.message ?? rejection.code,
                        }) }), rejectionDetail === undefined ? null : (_jsx("pre", { className: "mt-1 max-h-24 overflow-auto whitespace-pre-wrap font-mono text-ui-xs text-foreground-subtle", children: rejectionDetail }))] })), _jsx("div", { className: "flex justify-end", children: _jsxs(Button, { "data-testid": "workflow-run-settings-apply", disabled: change === undefined || pending || face.unavailable, onClick: handleApply, size: "default", type: "button", variant: "default", children: [pending ? _jsx(Spinner, { className: "size-3.5" }) : null, format(pending
                            ? "chat.toolCall.workflow.run.settings.applying"
                            : "chat.toolCall.workflow.run.settings.apply")] }) })] }));
}
//# sourceMappingURL=WorkflowRunSettingsPopover.js.map