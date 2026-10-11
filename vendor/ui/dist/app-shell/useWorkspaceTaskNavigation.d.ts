import { type AutomationsNavigationTab } from "@/lib/taskNavigationHistory.js";
export interface AutomationsNavigationTarget {
    workspacePath: string;
    workspaceIdentity?: string;
    automationId?: string;
    automationTab?: AutomationsNavigationTab;
}
export declare function useWorkspaceTaskNavigation({ intl, workspaceAbsPath, workspaceIdentity, activateTabByPath, onNavigateToTask, onNavigateToAutomations, onNavigateToPluginStore, }: {
    intl: {
        formatMessage: (descriptor: {
            id: string;
        }) => string;
    };
    workspaceAbsPath: string;
    workspaceIdentity?: string;
    activateTabByPath: (workspacePath: string, options?: {
        workspaceIdentity?: string;
    }) => boolean;
    onNavigateToTask?: () => void;
    onNavigateToAutomations?: (target: AutomationsNavigationTarget) => void;
    onNavigateToPluginStore?: (target: Omit<AutomationsNavigationTarget, "automationId">) => void;
}): {
    handleSelectTask: (targetWorkspacePath: string, taskId: string, targetWorkspaceIdentityHint?: string, selectedRowUnreadAt?: number) => void;
    handleOpenAutomations: (automationId?: string, automationTab?: AutomationsNavigationTab) => void;
    handleOpenPluginStore: () => void;
    handleTaskNavBack: () => void;
    handleTaskNavForward: () => void;
    canGoBack: boolean;
    canGoForward: boolean;
    canTaskNavBack: boolean;
    canTaskNavForward: boolean;
};
//# sourceMappingURL=useWorkspaceTaskNavigation.d.ts.map