import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// 工作流运行的迷你轨道（docs/dynamic-workflow/presentation.md「The sidebar run line」）：6px 灯按
// 声明序排开，之间是 6×1px 的轨段——控制流走过的段用强色，并行的两站之间画双线段；超过六站时折到
// 运行站 ±2 并带「+n」尾。侧栏运行行与任务岛的 run 行共用这一个组件：一条 run 在两处长得一样。
import { cn } from "@/components/lib/utils.js";
import { STATUS_DOT } from "@/components/workflow-graph/run-status-presentation.js";
const TRACE_FAINT = "var(--color-workflow-trace)";
const TRACE_STRONG = "var(--color-workflow-trace-strong)";
export function WorkflowRunRail({ rail, intl, }) {
    if (rail.implicit) {
        return (_jsx("span", { "data-workflow-run-rail": "true", "data-implicit": "true", className: "flex shrink-0 items-center", children: _jsx("span", { "aria-hidden": "true", className: cn("size-1.5 rounded-full", STATUS_DOT.running) }) }));
    }
    return (_jsxs("span", { "data-workflow-run-rail": "true", className: "flex shrink-0 items-center", children: [rail.stations.map((station, index) => (_jsxs("span", { className: "flex items-center", children: [index > 0 ? (station.twin === true ? (_jsxs("span", { "aria-hidden": "true", "data-rail-segment": station.reached ? "strong" : "faint", "data-rail-twin": "true", className: "flex h-1 w-1.5 flex-col justify-between", children: [_jsx("span", { className: "h-px w-full", style: { backgroundColor: station.reached ? TRACE_STRONG : TRACE_FAINT } }), _jsx("span", { className: "h-px w-full", style: { backgroundColor: station.reached ? TRACE_STRONG : TRACE_FAINT } })] })) : (_jsx("span", { "aria-hidden": "true", "data-rail-segment": station.reached ? "strong" : "faint", className: "h-px w-1.5", style: { backgroundColor: station.reached ? TRACE_STRONG : TRACE_FAINT } }))) : null, station.hole === undefined ? (_jsx("span", { "aria-hidden": "true", "data-rail-station": station.status, title: station.name, className: cn("size-1.5 rounded-full", STATUS_DOT[station.status]) })) : (_jsx("span", { "aria-hidden": "true", "data-rail-station": station.status, "data-rail-hole": station.hole, title: station.name, className: cn("size-1.5 rounded-full border border-dashed bg-transparent", station.hole === "waiting" ? "border-warning" : "border-foreground-subtlest") }))] }, `${station.name}:${index}`))), rail.hidden > 0 ? (_jsx("span", { className: "ml-1 text-ui-xs leading-none text-foreground-subtlest", children: intl.formatMessage({ id: "taskList.workflowRun.moreStations" }, { count: String(rail.hidden) }) })) : null] }));
}
//# sourceMappingURL=WorkflowRunRail.js.map