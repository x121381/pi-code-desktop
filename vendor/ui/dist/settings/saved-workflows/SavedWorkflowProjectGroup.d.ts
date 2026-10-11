import type { AutomationWorkspaceOption } from "@/settings/automationWorkspaceOptions.js";
import { type SavedWorkflowLaunchTarget } from "@/settings/saved-workflows/useSavedWorkflowLauncher.js";
import type { SavedWorkflowGroupMode, SavedWorkflowGroupState, SavedWorkflowProjectTarget, SavedWorkflowsOpenArtifactParams, SavedWorkflowsOpenRunParams } from "@/settings/saved-workflows/savedWorkflowContract.js";
export type { SavedWorkflowGroupMode, SavedWorkflowGroupState, } from "@/settings/saved-workflows/savedWorkflowContract.js";
interface SavedWorkflowProjectGroupProps {
    project: AutomationWorkspaceOption;
    /** 活动 workspace 的组带「当前」小标；只影响标记，不影响任何 target。 */
    isCurrent: boolean;
    /** 页级刷新计数器；变化（非首挂）时本组绕过缓存重拉。 */
    refreshSeq: number;
    mode: SavedWorkflowGroupMode;
    onStateChange: (workspaceKey: string, state: SavedWorkflowGroupState) => void;
    onOpenDetail: (name: string) => void;
    onBack: () => void;
    /** 「运行」= GUI 直接启动：accepted 后切到新会话。 */
    onNavigateToLaunchedRun?: (target: SavedWorkflowLaunchTarget, sessionId: string) => void;
    onCreateViaChat?: (prompt: string, target: SavedWorkflowProjectTarget) => void;
    onOpenWorkflowRun?: (params: SavedWorkflowsOpenRunParams) => void;
    /** 产物 chip → `workflow-artifact` tab。 */
    onOpenWorkflowArtifact?: (params: SavedWorkflowsOpenArtifactParams) => void;
}
/**
 * 单个项目的工作流组：接过 v1 单项目 section 的全部
 * 职责——用**本项目**的 agent 代理拉列表 / 运行历史、监听本项目目录、运行 / 修订 / 复制 / 删除 /
 * 提升为全局 / 进详情，全部带本项目的 target。组头 = 项目名 + 「当前」小标 + 数量 +
 * 「通过对话创建」。
 */
export declare function SavedWorkflowProjectGroup({ project, isCurrent, refreshSeq, mode, onStateChange, onOpenDetail, onBack, onNavigateToLaunchedRun, onCreateViaChat, onOpenWorkflowRun, onOpenWorkflowArtifact, }: SavedWorkflowProjectGroupProps): import("react/jsx-runtime").JSX.Element | null;
//# sourceMappingURL=SavedWorkflowProjectGroup.d.ts.map