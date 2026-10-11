import { type ZCodeAutomation, type ZCodeOffPeakTask } from "@zcode/shared";
import { type AutomationRunNowResult } from "@/store/automationManagementStore.js";
import type { AutomationsNavigationTab } from "@/lib/taskNavigationHistory.js";
import { type SavedWorkflowLaunchTarget, type SavedWorkflowProjectTarget, type SavedWorkflowsOpenArtifactParams, type SavedWorkflowsOpenRunParams, type SavedWorkflowsOpenTarget } from "@/settings/saved-workflows/SavedWorkflowsSection.js";
interface AutomationsSectionProps {
    workspacePath?: string | null;
    workspaceIdentity?: string;
    /** 「Create via chat」:切到会话让 agent 用 CronCreate 创建;缺省则回退到手动创建整页。
     * target = 工作流所属项目；定时任务的「通过对话创建」不带 target，落到活动项目。 */
    onCreateViaChat?: (prompt: string, target?: SavedWorkflowProjectTarget) => void;
    /** 会话内创建卡片的详情导航目标；定位成功后由调用方清空。 */
    openAutomationId?: string | null;
    /** 推荐提示词携带的一次性 tab 导航目标；仅在目标 tab 可见时应用。"workflow" 落到顶级「工作流」标签。 */
    openAutomationTab?: AutomationsNavigationTab | null;
    onOpenAutomationConsumed?: () => void;
    /** 工作流「运行」= GUI 直接启动：accepted 后切到新会话。 */
    onNavigateToLaunchedRun?: (target: SavedWorkflowLaunchTarget, sessionId: string) => void;
    /** 工作流运行历史「查看实例」：切到发起它的会话并打开实例详情页。 */
    onOpenWorkflowRun?: (params: SavedWorkflowsOpenRunParams) => void;
    /** 产物 chip → `workflow-artifact` tab。 */
    onOpenWorkflowArtifact?: (params: SavedWorkflowsOpenArtifactParams) => void;
    /** 深链直接落到详情页；透传给 SavedWorkflowsSection，定位后由调用方清空。global 只需 name。 */
    openWorkflow?: SavedWorkflowsOpenTarget | null;
    onOpenWorkflowConsumed?: () => void;
    /** 打开某次运行关联的会话；管理页列出所有项目，必须携带 automation 所属 workspace。 */
    onOpenSession?: (params: {
        sessionId: string;
        workspacePath: string;
        workspaceIdentity?: string;
    }) => void;
}
export declare const AUTOMATIONS_TOAST_ANCHOR_ID = "automations-main-toast-anchor";
/** 创建表单的预填草稿(来自「More ideas」模板)。 */
export interface AutomationDraft {
    templateId?: string;
    title: string;
    cronExpr: string;
    prompt: string;
}
/** 主视图标签页：Scheduled 常驻，Idle-time 受灰度控制（D31）；不设 All 混排视图。 */
export type AutomationsTab = "scheduled" | "idle";
export declare function resolveVisibleAutomationTabs({ hasAnyTasks, offPeakVisible, }: {
    hasAnyTasks: boolean;
    offPeakVisible: boolean;
}): readonly AutomationsTab[];
export declare function resolveAutomationTabAfterOffPeakChange(tab: AutomationsTab, offPeakVisible: boolean): AutomationsTab;
export declare function resolveAutomationTabNavigation({ requestedTab, tabsReady, visibleTabs, }: {
    requestedTab: AutomationsTab;
    tabsReady: boolean;
    visibleTabs: readonly AutomationsTab[];
}): {
    status: "pending";
} | {
    status: "settled";
    tab: AutomationsTab;
};
export declare function resolveAutomationTemplateVisibility({ hasAnyTasks, offPeakCreationEnabled, tab, }: {
    hasAnyTasks: boolean;
    offPeakCreationEnabled: boolean;
    tab: AutomationsTab;
}): {
    showOffPeakTemplates: boolean;
    showScheduledTemplates: boolean;
};
export declare function canRestartAutomation(automation: Pick<ZCodeAutomation, "lifecycleStatus">): boolean;
export declare function canToggleAutomation(automation: Pick<ZCodeAutomation, "lifecycleStatus">): boolean;
export declare function getAutomationRunNowToastId(result: AutomationRunNowResult): "automations.runNowQueued" | "automations.runNowAlreadyRunning" | "automations.runNowFailed";
export type AutomationActionError = "create" | "update" | "toggle" | "restart" | "delete";
/** 原始 Agent/RPC 错误留在 logger；界面只展示当前动作对应的可理解提示。 */
export declare function getAutomationActionErrorToastId(action: AutomationActionError): string;
export declare function getAutomationCreateErrorToastId(error: unknown): string;
export declare function resolveAutomationDetailTarget(automations: readonly ZCodeAutomation[], automationId?: string | null): ZCodeAutomation | null;
export declare function resolveAutomationDetailNavigation(automations: readonly ZCodeAutomation[], automationId: string | null | undefined, listReady: boolean): {
    status: "pending";
} | {
    status: "missing";
} | {
    status: "found";
    target: ZCodeAutomation;
};
/** D49：openAutomationId 里 `offpeak-` 前缀 id 的判别（生成点唯一：offPeakTaskService 的 offpeak-${uuid}）。 */
export declare function isOffPeakDetailNavigationId(automationId: string | null | undefined): boolean;
/** D49：闲时轮尾卡跳转的并行解析路径；与 cron 的 resolveAutomationDetailNavigation 对称。 */
export declare function resolveOffPeakDetailNavigation(tasks: readonly ZCodeOffPeakTask[], offPeakTaskId: string | null | undefined, listReady: boolean, listError?: string | null): {
    status: "pending";
} | {
    status: "unavailable";
} | {
    status: "missing";
} | {
    status: "found";
    target: ZCodeOffPeakTask;
};
export declare function AutomationsSection({ workspacePath, workspaceIdentity, onCreateViaChat, openAutomationId, openAutomationTab, onOpenAutomationConsumed, onNavigateToLaunchedRun, onOpenWorkflowRun, onOpenWorkflowArtifact, openWorkflow, onOpenWorkflowConsumed, onOpenSession, }: AutomationsSectionProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=AutomationsSection.d.ts.map