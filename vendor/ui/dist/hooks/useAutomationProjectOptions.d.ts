import type { WorkspacePurpose } from "@zcode/shared";
import { type WorkspaceTabState } from "@/store/tabStore.js";
export interface AutomationProjectOption {
    workspacePath: string;
    label: string;
    workspacePurpose?: WorkspacePurpose;
}
export declare function isRemoteAutomationWorkspace(tab: WorkspaceTabState | undefined): boolean;
export interface AutomationProjectOptionsConfig {
    includeConversationWorkspace?: boolean;
}
export declare function resolveAutomationProjectOptions(workspaceTabs: WorkspaceTabState[], config?: AutomationProjectOptionsConfig): AutomationProjectOption[];
/**
 * 自动化创建只读取当前窗口已经打开且仍可用的本地 workspace。
 * 定时任务可显式加入一个“无项目会话”逻辑目标；闲时任务保持仅真实项目。
 *
 * 候选只保留可用的本地 workspace tab，排除最近项目和远端 tab，
 * 避免把远端 identity 交给本地 host，或让闲时任务继承远端 workspace。
 * 两类任务共用入口过滤规则，保持一致的项目隔离语义。
 */
export declare function useAutomationProjectOptions(config?: AutomationProjectOptionsConfig): AutomationProjectOption[];
//# sourceMappingURL=useAutomationProjectOptions.d.ts.map