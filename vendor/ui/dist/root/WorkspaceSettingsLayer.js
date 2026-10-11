import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect } from "react";
import { SettingsPage } from "../SettingsPage.js";
import { ServiceProvider } from "../hooks/useServices.js";
import { logger } from "../logger.js";
export function WorkspaceSettingsLayer({ workspaceScopedServices, isDesktop, isMacDesktop, isWindowsDesktop, isWebRemoteControl, windowsWindowControlsRightPaddingPx, captionWorkspacePath, onBack, onCreateTask, onOpenWorkspace, allowOpenWorkspace, onLogin, onLogout, user, }) {
    useEffect(() => {
        logger.info("[Root] settings layer mounted");
        return () => {
            logger.info("[Root] settings layer unmounted");
        };
    }, []);
    return (_jsx("div", { className: "absolute inset-0 z-10", children: workspaceScopedServices ? (_jsx(ServiceProvider, { services: workspaceScopedServices, children: _jsx(SettingsPage, { isDesktop: isDesktop, isMacDesktop: isMacDesktop, isWindowsDesktop: isWindowsDesktop, isWebRemoteControl: isWebRemoteControl, windowsWindowControlsRightPaddingPx: windowsWindowControlsRightPaddingPx, captionWorkspacePath: captionWorkspacePath, onBack: onBack, onCreateTask: onCreateTask, onOpenWorkspace: onOpenWorkspace, allowOpenWorkspace: allowOpenWorkspace, onLogin: onLogin, onLogout: onLogout, user: user }) })) : (_jsx(SettingsPage, { isDesktop: isDesktop, isMacDesktop: isMacDesktop, isWindowsDesktop: isWindowsDesktop, isWebRemoteControl: isWebRemoteControl, windowsWindowControlsRightPaddingPx: windowsWindowControlsRightPaddingPx, captionWorkspacePath: captionWorkspacePath, onBack: onBack, onCreateTask: onCreateTask, onOpenWorkspace: onOpenWorkspace, allowOpenWorkspace: allowOpenWorkspace, onLogin: onLogin, onLogout: onLogout, user: user })) }));
}
//# sourceMappingURL=WorkspaceSettingsLayer.js.map