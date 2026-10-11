import type { IPlatformService, UpdateStatePayload } from "@zcode/shared";
interface DesktopTopOverlayProps {
    workspaceAbsPath: string;
    isMacDesktop?: boolean;
    isMacFullscreen?: boolean;
    isWindowsDesktop?: boolean;
    isDesktop?: boolean;
    macWindowControlsLeftPaddingPx?: number;
    windowsWindowControlsRightPaddingPx?: number;
    isSidebarVisible: boolean;
    updateReadyVersion: string | null;
    updateState: UpdateStatePayload | null;
    toggleSidebarShortcutLabel: string;
    newTaskShortcutLabel: string;
    goBackShortcutLabel: string;
    goForwardShortcutLabel: string;
    canTaskNavBack: boolean;
    canTaskNavForward: boolean;
    canGoBack: boolean;
    canGoForward: boolean;
    showNewTaskButton?: boolean;
    appLogoUrl: string;
    platform: IPlatformService;
    onToggleSidebar: () => void;
    onCreateTask: () => void;
    onGoBack: () => void;
    onGoForward: () => void;
    hideTaskNavigationButtons?: boolean;
    newTaskDisabledReason?: string;
}
export declare function DesktopTopOverlay({ workspaceAbsPath: _workspaceAbsPath, isMacDesktop, isMacFullscreen, isWindowsDesktop, isDesktop, macWindowControlsLeftPaddingPx, windowsWindowControlsRightPaddingPx, isSidebarVisible, updateReadyVersion, updateState, toggleSidebarShortcutLabel, newTaskShortcutLabel, goBackShortcutLabel, goForwardShortcutLabel, canTaskNavBack, canTaskNavForward, canGoBack: _canGoBack, canGoForward: _canGoForward, showNewTaskButton, appLogoUrl, platform, onToggleSidebar, onCreateTask, onGoBack, onGoForward, hideTaskNavigationButtons, newTaskDisabledReason, }: DesktopTopOverlayProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=DesktopTopOverlay.d.ts.map