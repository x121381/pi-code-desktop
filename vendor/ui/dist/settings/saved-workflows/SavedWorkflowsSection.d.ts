import { type ReactNode } from "react";
import type { SavedWorkflowLaunchTarget } from "@/settings/saved-workflows/useSavedWorkflowLauncher.js";
import type { SavedWorkflowProjectTarget, SavedWorkflowsOpenArtifactParams, SavedWorkflowsOpenRunParams } from "@/settings/saved-workflows/savedWorkflowContract.js";
export type { SavedWorkflowProjectTarget, SavedWorkflowsOpenArtifactParams, SavedWorkflowsOpenRunParams, SavedWorkflowLaunchTarget, };
/** 深链目标：默认 project（缺 scope 兼容旧调用），或 global（无 workspaceKey）。 */
export type SavedWorkflowsOpenTarget = {
    scope?: "project";
    workspaceKey: string;
    name: string;
} | {
    scope: "global";
    name: string;
};
interface SavedWorkflowsSectionProps {
    /** 页头（标题切换 + 副标题）；只在列表态渲染，详情页与定时任务编辑页一样独占整页。 */
    header?: ReactNode;
    /** 活动 workspace：只用来打「当前」标记和作全局空态的创建目标。 */
    workspacePath?: string | null;
    workspaceIdentity?: string;
    /** 「运行」= GUI 直接启动：accepted 后切到新会话。 */
    onNavigateToLaunchedRun?: (target: SavedWorkflowLaunchTarget, sessionId: string) => void;
    /** 「通过对话创建」/「在对话里修订」：只预填草稿，不发送；target = 所属项目（空态卡取活动项目）。 */
    onCreateViaChat?: (prompt: string, target: SavedWorkflowProjectTarget) => void;
    /** 运行历史「查看实例」：切到发起它的会话并打开实例详情页。 */
    onOpenWorkflowRun?: (params: SavedWorkflowsOpenRunParams) => void;
    /** 产物 chip → `workflow-artifact` tab。 */
    onOpenWorkflowArtifact?: (params: SavedWorkflowsOpenArtifactParams) => void;
    /** 深链直接落到详情页；定位后由调用方清空。project 需 workspaceKey，global 只需 name。 */
    openWorkflow?: SavedWorkflowsOpenTarget | null;
    onOpenWorkflowConsumed?: () => void;
}
/**
 * 已保存工作流中枢：顶部固定「全局」组，
 * 其下按已打开项目分组。页只持有刷新计数器、每组的加载态、详情态；「项目」= `buildAutomationWorkspaceOptions`。
 */
export declare function SavedWorkflowsSection({ header, workspacePath, workspaceIdentity, onNavigateToLaunchedRun, onCreateViaChat, onOpenWorkflowRun, onOpenWorkflowArtifact, openWorkflow, onOpenWorkflowConsumed, }: SavedWorkflowsSectionProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=SavedWorkflowsSection.d.ts.map