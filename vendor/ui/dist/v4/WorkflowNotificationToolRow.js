import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Hourglass, MessageCircleQuestion, Workflow } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CodeBlock, CodeBlockHeader } from "../components/ai-elements/code-block.js";
import { WorkflowNotificationHoleRow } from "../v4/WorkflowNotificationHoleRow.js";
import { ToolLayout } from "../ToolCallBlocks/ToolLayout.js";
import { useZCodeIntl } from "../i18n/IntlProvider.js";
import { workflowRunQuestionWaitedLabel } from "../app-shell/workflowRunQuestions.js";
import { WorkflowNotificationArtifactChips } from "../v4/WorkflowNotificationArtifactChips.js";
/**
 * 后台 workflow 通知行。
 *
 * manifest 台账形态已否决（判为「too flowery」），改走既有工具卡语法：
 * 通知行与普通工具调用行视觉完全同族（ToolLayout：图标 + kindLabel + primaryText + 展开体）。
 * 数据契约 / 发射侧 / hydration / pendingQuestions 联查全部不动——这里只是表现层。
 *
 * 纯展示：join 结果（onOpenRun / pendingQids）由宿主从投影解析后注入，组件不自取 store，
 * 好让它在 renderToStaticMarkup 下可测（展开态经 forceOpen 透传给 ToolLayout）。
 */
/** 通知行根节点的 testid 基名。 */
const TID_CHAT_WORKFLOW_NOTIFICATION_ROW = "chat-workflow-notification-row";
/** 折叠头部单行概要上限，照 escalate 卡：概要只是「大概问了什么」，全文在展开体里。 */
const INLINE_PREVIEW_MAX_LENGTH = 160;
const TERMINAL_ICON = _jsx(Workflow, { className: "size-4 shrink-0 text-foreground-subtle" });
const ESCALATION_ICON = (_jsx(MessageCircleQuestion, { className: "size-4 shrink-0 text-foreground-subtle" }));
/** 面板正文（问题 / 结果 prose）：照 escalate / submit-result 的 border-border bg-panel 惯例。 */
const PANEL_CLASS = "whitespace-pre-wrap break-words rounded-lg border border-border bg-panel px-4 py-3 text-ui-base leading-5";
/** 失败 error 面板：照 resolve-question outcome 的 border-destructive/40 惯例（不是行级失败装置）。 */
const ERROR_PANEL_CLASS = "whitespace-pre-wrap break-words rounded-lg border border-destructive/40 bg-panel px-4 py-3 text-ui-base leading-5 text-foreground";
/** 折叠成单行概要：换行折成空格，超长截断（照 escalate 卡 toInlinePreview）。 */
function toInlinePreview(value) {
    const collapsed = value.replace(/\s+/gu, " ").trim();
    if (collapsed.length === 0)
        return undefined;
    return collapsed.length > INLINE_PREVIEW_MAX_LENGTH
        ? `${collapsed.slice(0, INLINE_PREVIEW_MAX_LENGTH)}…`
        : collapsed;
}
const TERMINAL_KIND_LABEL_ID = {
    completed: "chat.backgroundResult.workflow.completed",
    errored: "chat.backgroundResult.workflow.errored",
    stopped: "chat.backgroundResult.workflow.stopped",
};
/** stall 行的 kindLabel：run 还在跑，只是 20 分钟没有一次成功的模型请求。 */
const STALL_KIND_LABEL_ID = "chat.backgroundResult.workflow.stall";
const STALL_ICON = _jsx(Hourglass, { className: "size-4 shrink-0 text-foreground-subtle" });
/** 展开体里的一个 `label: value` 事实行（stall 的等待时长 / 原因 / 并发数）。 */
function factLine(label, value, key) {
    return (_jsxs("p", { className: "text-ui-sm text-foreground-subtle", children: [_jsx("span", { className: "text-foreground-subtlest", children: label }), " ", value] }, key));
}
/**
 * 升级行 kindLabel 三态（按 pendingQuestions 在场性联查活翻转，与 manifest 同一逻辑）：
 *   pendingQids 含 qid → waiting（正在等待回答）；
 *   run 在场且 qid 缺席 → answered（问题已回答）；
 *   run 不在场（pendingQids === undefined）→ asked（中性：提出了问题）。
 * 不闪不 shimmer——shimmer 语义是「正在干活」，停驻问题等的是主代理。
 */
function escalationState(pendingQids, qid) {
    if (pendingQids === undefined)
        return "asked";
    return pendingQids.has(qid) ? "waiting" : "answered";
}
export function WorkflowNotificationToolRow(props) {
    // 留白行整个另起一件（WorkflowNotificationHoleRow.tsx）：它有自己的三态与展开体，塞进下面的
    // 三分支只会让每个分支都多一句「不是 hole」。
    if (props.notification.kind === "hole") {
        return (_jsx(WorkflowNotificationHoleRow, { forceOpen: props.forceOpen ?? false, holes: props.holes, notification: props.notification, runName: props.runName, toolId: `${TID_CHAT_WORKFLOW_NOTIFICATION_ROW}-${props.testIdKey}`, ...(props.onOpenRun === undefined ? {} : { onOpenRun: props.onOpenRun }) }));
    }
    return _jsx(WorkflowNotificationBaseRow, { ...props, notification: props.notification });
}
function WorkflowNotificationBaseRow({ notification, runName, testIdKey, theme, onOpenRun, onOpenArtifact, pendingQids, forceOpen = false, }) {
    const { intl } = useZCodeIntl();
    // 等待时长要在没有事件流时也照走（停驻的 run 恰恰不发事件），按固定间隔喂新的"现在"。
    const [now, setNow] = useState(() => Date.now());
    useEffect(() => {
        const timer = setInterval(() => setNow(Date.now()), 30_000);
        return () => clearInterval(timer);
    }, []);
    const openRunLink = onOpenRun ? (_jsx("button", { type: "button", onClick: onOpenRun, className: "text-ui-sm text-foreground-subtle decoration-dotted underline-offset-2 hover:text-foreground hover:underline", children: intl.formatMessage({ id: "chat.toolCall.workflow.openRunDetails" }) })) : null;
    const isEscalation = notification.kind === "escalation";
    const isStall = notification.kind === "stall";
    // kindLabel + primaryText + 展开体，按三类通知分别铸造。
    const escalationView = isEscalation ? escalationState(pendingQids, notification.qid) : undefined;
    // stopped 的原因词跟在 kindLabel 后。
    const stopReason = notification.kind === "terminal" && notification.status === "stopped"
        ? notification.stopReason
        : undefined;
    const kindLabel = isEscalation
        ? intl.formatMessage({ id: `chat.backgroundResult.workflow.${escalationView}` })
        : isStall
            ? intl.formatMessage({ id: STALL_KIND_LABEL_ID })
            : stopReason !== undefined
                ? `${intl.formatMessage({ id: TERMINAL_KIND_LABEL_ID[notification.status] })} · ${intl.formatMessage({ id: `chat.toolCall.workflow.run.stopReason.${stopReason}` })}`
                : intl.formatMessage({ id: TERMINAL_KIND_LABEL_ID[notification.status] });
    const primaryText = useMemo(() => {
        if (notification.kind === "terminal" || notification.kind === "stall") {
            return (_jsxs("span", { className: "inline-flex min-w-0 items-center gap-2", children: [_jsx("span", { "aria-hidden": true, children: "\u00B7" }), _jsx("span", { className: "min-w-0 truncate", children: runName })] }));
        }
        const preview = toInlinePreview(notification.question);
        return _jsx("span", { className: "min-w-0 truncate", children: preview ?? runName });
    }, [notification, runName]);
    // 折叠头部尾部的产物 chips。
    // 走 ToolLayout 的 `secondaryText` 槽，配合已有的 `hideSecondaryTextWhenOpen`——
    // 只在**折叠头部**展示：展开之后正文自己在说结果，chips 再挂着只是重复。
    const artifactChips = notification.kind === "terminal" &&
        notification.artifacts !== undefined &&
        notification.artifacts.length > 0 ? (_jsxs("span", { className: "inline-flex min-w-0 items-center gap-2", children: [_jsx("span", { "aria-hidden": true, children: "\u00B7" }), _jsx(WorkflowNotificationArtifactChips, { artifacts: notification.artifacts, ...(notification.artifactsTruncated === undefined
                    ? {}
                    : { truncated: notification.artifactsTruncated }), ...(onOpenArtifact === undefined ? {} : { onOpenArtifact }) })] })) : undefined;
    // 展开门：终态看 artifact（errored / provider 停下的 error，否则 result），升级恒有问题正文，
    // stall 恒有等待事实。
    const hasDetails = notification.kind === "escalation" || notification.kind === "stall"
        ? true
        : notification.error !== undefined
            ? true
            : Boolean(notification.result);
    const waited = escalationView === "waiting" && notification.kind === "escalation"
        ? workflowRunQuestionWaitedLabel(notification.askedAt, now, (descriptor, values) => intl.formatMessage(descriptor, values))
        : undefined;
    const renderContent = useCallback(() => {
        if (notification.kind === "escalation") {
            const contextHeading = intl.formatMessage({ id: "chat.toolCall.workflow.escalate.context" });
            return (_jsxs("div", { className: "space-y-3", children: [_jsx("p", { className: `${PANEL_CLASS} text-foreground`, children: notification.question }), notification.context !== undefined ? (_jsxs("section", { className: "space-y-1.5", children: [_jsx("h4", { className: "text-ui-sm font-medium text-foreground-subtlest", children: contextHeading }), _jsx("p", { className: `${PANEL_CLASS} text-foreground-subtle`, children: notification.context })] })) : null, waited ? _jsx("p", { className: "text-ui-sm text-foreground-subtle", children: waited }) : null, openRunLink] }));
        }
        if (notification.kind === "stall") {
            const minutes = Math.max(1, Math.round(notification.sinceMs / 60_000));
            return (_jsxs("div", { className: "space-y-1", "data-testid": "workflow-notification-stall", children: [_jsx("p", { className: `${PANEL_CLASS} text-foreground`, children: intl.formatMessage({ id: "chat.backgroundResult.workflow.stall.body" }, { minutes }) }), notification.reason !== undefined
                        ? factLine(intl.formatMessage({ id: "chat.backgroundResult.workflow.stall.reason" }), notification.reason, "reason")
                        : null, notification.cap !== undefined
                        ? factLine(intl.formatMessage({ id: "chat.backgroundResult.workflow.stall.cap" }), String(notification.cap), "cap")
                        : null, openRunLink] }));
        }
        // errored，或 stopped 而带错误明细（provider / interrupted）：错误面板。
        if (notification.error !== undefined) {
            return (_jsxs("div", { className: "space-y-3", children: [_jsx("p", { className: ERROR_PANEL_CLASS, children: notification.error }), openRunLink] }));
        }
        // completed / stopped：只显示 result（prose <p> / json CodeBlock，照 submit-result 惯例）。
        const { result, resultForm } = notification;
        let resultCode = result ?? "";
        if (resultForm === "json") {
            try {
                resultCode = JSON.stringify(JSON.parse(resultCode), null, 2);
            }
            catch {
                /* 历史截断的 JSON 保留原文，不丢弃结果。 */
            }
        }
        return (_jsxs("div", { className: "mb-2 min-w-0 space-y-2", "data-testid": "workflow-notification-result", children: [resultForm === "json" ? (_jsx(CodeBlock, { appTheme: theme, code: resultCode, language: "json", className: "border border-border bg-card", contentClassName: "max-h-80 overflow-auto", wrapLongLines: true, children: _jsx(CodeBlockHeader, { className: "pl-3 pr-2 pt-2", language: "json" }) })) : (_jsx("p", { className: "max-h-80 overflow-auto whitespace-pre-wrap break-words text-ui-base leading-relaxed text-foreground", children: result })), openRunLink] }));
    }, [notification, theme, waited, openRunLink, intl]);
    const toolId = `${TID_CHAT_WORKFLOW_NOTIFICATION_ROW}-${testIdKey}`;
    return (_jsx("div", { "data-testid": toolId, children: _jsx(ToolLayout, { toolId: toolId, persistOpenKey: toolId, icon: isEscalation ? ESCALATION_ICON : isStall ? STALL_ICON : TERMINAL_ICON, 
            // 图标已由 kind 区分；showIcon 缺省即显示。
            canToggle: hasDetails, forceOpen: forceOpen && hasDetails, hideSecondaryTextWhenOpen: true, kindLabel: kindLabel, primaryText: primaryText, secondaryText: artifactChips, 
            // 关键：**不**走 ToolLayout 的 failure status 装置（那是「这次调用坏了」的语义）；
            // 「工作流失败」由 kindLabel 说出，错误详情在展开体。也不设 isRunning（无 shimmer）。
            title: runName, renderContent: hasDetails ? renderContent : undefined }) }));
}
//# sourceMappingURL=WorkflowNotificationToolRow.js.map