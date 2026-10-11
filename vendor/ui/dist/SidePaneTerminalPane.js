import { jsx as _jsx } from "react/jsx-runtime";
import { useCallback } from "react";
import { TerminalSession } from "./terminal/TerminalSession.js";
export function SidePaneTerminalPane({ services, sessionId, workspaceKey, cwd, isVisible, isWindowsDesktop = false, onOpenBrowserUrl, }) {
    const handleShellLabelChange = useCallback(() => {
        // 业务说明：side pane 外层 tab 已经承载终端标题，这里只需要单个 shell 实例，
        // 不再显示或同步第二层 terminal tab 标题，避免形成嵌套 tabs。
    }, []);
    return (_jsx("section", { className: "h-full min-h-0 overflow-hidden bg-background p-3", children: _jsx(TerminalSession, { sessionId: sessionId, persistentKey: sessionId, workspaceKey: workspaceKey, services: services, cwd: cwd, isVisible: isVisible, isWindowsDesktop: isWindowsDesktop, onShellLabelChange: handleShellLabelChange, onOpenBrowserUrl: onOpenBrowserUrl }) }));
}
//# sourceMappingURL=SidePaneTerminalPane.js.map