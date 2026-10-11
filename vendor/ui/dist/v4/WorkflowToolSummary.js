import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { ArrowUpRightIcon } from "lucide-react";
import { useMemo } from "react";
import { WORKFLOW_CARD_ICON } from "@/components/workflow-timeline/WorkflowCardChrome.js";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
import { ToolLayout } from "@/ToolCallBlocks/ToolLayout.js";
export function WorkflowToolSummary({ toolCallId, summary, onOpen, amend = false, fill, }) {
    const { intl } = useZCodeIntl();
    // ToolLayout 是 memo 组件：primaryText 若是内联 JSX，每次渲染都会打破 memo（reactStableReferences 测试会拦下）。
    // 计数只说子代理；宿主没给子代理数时那一段留空，只剩 ↗。
    const agents = fill === undefined ? summary.agents : fill.agents;
    const primaryText = useMemo(() => (_jsxs("span", { className: "inline-flex min-w-0 items-center gap-2", children: [fill === undefined ? null : (_jsxs(_Fragment, { children: [_jsx("span", { "aria-hidden": true, children: "\u00B7" }), _jsx("span", { className: "min-w-0 truncate", "data-testid": "workflow-summary-hole-name", children: fill.name }), _jsx("span", { "aria-hidden": true, children: "\u00B7" }), _jsx("span", { "data-testid": "workflow-summary-hole-phases", children: intl.formatMessage({ id: "chat.toolCall.workflow.hole.phasesAdded" }, { count: fill.phases }) })] })), _jsx("span", { "aria-hidden": true, children: "\u00B7" }), _jsxs("span", { "data-testid": "workflow-summary-agents", className: onOpen
                    ? "inline-flex items-center gap-2 group-hover/tool-summary:text-foreground group-focus-visible/tool-summary:text-foreground"
                    : "inline-flex items-center gap-2", children: [agents === undefined
                        ? null
                        : intl.formatMessage({
                            id: agents === 1
                                ? "chat.toolCall.workflow.card.agent"
                                : "chat.toolCall.workflow.card.agents",
                        }, { count: agents }), onOpen ? _jsx(ArrowUpRightIcon, { "aria-hidden": true, className: "size-4 shrink-0" }) : null] })] })), [agents, fill, intl, onOpen]);
    const kindId = fill !== undefined
        ? "chat.toolCall.workflow.hole.filled"
        : amend
            ? "chat.toolCall.workflow.amend.amended"
            : "chat.toolCall.workflow.ran";
    return (_jsx("div", { "data-testid": "workflow-tool-summary", "data-tool-call-id": toolCallId, "data-workflow-run-id": summary.runId, children: _jsx(ToolLayout, { toolId: toolCallId, icon: WORKFLOW_CARD_ICON, kindLabel: intl.formatMessage({ id: kindId }), canToggle: false, primaryText: primaryText, summaryAction: onOpen
                ? {
                    ariaLabel: intl.formatMessage({ id: "chat.toolCall.workflow.openRunDetails" }),
                    onActivate: onOpen,
                }
                : undefined }) }));
}
//# sourceMappingURL=WorkflowToolSummary.js.map