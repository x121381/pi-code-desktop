import type { GitChangeSourceId, GitRepositorySummary, ZCodeSessionRunningSubagent, ZCodeTaskChangeSummary } from "@zcode/shared";
import type { BackgroundWorkSummary, GoalState, PlanState, ToolCallRow, WorkflowRunState } from "@zcode/shared/zcode-protocol-v4";
import type { OpenPlanDetailSideTabRequest, OpenSubagentDirectorySideTabRequest, OpenSubagentSideTabRequest, OpenWorkflowRunDirectorySideTabRequest } from "@/lib/workspaceSidePane.js";
import type { ChatViewSummaryPanelVariant } from "@/v4/legacyChatViewTypes.js";
import { type ConversationStatusPanelSessionPlanItem } from "@/v4/conversationStatusPanelModel.js";
import type { ConversationStatusPanelWorkflowRunTarget } from "@/v4/conversationStatusPanelModel.js";
export interface ConversationStatusPanelProps {
    workspacePath: string;
    workspaceIdentity?: string;
    gitSummary?: GitRepositorySummary | null;
    gitDirtyFileCount?: number;
    gitWorktreeReviewSourceId?: GitChangeSourceId | null;
    gitWorktreeChangeSummary?: {
        added: number;
        removed: number;
    } | null;
    activeTaskChangeSummary?: ZCodeTaskChangeSummary | null;
    goal?: GoalState | null;
    sessionPlans?: readonly ToolCallRow[];
    plan?: PlanState | null;
    backgroundWorks?: readonly BackgroundWorkSummary[];
    runningSubagents?: readonly ZCodeSessionRunningSubagent[];
    /** 本会话 `snapshot.workflowRuns.runs`；与 backgroundWorks 在模型层按 workId ≡ runId 联接。 */
    workflowRuns?: readonly WorkflowRunState[];
    /**
     * 已结束的 workflow run 条数（journal 口径，`countEndedWorkflowRuns`）。
     * 面板不自己算：它手上的投影是 memory-only 的活状态，重启后为空，而这条计数恰恰要在重启后
     * 仍然正确。
     */
    endedWorkflowRunCount?: number;
    endedSubagentCount?: number;
    rootSessionId?: string;
    parentSessionId?: string;
    /** 当前 pane 是否由手机 Web 远控壳承载。 */
    isWebRemoteControl?: boolean;
    /** 当前是否为粗指针手机视口。 */
    isMobileViewport?: boolean;
    layoutMode?: "none" | "auto" | "inline";
    summaryPanelVariantOverride?: ChatViewSummaryPanelVariant | null;
    onVariantChange?: (variant: ChatViewSummaryPanelVariant | null) => void;
    terminalSectionOpen?: boolean;
    onTerminalSectionOpenChange?: (open: boolean) => void;
    agentSectionOpen?: boolean;
    onAgentSectionOpenChange?: (open: boolean) => void;
    workflowSectionOpen?: boolean;
    onWorkflowSectionOpenChange?: (open: boolean) => void;
    onRefreshGit?: () => void;
    onOpenGitReview?: (sourceId?: GitChangeSourceId) => void;
    onPauseGoal?: () => void;
    onResumeGoal?: () => void;
    onOpenPlanDetail?: (request: OpenPlanDetailSideTabRequest) => void;
    onOpenBackgroundBash?: (work: BackgroundWorkSummary) => void;
    onCancelBackgroundWork?: (workId: string) => void;
    onOpenSubagentSession?: (request: OpenSubagentSideTabRequest) => void;
    onOpenSubagentDirectory?: (request: OpenSubagentDirectorySideTabRequest) => void;
    onOpenWorkflowRun?: (target: ConversationStatusPanelWorkflowRunTarget) => void;
    onOpenWorkflowRunDirectory?: (request: OpenWorkflowRunDirectorySideTabRequest) => void;
    className?: string;
}
export interface StatusPanelTodoFocusWindow {
    compact: boolean;
    precedingItems: PlanState["items"];
    focusItems: PlanState["items"];
    followingItems: PlanState["items"];
}
export declare function getStatusPanelTodoFocusWindow(items: PlanState["items"]): StatusPanelTodoFocusWindow;
export declare function buildSessionPlanOpenRequest(parentSessionId: string, item: ConversationStatusPanelSessionPlanItem): OpenPlanDetailSideTabRequest;
export declare function buildRunningSubagentOpenRequest({ parentSessionId, rootSessionId, subagent, }: {
    parentSessionId?: string;
    rootSessionId?: string;
    subagent: ZCodeSessionRunningSubagent;
}): OpenSubagentSideTabRequest | null;
declare function ConversationStatusPanelImpl({ workspacePath, workspaceIdentity, gitSummary, gitDirtyFileCount, gitWorktreeReviewSourceId, gitWorktreeChangeSummary, activeTaskChangeSummary, goal, sessionPlans, plan, backgroundWorks, runningSubagents, workflowRuns, endedWorkflowRunCount, endedSubagentCount, rootSessionId, parentSessionId, isWebRemoteControl, isMobileViewport, layoutMode, summaryPanelVariantOverride, onVariantChange, terminalSectionOpen, onTerminalSectionOpenChange, agentSectionOpen, onAgentSectionOpenChange, workflowSectionOpen, onWorkflowSectionOpenChange, onRefreshGit, onOpenGitReview, onPauseGoal, onResumeGoal, onOpenPlanDetail, onOpenBackgroundBash, onCancelBackgroundWork, onOpenSubagentSession, onOpenSubagentDirectory, onOpenWorkflowRun, onOpenWorkflowRunDirectory, className, }: ConversationStatusPanelProps): import("react/jsx-runtime").JSX.Element | null;
export declare const ConversationStatusPanel: import("react").MemoExoticComponent<typeof ConversationStatusPanelImpl>;
export {};
//# sourceMappingURL=ConversationStatusPanel.d.ts.map