import { jsx as _jsx } from "react/jsx-runtime";
import { memo, useEffect, useMemo, useState } from "react";
import { MessageResponse } from "../components/ai-elements/message.js";
import { DEFAULT_CODE_PREVIEW_SETTINGS } from "../lib/codePreviewSettings.js";
import { extractPlanToolCallContent } from "../lib/planToolCall.js";
import { useZCodeStoreWithDefault } from "../store/StoreProvider.js";
import { toolCallRowToLegacyNode } from "../v4/toolCallRowAdapter.js";
import { useConversationProjection } from "../v4/useConversationProjection.js";
import { useV4Conversation, V4PaneConversationProvider } from "../v4/V4ConversationContext.js";
const PlanDetailContent = memo(function PlanDetailContent({ tab, onOpenBrowserUrl, onOpenCodeViewer, onOpenFileLink, }) {
    const { layer } = useV4Conversation();
    const [lease, setLease] = useState(null);
    const [lastMarkdown, setLastMarkdown] = useState(tab.markdown);
    const theme = useZCodeStoreWithDefault((state) => state.theme, "system");
    const codePreviewSettings = useZCodeStoreWithDefault((state) => state.codePreviewSettings, DEFAULT_CODE_PREVIEW_SETTINGS);
    useEffect(() => {
        const nextLease = layer.acquire(tab.parentSessionId);
        setLease(nextLease);
        return () => nextLease.release();
    }, [layer, tab.parentSessionId]);
    const state = useConversationProjection(lease);
    const liveMarkdown = useMemo(() => {
        const row = state.snapshot?.rows.window.find((candidate) => candidate.kind === "toolCall" && candidate.toolCallId === tab.toolCallId);
        if (!row || row.kind !== "toolCall")
            return undefined;
        const node = toolCallRowToLegacyNode(row);
        return extractPlanToolCallContent(node.toolCall, tab.workspacePath).markdown;
    }, [state.snapshot, tab.toolCallId, tab.workspacePath]);
    useEffect(() => {
        if (liveMarkdown)
            setLastMarkdown(liveMarkdown);
    }, [liveMarkdown]);
    useEffect(() => {
        if (tab.markdown)
            setLastMarkdown(tab.markdown);
    }, [tab.markdown]);
    const markdown = liveMarkdown ?? lastMarkdown;
    return (_jsx("div", { "data-plan-detail-tool-call-id": tab.toolCallId, className: "h-full min-h-0 overflow-y-auto bg-background px-4 py-4", children: _jsx(MessageResponse, { className: "mx-auto w-full max-w-4xl min-w-0 break-words text-foreground", workspacePath: tab.workspacePath, theme: theme, codePreviewSettings: codePreviewSettings, onOpenCodeViewer: onOpenCodeViewer, onOpenFileLink: onOpenFileLink, onOpenExternalUrl: onOpenBrowserUrl, children: markdown }) }));
});
export const PlanDetailSidePane = memo(function PlanDetailSidePane({ tab, onOpenBrowserUrl, onOpenCodeViewer, onOpenFileLink, }) {
    const scope = useMemo(() => ({
        workspacePath: tab.workspacePath,
        ...(tab.workspaceIdentity ? { workspaceIdentity: tab.workspaceIdentity } : {}),
        ...(tab.remoteSessionId ? { remoteSessionId: tab.remoteSessionId } : {}),
    }), [tab.remoteSessionId, tab.workspaceIdentity, tab.workspacePath]);
    return (_jsx(V4PaneConversationProvider, { scope: scope, children: _jsx(PlanDetailContent, { tab: tab, onOpenBrowserUrl: onOpenBrowserUrl, onOpenCodeViewer: onOpenCodeViewer, onOpenFileLink: onOpenFileLink }) }));
});
//# sourceMappingURL=PlanDetailSidePane.js.map