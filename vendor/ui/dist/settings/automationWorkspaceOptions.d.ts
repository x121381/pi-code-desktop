import { type RemoteTarget, type WorkspacePurpose } from "@zcode/shared";
import { type WindowTabState } from "@/store/tabStore.js";
export interface AutomationWorkspaceOption {
    workspacePath: string;
    workspaceIdentity?: string;
    remoteSessionId?: string;
    remoteTarget?: RemoteTarget;
    label: string;
    workspacePurpose?: WorkspacePurpose;
}
export declare function resolveAutomationWorkspaceSelectionKey(workspace: Pick<AutomationWorkspaceOption, "workspacePath" | "workspaceIdentity">): string;
export declare function findAutomationWorkspaceOptionByKey(options: readonly AutomationWorkspaceOption[], workspaceKey: string | null): AutomationWorkspaceOption | undefined;
/**
 * 新建表单的项目选择只能落在当前有效候选中。
 * 候选变化时保留仍有效的选择，否则依次回落到有效默认项目、首个有效项目或 null。
 */
export declare function reconcileAutomationWorkspaceSelectionKey(options: readonly AutomationWorkspaceOption[], currentWorkspaceKey: string | null, preferredWorkspace?: Pick<AutomationWorkspaceOption, "workspacePath" | "workspaceIdentity">): string | null;
/**
 * 构建纯项目候选，供不允许“无项目会话”的边界使用。
 * 定时任务表单额外展示的单一“无项目会话”目标由 useAutomationProjectOptions 显式归并；
 * recentProjects、conversation backing 与失效目录不能作为普通项目混入这里。
 */
export declare function buildAutomationWorkspaceOptions(tabs: readonly WindowTabState[]): AutomationWorkspaceOption[];
//# sourceMappingURL=automationWorkspaceOptions.d.ts.map