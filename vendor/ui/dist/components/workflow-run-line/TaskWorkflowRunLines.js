import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
// 侧栏任务行标题下的工作流运行行：
// Workflow 图标 + 迷你轨道灯 + 当前 phase 名。一眼看懂「这个会话在跑工作流、跑到哪一站」，
// 别的都不画：没有光晕、没有行进虚线、没有问题 chip（升级问答由主代理作答，不是用户）、
// 没有子代理数、没有箭头——那些进 hover tooltip。结束的 run 只剩一个中性词，颜色只留给灯。
import { useEffect, useMemo } from "react";
import { Workflow } from "lucide-react";
import { isSessionWorkflowRunLive } from "@zcode/shared/zcode-protocol-v4";
import { cn } from "@/components/lib/utils.js";
import { ControlHintTooltip } from "@/ControlHintTooltip.js";
import { readWorkflowRunStopReason, workflowRunStopReasonMessageId, } from "@/components/workflow-graph/run-status-presentation.js";
import { formatTaskRelativeTime } from "@/lib/taskListItemPresentation.js";
import { getWorkflowRunAckStore, useWorkflowRunAcknowledged } from "@/lib/workflowRunAckStore.js";
import { foldWorkflowRunRail, selectWorkflowRunLines, settledWorkflowRunIds, workflowRunParallelPhaseLabel, } from "@/lib/workflowRunLine.js";
import { WorkflowRunRail as RunRail } from "@/components/workflow-run-line/WorkflowRunRail.js";
import { useWorkflowRunOpen } from "@/v4/workflowRunOpenContext.js";
const SEPARATOR = " · ";
function runStatusWord(run, intl) {
    return intl.formatMessage({ id: `chat.toolCall.workflow.run.status.${run.status}` });
}
/** 行上的词：在跑 → 当前 phase 名（无阶段词汇表 → 「Workflow」）；结束 → 中性词（+ phase / 原因）。 */
function runLineText(run, rail, intl) {
    if (isSessionWorkflowRunLive(run.status)) {
        // 停在留白上：「决定分组 · 等待补全」（docs/dynamic-workflow/presentation.md「Holes on the timeline」）。
        if (run.waitingHole !== undefined) {
            return intl.formatMessage({ id: "taskList.workflowRun.holeWaiting" }, { name: run.waitingHole });
        }
        if (rail.implicit) {
            return intl.formatMessage({ id: "chat.toolCall.workflow.graph.phase.workflow" });
        }
        return run.currentPhase ?? runStatusWord(run, intl);
    }
    const word = runStatusWord(run, intl);
    if (run.status === "errored" && run.currentPhase !== undefined) {
        return `${word}${SEPARATOR}${run.currentPhase}`;
    }
    const reason = readWorkflowRunStopReason(run);
    if (reason !== undefined) {
        return `${word}${SEPARATOR}${intl.formatMessage({ id: workflowRunStopReasonMessageId(reason) })}`;
    }
    return word;
}
function runName(run, intl) {
    return run.name ?? intl.formatMessage({ id: "chat.toolCall.workflow.graph.phase.workflow" });
}
/** tooltip 第二行：`{phase} · {n agents working} · {elapsed}`，缺的段落省略。 */
function runTooltipDescription(run, intl) {
    const parts = [];
    // 并行时「当前阶段」不再是一个站：同时在跑的几站并排列出，谁都不比谁更当前。
    const parallel = workflowRunParallelPhaseLabel(run.phases);
    if (parallel !== undefined)
        parts.push(parallel);
    else if (run.currentPhase !== undefined)
        parts.push(run.currentPhase);
    if (isSessionWorkflowRunLive(run.status) && run.agentsWorking > 0) {
        parts.push(intl.formatMessage({ id: "chat.toolCall.workflow.card.agentsWorking" }, { count: String(run.agentsWorking) }));
    }
    if (run.startedAt !== undefined)
        parts.push(formatTaskRelativeTime(run.startedAt, intl));
    return parts.length === 0 ? undefined : parts.join(SEPARATOR);
}
export function TaskWorkflowRunLines({ activity, isActive, intl, session, density = "default", className, }) {
    const isAcknowledged = useWorkflowRunAcknowledged();
    const openRun = useWorkflowRunOpen();
    const settledKey = settledWorkflowRunIds(activity).join(" ");
    // 打开会话 = 确认它此刻所有已结束的 run；会话保持打开时 run 结束也立即确认（在读者眼前折叠）。
    useEffect(() => {
        if (!isActive || settledKey.length === 0)
            return;
        getWorkflowRunAckStore().acknowledge(settledKey.split(" "));
    }, [isActive, settledKey]);
    const selection = useMemo(() => selectWorkflowRunLines(activity, isAcknowledged), [activity, isAcknowledged]);
    if (selection.lines.length === 0)
        return null;
    const interactive = openRun !== null && session !== undefined;
    const compact = density === "compact";
    return (_jsxs("div", { "data-workflow-run-lines": "true", className: cn("flex min-w-0 max-w-full flex-col items-start", className), children: [selection.lines.map((run) => {
                const rail = foldWorkflowRunRail(run.phases);
                const text = runLineText(run, rail, intl);
                const name = runName(run, intl);
                const statusWord = runStatusWord(run, intl);
                const ariaLabel = intl.formatMessage({ id: "taskList.workflowRun.ariaLabel" }, { name, status: statusWord });
                const content = (_jsxs(_Fragment, { children: [_jsx(Workflow, { "aria-hidden": "true", className: "size-3 shrink-0 text-foreground-subtle" }), _jsx(RunRail, { rail: rail, intl: intl }), _jsx("span", { className: "min-w-0 truncate", children: text })] }));
                const lineClassName = cn("flex min-w-0 max-w-full items-center gap-1.5 rounded-md text-foreground-subtle", compact ? "h-6 text-ui-sm" : "h-5 text-ui-sm", interactive && "-ml-1 px-1 hover:bg-surface-hover hover:text-foreground");
                const lineProps = {
                    "data-workflow-run-line": "true",
                    "data-run-id": run.runId,
                    "data-run-status": run.status,
                    className: lineClassName,
                };
                const line = interactive && session !== undefined && openRun !== null ? (_jsx("button", { type: "button", ...lineProps, "aria-label": ariaLabel, onClick: (event) => {
                        // 行本身也可点（选中会话）；运行行是更具体的落点，不让点击再冒泡成一次普通选中。
                        event.preventDefault();
                        event.stopPropagation();
                        openRun({
                            workspacePath: session.workspacePath,
                            ...(session.workspaceIdentity
                                ? { workspaceIdentity: session.workspaceIdentity }
                                : {}),
                            sessionId: session.sessionId,
                            run,
                        });
                    }, children: content })) : (_jsx("span", { ...lineProps, "aria-label": ariaLabel, children: content }));
                const description = runTooltipDescription(run, intl);
                return (_jsx(ControlHintTooltip, { title: `${name}${SEPARATOR}${statusWord}`, ...(description === undefined ? {} : { description }), side: "right", align: "center", children: line }, run.runId));
            }), selection.overflow > 0 ? (_jsx("span", { "data-workflow-run-overflow": String(selection.overflow), className: cn("text-foreground-subtlest", compact ? "h-6 text-ui-sm" : "h-5 text-ui-xs"), children: intl.formatMessage({ id: "taskList.workflowRun.moreRuns" }, { count: String(selection.overflow) }) })) : null] }));
}
//# sourceMappingURL=TaskWorkflowRunLines.js.map