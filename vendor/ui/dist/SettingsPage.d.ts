import type { UserInfo } from "@zcode/shared";
import type { CreateTaskRequest } from "@/app-shell/types.js";
export declare function SettingsPage({ isDesktop, isWindowsDesktop, isMacDesktop, isWebRemoteControl, windowsWindowControlsRightPaddingPx: _windowsWindowControlsRightPaddingPx, captionWorkspacePath, onBack, onCreateTask, onOpenWorkspace, allowOpenWorkspace, onLogin, onLogout, user, }: {
    isDesktop?: boolean;
    isWindowsDesktop?: boolean;
    isMacDesktop?: boolean;
    isWebRemoteControl?: boolean;
    windowsWindowControlsRightPaddingPx?: number;
    captionWorkspacePath?: string | null;
    onBack?: () => void;
    onCreateTask?: (request?: CreateTaskRequest) => void;
    onOpenWorkspace?: () => void;
    allowOpenWorkspace?: boolean;
    onLogin?: () => void;
    onLogout?: () => void;
    user?: UserInfo | null;
}): import("react/jsx-runtime").JSX.Element | null;
//# sourceMappingURL=SettingsPage.d.ts.map