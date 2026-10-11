import type { WebRemoteControlMobileNavigationIntent, WebRemoteControlTaskTarget } from "@zcode/shared";
import type { WebRemoteControlWorkspaceSwitcherApi } from "@/root/types.js";
export declare function buildWebRemoteControlTaskRowKey(task: WebRemoteControlTaskTarget): string;
interface OpenWebRemoteControlTaskOptions {
    switcher: WebRemoteControlWorkspaceSwitcherApi;
    activeWorkspacePath: string;
    activeWorkspaceIdentity?: string;
    activeTaskId: string | null;
    task: WebRemoteControlTaskTarget;
    markTaskReadOnOpen?: boolean;
    mobileNavigationIntent?: WebRemoteControlMobileNavigationIntent;
    onSelectTask: (targetWorkspacePath: string, taskId: string, targetWorkspaceIdentity?: string) => void;
    onNavigateToChat?: () => void;
    onTaskOpen?: (options: {
        crossWorkspace: boolean;
    }) => void;
    onSwitchingChange?: (switching: boolean) => void;
    onNavigateHome?: () => void;
    setSwitchingTaskKey?: (taskKey: string | null) => void;
    setError?: (error: string | null) => void;
}
export declare function openWebRemoteControlTask({ activeWorkspaceIdentity, activeWorkspacePath, markTaskReadOnOpen, mobileNavigationIntent, onNavigateHome, onNavigateToChat, onSelectTask, onSwitchingChange, onTaskOpen, setError, setSwitchingTaskKey, switcher, task, }: OpenWebRemoteControlTaskOptions): Promise<void>;
export declare function useWebRemoteControlTaskOpen({ activeTaskId, activeWorkspaceIdentity, activeWorkspacePath, markTaskReadOnOpen, mobileNavigationIntent, onNavigateHome, onNavigateToChat, onSelectTask, onSwitchingChange, onTaskOpen, switcher, }: Omit<OpenWebRemoteControlTaskOptions, "setError" | "setSwitchingTaskKey" | "task">): {
    activeWorkspaceKey: string;
    error: string | null;
    openTask: (task: WebRemoteControlTaskTarget) => void;
    switchingTaskKey: string | null;
};
export {};
//# sourceMappingURL=useWebRemoteControlTaskOpen.d.ts.map