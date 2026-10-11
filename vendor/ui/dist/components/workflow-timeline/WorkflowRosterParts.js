import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CircleCheckIcon, CircleXIcon, LoaderCircleIcon } from "lucide-react";
import { cn } from "../../components/lib/utils.js";
import { useZCodeIntl } from "../../i18n/IntlProvider.js";
/**
 * 阶段名册的两件小零件：计数行与量条。
 */
const COUNT_ORDER = ["done", "running", "failed", "pending"];
function useCountLabels(counts) {
    const { intl } = useZCodeIntl();
    const label = (status) => intl.formatMessage({ id: `chat.toolCall.workflow.timeline.roster.${status}` }, { count: counts[status] });
    return {
        done: label("done"),
        failed: label("failed"),
        pending: label("pending"),
        running: label("running"),
    };
}
/** 计数行：`✓ n · ◌ n · ✕ n · ○ n`，为零的项缺席；每项的 title 是整句。 */
export function RosterTally({ className, counts }) {
    const labels = useCountLabels(counts);
    return (_jsx("div", { className: cn("flex h-3.5 items-center gap-2.5 font-mono text-ui-xs leading-none tabular-nums", className), "data-testid": "workflow-roster-tally", children: COUNT_ORDER.filter((status) => counts[status] > 0).map((status) => (_jsxs("span", { className: cn("flex items-center gap-[3px]", status === "done" && "text-success", status === "running" && "text-warning", status === "failed" && "text-destructive", status === "pending" && "text-foreground-subtlest"), "data-roster-count": status, title: labels[status], children: [status === "done" ? (_jsx(CircleCheckIcon, { "aria-hidden": true, className: "size-2.5" })) : status === "running" ? (_jsx(LoaderCircleIcon, { "aria-hidden": true, className: "size-2.5 animate-spin motion-reduce:animate-none" })) : status === "failed" ? (_jsx(CircleXIcon, { "aria-hidden": true, className: "size-2.5" })) : (_jsx("span", { "aria-hidden": true, className: "size-2 rounded-full border-[1.5px] border-current" })), _jsx("span", { className: "font-medium", children: counts[status] })] }, status))) }));
}
/**
 * 量条：段序 done · failed · running · pending，从左到右随阶段结算填满；pending 段用 `--color-border`
 * 作轨道。段宽随计数过渡（`.wf-meter-seg`）。`mini` 是折叠节头上的 44 px 版本。
 */
export function RosterMeter({ className, counts, mini = false, }) {
    const labels = useCountLabels(counts);
    const order = ["done", "failed", "running", "pending"];
    return (_jsx("div", { "aria-label": COUNT_ORDER.map((status) => labels[status]).join(", "), className: cn("flex h-[3px] gap-px overflow-hidden rounded-xs", mini && "w-11 shrink-0", className), "data-testid": mini ? "workflow-roster-meter-mini" : "workflow-roster-meter", role: "img", children: order
            .filter((status) => counts[status] > 0)
            .map((status) => (_jsx("span", { className: cn("wf-meter-seg min-w-0.5 basis-0", status === "done" && "bg-success", status === "failed" && "bg-destructive", status === "running" && "bg-warning", status === "pending" && "bg-border"), "data-meter-segment": status, style: { flexGrow: counts[status] }, title: labels[status] }, status))) }));
}
//# sourceMappingURL=WorkflowRosterParts.js.map