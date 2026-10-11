import { jsx as _jsx } from "react/jsx-runtime";
import { memo, useMemo } from "react";
import { SessionPane } from "../v4/SessionPane.js";
import { V4PaneConversationProvider } from "../v4/V4ConversationContext.js";
export const SubagentSessionSidePane = memo(function SubagentSessionSidePane({ tab, focused, compactForRemoteControl = false, onOpenBrowserUrl, onOpenCodeViewer, onOpenFileLink, onOpenSubagentSession, onOpenBackgroundBash, }) {
    const scope = useMemo(() => ({
        workspacePath: tab.workspacePath,
        ...(tab.workspaceIdentity ? { workspaceIdentity: tab.workspaceIdentity } : {}),
        ...(tab.remoteSessionId ? { remoteSessionId: tab.remoteSessionId } : {}),
    }), [tab.remoteSessionId, tab.workspaceIdentity, tab.workspacePath]);
    return (_jsx(V4PaneConversationProvider, { scope: scope, children: _jsx(SessionPane, { paneId: tab.id, sessionId: tab.childSessionId, openTrigger: "subagent", rootSessionId: tab.rootSessionId, readOnly: true, allowWorkspaceFileRewind: true, compactForRemoteControl: compactForRemoteControl, focused: focused, telemetryVisible: focused, workspacePath: tab.workspacePath, workspaceIdentity: tab.workspaceIdentity, remoteSessionId: tab.remoteSessionId, onOpenBrowserUrl: onOpenBrowserUrl, onOpenCodeViewer: onOpenCodeViewer, onOpenFileLink: onOpenFileLink, onOpenSubagentSession: onOpenSubagentSession, onOpenBackgroundBash: onOpenBackgroundBash }) }));
});
//# sourceMappingURL=SubagentSessionSidePane.js.map