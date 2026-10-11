import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { memo } from "react";
import { TID_V4_GOAL_BANNER } from "@zcode/shared";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
/**
 * M4 goal 横幅：展示 sendGoalCommand/resumeGoal 的 goal 状态投影（objective/status/iteration）。
 * memo：goal 不变时不随 SessionPane 其他状态重渲染。
 */
function ConversationGoalBannerImpl({ goal }) {
    const { intl } = useZCodeIntl();
    return (_jsxs("div", { "data-testid": TID_V4_GOAL_BANNER, "data-goal-status": goal.status, "data-goal-objective": goal.objective, className: "flex items-center gap-2 border-b border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-ui-sm", children: [_jsx("span", { className: "text-[var(--color-foreground-subtle)]", children: intl.formatMessage({ id: "chat.goalBanner.label" }) }), _jsx("span", { className: "min-w-0 flex-1 truncate text-[var(--color-foreground)]", children: goal.objective }), _jsxs("span", { className: "shrink-0 rounded border border-[var(--color-border)] px-1.5 py-0.5 text-[var(--color-foreground-subtle)]", children: [goal.status, " \u00B7 #", goal.iteration] })] }));
}
export const ConversationGoalBanner = memo(ConversationGoalBannerImpl);
//# sourceMappingURL=ConversationGoalBanner.js.map