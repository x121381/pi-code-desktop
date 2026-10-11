import { type WebRemoteControlTaskTarget, type WebRemoteControlWorkspaceListResult } from "@zcode/shared";
import { type WebRemoteControlMobileTaskHomePreferences } from "@/lib/webRemoteControlMobileTaskHome.js";
import type { WebRemoteControlWorkspaceSwitcherApi } from "@/root/types.js";
export { buildWebRemoteControlMobileTaskHomeModel } from "@/lib/webRemoteControlMobileTaskHome.js";
export { persistWebRemoteControlMobileTaskHomePreferences, readWebRemoteControlMobileTaskHomePreferences, type WebRemoteControlMobileTaskHomePreferences, } from "@/lib/webRemoteControlMobileTaskHome.js";
export declare function WebRemoteControlMobileTaskHome({ activeTaskId, activeWorkspaceIdentity, activeWorkspacePath, initialResult, onNavigateHome, onNavigateToChat, onOpenTask, preferences, onPreferencesChange, onSelectTask, onStartDraftInWorkspace, refreshKey, onCrossWorkspaceSwitchingChange, switcher, }: {
    switcher: WebRemoteControlWorkspaceSwitcherApi;
    activeWorkspacePath: string;
    activeWorkspaceIdentity?: string;
    activeTaskId: string | null;
    initialResult?: WebRemoteControlWorkspaceListResult;
    onSelectTask?: (targetWorkspacePath: string, taskId: string, targetWorkspaceIdentity?: string) => void;
    onStartDraftInWorkspace?: (targetWorkspacePath: string, targetWorkspaceIdentity?: string) => void;
    onNavigateHome?: () => void;
    onNavigateToChat?: () => void;
    onOpenTask?: (task: WebRemoteControlTaskTarget) => void;
    preferences: WebRemoteControlMobileTaskHomePreferences;
    onPreferencesChange: (preferences: WebRemoteControlMobileTaskHomePreferences) => void;
    refreshKey?: number;
    onCrossWorkspaceSwitchingChange?: (switching: boolean) => void;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=WebRemoteControlMobileTaskHome.d.ts.map