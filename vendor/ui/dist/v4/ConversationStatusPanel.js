import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/* oxlint-disable eslint(max-lines) -- 状态面板同时维护收起态摘要、展开态分区、菜单策略和宽度自适应，同文件能保证两种形态共享同一内容优先级。 */
import { useIsOfficeMode } from "../hooks/useInterfaceMode.js";
import { forwardRef, memo, useCallback, useEffect, useMemo, useState, } from "react";
import { ActivityIcon, ArrowRightIcon, BotIcon, CheckCircle2Icon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, CircleCheckBigIcon, CircleIcon, EllipsisIcon, FileDiffIcon, GoalIcon, ListChecksIcon, Maximize2Icon, Minimize2Icon, PauseIcon, PlayIcon, SquareIcon, SquareTerminalIcon, Workflow, } from "lucide-react";
import { TID_CHAT_SUMMARY_PANEL, TID_V4_BACKGROUND_WORK_CANCEL, TID_V4_BACKGROUND_WORK_ITEM, testId, } from "@zcode/shared";
import { cn } from "../components/lib/utils.js";
import { Button } from "../components/ui/button.js";
import { RUN_STATUS_DOT } from "../components/workflow-graph/run-status-presentation.js";
import { WorkflowRunRail } from "../components/workflow-run-line/WorkflowRunRail.js";
import { foldWorkflowRunRail } from "../lib/workflowRunLine.js";
import { useNowTicker } from "../components/workflow-graph/use-now-ticker.js";
import { Collapsible, CollapsibleContent, CollapsibleTrigger, } from "../components/ui/collapsible.js";
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger, } from "../components/ui/dropdown-menu.js";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../components/ui/hover-card.js";
import { ControlHintTooltip } from "../ControlHintTooltip.js";
import { formatBackgroundTaskElapsedLabel } from "../BackgroundTaskElapsedLabel.js";
import { GitActionMenu } from "../GitActionMenu.js";
import { GitBranchSwitcher } from "../GitBranchSwitcher.js";
import { useZCodeIntl } from "../i18n/IntlProvider.js";
import { resolveConversationStatusPanelVariant } from "../v4/conversationLayout.js";
import { buildConversationStatusPanelModel, } from "../v4/conversationStatusPanelModel.js";
import { workflowRunOpenTarget, workflowRunWords, } from "../v4/conversationStatusPanelModel.js";
import { buildConversationGoalIterationSummaries, getConversationGoalElapsedSeconds, } from "../v4/conversationGoalSummaryModel.js";
// memo 组件默认 props 不内联创建数组，避免每次渲染生成新引用触发稳定引用边界测试。
const EMPTY_BACKGROUND_WORKS = [];
const EMPTY_RUNNING_SUBAGENTS = [];
const EMPTY_WORKFLOW_RUNS = [];
function formatDurationUnits(totalSeconds, formatMessage) {
    const seconds = Math.max(0, Math.floor(totalSeconds));
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const restSeconds = seconds % 60;
    const hourUnit = formatMessage({ id: "chat.summaryPanel.duration.hours" });
    const minuteUnit = formatMessage({ id: "chat.summaryPanel.duration.minutes" });
    const secondUnit = formatMessage({ id: "chat.summaryPanel.duration.seconds" });
    const parts = [];
    if (hours > 0) {
        parts.push(`${hours}${hourUnit}`);
    }
    if (minutes > 0) {
        parts.push(`${minutes}${minuteUnit}`);
    }
    if (restSeconds > 0 || parts.length === 0) {
        parts.push(`${restSeconds}${secondUnit}`);
    }
    return parts.join(" ");
}
function getBackgroundWorkElapsedMs(work, now) {
    return Math.max(0, now - work.startedAt);
}
function getLongestRunningWorkElapsedMs(works, now) {
    return works.reduce((longestElapsedMs, work) => Math.max(longestElapsedMs, getBackgroundWorkElapsedMs(work, now)), 0);
}
function formatRunningCount(formatMessage, count) {
    return formatMessage({
        id: count === 1
            ? "chat.summaryPanel.runningBackgroundTasksMiniValue"
            : "chat.summaryPanel.runningBackgroundTasksMiniValuePlural",
    }, { count: String(count) });
}
function formatRunningSubagentCount(formatMessage, count) {
    return formatMessage({
        // 这里的计数至少包含 running 投影中的 subagent（可能是 mixed 胶囊总数）；
        // subagent 又包含 foreground、background、blocked 和 waiting，复用后台任务文案
        // 会把计数语义错误地缩窄成“后台”。
        id: count === 1
            ? "chat.statusPanel.runningAgentsValue"
            : "chat.statusPanel.runningAgentsValuePlural",
    }, { count: String(count) });
}
const STATUS_SECTION_SCROLL_POLICY = {
    environment: null,
    goal: "max-h-48",
    sessionPlans: "max-h-48",
    // 六个双行 Todo（6 × 52px）需要约 20rem；超过后只滚动进程区块。
    plan: "max-h-80",
    terminal: "max-h-48",
    // workflow 行定高 56px，列表滚到三行半（196px）：露出的半行告诉人下面还有。
    workflow: "max-h-[12.25rem]",
    agent: "max-h-48",
};
function StatusSectionHeader({ children, isOpen, section, title, }) {
    return (_jsxs("div", { className: "mb-0.5 flex h-8 min-w-0 shrink-0 items-center gap-1.5 px-2 pr-8", children: [_jsx(CollapsibleTrigger, { asChild: true, children: _jsxs("button", { type: "button", "aria-expanded": isOpen, "data-status-section-trigger": section, className: "group flex min-w-0 shrink-0 items-center gap-1 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-input-border-focused)]", children: [_jsx("span", { className: "shrink-0 text-ui-base text-[var(--color-foreground-subtle)]", children: title }), isOpen ? (_jsx(ChevronDownIcon, { className: "size-3.5 shrink-0 text-[var(--color-foreground-subtle)] opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100" })) : (_jsx(ChevronRightIcon, { className: "size-3.5 shrink-0 text-[var(--color-foreground-subtle)] opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100" }))] }) }), children ? (_jsx("div", { className: "inline-flex min-w-0 max-w-full shrink items-center gap-1.5 text-ui-sm text-[var(--color-foreground-subtlest)]", children: children })) : null] }));
}
function StatusSection({ children, defaultOpen = true, footer, onOpenChange, open, separated = false, section, title, trailing, }) {
    const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
    const isControlled = open !== undefined;
    const isOpen = open ?? uncontrolledOpen;
    // 限高过去依赖每个调用方显式传 scrollable，组合区块或新增类型时容易
    // 旁路滚动视口。改为按完整区块类型表统一裁决，让计划等新类型漏配时直接触发类型检查。
    const scrollViewportMaxHeightClass = STATUS_SECTION_SCROLL_POLICY[section];
    const handleOpenChange = useCallback((nextOpen) => {
        if (!isControlled) {
            setUncontrolledOpen(nextOpen);
        }
        onOpenChange?.(nextOpen);
    }, [isControlled, onOpenChange]);
    return (_jsx(Collapsible, { open: isOpen, onOpenChange: handleOpenChange, "data-status-section": section, className: cn("min-w-0 flex-none", separated && "border-t border-[var(--color-border)] pt-2"), children: _jsxs("section", { className: "min-w-0 flex-none", children: [_jsx(StatusSectionHeader, { isOpen: isOpen, section: section, title: title, children: trailing?.(isOpen) }), _jsxs(CollapsibleContent, { children: [scrollViewportMaxHeightClass ? (_jsx("div", { "data-status-section-scroll": section, className: cn(scrollViewportMaxHeightClass, "min-h-0 overflow-x-hidden overflow-y-auto pr-1"), children: children })) : (children), footer] })] }) }));
}
function GitStatusSection({ activeTaskChangeSummary, gitSummary, gitWorktreeReviewSourceId, model, onOpenGitReview, onRefreshGit, separated, workspaceIdentity, workspacePath, useVerticalFloatingPanels, }) {
    const { intl } = useZCodeIntl();
    const git = model.git;
    if (!git || !gitSummary || !onRefreshGit) {
        return null;
    }
    const hasChanges = git.added + git.removed > 0;
    const canOpenReview = Boolean(onOpenGitReview && gitSummary.isRepository);
    return (_jsx(StatusSection, { section: "environment", separated: separated, title: intl.formatMessage({ id: "chat.statusPanel.environment" }), trailing: (isOpen) => isOpen ? null : (_jsxs("span", { className: "shrink-0 font-mono text-ui-sm tabular-nums", children: [_jsxs("span", { className: cn("text-[var(--color-diff-added)]", !hasChanges && "opacity-50"), children: ["+", git.added] }), " ", _jsxs("span", { className: cn("text-[var(--color-diff-removed)]", !hasChanges && "opacity-50"), children: ["-", git.removed] })] })), children: _jsxs("div", { className: "space-y-0", children: [_jsxs("button", { type: "button", disabled: !canOpenReview, className: cn("flex h-8 w-full min-w-0 items-center gap-2 rounded-lg px-2 text-left text-ui-base text-[var(--color-foreground)] transition-colors", canOpenReview
                        ? "hover:bg-[var(--color-hover)] hover:text-[var(--color-foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-input-border-focused)]"
                        : "cursor-default opacity-50"), onClick: () => {
                        onOpenGitReview?.(gitWorktreeReviewSourceId ?? undefined);
                    }, children: [_jsx(FileDiffIcon, { className: "size-4 shrink-0 text-[var(--color-foreground)]" }), _jsx("span", { className: "min-w-0 flex-1 truncate", children: intl.formatMessage({ id: "chat.statusPanel.changes" }) }), _jsxs("span", { className: "shrink-0 font-mono tabular-nums", children: [_jsxs("span", { className: "text-[var(--color-diff-added)]", children: ["+", git.added] }), " ", _jsxs("span", { className: "text-[var(--color-diff-removed)]", children: ["-", git.removed] })] })] }), _jsx(GitBranchSwitcher, { workspacePath: workspacePath, gitSummary: gitSummary, dirtyFileCount: git.dirtyFileCount, onRefreshGit: onRefreshGit, className: "w-full px-0 pt-0", triggerClassName: "flex h-8 w-full min-w-0 justify-start gap-2 rounded-lg px-2 text-left text-ui-base text-[var(--color-foreground)] hover:bg-[var(--color-hover)] hover:text-[var(--color-foreground)] [&>span]:max-w-[calc(100%-3.5rem)] [&_svg:first-child]:text-[var(--color-foreground)]", popoverClassName: "w-72 max-w-[calc(100vw-2rem)]", branchListClassName: "max-h-56", popoverSide: useVerticalFloatingPanels ? "bottom" : "left", showFooterActions: true }), _jsx(GitActionMenu, { workspacePath: workspacePath, workspaceIdentity: workspaceIdentity, gitSummary: gitSummary, activeTaskChangeSummary: activeTaskChangeSummary ?? null, onRefreshGit: onRefreshGit, triggerLayout: "status-row", className: "w-full" })] }) }));
}
function GoalStatusSection({ model, onPauseGoal, onResumeGoal, separated, }) {
    const { intl } = useZCodeIntl();
    const goal = model.goal;
    const isPausable = goal?.status === "active" || goal?.status === "verifying" || goal?.status === "notSatisfied";
    const isPaused = goal?.status === "paused";
    const isDone = goal?.status === "verified";
    const iterationRows = useMemo(() => (goal ? buildConversationGoalIterationSummaries(goal) : []), [goal]);
    // 用时秒针只看「有没有在跑」这一个布尔。effect 不能以整个 goal 对象为依赖：
    // 每个 goal 事件都同步 setNow 并重建 interval——落在投影帧的同步提交里，给 React 的嵌套更新计数
    // 记一笔（与工作流卡 React #185 崩溃同形）。
    const now = useNowTicker(isPausable && goal?.activeRunStartedAtMs != null);
    if (!goal)
        return null;
    const elapsed = formatDurationUnits(getConversationGoalElapsedSeconds(goal, now), intl.formatMessage);
    const control = isPausable ? (_jsx(ControlHintTooltip, { title: intl.formatMessage({ id: "chat.target.pause" }), children: _jsx(Button, { type: "button", variant: "ghost", size: "icon-sm", className: "size-6 shrink-0", "data-goal-action": "pause", disabled: !onPauseGoal, "aria-label": intl.formatMessage({ id: "chat.target.pause" }), onClick: onPauseGoal, children: _jsx(PauseIcon, { className: "size-3.5" }) }) })) : isPaused ? (_jsx(ControlHintTooltip, { title: intl.formatMessage({ id: "chat.target.resume" }), children: _jsx(Button, { type: "button", variant: "ghost", size: "icon-sm", className: "size-6 shrink-0", "data-goal-action": "resume", disabled: !onResumeGoal, "aria-label": intl.formatMessage({ id: "chat.target.resume" }), onClick: onResumeGoal, children: _jsx(PlayIcon, { className: "size-3.5" }) }) })) : isDone ? (_jsx(CircleCheckBigIcon, { "aria-label": intl.formatMessage({ id: "chat.goalVerification.complete" }), className: "size-4 shrink-0 text-[var(--color-success)]" })) : null;
    return (_jsx(StatusSection, { section: "goal", separated: separated, title: intl.formatMessage({ id: "chat.statusPanel.goal" }), trailing: () => (_jsxs(_Fragment, { children: [_jsx("span", { className: "shrink-0 tabular-nums", "data-goal-elapsed-seconds": getConversationGoalElapsedSeconds(goal, now), children: elapsed }), control ? _jsx("span", { className: "shrink-0", children: "\u00B7" }) : null, control] })), children: _jsx("div", { className: "space-y-0", children: iterationRows.map((row) => {
                const title = row.title ??
                    intl.formatMessage({ id: "chat.summaryPanel.goalIterationValue" }, { count: String(row.iteration) });
                return (_jsxs("div", { "data-goal-iteration": row.iteration, "data-goal-iteration-completed": row.completed, "data-goal-verification-outcome": row.verificationOutcome ?? undefined, className: "flex min-w-0 cursor-default items-start gap-2 rounded-lg px-2 py-2 hover:bg-[var(--color-hover)]", title: title, children: [row.completed ? (_jsx("span", { className: "flex size-4 shrink-0 items-center justify-center rounded-full border border-[var(--color-success)] text-ui-xs tabular-nums text-[var(--color-success)]", children: row.iteration })) : (_jsx(GoalIcon, { className: "size-4 shrink-0 text-[var(--color-foreground-subtle)]" })), _jsx("p", { className: "line-clamp-3 min-w-0 flex-1 text-ui-base leading-4 text-[var(--color-foreground)]", children: title }), row.totalCount > 0 ? (_jsxs("span", { className: "shrink-0 text-ui-sm tabular-nums text-[var(--color-foreground-subtle)]", children: [row.completedCount, "/", row.totalCount] })) : null] }, row.iteration));
            }) }) }));
}
function PlanStatusIcon({ status }) {
    if (status === "completed") {
        return (_jsx(CheckCircle2Icon, { "aria-hidden": true, className: "mt-0.5 size-3.5 shrink-0 text-[var(--color-success)]" }));
    }
    if (status === "inProgress") {
        return (_jsx(ArrowRightIcon, { "aria-hidden": true, className: "mt-0.5 size-3.5 shrink-0 text-[var(--color-foreground)]" }));
    }
    return (_jsx(CircleIcon, { "aria-hidden": true, className: "mt-0.5 size-3.5 shrink-0 text-[var(--color-foreground-subtlest)]" }));
}
const COMPACT_TODO_THRESHOLD = 6;
const TODO_FOCUS_WINDOW_SIZE = 3;
export function getStatusPanelTodoFocusWindow(items) {
    if (items.length <= COMPACT_TODO_THRESHOLD) {
        return {
            compact: false,
            precedingItems: [],
            focusItems: items,
            followingItems: [],
        };
    }
    const runningIndex = items.findIndex((item) => item.status === "inProgress");
    const firstUnfinishedIndex = items.findIndex((item) => item.status !== "completed");
    const focusIndex = runningIndex >= 0
        ? runningIndex
        : firstUnfinishedIndex >= 0
            ? firstUnfinishedIndex
            : Math.max(0, items.length - TODO_FOCUS_WINDOW_SIZE);
    // 只取“当前 + 后两条”会让靠近列表末尾的当前项只剩一两条上下文。
    // 从前面回补可以让精简窗口在项目数足够时始终保持三条，同时不改变 snapshot 原序。
    const focusStartIndex = Math.max(0, Math.min(focusIndex, items.length - TODO_FOCUS_WINDOW_SIZE));
    const focusEndIndex = Math.min(items.length, focusStartIndex + TODO_FOCUS_WINDOW_SIZE);
    return {
        compact: true,
        precedingItems: items.slice(0, focusStartIndex),
        focusItems: items.slice(focusStartIndex, focusEndIndex),
        followingItems: items.slice(focusEndIndex),
    };
}
function PlanStatusItemRows({ items }) {
    return items.map((item) => (_jsxs("li", { "data-plan-status": item.status, className: "flex min-h-8 items-start gap-2 rounded-lg px-2 py-1.5 text-ui-base hover:bg-[var(--color-hover)]", children: [_jsx(PlanStatusIcon, { status: item.status }), _jsx("span", { title: item.content, className: cn("line-clamp-2 min-w-0 flex-1 break-words leading-5", item.status === "completed"
                    ? "text-[var(--color-foreground-subtlest)] line-through"
                    : "text-[var(--color-foreground)]"), children: item.content })] }, item.id)));
}
const TodoPreviewTrigger = forwardRef(function TodoPreviewTrigger({ group, label, onClick, onTouchOpen, open, ...buttonProps }, ref) {
    return (_jsxs("button", { ...buttonProps, ref: ref, type: "button", "aria-expanded": open, "data-status-todo-preview-trigger": group, className: "flex h-8 w-full min-w-0 items-center gap-2 rounded-lg px-2 text-left text-ui-base text-[var(--color-foreground-subtle)] hover:bg-[var(--color-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-input-border-focused)]", onClick: (event) => {
            onClick?.(event);
            // HoverCard 在桌面由 hover/focus 驱动；仅无 hover 输入补充点击打开，
            // 避免桌面点击把已经由 hover 打开的预览反向关闭。
            if (!event.defaultPrevented &&
                typeof window !== "undefined" &&
                window.matchMedia?.("(hover: none)").matches) {
                onTouchOpen();
            }
        }, children: [_jsx(ChevronLeftIcon, { className: "size-3.5 shrink-0" }), _jsx("span", { className: "min-w-0 truncate", children: label })] }));
});
function TodoHiddenGroupPreview({ group, items, onOpenChange, open, popoverSide, }) {
    const { intl } = useZCodeIntl();
    const messageId = group === "preceding"
        ? items.every((item) => item.status === "completed")
            ? "chat.statusPanel.todoCompletedFold"
            : "chat.statusPanel.todoEarlierFold"
        : items.every((item) => item.status === "pending")
            ? "chat.statusPanel.todoWaitingFold"
            : "chat.statusPanel.todoLaterFold";
    const label = intl.formatMessage({ id: messageId }, { count: String(items.length) });
    return (_jsxs(HoverCard, { closeDelay: 80, open: open, openDelay: 120, onOpenChange: onOpenChange, children: [_jsx(HoverCardTrigger, { asChild: true, children: _jsx(TodoPreviewTrigger, { group: group, label: label, open: open, onTouchOpen: () => onOpenChange(true) }) }), _jsx(HoverCardContent, { align: "start", side: popoverSide, sideOffset: 4, "data-status-todo-preview-content": group, className: "w-80 max-w-[min(20rem,calc(100vw-2rem))] rounded-xl border border-[var(--color-popover-border)] bg-[var(--color-menu)] p-3 shadow-md ring-0", children: _jsxs("div", { className: "flex max-h-[min(24rem,calc(100dvh-2rem))] min-w-0 flex-col", children: [_jsx("p", { className: "flex h-8 shrink-0 items-center px-2 text-ui-base text-[var(--color-foreground-subtle)]", children: label }), _jsx("ul", { className: "min-h-0 space-y-0 overflow-y-auto pr-1", children: _jsx(PlanStatusItemRows, { items: items }) })] }) })] }));
}
function PlanStatusItems({ plan, popoverSide, }) {
    const [openPreviewGroup, setOpenPreviewGroup] = useState(null);
    const window = getStatusPanelTodoFocusWindow(plan.displayItems);
    const handlePreviewOpenChange = (group, open) => {
        setOpenPreviewGroup((current) => (open ? group : current === group ? null : current));
    };
    return (_jsxs("ul", { className: "space-y-0 pb-1", children: [window.compact && window.precedingItems.length > 0 ? (_jsx("li", { children: _jsx(TodoHiddenGroupPreview, { group: "preceding", items: window.precedingItems, open: openPreviewGroup === "preceding", onOpenChange: (open) => handlePreviewOpenChange("preceding", open), popoverSide: popoverSide }) })) : null, _jsx(PlanStatusItemRows, { items: window.focusItems }), window.compact && window.followingItems.length > 0 ? (_jsx("li", { children: _jsx(TodoHiddenGroupPreview, { group: "following", items: window.followingItems, open: openPreviewGroup === "following", onOpenChange: (open) => handlePreviewOpenChange("following", open), popoverSide: popoverSide }) })) : null] }));
}
function SessionPlansStatusSection({ model, onOpenPlanDetail, parentSessionId, separated, }) {
    const { intl } = useZCodeIntl();
    const sessionPlans = model.sessionPlans;
    if (!sessionPlans)
        return null;
    return (_jsx(StatusSection, { section: "sessionPlans", separated: separated, title: intl.formatMessage({ id: "chat.statusPanel.sessionPlans" }), children: _jsx("ul", { className: "space-y-0", children: sessionPlans.items.map((item) => {
                const title = item.title ?? intl.formatMessage({ id: "chat.statusPanel.planFallback" });
                const canOpen = Boolean(parentSessionId && onOpenPlanDetail);
                return (_jsx("li", { children: _jsxs("button", { type: "button", "data-plan-directory-tool-call-id": item.toolCallId, disabled: !canOpen, "aria-label": intl.formatMessage({ id: "chat.statusPanel.openPlan" }, { title }), onClick: () => {
                            if (!parentSessionId)
                                return;
                            onOpenPlanDetail?.(buildSessionPlanOpenRequest(parentSessionId, item));
                        }, className: cn("flex min-h-8 w-full min-w-0 items-center gap-2 rounded-lg px-2 py-1.5 text-left text-ui-base text-[var(--color-foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-input-border-focused)]", canOpen && "hover:bg-[var(--color-hover)]"), children: [_jsx(ListChecksIcon, { className: "size-4 shrink-0 text-[var(--color-foreground-subtle)]" }), _jsx("span", { className: "min-w-0 flex-1 truncate", children: title })] }) }, item.toolCallId));
            }) }) }));
}
export function buildSessionPlanOpenRequest(parentSessionId, item) {
    return {
        parentSessionId,
        toolCallId: item.toolCallId,
        markdown: item.markdown,
        ...(item.planFilePath ? { planFilePath: item.planFilePath } : {}),
    };
}
function PlanStatusSection({ model, popoverSide, separated, }) {
    const { intl } = useZCodeIntl();
    const plan = model.plan;
    if (!plan)
        return null;
    const isCompleted = plan.totalCount > 0 && plan.completedCount >= plan.totalCount;
    return (_jsx(StatusSection, { section: "plan", separated: separated, title: intl.formatMessage({ id: "chat.statusPanel.todo" }), trailing: () => (_jsxs("span", { className: cn("tabular-nums", isCompleted ? "text-[var(--color-success)]" : "text-[var(--color-foreground-subtle)]"), children: [plan.completedCount, "/", plan.totalCount] })), children: _jsx(PlanStatusItems, { plan: plan, popoverSide: popoverSide }, plan.displayItems
            .map((item) => `${item.id}\u0000${item.content}\u0000${item.status}`)
            .join("\u0001")) }));
}
function RunningWorkCancelButton({ workId, onCancel, }) {
    const { intl } = useZCodeIntl();
    const handleClick = useCallback((event) => {
        event.stopPropagation();
        onCancel?.(workId);
    }, [onCancel, workId]);
    if (!onCancel)
        return null;
    return (_jsxs(Button, { type: "button", variant: "ghost", size: "sm", "data-testid": testId(TID_V4_BACKGROUND_WORK_CANCEL, workId), "aria-label": intl.formatMessage({
            id: "chat.summaryPanel.stopRunningBackgroundTask",
        }), onClick: handleClick, className: "pointer-events-auto relative z-[2] ml-auto h-6 shrink-0 px-1.5 text-ui-base text-[var(--color-foreground)]", children: [_jsx(SquareIcon, { "aria-hidden": true, className: "size-3 fill-current" }), intl.formatMessage({ id: "chat.statusPanel.runningStop" })] }));
}
export function buildRunningSubagentOpenRequest({ parentSessionId, rootSessionId, subagent, }) {
    if (!parentSessionId)
        return null;
    return {
        rootSessionId: rootSessionId ?? parentSessionId,
        parentSessionId,
        childSessionId: subagent.childSessionId,
        subagentType: subagent.subagentType,
        title: subagent.title,
    };
}
function RunningStatusItem({ now, onOpenBackgroundBash, onCancelBackgroundWork, work, }) {
    const { intl } = useZCodeIntl();
    return (_jsxs("li", { "data-testid": testId(TID_V4_BACKGROUND_WORK_ITEM, work.workId), "data-background-task-kind": work.kind, "data-work-id": work.workId, "data-work-status": work.status, className: "group relative flex min-w-0 items-start gap-2 rounded-lg px-2 py-2 hover:bg-[var(--color-hover)]", children: [onOpenBackgroundBash ? (_jsx("button", { type: "button", className: "absolute inset-0 rounded-lg focus-visible:outline-ring", "aria-label": intl.formatMessage({ id: "bashOutput.open" }, { title: work.title }), "data-testid": "background-bash-open", onClick: () => onOpenBackgroundBash(work) })) : null, _jsx(SquareTerminalIcon, { className: "pointer-events-none relative z-[1] mt-0.5 size-4 shrink-0 text-[var(--color-foreground-subtle)]" }), _jsxs("div", { className: "pointer-events-none relative z-[1] flex min-w-0 flex-1 flex-col gap-1.5", children: [_jsx("p", { className: "line-clamp-2 text-ui-base leading-5 text-[var(--color-foreground)]", children: work.title }), _jsxs("div", { className: "flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-ui-base", children: [_jsx("span", { className: "shrink-0 tabular-nums text-[var(--color-foreground-subtle)]", children: formatBackgroundTaskElapsedLabel(getBackgroundWorkElapsedMs(work, now), intl.formatMessage) }), work.cancellable !== false ? (_jsx(RunningWorkCancelButton, { workId: work.workId, onCancel: onCancelBackgroundWork })) : null] })] })] }));
}
function BackgroundWorkStatusSection({ onOpenBackgroundBash, onCancelBackgroundWork, onOpenChange, open, separated, section, title, works, }) {
    const { intl } = useZCodeIntl();
    const [now, setNow] = useState(() => Date.now());
    const orderedRunningWorks = useMemo(() => [...works].sort((left, right) => left.startedAt - right.startedAt), [works]);
    useEffect(() => {
        if (works.length === 0) {
            return;
        }
        const timer = setInterval(() => {
            setNow(Date.now());
        }, 1000);
        return () => clearInterval(timer);
    }, [works.length]);
    if (works.length === 0)
        return null;
    const collapsedElapsedLabel = formatDurationUnits(Math.max(1, Math.floor(getLongestRunningWorkElapsedMs(works, now) / 1000)), intl.formatMessage);
    return (_jsx(StatusSection, { section: section, defaultOpen: false, open: open, onOpenChange: onOpenChange, separated: separated, title: title, trailing: (isOpen) => isOpen ? (_jsx("span", { children: intl.formatMessage({
                id: works.length === 1
                    ? "chat.statusPanel.runningStatusValue"
                    : "chat.statusPanel.runningStatusValuePlural",
            }, { count: String(works.length) }) })) : (_jsxs(_Fragment, { children: [_jsx("span", { className: "min-w-0 truncate", children: collapsedElapsedLabel }), _jsx("span", { className: "shrink-0", children: "\u00B7" }), _jsx("span", { className: "shrink-0", children: formatRunningCount(intl.formatMessage, works.length) })] })), children: _jsx("ul", { className: "space-y-0", children: orderedRunningWorks.map((work) => (_jsx(RunningStatusItem, { work: work, now: now, onOpenBackgroundBash: onOpenBackgroundBash, onCancelBackgroundWork: onCancelBackgroundWork }, work.workId))) }) }));
}
/**
 * run 行的时长：沿用分区头部的时长单位（formatDurationUnits），但不带「已运行」前缀，且超过
 * 一小时去掉秒——一条跑了一小时的 run 上逐秒跳动的数字只是噪音（`1小时 2分` / `1h 2m`）。
 */
function formatWorkflowRunElapsed(elapsedMs, formatMessage) {
    const seconds = Math.max(0, Math.floor(elapsedMs / 1000));
    return formatDurationUnits(seconds >= 3600 ? seconds - (seconds % 60) : seconds, formatMessage);
}
/** run 「此刻在做什么」的词，按 i18n 拼成一句（规则在模型层的 `workflowRunWords`）。 */
function formatWorkflowRunWords(words, formatMessage) {
    switch (words.kind) {
        case "status":
            return formatMessage({ id: `chat.toolCall.workflow.run.status.${words.status}` });
        case "steps":
            return formatMessage({ id: "chat.toolCall.workflow.card.steps" }, { done: String(words.done), total: String(words.total) });
        case "phases":
            return words.text;
    }
}
/** 未命名的判定：`title ≡ runId`（见 `ConversationStatusPanelWorkflowRun.title`）。 */
function workflowRunDisplayName(run) {
    return run.title && run.title !== run.runId ? run.title : null;
}
/** 单盏状态灯（pending 空心、running 脉冲），与卡片、侧栏同一套 `STATUS_DOT`。 */
function WorkflowRunLamp({ status }) {
    return (_jsx("span", { "aria-hidden": "true", "data-workflow-run-lamp": status, className: cn("size-1.5 shrink-0 rounded-full", RUN_STATUS_DOT[status]) }));
}
/**
 * run 行的 Stop（docs/dynamic-workflow/presentation.md「Other places a run appears」）：沿用今天的
 * 幽灵按钮（方块 + 「停止」），但**叠在时长上**——悬停或键盘焦点落进这一行时出现、时长淡出；
 * 平时不占位，整列行因此只剩名字和时长。没有悬停的触屏（`hover: none`）上常驻，换成第三列的 32px
 * 图标按钮。隐藏时同时关掉指针事件：一个看不见却点得中的 Stop 会在用户点时长时停掉 run。
 * 背景用不透明的 menu-hover：它与悬停中的行同色，盖住时长下面可能被截断的名字尾巴。
 */
function WorkflowRunStopButton({ workId, onCancel, }) {
    const { intl } = useZCodeIntl();
    return (_jsxs(Button, { type: "button", variant: "ghost", size: "sm", "data-testid": testId(TID_V4_BACKGROUND_WORK_CANCEL, workId), "aria-label": intl.formatMessage({ id: "chat.toolCall.workflow.run.cancel" }), onClick: (event) => {
            event.stopPropagation();
            onCancel(workId);
        }, className: cn("pointer-events-none absolute right-1.5 top-1.5 z-[2] h-6 gap-1 bg-menu-hover px-1.5 text-ui-sm text-foreground opacity-0 transition-opacity", "hover:bg-[image:linear-gradient(var(--color-hover),var(--color-hover))]", "group-hover/wf-run:pointer-events-auto group-hover/wf-run:opacity-100 group-focus-within/wf-run:pointer-events-auto group-focus-within/wf-run:opacity-100", "[@media(hover:none)]:pointer-events-auto [@media(hover:none)]:static [@media(hover:none)]:size-8 [@media(hover:none)]:bg-transparent [@media(hover:none)]:p-0 [@media(hover:none)]:text-foreground-subtle [@media(hover:none)]:opacity-100"), children: [_jsx(SquareIcon, { "aria-hidden": true, className: "size-2.5 fill-current [@media(hover:none)]:size-3" }), _jsx("span", { className: "[@media(hover:none)]:sr-only", children: intl.formatMessage({ id: "chat.statusPanel.runningStop" }) })] }));
}
/**
 * 一条 run 两行定高（56px）：第一行 名字 + 时长，第二行 侧栏同款轨道 + 「在做什么」的词。
 * 字段三簇逐簇独立缺席（见 `ConversationStatusPanelWorkflowRun`）：
 * - 无 `status`：偏斜降级行（旧 CLI），只剩第一行——不知道状态就不画灯、不说词；
 * - 无 `startedAt`：没有配对的后台任务，没有时长；pending 也不报时长；
 * - 无 `workId` / 不可取消：没有 Stop，时长常驻。
 * 可见的状态词没了（灯和 phase 已经说了），所以它进打开按钮的无障碍名：名字 · 状态 · 词。
 */
function WorkflowRunRow({ now, onCancelBackgroundWork, onOpenWorkflowRun, run, }) {
    const { intl } = useZCodeIntl();
    // 行 → 打开意图的换算与 composer 徽标直达共用（模型层 workflowRunOpenTarget）。
    const openTarget = onOpenWorkflowRun ? workflowRunOpenTarget(run) : null;
    const name = workflowRunDisplayName(run);
    const displayName = name ?? intl.formatMessage({ id: "chat.toolCall.workflow.fallbackName" });
    const words = workflowRunWords(run);
    const wordsText = words ? formatWorkflowRunWords(words, intl.formatMessage) : null;
    const elapsed = run.startedAt === undefined || run.status === "pending"
        ? null
        : formatWorkflowRunElapsed(now - run.startedAt, intl.formatMessage);
    const canStop = Boolean(run.workId && run.cancellable !== false && onCancelBackgroundWork);
    const statusWord = run.status
        ? intl.formatMessage({ id: `chat.toolCall.workflow.run.status.${run.status}` })
        : null;
    const openLabel = [
        intl.formatMessage({ id: "chat.toolCall.workflow.openRunDetails" }),
        displayName,
        statusWord,
        wordsText === statusWord ? null : wordsText,
    ]
        .filter(Boolean)
        .join(" · ");
    const phases = run.phases ?? [];
    return (_jsxs("li", { "data-testid": run.workId ? testId(TID_V4_BACKGROUND_WORK_ITEM, run.workId) : undefined, "data-background-task-kind": "workflow", "data-workflow-run-id": run.runId, "data-work-id": run.workId, "data-work-status": run.status, className: cn("group/wf-run relative grid min-w-0 grid-cols-[1rem_minmax(0,1fr)] items-center gap-x-2 rounded-lg p-2 hover:bg-[var(--color-hover)]", canStop && "[@media(hover:none)]:grid-cols-[1rem_minmax(0,1fr)_2rem]", openTarget && "cursor-pointer"), children: [openTarget ? (_jsx("button", { type: "button", "data-workflow-run-details-trigger": "true", "data-workflow-run-id": run.runId, "aria-label": openLabel, title: displayName, onClick: () => onOpenWorkflowRun?.(openTarget), className: "absolute inset-0 z-0 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-input-border-focused)]" })) : null, _jsx(Workflow, { className: "pointer-events-none relative z-[1] mt-0.5 size-4 shrink-0 self-start text-[var(--color-foreground-subtle)]" }), _jsxs("div", { className: "pointer-events-none relative z-[1] flex min-w-0 flex-col gap-0.5", children: [_jsxs("div", { "data-workflow-island-line": "name", className: "flex h-5 min-w-0 items-baseline gap-2 leading-5", children: [_jsx("span", { className: cn("min-w-0 flex-1 truncate text-ui-base", name ? "text-[var(--color-foreground)]" : "text-[var(--color-foreground-subtle)]"), children: displayName }), elapsed ? (_jsx("span", { "data-workflow-run-elapsed": "true", className: cn("shrink-0 text-ui-sm tabular-nums text-[var(--color-foreground-subtle)] transition-opacity", canStop &&
                                    "group-hover/wf-run:opacity-0 [@media(hover:hover)]:group-focus-within/wf-run:opacity-0", 
                                // 触屏：Stop 占了第三列，时长挪到第二行末尾（没有第二行时留在这里）。
                                canStop && wordsText && "[@media(hover:none)]:hidden"), children: elapsed })) : null] }), words && wordsText ? (_jsxs("div", { "data-workflow-island-line": "phase", className: "flex h-4.5 min-w-0 items-center gap-1.5 text-ui-sm text-[var(--color-foreground-subtle)]", children: [words.kind === "phases" ? (_jsx(WorkflowRunRail, { rail: foldWorkflowRunRail(phases), intl: intl })) : (_jsx(WorkflowRunLamp, { status: run.status === "pending" ? "pending" : "running" })), _jsx("span", { className: "min-w-0 flex-1 truncate", children: wordsText }), elapsed && canStop ? (_jsx("span", { "aria-hidden": "true", className: "hidden shrink-0 tabular-nums [@media(hover:none)]:inline", children: elapsed })) : null] })) : null] }), canStop && run.workId && onCancelBackgroundWork ? (_jsx(WorkflowRunStopButton, { workId: run.workId, onCancel: onCancelBackgroundWork })) : null] }));
}
/**
 * Workflows 分区：与 Terminals / Agents 并列的第三类实时活动，**外加**一条通往 run 目录的
 * 页脚行——已结束的 run 折进这条页脚行，不占活动列表的位置。
 *
 * 头部右侧开合一个样：一盏运行灯 + 「{n} 个运行中」。折叠时不再换成「所有 run 里最长的时长」
 * ——那不是任何一条 run 的时间。只有 run 列表滚动（三行半，露出的半行告诉人下面还有）；
 * 已结束入口放在滚动区之外，run 再多也滚不走它。
 *
 * **不排序**：顺序 = 投影 runs 序 = 启动序（模型层已经保证）。Terminals / Agents 按
 * startedAt 排是因为它们的投影无序；这里重排反而会让行在每次投影更新时跳位。
 */
function WorkflowStatusSection({ endedRunCount, onCancelBackgroundWork, onOpenChange, onOpenDirectory, onOpenWorkflowRun, open, parentSessionId, runs, separated, title, }) {
    const { intl } = useZCodeIntl();
    const [now, setNow] = useState(() => Date.now());
    // 只有带 startedAt 的行需要秒级刷新；一行都没有时不必让面板每秒重渲染。
    const tickingRunCount = runs.filter((run) => run.startedAt !== undefined).length;
    useEffect(() => {
        if (tickingRunCount === 0)
            return;
        const timer = window.setInterval(() => setNow(Date.now()), 1000);
        return () => window.clearInterval(timer);
    }, [tickingRunCount]);
    // 活动行与已结束计数**都**为零才收起整个分区：只按活动数开门的那一版，重启后一个 run
    // 都不在跑，于是入口连带目录页一起消失——而重启后回看被打断的 run 正是它的主要用途。
    if (runs.length === 0 && endedRunCount <= 0)
        return null;
    return (_jsx(StatusSection, { section: "workflow", 
        // 宿主不接管开合时同一条规则：有活 run 就默认打开（受控时由宿主按同一规则驱动）。
        defaultOpen: runs.length > 0, open: open, onOpenChange: onOpenChange, separated: separated, title: title, trailing: () => runs.length > 0 ? (_jsxs(_Fragment, { children: [_jsx(WorkflowRunLamp, { status: "running" }), _jsx("span", { children: intl.formatMessage({ id: "chat.statusPanel.workflowsLive" }, { count: String(runs.length) }) })] })) : null, 
        // 已结束的 run 折进这条页脚行（与 Agents 分区共用同一个 affordance）：终态 run 不占
        // 活动列表的位置，但入口必须留着——被打断的那些正是最需要点进去的。
        footer: _jsx(EndedDirectoryRow, { count: endedRunCount, icon: _jsx(CheckCircle2Icon, { className: "size-4 shrink-0 text-[var(--color-foreground-subtle)]" }), label: intl.formatMessage({ id: "chat.statusPanel.endedWorkflows" }), separated: runs.length > 0, testId: "workflow-run-directory-trigger", onOpen: parentSessionId && onOpenDirectory
                ? () => onOpenDirectory({ parentSessionId })
                : undefined }), children: _jsx("ul", { className: "space-y-0", children: runs.map((run) => (_jsx(WorkflowRunRow, { run: run, now: now, onCancelBackgroundWork: onCancelBackgroundWork, onOpenWorkflowRun: onOpenWorkflowRun }, run.runId))) }) }));
}
function SubagentStatusSection({ endedSubagentCount, onCancelBackgroundWork, onOpenChange, onOpenSubagentDirectory, onOpenSubagentSession, open, parentSessionId, rootSessionId, separated, title, subagents, }) {
    const { intl } = useZCodeIntl();
    const [now, setNow] = useState(() => Date.now());
    const ordered = useMemo(() => [...subagents].sort((left, right) => (left.startedAt ?? 0) - (right.startedAt ?? 0)), [subagents]);
    useEffect(() => {
        if (subagents.length === 0)
            return;
        const timer = window.setInterval(() => setNow(Date.now()), 1000);
        return () => window.clearInterval(timer);
    }, [subagents.length]);
    if (subagents.length === 0 && endedSubagentCount <= 0)
        return null;
    const longestElapsedMs = subagents.reduce((longest, item) => Math.max(longest, Math.max(0, now - (item.startedAt ?? now))), 0);
    return (_jsxs(StatusSection, { section: "agent", defaultOpen: false, open: open, onOpenChange: onOpenChange, separated: separated, title: title, trailing: (isOpen) => subagents.length === 0 ? null : isOpen ? (_jsx("span", { children: formatRunningSubagentCount(intl.formatMessage, subagents.length) })) : (_jsxs(_Fragment, { children: [_jsx("span", { className: "min-w-0 truncate", children: formatDurationUnits(Math.max(1, Math.floor(longestElapsedMs / 1000)), intl.formatMessage) }), _jsx("span", { className: "shrink-0", children: "\u00B7" }), _jsx("span", { className: "shrink-0", children: formatRunningSubagentCount(intl.formatMessage, subagents.length) })] })), children: [_jsx("ul", { className: "space-y-0", children: ordered.map((subagent) => {
                    const request = buildRunningSubagentOpenRequest({
                        parentSessionId,
                        rootSessionId,
                        subagent,
                    });
                    const canOpenSubagentSession = Boolean(request && onOpenSubagentSession);
                    return (_jsxs("li", { "data-testid": subagent.controlWorkId
                            ? testId(TID_V4_BACKGROUND_WORK_ITEM, subagent.controlWorkId)
                            : undefined, "data-background-task-kind": "agent", "data-child-session-id": subagent.childSessionId, "data-work-id": subagent.controlWorkId, "data-work-status": "running", className: cn("group relative flex min-w-0 items-start gap-2 rounded-lg px-2 py-2 hover:bg-[var(--color-hover)]", canOpenSubagentSession && "cursor-pointer"), children: [canOpenSubagentSession ? (_jsx("button", { type: "button", "data-running-subagent-session-trigger": "true", "data-child-session-id": subagent.childSessionId, "aria-label": intl.formatMessage({
                                    id: "chat.summaryPanel.openRunningSubagentSession",
                                }), onClick: () => request && onOpenSubagentSession?.(request), className: "absolute inset-0 z-0 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-input-border-focused)]" })) : null, _jsx(BotIcon, { className: "pointer-events-none relative z-[1] mt-0.5 size-4 shrink-0 text-[var(--color-foreground-subtle)]" }), _jsxs("div", { className: "pointer-events-none relative z-[1] flex min-w-0 flex-1 flex-col gap-1.5", children: [_jsx("span", { className: "line-clamp-2 text-ui-base leading-5 text-[var(--color-foreground)]", children: subagent.title }), _jsxs("span", { className: "flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-ui-base", children: [_jsx("span", { className: "text-ui-base tabular-nums text-[var(--color-foreground-subtle)]", children: formatBackgroundTaskElapsedLabel(Math.max(0, now - (subagent.startedAt ?? now)), intl.formatMessage) }), subagent.controlWorkId && subagent.cancellable !== false ? (_jsx(RunningWorkCancelButton, { workId: subagent.controlWorkId, onCancel: onCancelBackgroundWork })) : null] })] })] }, subagent.childSessionId));
                }) }), _jsx(EndedSubagentDirectoryRow, { count: endedSubagentCount, parentSessionId: parentSessionId, rootSessionId: rootSessionId, onOpen: onOpenSubagentDirectory, separated: subagents.length > 0 })] }));
}
/**
 * 「已结束的 X · N ›」页脚行：分区里那条通往目录页的入口。
 *
 * Agents 与 Workflows **共用这一个** affordance（图标/文案/计数/回调由调用方给）。抽出来的
 * 理由不是省行数，而是不出现第二套画法：两个分区的页脚行若各写一遍，两者会随时间长出不同的
 * 间距、不同的 hover、不同的计数位置，而它们在读者眼里本来是同一个动作。
 *
 * `count <= 0` 或缺回调即整行缺席：一个点了没反应的入口比没有入口更糟。
 */
function EndedDirectoryRow({ count, icon, label, onOpen, separated, testId, }) {
    if (count <= 0 || !onOpen)
        return null;
    return (_jsx("div", { className: cn(separated && "border-t border-[var(--color-border)] pt-2"), children: _jsxs("button", { type: "button", "data-testid": testId, className: "flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-ui-base text-[var(--color-foreground)] hover:bg-[var(--color-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-input-border-focused)]", onClick: onOpen, children: [icon, _jsx("span", { children: label }), _jsx("span", { className: "ml-auto text-[var(--color-foreground-subtle)]", children: count }), _jsx(ChevronRightIcon, { className: "size-4 text-[var(--color-foreground-subtle)]" })] }) }));
}
function EndedSubagentDirectoryRow({ count, onOpen, parentSessionId, rootSessionId, separated, }) {
    const { intl } = useZCodeIntl();
    return (_jsx(EndedDirectoryRow, { count: count, icon: _jsx(CheckCircle2Icon, { className: "size-4 shrink-0 text-[var(--color-foreground-subtle)]" }), label: intl.formatMessage({ id: "chat.statusPanel.endedAgents" }), separated: separated, onOpen: parentSessionId && onOpen
            ? () => onOpen({
                rootSessionId: rootSessionId ?? parentSessionId,
                parentSessionId,
            })
            : undefined }));
}
function StatusSummaryMetric({ children, icon }) {
    return (_jsxs("div", { className: "flex h-8 w-max max-w-full min-w-0 items-center gap-1.5 pl-2 pr-3 text-ui-base text-[var(--color-foreground)]", children: [_jsxs("span", { className: "relative size-4 shrink-0", children: [_jsx("span", { className: "absolute inset-0 transition-opacity group-hover:opacity-0 group-focus-visible:opacity-0", children: icon }), _jsx(Maximize2Icon, { className: "absolute inset-0 size-4 text-[var(--color-foreground)] opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100" })] }), children] }));
}
/**
 * 胶囊里的工作流摘要：Workflow 图标 · 名字 · 灯 · phase 词 · `+n`（其余在跑的 run）。
 * phase 词整段保留（至多占 45%），先截的是名字：名字看开头就认得出，截断的 phase 什么也说不了。降级行（旧 CLI，无状态）只有名字，不画灯——不知道状态就不猜。
 */
function WorkflowSummaryMetric({ others, run, }) {
    const { intl } = useZCodeIntl();
    const name = workflowRunDisplayName(run);
    const words = workflowRunWords(run);
    const wordsText = words ? formatWorkflowRunWords(words, intl.formatMessage) : null;
    return (_jsxs(StatusSummaryMetric, { icon: _jsx(Workflow, { className: "size-4 text-[var(--color-foreground)]" }), children: [_jsx("span", { "data-workflow-pill": run.runId, className: cn(
                // 挤不下时只有名字让位：phase 不收缩，但封顶 45%，所以名字总还剩一半多。不给名字设
                // 最小宽度——定宽下限会把短名字撑出一段空白，还会和 phase 一起把胶囊撑破。
                "min-w-0 truncate", !name && "text-[var(--color-foreground-subtle)]"), children: name ?? intl.formatMessage({ id: "chat.toolCall.workflow.fallbackName" }) }), run.status && wordsText ? (_jsxs(_Fragment, { children: [_jsx(WorkflowRunLamp, { status: run.status }), _jsx("span", { className: "max-w-[45%] shrink-0 truncate text-[var(--color-foreground-subtle)]", children: wordsText })] })) : null, others > 0 ? (_jsxs("span", { className: "shrink-0 tabular-nums text-[var(--color-foreground-subtlest)]", children: ["+", others] })) : null] }));
}
function getCurrentPlanItem(plan) {
    return (plan?.items.find((item) => item.status === "inProgress") ??
        plan?.items.find((item) => item.status === "pending") ??
        null);
}
function getCompletedPlanItem(plan) {
    return [...(plan?.items ?? [])].reverse().find((item) => item.status === "completed") ?? null;
}
function StatusSummaryRow({ endedWorkflowRunCount, gitWorktreeChangeSummary, model, onOpenWorkflowSection, onVariantChange, }) {
    const { intl } = useZCodeIntl();
    const expandLabel = intl.formatMessage({ id: "chat.summaryPanel.showPanel" });
    const currentPlanItem = getCurrentPlanItem(model.plan);
    const completedPlanItem = getCompletedPlanItem(model.plan);
    const latestSessionPlan = model.sessionPlans?.items[0] ?? null;
    const goal = model.goal;
    const goalTitle = goal ? goal.summaryTitle?.trim() || goal.objective.trim() || null : null;
    const goalStatus = goal?.status ?? null;
    // V4 goal 在 verifier 判定未完成后会进入 notSatisfied；mini 过去漏掉
    // 这个合法开放态并返回 null，导致只剩 2px 空 shell，也失去重新展开入口。
    const isActiveGoal = goalStatus === "active" ||
        goalStatus === "notSatisfied" ||
        goalStatus === "paused" ||
        goalStatus === "verifying";
    const isDoneGoal = goalStatus === "verified";
    const added = gitWorktreeChangeSummary?.added ?? 0;
    const removed = gitWorktreeChangeSummary?.removed ?? 0;
    const hasGitMiniSummary = Boolean(model.git && added + removed > 0);
    // 胶囊摘要过去把所有后台任务都写死成 Activity，纯 Subagent 因而没有复用
    // Running 明细的 Bot 语义。**恰好一类**沿用该类图标，混合才是 Activity。在跑的工作流不进这条
    // 兜底：它排在胶囊最前，自己一个分支（名字 · 灯 · phase），不再是一个计数。
    const hasRunningBash = model.runningBashWorks.length > 0;
    const hasRunningSubagent = model.runningSubagentWorks.length > 0;
    const runningCount = model.runningBashWorks.length + model.runningSubagentWorks.length;
    const RunningSummaryIcon = hasRunningBash && hasRunningSubagent
        ? ActivityIcon
        : hasRunningBash
            ? SquareTerminalIcon
            : BotIcon;
    const firstLiveRun = model.runningWorkflowRuns[0];
    // 在跑的工作流排在胶囊最前（docs/dynamic-workflow/presentation.md「Other places a run appears」）：
    // 它在跑时就是会话在做的事，而主代理那一轮多半早已结束、todo 只是上一轮的余迹。过去它排在
    // 最后，理由是「与输入框的后台计数重复」——名字加 phase 并不重复什么。
    const summaryMetric = firstLiveRun ? (_jsx(WorkflowSummaryMetric, { run: firstLiveRun, others: model.runningWorkflowRuns.length - 1 })) : currentPlanItem ? (_jsx(StatusSummaryMetric, { icon: _jsx(ArrowRightIcon, { className: "size-4 text-[var(--color-foreground)]" }), children: _jsx("span", { className: "min-w-0 truncate", children: currentPlanItem.content }) })) : goalTitle && isActiveGoal ? (_jsx(StatusSummaryMetric, { icon: _jsx(GoalIcon, { className: "size-4 text-[var(--color-foreground)]" }), children: _jsx("span", { className: "min-w-0 truncate", children: goalTitle }) })) : hasGitMiniSummary ? (_jsxs(StatusSummaryMetric, { icon: _jsx(FileDiffIcon, { className: "size-4 text-[var(--color-foreground)]" }), children: [_jsx("span", { className: "min-w-0 truncate", children: intl.formatMessage({ id: "chat.statusPanel.changes" }) }), _jsxs("span", { className: "shrink-0 text-[var(--color-diff-added)]", children: ["+", added] }), _jsxs("span", { className: "shrink-0 text-[var(--color-diff-removed)]", children: ["-", removed] })] })) : goalTitle && isDoneGoal ? (_jsx(StatusSummaryMetric, { icon: _jsx(GoalIcon, { className: "size-4 text-[var(--color-foreground)]" }), children: _jsx("span", { className: "min-w-0 truncate", children: goalTitle }) })) : completedPlanItem ? (_jsx(StatusSummaryMetric, { icon: _jsx(CheckCircle2Icon, { className: "size-4 text-[var(--color-success)]" }), children: _jsx("span", { className: "min-w-0 truncate", children: completedPlanItem.content }) })) : model.plan ? (_jsxs(StatusSummaryMetric, { icon: _jsx(ListChecksIcon, { className: "size-4 text-[var(--color-foreground-subtle)]" }), children: [_jsx("span", { className: "min-w-0 truncate", children: intl.formatMessage({ id: "chat.statusPanel.todo" }) }), _jsxs("span", { className: "shrink-0 text-[var(--color-foreground-subtle)]", children: [model.plan.completedCount, "/", model.plan.totalCount] })] })) : latestSessionPlan ? (_jsx(StatusSummaryMetric, { icon: _jsx(ListChecksIcon, { className: "size-4 text-[var(--color-foreground)]" }), children: _jsx("span", { className: "min-w-0 truncate", children: latestSessionPlan.title ?? intl.formatMessage({ id: "chat.statusPanel.planFallback" }) }) })) : runningCount > 0 ? (_jsx(StatusSummaryMetric, { icon: _jsx(RunningSummaryIcon, { className: "size-4 text-[var(--color-foreground)]" }), children: _jsx("span", { className: "shrink-0", children: hasRunningSubagent
                ? formatRunningSubagentCount(intl.formatMessage, runningCount)
                : formatRunningCount(intl.formatMessage, runningCount) }) })) : endedWorkflowRunCount > 0 ? (_jsxs(StatusSummaryMetric, { icon: _jsx(Workflow, { className: "size-4 text-[var(--color-foreground-subtle)]" }), children: [_jsx("span", { className: "min-w-0 truncate", children: intl.formatMessage({ id: "chat.statusPanel.endedWorkflows" }) }), _jsx("span", { className: "shrink-0 text-[var(--color-foreground-subtle)]", children: endedWorkflowRunCount })] })) : null;
    if (!summaryMetric) {
        return null;
    }
    return (_jsx(ControlHintTooltip, { title: expandLabel, sideOffset: 4, side: "left", children: _jsx("button", { type: "button", "aria-label": expandLabel, className: "group inline-flex w-max max-w-full cursor-pointer flex-col items-stretch text-left text-[var(--color-foreground)] transition-colors hover:bg-[var(--color-menu-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-input-border-focused)]", onClick: () => {
                // 展开后看到的不能比胶囊还少：胶囊显示着工作流，就连同「工作流」分区一起打开——
                // 哪怕读者先前手动折过它（点胶囊就是「给我看这个」）。
                if (firstLiveRun)
                    onOpenWorkflowSection?.();
                onVariantChange?.("panel");
            }, children: summaryMetric }) }));
}
function ConversationStatusPanelImpl({ workspacePath, workspaceIdentity, gitSummary, gitDirtyFileCount = 0, gitWorktreeReviewSourceId, gitWorktreeChangeSummary, activeTaskChangeSummary, goal, sessionPlans, plan, backgroundWorks = EMPTY_BACKGROUND_WORKS, runningSubagents = EMPTY_RUNNING_SUBAGENTS, workflowRuns = EMPTY_WORKFLOW_RUNS, endedWorkflowRunCount = 0, endedSubagentCount = 0, rootSessionId, parentSessionId, isWebRemoteControl = false, isMobileViewport = false, layoutMode = "none", summaryPanelVariantOverride, onVariantChange, terminalSectionOpen, onTerminalSectionOpenChange, agentSectionOpen, onAgentSectionOpenChange, workflowSectionOpen, onWorkflowSectionOpenChange, onRefreshGit, onOpenGitReview, onPauseGoal, onResumeGoal, onOpenPlanDetail, onOpenBackgroundBash, onCancelBackgroundWork, onOpenSubagentSession, onOpenSubagentDirectory, onOpenWorkflowRun, onOpenWorkflowRunDirectory, className, }) {
    const isOfficeMode = useIsOfficeMode();
    const model = useMemo(() => buildConversationStatusPanelModel({
        isOfficeMode,
        gitSummary,
        gitDirtyFileCount,
        gitWorktreeChangeSummary,
        goal,
        sessionPlans,
        workspacePath,
        plan,
        backgroundWorks,
        runningSubagents,
        workflowRuns,
    }), [
        isOfficeMode,
        backgroundWorks,
        gitDirtyFileCount,
        gitSummary,
        gitWorktreeChangeSummary,
        goal,
        sessionPlans,
        plan,
        runningSubagents,
        workflowRuns,
        workspacePath,
    ]);
    const variant = resolveConversationStatusPanelVariant({
        variantOverride: summaryPanelVariantOverride ?? null,
    });
    const isVariantAutomatic = summaryPanelVariantOverride == null;
    // Bug 根因：状态面板在手机远控中仍把分支/Todo 浮层固定到左侧，
    // 而面板本身已占据大部分视口，左右均无法容纳固定宽度。手机远控改用纵向定位，
    // 让 Radix 在上/下之间翻转；桌面和宽屏 Web 保持原左侧交互。
    const useVerticalFloatingPanels = isWebRemoteControl && isMobileViewport;
    const panelModeValue = isVariantAutomatic ? "auto" : variant;
    const { intl } = useZCodeIntl();
    const panelMenuLabel = intl.formatMessage({
        id: "chat.summaryPanel.displayMode",
    });
    const canRenderGit = Boolean(model.git && gitSummary && onRefreshGit);
    const canRenderGoal = Boolean(model.goal);
    const canRenderSessionPlans = Boolean(model.sessionPlans);
    const canRenderPlan = Boolean(model.plan);
    const canRenderTerminals = model.runningBashWorks.length > 0;
    // 已结束的 run 也开门（与 canRenderAgents 同判断）：重启后活动数为零，若只按它开门，
    // 通往 run 目录的唯一入口会连带消失。
    const canRenderEndedWorkflows = Boolean(endedWorkflowRunCount > 0 && parentSessionId && onOpenWorkflowRunDirectory);
    const canRenderWorkflows = model.runningWorkflowRuns.length > 0 || canRenderEndedWorkflows;
    const canRenderEndedAgents = Boolean(endedSubagentCount > 0 && parentSessionId && onOpenSubagentDirectory);
    // 已结束目录入口过去渲染在 Agent StatusSection 之后，视觉和 DOM 都被提升成
    // 并列顶层 section。Agent 的运行态和已结束目录属于同一领域，统一由 Agent 折叠分组承载。
    const canRenderAgents = model.runningSubagentWorks.length > 0 || canRenderEndedAgents;
    const handlePanelModeChange = useCallback((value) => {
        if (value === "auto") {
            onVariantChange?.(null);
            return;
        }
        if (value === "panel" || value === "mini") {
            onVariantChange?.(value);
        }
    }, [onVariantChange]);
    const handleOpenWorkflowSection = useCallback(() => {
        onWorkflowSectionOpenChange?.(true);
    }, [onWorkflowSectionOpenChange]);
    const handleCollapseToMini = useCallback(() => {
        onVariantChange?.("mini");
    }, [onVariantChange]);
    // `model.hasContent` 只认**活的**内容（模型手上的投影都是活状态），所以「只剩历史」的
    // 会话会连整个胶囊一起消失——而那正是重启后打开一条旧对话的样子，run 目录的入口于是又没了。
    // 已结束的 run 因此单独开这道门。（Agents 的已结束行有同一个洞：`endedSubagentCount` 也
    // 没进 `hasContent`。那是既有行为，不在本轮一起翻。）
    if (!model.hasContent && !canRenderEndedWorkflows) {
        return null;
    }
    return (_jsx("div", { className: cn("pointer-events-none absolute top-0 z-20 pt-4", 
        // 旧 ChatView 的 inline 面板直接钉在右侧，正文列通过独立 translate 让位。
        // v4 若继续用 inset-x-0 + justify-end，会让面板容器宽铺满并改变宽屏下的横向对齐。
        layoutMode === "inline"
            ? "right-4"
            : layoutMode === "auto"
                ? "inset-x-0 flex justify-end px-4 @min-[1280px]/conversation:left-auto @min-[1280px]/conversation:right-4 @min-[1280px]/conversation:px-0"
                : "inset-x-0 flex justify-end px-4", className), children: _jsxs("aside", { "aria-label": intl.formatMessage({ id: "chat.summaryPanel.title" }), "data-testid": TID_CHAT_SUMMARY_PANEL, "data-state": variant === "mini" ? "collapsed" : "expanded", "data-display-mode": variant, "data-goal-status": model.goal?.status, "data-goal-objective": model.goal?.objective, "data-running-background-count": model.runningBashWorks.length +
                model.runningSubagentWorks.length +
                model.runningWorkflowRuns.length, "data-running-terminal-count": model.runningBashWorks.length, "data-running-agent-count": model.runningSubagentWorks.length, "data-running-workflow-count": model.runningWorkflowRuns.length, "data-ended-workflow-count": endedWorkflowRunCount, className: cn("pointer-events-auto relative overflow-hidden rounded-2xl border border-[var(--color-popover-border)] bg-[var(--color-popover)] text-[var(--color-foreground)] shadow-md transition-[border-radius,padding,background-color,box-shadow] duration-300 ease-in-out", 
            // 胶囊宽度只由 CSS 决定：w-max 跟随摘要内容，上限以 conversation 容器（100cqw）为基准。
            // Bug 原因：过去由 ResizeObserver 量出摘要宽度写进 CSS 变量（为了给宽度做插值动画，
            // 而 shell 早已不过渡宽度），测量值会比内容晚一次渲染、上限又按窗口宽度（100vw）算——
            // 两者都能让文字落到胶囊外面。
            variant === "mini"
                ? "inline-flex max-h-8.5 w-max max-w-[min(20rem,calc(100cqw-2rem))] flex-col"
                : variant === "panel"
                    ? "flex max-h-[min(64dvh,32rem)] w-80 max-w-[calc(100cqw-2rem)] flex-col"
                    : "inline-flex max-h-8.5 w-max max-w-[min(20rem,calc(100cqw-2rem))] flex-col @min-[1280px]/conversation:max-h-[min(64dvh,32rem)] @min-[1280px]/conversation:w-80"), children: [variant !== "mini" ? (_jsxs("div", { className: cn("absolute right-3 top-3 z-10 items-center gap-1", variant === "auto" ? "hidden @min-[1280px]/conversation:flex" : "flex"), children: [_jsxs(DropdownMenu, { children: [_jsx(ControlHintTooltip, { title: panelMenuLabel, side: "left", children: _jsx(DropdownMenuTrigger, { asChild: true, children: _jsx(Button, { type: "button", variant: "ghost", size: "icon-sm", className: "size-6", "aria-label": panelMenuLabel, children: _jsx(EllipsisIcon, { className: "size-3.5" }) }) }) }), _jsx(DropdownMenuContent, { align: "end", side: "bottom", className: "w-44", children: _jsx(DropdownMenuRadioGroup, { value: panelModeValue, onValueChange: handlePanelModeChange, children: _jsx(DropdownMenuRadioItem, { value: "auto", children: intl.formatMessage({
                                                id: "chat.summaryPanel.displayModeAuto",
                                            }) }) }) })] }), _jsx(ControlHintTooltip, { title: intl.formatMessage({ id: "chat.summaryPanel.showMini" }), side: "left", children: _jsx(Button, { type: "button", variant: "ghost", size: "icon-sm", className: "size-6", "aria-label": intl.formatMessage({
                                    id: "chat.summaryPanel.showMini",
                                }), onClick: handleCollapseToMini, children: _jsx(Minimize2Icon, { className: "size-3.5" }) }) })] })) : null, variant !== "mini" ? (_jsxs("div", { className: cn("min-h-0 flex-1 flex-col gap-2 overflow-x-hidden overflow-y-auto p-2", variant === "auto" ? "hidden @min-[1280px]/conversation:flex" : "flex"), children: [canRenderGit ? (_jsx(GitStatusSection, { model: model, gitSummary: gitSummary, gitWorktreeReviewSourceId: gitWorktreeReviewSourceId, workspacePath: workspacePath, workspaceIdentity: workspaceIdentity, activeTaskChangeSummary: activeTaskChangeSummary, onRefreshGit: onRefreshGit, onOpenGitReview: onOpenGitReview, separated: false, useVerticalFloatingPanels: useVerticalFloatingPanels })) : null, canRenderGoal ? (_jsx(GoalStatusSection, { model: model, separated: canRenderGit, onPauseGoal: onPauseGoal, onResumeGoal: onResumeGoal })) : null, canRenderSessionPlans ? (_jsx(SessionPlansStatusSection, { model: model, parentSessionId: parentSessionId, onOpenPlanDetail: onOpenPlanDetail, separated: canRenderGit || canRenderGoal })) : null, canRenderPlan ? (_jsx(PlanStatusSection, { model: model, popoverSide: useVerticalFloatingPanels ? "bottom" : "left", separated: canRenderGit || canRenderGoal || canRenderSessionPlans })) : null, canRenderTerminals ? (_jsx(BackgroundWorkStatusSection, { onOpenBackgroundBash: onOpenBackgroundBash, section: "terminal", title: intl.formatMessage({ id: "chat.statusPanel.terminals" }), works: model.runningBashWorks, open: terminalSectionOpen, onOpenChange: onTerminalSectionOpenChange, separated: canRenderGit || canRenderGoal || canRenderSessionPlans || canRenderPlan, onCancelBackgroundWork: onCancelBackgroundWork })) : null, canRenderWorkflows ? (_jsx(WorkflowStatusSection, { title: intl.formatMessage({ id: "chat.statusPanel.workflows" }), runs: model.runningWorkflowRuns, endedRunCount: canRenderEndedWorkflows ? endedWorkflowRunCount : 0, open: workflowSectionOpen, onOpenChange: onWorkflowSectionOpenChange, separated: canRenderGit ||
                                canRenderGoal ||
                                canRenderSessionPlans ||
                                canRenderPlan ||
                                canRenderTerminals, parentSessionId: parentSessionId, onCancelBackgroundWork: onCancelBackgroundWork, onOpenWorkflowRun: onOpenWorkflowRun, onOpenDirectory: onOpenWorkflowRunDirectory })) : null, canRenderAgents ? (_jsx(SubagentStatusSection, { title: intl.formatMessage({ id: "chat.statusPanel.agents" }), subagents: model.runningSubagentWorks, endedSubagentCount: canRenderEndedAgents ? endedSubagentCount : 0, onCancelBackgroundWork: onCancelBackgroundWork, open: agentSectionOpen, onOpenChange: onAgentSectionOpenChange, separated: canRenderGit ||
                                canRenderGoal ||
                                canRenderSessionPlans ||
                                canRenderPlan ||
                                canRenderTerminals ||
                                canRenderWorkflows, parentSessionId: parentSessionId, rootSessionId: rootSessionId, onOpenSubagentSession: onOpenSubagentSession, onOpenSubagentDirectory: onOpenSubagentDirectory })) : null] })) : null, _jsx("div", { "aria-hidden": variant === "panel", className: cn("w-max max-w-full transition-opacity duration-150", variant === "mini"
                        ? "pointer-events-auto relative visible opacity-100"
                        : variant === "panel"
                            ? "pointer-events-none invisible absolute left-0 top-0 opacity-0"
                            : "pointer-events-auto relative visible opacity-100 @min-[1280px]/conversation:hidden"), children: _jsx(StatusSummaryRow, { model: model, 
                        // 与页脚同一道门（canRenderEndedWorkflows）：缺会话或缺回调时目录打不开，
                        // 胶囊也就不该报一个点了没反应的数。
                        endedWorkflowRunCount: canRenderEndedWorkflows ? endedWorkflowRunCount : 0, gitWorktreeChangeSummary: gitWorktreeChangeSummary, onOpenWorkflowSection: handleOpenWorkflowSection, onVariantChange: onVariantChange }) })] }) }));
}
export const ConversationStatusPanel = memo(ConversationStatusPanelImpl);
//# sourceMappingURL=ConversationStatusPanel.js.map