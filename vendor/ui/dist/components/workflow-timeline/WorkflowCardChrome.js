import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { ChevronRightIcon, ListIcon, Maximize2Icon, Workflow } from "lucide-react";
import { Button } from "../../components/ui/button.js";
import { cn } from "../../components/lib/utils.js";
import { ControlHintTooltip } from "../../ControlHintTooltip.js";
import { RUN_STATUS_DOT, RUN_STATUS_TEXT, STATUS_DOT, readWorkflowRunStopReason, workflowRunStopReasonMessageId, isWorkflowRunSuperseded, } from "../../components/workflow-graph/run-status-presentation.js";
import { useZCodeIntl } from "../../i18n/IntlProvider.js";
/**
 * 工作流卡的表头与页脚。
 *
 * 不走 `ToolLayout`：它的摘要行是 `inline-flex self-start`，右对齐的状态簇放不进去。表头一行：
 * 图标 + 种类词 + 名字，右侧灯 + 状态词 + 等宽细节 + [⤢] + chevron。站数超过一列时不再有秩带：
 * 看不见的站在时间线自己的边檐上。
 */
export const WORKFLOW_CARD_ICON = _jsx(Workflow, { className: "size-4 shrink-0 text-foreground-subtle" });
/** 联接到 run 之后的种类词：同一个 run 在卡上、轮尾摘要里、通知里、详情页里必须叫同一个名字。 */
export const WORKFLOW_RUN_KIND_ID = {
    pending: "chat.toolCall.workflow.card.started",
    running: "chat.toolCall.workflow.card.running",
    completed: "chat.toolCall.workflow.card.completed",
    errored: "chat.toolCall.workflow.card.errored",
    stopped: "chat.toolCall.workflow.card.stopped",
};
/**
 * run 不在活投影里（八条上限淘汰 / 冷恢复无 journal 命中）时的中性种类词：卡只说「这里曾有一条 run」，
 * 不冒充某个终态。
 */
export const WORKFLOW_RUN_ENDED_KIND_ID = "chat.toolCall.workflow.card.ended";
/** 被修订替代的 run 的种类词。 */
export const WORKFLOW_RUN_SUPERSEDED_KIND_ID = "chat.toolCall.workflow.card.superseded";
/**
 * 种类词的唯一入口：stopped ∧ superseded 说「已被替代」，其余按状态查表。三处消费（卡、轮尾摘要、
 * 旧宿主运行卡）都走这里，否则同一个被替代的 run 会在一处叫「已停止」、另一处叫「已被替代」。
 */
export function workflowRunKindMessageId(run) {
    return isWorkflowRunSuperseded(run)
        ? WORKFLOW_RUN_SUPERSEDED_KIND_ID
        : WORKFLOW_RUN_KIND_ID[run.status];
}
/** run 级状态：灯 + 词，永远成对出现（不变式 3）。 */
export function WorkflowRunStatus({ className, status, run, testId, }) {
    const { intl } = useZCodeIntl();
    const effectiveStatus = status ?? run?.status ?? "pending";
    const reason = run === undefined ? undefined : readWorkflowRunStopReason({ ...run, status: effectiveStatus });
    return (_jsxs("span", { className: cn("flex shrink-0 items-center gap-1.5", className), children: [_jsx("span", { "aria-hidden": true, className: cn("wf-lamp size-2 shrink-0 rounded-full", RUN_STATUS_DOT[effectiveStatus]) }), _jsx("span", { className: cn("wf-swap text-ui-sm", RUN_STATUS_TEXT[effectiveStatus]), "data-testid": testId, children: intl.formatMessage({ id: `chat.toolCall.workflow.run.status.${effectiveStatus}` }) }, effectiveStatus), reason ? (_jsxs("span", { className: "text-ui-sm text-foreground-subtlest", "data-testid": testId ? `${testId}-reason` : undefined, children: ["\u00B7 ", intl.formatMessage({ id: workflowRunStopReasonMessageId(reason) })] })) : null, run?.resumable === true ? (_jsxs("span", { className: "text-ui-sm text-foreground-subtlest", "data-testid": testId ? `${testId}-resumable` : undefined, children: ["\u00B7 ", intl.formatMessage({ id: "chat.toolCall.workflow.run.resumable" })] })) : null] }));
}
/** 静态（尚未联接 run）的状态：空环灯 + 一个词（「compiled」）。 */
export function WorkflowStaticStatus({ word }) {
    return (_jsxs("span", { className: "flex shrink-0 items-center gap-1.5", children: [_jsx("span", { "aria-hidden": true, className: cn("size-2 shrink-0 rounded-full", STATUS_DOT.pending) }), _jsx("span", { className: "text-ui-sm text-foreground-subtle", "data-testid": "workflow-card-static-status", children: word })] }));
}
export function WorkflowCardHeader({ detail, detailTitle, expanded, kind, leading, live = false, name, onOpenDetails, onToggle, status, toggleLabel: toggleLabelOverride, trailing, }) {
    const { intl } = useZCodeIntl();
    const openLabel = intl.formatMessage({ id: "chat.toolCall.workflow.openRunDetails" });
    const toggleLabel = toggleLabelOverride ??
        intl.formatMessage({
            id: expanded ? "chat.toolCall.collapseDetails" : "chat.toolCall.expandDetails",
        });
    return (_jsxs("div", { className: "flex min-w-0 items-center gap-2 text-ui-base", "data-testid": "workflow-card-header", children: [WORKFLOW_CARD_ICON, _jsx("span", { className: "shrink-0 whitespace-nowrap font-medium", "data-testid": "workflow-card-kind", children: _jsx("span", { className: "wf-swap", children: _jsx("span", { className: live ? "animated-gradient-text" : "text-foreground", children: kind }) }, typeof kind === "string" ? kind : undefined) }), _jsx("span", { 
                // 名称是 UI 文本；工具摘要与取消等状态共用的卡片表头都要经过同一修正。
                className: "min-w-0 flex-1 truncate text-foreground-subtle", "data-testid": "workflow-card-name", title: name, children: name }), _jsxs("span", { className: "flex min-w-0 items-center gap-2", children: [leading, status, detail === undefined || detail.length === 0 ? null : (_jsx("span", { className: "min-w-0 truncate text-ui-base tabular-nums text-foreground-subtlest", "data-testid": "workflow-card-detail", ...(detailTitle === undefined ? {} : { title: detailTitle }), children: detail })), trailing, onOpenDetails === undefined ? null : (_jsx(ControlHintTooltip, { title: openLabel, side: "top", children: _jsx(Button, { "aria-label": openLabel, "data-testid": "workflow-card-open-details", onClick: onOpenDetails, size: "icon-md", type: "button", variant: "ghost", children: _jsx(Maximize2Icon, { className: "size-3.5" }) }) })), onToggle === undefined ? null : (_jsx(Button, { "aria-expanded": expanded, "aria-label": toggleLabel, "data-testid": "workflow-card-toggle", onClick: onToggle, size: "icon-md", type: "button", variant: "ghost", children: _jsx(ChevronRightIcon, { className: cn("size-4 transition-transform", expanded && "rotate-90") }) }))] })] }));
}
/** 页脚摘要行：灯 + 状态词 + 清单图标 + 各段用 `·` 隔开 + 末尾控件（失败态的 Resume）。 */
export function WorkflowCardFooter({ parts = [], status, trailing, }) {
    return (_jsxs("div", { className: "flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-ui-sm text-foreground-subtle", "data-testid": "workflow-card-footer", children: [_jsx(WorkflowRunStatus, { status: status }), parts.length > 0 ? (_jsxs(_Fragment, { children: [_jsx(ListIcon, { "aria-hidden": true, className: "size-3.5 shrink-0 text-foreground-subtlest" }), _jsx("span", { className: "flex min-w-0 flex-wrap items-center gap-x-2 tabular-nums", children: parts.map((part, i) => (_jsxs("span", { className: "flex items-center gap-x-2", children: [i > 0 ? (_jsx("span", { "aria-hidden": true, className: "text-foreground-subtlest", children: "\u00B7" })) : null, _jsx("span", { children: part })] }, i))) })] })) : null, trailing] }));
}
//# sourceMappingURL=WorkflowCardChrome.js.map