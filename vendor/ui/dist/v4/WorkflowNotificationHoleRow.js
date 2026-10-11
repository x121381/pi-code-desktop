import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Pen } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ToolLayout } from "@/ToolCallBlocks/ToolLayout.js";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
import { workflowRunQuestionWaitedLabel } from "@/app-shell/workflowRunQuestions.js";
export function holeRowState(holes, siteId) {
    if (holes === undefined)
        return "left";
    const hole = holes.find((candidate) => candidate.siteId === siteId);
    if (hole === undefined)
        return "left";
    return hole.state === "waiting" ? "waiting" : "filled";
}
const KIND_LABEL_ID = {
    waiting: "chat.backgroundResult.workflow.hole.waiting",
    filled: "chat.backgroundResult.workflow.hole.filled",
    left: "chat.backgroundResult.workflow.hole.left",
};
const HOLE_ICON = _jsx(Pen, { className: "size-4 shrink-0 text-foreground-subtle" });
const PANEL_CLASS = "whitespace-pre-wrap break-words rounded-lg border border-border bg-panel px-4 py-3 text-ui-base leading-5 text-foreground";
export function WorkflowNotificationHoleRow({ forceOpen = false, holes, notification, onOpenRun, runName, toolId, }) {
    const { intl } = useZCodeIntl();
    const state = holeRowState(holes, notification.siteId);
    // 等待时长要在没有事件流时也照走（停驻的 run 恰恰不发事件），30 秒喂一次新的「现在」；只在等待时走。
    const [now, setNow] = useState(() => Date.now());
    useEffect(() => {
        if (state !== "waiting")
            return undefined;
        setNow(Date.now());
        const timer = setInterval(() => setNow(Date.now()), 30_000);
        return () => clearInterval(timer);
    }, [state]);
    const waited = state === "waiting"
        ? workflowRunQuestionWaitedLabel(notification.reachedAt, now, (descriptor, values) => intl.formatMessage(descriptor, values))
        : undefined;
    const primaryText = useMemo(() => (_jsxs("span", { className: "inline-flex min-w-0 items-center gap-2", children: [_jsx("span", { "aria-hidden": true, children: "\u00B7" }), _jsx("span", { className: "min-w-0 truncate", children: runName }), _jsx("span", { "aria-hidden": true, children: "\u00B7" }), _jsx("span", { className: "min-w-0 truncate", "data-testid": "workflow-hole-notification-name", children: notification.name })] })), [notification.name, runName]);
    const renderContent = useCallback(() => {
        const { after, before, draftPath, line, prompt } = notification;
        const standsId = before !== undefined && after !== undefined
            ? "chat.toolCall.workflow.hole.stands.between"
            : before !== undefined
                ? "chat.toolCall.workflow.hole.stands.after"
                : after !== undefined
                    ? "chat.toolCall.workflow.hole.stands.before"
                    : undefined;
        return (_jsxs("div", { className: "space-y-3", "data-testid": "workflow-hole-notification-body", children: [prompt === undefined || prompt.length === 0 ? null : (_jsx("p", { className: PANEL_CLASS, children: prompt })), _jsx("p", { className: "text-ui-sm text-foreground-subtle", children: standsId === undefined
                        ? null
                        : intl.formatMessage({ id: standsId }, { before: before ?? "", after: after ?? "" }) }), draftPath === undefined ? null : (_jsxs("p", { className: "text-ui-sm text-foreground-subtle", children: [_jsx("span", { className: "text-foreground-subtlest", children: intl.formatMessage({ id: "chat.toolCall.workflow.hole.draftPath" }) }), " ", _jsx("span", { className: "font-mono", "data-testid": "workflow-hole-notification-draft", children: line === undefined ? draftPath : `${draftPath}:L${line}` })] })), waited ? (_jsx("p", { className: "text-ui-sm text-foreground-subtle", "data-testid": "workflow-hole-notification-waited", children: intl.formatMessage({ id: "chat.toolCall.workflow.hole.waited" }, { time: waited }) })) : null, onOpenRun ? (_jsx("button", { type: "button", onClick: onOpenRun, className: "text-ui-sm text-foreground-subtle decoration-dotted underline-offset-2 hover:text-foreground hover:underline", children: intl.formatMessage({ id: "chat.toolCall.workflow.openRunDetails" }) })) : null] }));
    }, [intl, notification, onOpenRun, waited]);
    return (_jsx("div", { "data-testid": toolId, "data-hole-state": state, children: _jsx(ToolLayout, { toolId: toolId, persistOpenKey: toolId, icon: HOLE_ICON, canToggle: true, forceOpen: forceOpen, kindLabel: intl.formatMessage({ id: KIND_LABEL_ID[state] }), primaryText: primaryText, title: runName, renderContent: renderContent }) }));
}
//# sourceMappingURL=WorkflowNotificationHoleRow.js.map