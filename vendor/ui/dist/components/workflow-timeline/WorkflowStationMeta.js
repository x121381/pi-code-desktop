import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Repeat2Icon } from "lucide-react";
import { useZCodeIntl } from "../../i18n/IntlProvider.js";
/** 站头元数据（从 `WorkflowTimeline.tsx` 拆出以守 400 行）：`⟳ n` 轮次（只在循环上的站）与 `a/b` 步数分数（只在观察到节点后）。 */
export function StationMeta({ station }) {
    const { intl } = useZCodeIntl();
    const showRounds = station.onLoop && station.rounds > 0;
    if (!showRounds && station.fraction === undefined)
        return null;
    return (_jsxs("span", { className: "flex shrink-0 items-center gap-1.5 font-mono text-ui-xs tabular-nums text-foreground-subtlest", children: [showRounds ? (_jsxs("span", { className: "flex items-center gap-1", "data-testid": "workflow-timeline-rounds", title: intl.formatMessage({ id: "chat.toolCall.workflow.timeline.rounds" }, { count: station.rounds }), children: [_jsx(Repeat2Icon, { "aria-hidden": true, className: "size-2.5" }), station.rounds] })) : null, showRounds && station.fraction !== undefined ? _jsx("span", { "aria-hidden": true, children: "\u00B7" }) : null, station.fraction === undefined ? null : (_jsxs("span", { className: "text-ui-sm", "data-testid": "workflow-timeline-fraction", children: [station.fraction.settled, "/", station.fraction.observed] }))] }));
}
//# sourceMappingURL=WorkflowStationMeta.js.map