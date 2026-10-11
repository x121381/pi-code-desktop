import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { WorkspaceEditorButtonGroup } from "../WorkspaceEditorButtonGroup.js";
import { WorkspaceSidePaneToggleButton } from "../WorkspaceSidePaneToggleButton.js";
import { WorkspaceTerminalToggleButton } from "../WorkspaceTerminalToggleButton.js";
import { cn } from "../components/lib/utils.js";
import { WorkspaceHelpMenuButton } from "../WorkspaceHelpMenuButton.js";
import { ConversationShareMenu } from "../ConversationShareMenu.js";
import { DesktopWindowControls } from "../DesktopWindowControls.js";
export function WorkspaceHeaderActionSection({ variant = "task", activeTaskId, user, readOnlyReason, workspaceAbsPath, workspaceIdentity, remoteTarget, isWebRemoteControl = false, isDesktop, isTerminalOpen, isSidePaneOpen, onToggleTerminal, onToggleSidePane, toggleSidePaneShortcutLabel, onSelectedEditorChange, simplifyForNarrowRemote = false, hideHelpMenu = false, showWindowControls = false, useWindowsCaptionSpacing = false, }) {
    return (_jsxs("div", { className: cn("flex shrink-0 items-center [app-region:no-drag]", 
        // Windows header 内容区有 p-2，普通工具栏按钮 hover 只覆盖 32px 高度。
        // 标题栏按钮需要抵消这层垂直内边距，和原生窗控/右侧菜单保持同一个 48px hover 面。
        useWindowsCaptionSpacing ? "-my-2 h-12 gap-0" : "gap-0.5"), children: [variant === "task" ? (_jsx(WorkspaceEditorButtonGroup, { disabledReason: readOnlyReason, workspaceAbsPath: workspaceAbsPath, workspaceIdentity: workspaceIdentity, remoteTarget: remoteTarget, onSelectedEditorChange: onSelectedEditorChange })) : null, activeTaskId &&
                user &&
                isDesktop !== false &&
                !isWebRemoteControl &&
                remoteTarget?.kind !== "server" ? (_jsx(ConversationShareMenu, { taskId: activeTaskId, useWindowsCaptionSpacing: useWindowsCaptionSpacing })) : null, !simplifyForNarrowRemote ? (_jsxs(_Fragment, { children: [!hideHelpMenu ? _jsx(WorkspaceHelpMenuButton, { isDesktop: Boolean(isDesktop) }) : null, _jsx(WorkspaceTerminalToggleButton, { isTerminalOpen: isTerminalOpen, onToggleTerminal: onToggleTerminal, disabledReason: readOnlyReason, useWindowsCaptionSpacing: useWindowsCaptionSpacing })] })) : null, !isSidePaneOpen ? (_jsx(WorkspaceSidePaneToggleButton, { isSidePaneOpen: isSidePaneOpen, onToggleSidePane: onToggleSidePane, shortcutLabel: toggleSidePaneShortcutLabel, useWindowsCaptionSpacing: useWindowsCaptionSpacing })) : null, showWindowControls && !isSidePaneOpen ? _jsx(DesktopWindowControls, {}) : null] }));
}
//# sourceMappingURL=WorkspaceHeaderActionSection.js.map