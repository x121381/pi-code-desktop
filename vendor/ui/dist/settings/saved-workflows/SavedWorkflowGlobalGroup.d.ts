import type { AutomationWorkspaceOption } from "@/settings/automationWorkspaceOptions.js";
import type { SavedWorkflowLaunchTarget } from "@/settings/saved-workflows/useSavedWorkflowLauncher.js";
import type { SavedWorkflowGroupMode, SavedWorkflowGroupState } from "@/settings/saved-workflows/SavedWorkflowProjectGroup.js";
import type { SavedWorkflowProjectTarget, SavedWorkflowsOpenArtifactParams, SavedWorkflowsOpenRunParams } from "@/settings/saved-workflows/savedWorkflowContract.js";
interface SavedWorkflowGlobalGroupProps {
    /** 页级刷新计数器；变化（非首挂）时绕过缓存重拉。 */
    refreshSeq: number;
    mode: SavedWorkflowGroupMode;
    onStateChange: (key: "global", state: SavedWorkflowGroupState) => void;
    onOpenDetail: (name: string) => void;
    onBack: () => void;
    /** 「运行」= GUI 直接启动：accepted 后切到新会话。 */
    onNavigateToLaunchedRun?: (target: SavedWorkflowLaunchTarget, sessionId: string) => void;
    onCreateViaChat?: (prompt: string, target: SavedWorkflowProjectTarget) => void;
    onOpenWorkflowRun?: (params: SavedWorkflowsOpenRunParams) => void;
    /** 产物 chip → `workflow-artifact` tab。 */
    onOpenWorkflowArtifact?: (params: SavedWorkflowsOpenArtifactParams) => void;
    /** 本机项目候选（已过滤远程 remoteSessionId）：运行落点、修订落点、移到项目的目标。 */
    localProjects: readonly AutomationWorkspaceOption[];
    /** 活动项目 key：实参窗默认「运行于」、修订 / 创建默认落点。 */
    activeProjectKey: string | null;
    /** 移动成功后回调页刷新两组。 */
    onMoved: () => void;
}
/**
 * 全局工作流组：顶部固定的「全局」组，空也显示。载体不用
 * `useWorkspaceServicesResolution`——直接用 `useServices().zcodeAgentService`，RPC 带 `{ scope: "global" }`，
 * services 层自选本机运行时。运行走带「运行于」的实参窗；卡片 / 详情可「移到项目…」搬回本地项目。
 * 状态与动作全在 `useSavedWorkflowGlobalGroup`，本文件只负责渲染。
 */
export declare function SavedWorkflowGlobalGroup(props: SavedWorkflowGlobalGroupProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=SavedWorkflowGlobalGroup.d.ts.map