import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// ============================================================
// WorkflowRunSidePane 的分区子组件（状态头 / 终态结果区）
// ============================================================
// 从 WorkflowRunSidePane.tsx 拆出（eslint max-lines 400 行门）：面板文件承载
// 数据装配与交互接线，本文件承载纯展示分区。props 全是烹熟的视图值——不接触
// 投影、lease 或命令通道。
import { workflowRunStopReasonMessageId } from "../components/workflow-graph/run-status-presentation.js";
import { memo } from "react";
import { ArrowUpRightIcon, ListIcon, RotateCcwIcon, SlidersHorizontalIcon, SquareIcon, } from "lucide-react";
import { Button } from "../components/ui/button.js";
import { ControlHintTooltip } from "../ControlHintTooltip.js";
import { useZCodeIntl } from "../i18n/IntlProvider.js";
import { workflowRunConcurrencyChip } from "../app-shell/workflowRunThrottle.js";
import { WorkflowRunStatus } from "../components/workflow-timeline/WorkflowCardChrome.js";
import { RunHolesWaitingChip } from "../components/workflow-timeline/WorkflowHoleParts.js";
import { WorkflowTruncatedNotice } from "../components/workflow-timeline/WorkflowTruncatedNotice.js";
import { useNowTicker } from "../components/workflow-graph/use-now-ticker.js";
const formatCount = (value) => value.toLocaleString();
/**
 * 摘要行的模型段：run 能配置时它也是一枚按钮（悬停下划线），打开同一个「配置」弹层、锚在它自己身上；
 * 否则就是一段带 tooltip 的字。
 */
function SubagentModelSegment({ children, className, configureOpen, onConfigureFrom, title, }) {
    if (onConfigureFrom === undefined) {
        return (_jsx("span", { className: className, "data-testid": "workflow-run-subagent-model", title: title, children: children }));
    }
    return (_jsx("button", { "aria-expanded": configureOpen, "aria-haspopup": "dialog", className: `${className ?? ""} cursor-pointer rounded-sm text-left underline-offset-2 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring/40`, "data-testid": "workflow-run-subagent-model", onClick: (event) => onConfigureFrom(event.currentTarget), title: title, type: "button", children: children }));
}
/**
 * 状态头：第一行是名字与控件（Configure、
 * Resume、Stop），第二行是灯与状态词 + 并发芯片——三枚按钮挤在状态旁边太满，状态因此单独成行。
 * 其下是 lineage 行与与聊天卡页脚**同文案**的摘要行——同一个 run 在两个面上必须说同一句话。
 * 摘要行素材缺席（图不可得，建不出时间线）时退回既有的用量行。
 */
export const WorkflowRunStatusHeader = memo(function WorkflowRunStatusHeader({ cancellable, configureOpen = false, onCancel, onConfigureFrom, onOpenSuccessor, onResume, rejection, resumable, run, saveSlots, subagentModel, summaryParts, title, usage, }) {
    const { intl } = useZCodeIntl();
    const saveChip = saveSlots?.leading ?? null;
    const saveVerb = saveSlots?.trailing ?? null;
    const cancelLabel = intl.formatMessage({ id: "chat.toolCall.workflow.run.cancel" });
    const resumeLabel = intl.formatMessage({ id: "chat.toolCall.workflow.run.resume" });
    // 并发芯片（docs/dynamic-workflow/concurrency.md「What the user sees」）：生效的界（共享 cap 与
    // 本 run 的界取小）被压在界之下、或 run 有自己的界，且 run 能配置时在场；冷却是一个 deadline，
    // 所以有冷却时走秒针，让它自己过期。
    const cooldownActive = run?.concurrency?.cooldownMs !== undefined;
    const now = useNowTicker(cooldownActive);
    const concurrency = workflowRunConcurrencyChip(run, now);
    // lineage 行（docs/dynamic-workflow/presentation.md「The run pane」状态头）：修订出来的 run 说它改自谁，
    // 被替代的 run 指向后继。两者互斥不成立（一个修订 run 也可能再被替代），所以各自一行。
    const resumedFrom = run?.resumedFrom;
    const supersededBy = run?.supersededBy;
    return (_jsxs("div", { className: "shrink-0 border-b border-border px-4 py-3", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "min-w-0 flex-1 truncate font-mono text-ui-base font-medium text-foreground", children: title }), onConfigureFrom === undefined ? null : (_jsxs(Button, { "aria-expanded": configureOpen, "aria-haspopup": "dialog", "data-testid": "workflow-run-configure", onClick: (event) => onConfigureFrom(event.currentTarget), size: "sm", type: "button", variant: "outline", children: [_jsx(SlidersHorizontalIcon, { className: "size-3.5" }), intl.formatMessage({ id: "chat.toolCall.workflow.run.configure" })] })), resumable ? (_jsx(ControlHintTooltip, { title: intl.formatMessage({ id: "chat.toolCall.workflow.run.resumeHint" }), side: "bottom", children: _jsxs(Button, { "aria-label": resumeLabel, "data-testid": "workflow-run-resume", onClick: onResume, size: "sm", type: "button", variant: "outline", children: [_jsx(RotateCcwIcon, { className: "size-3.5" }), resumeLabel] }) })) : null, saveVerb, _jsx(ControlHintTooltip, { title: cancellable
                            ? cancelLabel
                            : intl.formatMessage({ id: "chat.toolCall.workflow.run.cancelDisabled" }), side: "bottom", ...(cancellable
                            ? { description: intl.formatMessage({ id: "chat.toolCall.workflow.run.stopHint" }) }
                            : {}), children: _jsxs(Button, { "aria-label": cancelLabel, "data-testid": "workflow-run-cancel", disabled: !cancellable, onClick: onCancel, size: "sm", type: "button", variant: "outline", children: [_jsx(SquareIcon, { className: "size-3.5 fill-current" }), cancelLabel] }) })] }), run === undefined && concurrency === undefined && saveChip === null ? null : (_jsxs("div", { className: "mt-1.5 flex min-w-0 flex-wrap items-center gap-2", "data-testid": "workflow-run-status-row", children: [run ? _jsx(WorkflowRunStatus, { run: run, testId: "workflow-run-status" }) : null, _jsx(RunHolesWaitingChip, { run: run, testId: "workflow-run-holes" }), saveChip, concurrency === undefined ? null : (_jsxs("span", { className: "shrink-0 rounded-xs border border-warning/60 px-1.5 py-0.5 font-mono text-ui-xs leading-none text-warning", "data-testid": "workflow-run-concurrency", children: [intl.formatMessage({ id: "chat.toolCall.workflow.run.concurrency.label" }, { cap: String(concurrency.cap) }), concurrency.cooldownUntil === undefined
                                ? null
                                : ` · ${intl.formatMessage({ id: "chat.toolCall.workflow.run.concurrency.cooldown" }, { time: new Date(concurrency.cooldownUntil).toLocaleTimeString() })}`] }))] })), rejection === undefined ? null : (_jsxs("div", { className: "mt-1.5 text-ui-xs text-warning", "data-testid": "workflow-run-rejection", role: "status", children: [_jsx("span", { children: rejection.text }), rejection.detail === undefined ? null : (_jsx("pre", { className: "mt-1 max-h-24 overflow-auto whitespace-pre-wrap font-mono text-ui-xs text-foreground-subtle", children: rejection.detail }))] })), resumedFrom === undefined ? null : (_jsxs("div", { className: "mt-1.5 flex min-w-0 items-baseline gap-2 text-ui-xs text-foreground-subtlest", "data-testid": "workflow-run-amends", children: [_jsx("span", { className: "shrink-0", children: intl.formatMessage({ id: "chat.toolCall.workflow.run.amends" }) }), _jsx("span", { className: "min-w-0 truncate font-mono", title: resumedFrom, children: resumedFrom })] })), supersededBy === undefined ? null : onOpenSuccessor === undefined ? (_jsxs("div", { className: "mt-1.5 flex min-w-0 items-baseline gap-2 text-ui-xs text-foreground-subtlest", "data-testid": "workflow-run-superseded-by", children: [_jsx("span", { className: "shrink-0", children: intl.formatMessage({ id: "chat.toolCall.workflow.run.supersededBy" }) }), _jsx("span", { className: "min-w-0 truncate font-mono", title: supersededBy, children: supersededBy })] })) : (_jsxs("button", { className: "mt-1.5 flex min-w-0 cursor-pointer items-baseline gap-2 rounded-md text-left text-ui-xs text-foreground-subtle outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/40", "data-testid": "workflow-run-superseded-by", onClick: onOpenSuccessor, type: "button", children: [_jsx("span", { className: "shrink-0", children: intl.formatMessage({ id: "chat.toolCall.workflow.run.supersededBy" }) }), _jsx("span", { className: "min-w-0 truncate font-mono", title: supersededBy, children: supersededBy }), _jsx(ArrowUpRightIcon, { "aria-hidden": true, className: "size-3 shrink-0 self-center" })] })), summaryParts !== undefined ? (_jsxs("div", { className: "mt-2 flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-ui-sm text-foreground-subtle", "data-testid": "workflow-run-usage", children: [_jsx(ListIcon, { "aria-hidden": true, className: "size-3.5 shrink-0 text-foreground-subtlest" }), summaryParts.map((part, i) => (_jsxs("span", { className: "flex items-center gap-x-2 tabular-nums", children: [i > 0 ? (_jsx("span", { "aria-hidden": true, className: "text-foreground-subtlest", children: "\u00B7" })) : null, i === 0 && subagentModel !== undefined ? (_jsx(SubagentModelSegment, { configureOpen: configureOpen, title: subagentModel.title, ...(onConfigureFrom === undefined ? {} : { onConfigureFrom }), children: part })) : (_jsx("span", { children: part }))] }, i)))] })) : usage ? (_jsxs("div", { className: "mt-2 flex items-baseline justify-between gap-2", "data-testid": "workflow-run-usage", children: [_jsxs("span", { className: "flex min-w-0 items-baseline gap-2", children: [subagentModel === undefined ? null : (_jsx(SubagentModelSegment, { className: "min-w-0 truncate text-ui-xs text-foreground-subtle", configureOpen: configureOpen, title: subagentModel.title, ...(onConfigureFrom === undefined ? {} : { onConfigureFrom }), children: intl.formatMessage({ id: "chat.toolCall.workflow.run.subagentModel.label" }, { model: subagentModel.name }) })), _jsx("span", { className: "shrink-0 text-ui-xs text-foreground-subtle", children: intl.formatMessage({ id: "chat.toolCall.workflow.run.usage.label" }) })] }), _jsx("span", { className: "font-mono text-ui-xs tabular-nums text-foreground", children: intl.formatMessage({ id: "chat.toolCall.workflow.run.usage.value" }, { tokens: formatCount(usage.spentTokens), steps: usage.nodesUsed }) })] })) : null, _jsx(WorkflowTruncatedNotice, { className: "mt-1.5", run: run, testId: "workflow-run-truncated" })] }));
});
/** 终态区：不可追踪提示 / 完成产物预览 / 失败与取消的错误面板。非对应终态时各自缺席。 */
export const WorkflowRunResultSections = memo(function WorkflowRunResultSections({ result, }) {
    const { intl } = useZCodeIntl();
    return (_jsxs(_Fragment, { children: [result.kind === "absent" ? (_jsxs("div", { className: "shrink-0 border-b border-border px-4 py-3", "data-testid": "workflow-run-untracked", children: [_jsx("div", { className: "text-ui-base text-foreground", children: intl.formatMessage({ id: "chat.toolCall.workflow.run.untracked.title" }) }), _jsx("p", { className: "mt-1 text-ui-xs text-foreground-subtle", children: intl.formatMessage({ id: "chat.toolCall.workflow.run.untracked.body" }) })] })) : null, result.kind === "completed" ? (_jsxs("div", { className: "shrink-0 border-b border-border px-4 py-3", "data-testid": "workflow-run-result", children: [_jsx("div", { className: "text-ui-xs font-medium text-foreground-subtle", children: intl.formatMessage({ id: "chat.toolCall.workflow.run.result.title" }) }), result.preview === undefined ? (_jsx("p", { className: "mt-1 text-ui-base text-foreground-subtle", children: intl.formatMessage({ id: "chat.toolCall.workflow.run.result.completedHint" }) })) : (_jsx("pre", { className: "mt-1 max-h-40 overflow-auto whitespace-pre-wrap break-words font-mono text-ui-xs text-foreground", children: result.preview }))] })) : null, result.kind === "error" ? (_jsxs("div", { className: "shrink-0 border-b border-destructive/40 px-4 py-3", "data-testid": "workflow-run-error", children: [_jsxs("div", { className: "text-ui-xs font-medium text-destructive", children: [intl.formatMessage({
                                id: result.status === "stopped"
                                    ? "chat.toolCall.workflow.run.result.stoppedTitle"
                                    : "chat.toolCall.workflow.run.result.erroredTitle",
                            }), result.status === "stopped" && result.stopReason ? (_jsxs("span", { className: "font-normal text-foreground-subtle", "data-testid": "workflow-run-stop-reason", children: [" · ", intl.formatMessage({ id: workflowRunStopReasonMessageId(result.stopReason) })] })) : null] }), _jsx("p", { className: "mt-1 max-h-40 overflow-auto whitespace-pre-wrap break-words text-ui-base text-foreground", "data-testid": "workflow-run-error-message", children: result.message ??
                            intl.formatMessage({ id: "chat.toolCall.workflow.run.result.noError" }) })] })) : null] }));
});
//# sourceMappingURL=WorkflowRunSidePaneSections.js.map