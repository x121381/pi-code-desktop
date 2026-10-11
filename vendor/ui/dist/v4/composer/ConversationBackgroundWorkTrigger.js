import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { memo, useMemo } from "react";
import { ActivityIcon, BotIcon, SquareTerminalIcon, Workflow } from "lucide-react";
import { TID_V4_COMPOSER_BACKGROUND_WORK_TRIGGER } from "@zcode/shared";
import { Button } from "@/components/ui/button.js";
import { ControlHintTooltip } from "@/ControlHintTooltip.js";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
export function getComposerBackgroundWorkCounts(backgroundWorks, runningSubagentCount = 0) {
    let bashCount = 0;
    let workflowCount = 0;
    for (const work of backgroundWorks) {
        if (work.status !== "running")
            continue;
        if (work.kind === "bash") {
            bashCount += 1;
        }
        else if (work.kind === "workflow") {
            // workflow run 单独计数，不并入 bashCount。totalCount 汇总三类后台工作，
            // 确保只有 workflow run 时也显示 badge，用户仍能打开面板使用停止按钮。
            workflowCount += 1;
        }
    }
    const subagentCount = Math.max(0, runningSubagentCount);
    return {
        bashCount,
        workflowCount,
        subagentCount,
        totalCount: bashCount + workflowCount + subagentCount,
    };
}
function ConversationBackgroundWorkTriggerImpl({ backgroundWorks, runningSubagentCount = 0, onOpen, openTarget = "panel", }) {
    const { intl } = useZCodeIntl();
    const counts = useMemo(() => getComposerBackgroundWorkCounts(backgroundWorks, runningSubagentCount), [backgroundWorks, runningSubagentCount]);
    if (!onOpen || counts.totalCount === 0)
        return null;
    // 恰好一类时用该类文案，否则混合：三类两两组合各写一句会堆出六条同义 tooltip，
    // 而 badge 的作用只是「有实时活动，点开看」，不承担精确枚举。
    const activeKindCount = [counts.bashCount, counts.workflowCount, counts.subagentCount].filter((count) => count > 0).length;
    const tooltip = intl.formatMessage({
        id: openTarget === "workflow-run"
            ? "chat.composer.backgroundWorks.tooltipWorkflowDetails"
            : activeKindCount > 1
                ? "chat.composer.backgroundWorks.tooltipMixed"
                : counts.bashCount > 0
                    ? "chat.composer.backgroundWorks.tooltipTerminal"
                    : counts.workflowCount > 0
                        ? "chat.composer.backgroundWorks.tooltipWorkflow"
                        : "chat.composer.backgroundWorks.tooltipAgent",
    });
    const ariaLabel = intl.formatMessage({ id: "chat.composer.backgroundWorks.ariaLabel" }, {
        bashCount: String(counts.bashCount),
        workflowCount: String(counts.workflowCount),
        subagentCount: String(counts.subagentCount),
        count: String(counts.totalCount),
    });
    return (_jsx(ControlHintTooltip, { title: tooltip, children: _jsxs(Button, { type: "button", variant: "ghost", size: "default", "data-testid": TID_V4_COMPOSER_BACKGROUND_WORK_TRIGGER, "data-background-bash-count": counts.bashCount, "data-background-workflow-count": counts.workflowCount, "data-background-subagent-count": counts.subagentCount, "data-background-total-count": counts.totalCount, "data-background-open-target": openTarget, "aria-label": ariaLabel, onClick: onOpen, className: "rounded-lg px-1.5 text-ui-base text-[var(--color-foreground-subtle)] tabular-nums", children: [_jsxs("span", { "data-composer-background-layout": "typed", className: "inline-flex items-center gap-1 @max-[480px]/composer:hidden", "aria-hidden": true, children: [counts.bashCount > 0 ? (_jsxs("span", { className: "inline-flex items-center gap-0.5", children: [_jsx(SquareTerminalIcon, { className: "size-3.5" }), _jsx("span", { children: counts.bashCount })] })) : null, counts.workflowCount > 0 ? (_jsxs("span", { className: "inline-flex items-center gap-0.5", children: [_jsx(Workflow, { className: "size-3.5" }), _jsx("span", { children: counts.workflowCount })] })) : null, counts.subagentCount > 0 ? (_jsxs("span", { className: "inline-flex items-center gap-0.5", children: [_jsx(BotIcon, { className: "size-3.5" }), _jsx("span", { children: counts.subagentCount })] })) : null] }), _jsxs("span", { "data-composer-background-layout": "compact", className: "hidden items-center gap-0.5 @max-[480px]/composer:inline-flex", "aria-hidden": true, children: [_jsx(ActivityIcon, { className: "size-3.5" }), _jsx("span", { children: counts.totalCount })] })] }) }));
}
export const ConversationBackgroundWorkTrigger = memo(ConversationBackgroundWorkTriggerImpl);
//# sourceMappingURL=ConversationBackgroundWorkTrigger.js.map