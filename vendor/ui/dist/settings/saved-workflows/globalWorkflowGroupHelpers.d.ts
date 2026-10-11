import { type ZCodeSavedWorkflowRun } from "@zcode/shared";
import type { ZCodeAgentSavedWorkflowTarget } from "@zcode/services";
import type { AutomationWorkspaceOption } from "@/settings/automationWorkspaceOptions.js";
import type { SavedWorkflowProjectTarget } from "@/settings/saved-workflows/savedWorkflowContract.js";
import type { SavedWorkflowRunProject } from "@/settings/saved-workflows/SavedWorkflowRunHistoryPanel.js";
/** 全局档的 RPC 载体常量：不带 workspace，services 层自选本机运行时。 */
export declare const GLOBAL_SAVED_WORKFLOW_TARGET: ZCodeAgentSavedWorkflowTarget;
/** 「修订」/「通过对话创建」的落点：活动本地项目，不在候选里则第一个本地项目；都没有则 null。 */
export declare function resolveGlobalActionTarget(localProjects: readonly AutomationWorkspaceOption[], activeProjectKey: string | null): SavedWorkflowProjectTarget | null;
/** 运行行的 cwd 命中哪个已打开本地项目（用绝对路径逐字比较）。 */
export declare function findProjectByCwd(localProjects: readonly AutomationWorkspaceOption[], cwd: string | undefined): AutomationWorkspaceOption | null;
/**
 * 详情页运行历史每行的项目列（全局档跨 cwd）：cwd 命中已打开项目 → 该项目 label 且可「查看实例」；
 * 否则以 `basename(cwd)` 兜底、完整路径挂 title、不可「查看实例」；没有 cwd 的老行不画项目列。
 */
export declare function buildGlobalRunProjectResolver(localProjects: readonly AutomationWorkspaceOption[]): (run: ZCodeSavedWorkflowRun) => SavedWorkflowRunProject | null;
//# sourceMappingURL=globalWorkflowGroupHelpers.d.ts.map