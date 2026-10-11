import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Ban, ChevronRight, CircleCheck, Loader2, TriangleAlert } from "lucide-react";
import { TID_WORKFLOW_RUN_ROW, testId } from "@zcode/shared";
import { Button } from "@/components/ui/button.js";
import { cn } from "@/components/lib/utils.js";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
import { formatDateTime } from "@/settings/automationFormat.js";
import { SavedWorkflowArtifactChips } from "@/settings/saved-workflows/SavedWorkflowArtifactChips.js";
import { formatSavedWorkflowRunArgs, formatSavedWorkflowTokens, savedWorkflowRunBadgeKind, savedWorkflowRunDurationMs, } from "@/settings/saved-workflows/savedWorkflowRunHistory.js";
/** 详情页「运行历史」：journal 行（状态 / 时间 / 花费 / 实参），有归属字段的行可「查看实例」。 */
export function SavedWorkflowRunHistory({ runs, now, canOpenRun, onOpenRun, onOpenArtifact, resolveRunProject, }) {
    const { intl } = useZCodeIntl();
    if (runs.length === 0) {
        return (_jsx("p", { className: "text-ui-base text-foreground-subtlest", children: intl.formatMessage({ id: "workflows.hub.history.empty" }) }));
    }
    return (_jsxs("div", { className: "flex flex-col gap-4", children: [_jsx("div", { className: "overflow-hidden rounded-lg border border-border", children: runs.map((run, index) => {
                    const kind = savedWorkflowRunBadgeKind(run.status);
                    const project = resolveRunProject ? resolveRunProject(run) : null;
                    const durationMs = savedWorkflowRunDurationMs(run, now);
                    const totalSeconds = Math.round(durationMs / 1000);
                    const minutes = Math.floor(totalSeconds / 60);
                    const seconds = totalSeconds % 60;
                    const duration = minutes > 0
                        ? intl.formatMessage({ id: "workflows.hub.time.duration.minutes" }, { minutes: String(minutes), seconds: String(seconds) })
                        : intl.formatMessage({ id: "workflows.hub.time.duration.seconds" }, { seconds: String(seconds) });
                    const openable = canOpenRun &&
                        Boolean(run.parentSessionId && run.toolCallId) &&
                        (resolveRunProject ? (project?.canOpen ?? false) : true);
                    // 产物 chip 的门：只要 `parentSessionId` 在场（老行可缺）+ 项目可打开。
                    // `toolCallId` 不是条件——产物 tab 不回那条 CreateWorkflow 工具行。
                    const artifactsOpenable = onOpenArtifact !== undefined &&
                        Boolean(run.parentSessionId) &&
                        (resolveRunProject ? (project?.canOpen ?? false) : true);
                    const statusLabel = intl.formatMessage({ id: `workflows.hub.lastRun.${kind}` });
                    let icon;
                    let statusClass;
                    switch (kind) {
                        case "completed":
                            icon = _jsx(CircleCheck, { className: "size-4", strokeWidth: 1.33, "aria-hidden": "true" });
                            statusClass = "text-success";
                            break;
                        case "errored":
                            icon = _jsx(TriangleAlert, { className: "size-4", strokeWidth: 1.33, "aria-hidden": "true" });
                            statusClass = "text-destructive";
                            break;
                        case "running":
                            icon = (_jsx(Loader2, { className: "size-4 animate-spin", strokeWidth: 1.33, "aria-hidden": "true" }));
                            statusClass = "text-warning";
                            break;
                        default:
                            icon = _jsx(Ban, { className: "size-4", strokeWidth: 1.33, "aria-hidden": "true" });
                            statusClass = "text-foreground-subtle";
                    }
                    return (_jsxs("div", { "data-testid": testId(TID_WORKFLOW_RUN_ROW, run.runId), className: cn("grid grid-cols-[112px_minmax(0,1fr)_auto] items-center gap-4 px-3 py-2.5", index > 0 && "border-t border-border"), children: [_jsxs("span", { className: cn("inline-flex items-center gap-1.5 text-ui-base", statusClass), children: [icon, statusLabel] }), _jsxs("div", { className: "flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 text-ui-base", children: [_jsx("span", { className: "text-foreground", children: formatDateTime(run.createdAt) }), resolveRunProject && project ? (_jsx("span", { "data-workflow-run-project": "true", className: "min-w-0 max-w-40 truncate text-foreground-subtle", title: project.title ?? project.label, children: project.label })) : null, _jsxs("span", { className: "text-foreground-subtle", children: [duration, " \u00B7", " ", intl.formatMessage({ id: "workflows.hub.history.tokens" }, { tokens: formatSavedWorkflowTokens(run.spentTokens) })] }), formatSavedWorkflowRunArgs(run.args).map((chip) => (_jsx("span", { className: "rounded-xs border border-border px-1.5 py-0.5 font-mono text-ui-xs leading-none text-foreground-subtlest", children: chip }, chip))), run.artifacts === undefined ? null : (_jsx(SavedWorkflowArtifactChips, { artifacts: run.artifacts, ...(artifactsOpenable
                                            ? {
                                                onOpenArtifact: (artifactId) => onOpenArtifact?.(run, artifactId),
                                            }
                                            : {}) }))] }), openable ? (_jsxs(Button, { type: "button", variant: "ghost", size: "sm", "data-icon": "inline-end", className: "text-foreground-subtle", onClick: () => onOpenRun(run), children: [intl.formatMessage({ id: "workflows.hub.history.open" }), _jsx(ChevronRight, { className: "size-3", "aria-hidden": "true" })] })) : (_jsx("span", { "aria-hidden": "true" }))] }, run.runId));
                }) }), _jsx("p", { className: "text-ui-sm text-foreground-subtle", children: intl.formatMessage({ id: "workflows.hub.history.note" }) })] }));
}
//# sourceMappingURL=SavedWorkflowRunHistoryPanel.js.map