import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { memo, useEffect, useMemo, useState } from "react";
import { BanIcon, CheckCircle2Icon, CircleAlertIcon, CircleDashedIcon, LoaderCircleIcon, PauseCircleIcon, } from "lucide-react";
import { Button } from "@/components/ui/button.js";
import { useSessionSubagents } from "@/hooks/useSessionSubagents.js";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
import { formatTaskRelativeTime } from "@/lib/taskListItemPresentation.js";
import { V4PaneConversationProvider, useV4Conversation, } from "@/v4/V4ConversationContext.js";
import { useConversationProjection } from "@/v4/useConversationProjection.js";
const EMPTY_RUNNING = [];
export function buildSubagentDirectoryOpenRequest(tab, item) {
    return {
        workspacePath: tab.workspacePath,
        ...(tab.workspaceIdentity ? { workspaceIdentity: tab.workspaceIdentity } : {}),
        ...(tab.remoteSessionId ? { remoteSessionId: tab.remoteSessionId } : {}),
        rootSessionId: tab.rootSessionId,
        parentSessionId: tab.parentSessionId,
        childSessionId: item.childSessionId,
        subagentType: item.subagentType,
        title: item.title,
    };
}
function StatusIcon({ status }) {
    const className = "size-4 shrink-0";
    switch (status) {
        case "running":
            return _jsx(LoaderCircleIcon, { "aria-hidden": true, className: `${className} animate-spin` });
        case "waiting":
        case "blocked":
            return _jsx(PauseCircleIcon, { "aria-hidden": true, className: className });
        case "success":
            return _jsx(CheckCircle2Icon, { "aria-hidden": true, className: className });
        case "failed":
            return _jsx(CircleAlertIcon, { "aria-hidden": true, className: className });
        case "cancelled":
            return _jsx(BanIcon, { "aria-hidden": true, className: className });
        case "lost":
            return _jsx(CircleDashedIcon, { "aria-hidden": true, className: className });
    }
}
const DirectoryRow = memo(function DirectoryRow({ item, onOpen, }) {
    const { intl } = useZCodeIntl();
    const timestamp = "endedAt" in item ? item.endedAt : item.startedAt;
    return (_jsxs("button", { type: "button", className: "flex w-full min-w-0 items-start gap-3 rounded-lg px-3 py-2.5 text-left text-ui-base transition-colors hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-input-border-focused", onClick: () => onOpen(item), children: [_jsx("span", { className: "mt-0.5 text-foreground-subtle", children: _jsx(StatusIcon, { status: item.status }) }), _jsxs("span", { className: "min-w-0 flex-1", children: [_jsxs("span", { className: "flex min-w-0 items-center gap-2", children: [_jsx("span", { className: "truncate font-medium text-foreground", children: item.title }), _jsx("span", { className: "shrink-0 text-ui-sm text-foreground-subtlest", children: intl.formatMessage({ id: `subagentDirectory.status.${item.status}` }) })] }), item.summary ? (_jsx("span", { className: "mt-0.5 block truncate text-ui-sm text-foreground-subtle", children: item.summary })) : null] }), timestamp ? (_jsx("span", { className: "shrink-0 text-ui-sm text-foreground-subtlest", children: formatTaskRelativeTime(timestamp, intl) })) : null] }));
});
export const SubagentDirectorySidePane = memo(function SubagentDirectorySidePane({ tab, onOpenSubagentSession, }) {
    const scope = useMemo(() => ({
        workspacePath: tab.workspacePath,
        ...(tab.workspaceIdentity ? { workspaceIdentity: tab.workspaceIdentity } : {}),
        ...(tab.remoteSessionId ? { remoteSessionId: tab.remoteSessionId } : {}),
    }), [tab.remoteSessionId, tab.workspaceIdentity, tab.workspacePath]);
    return (_jsx(V4PaneConversationProvider, { scope: scope, children: _jsx(SubagentDirectoryContents, { tab: tab, onOpenSubagentSession: onOpenSubagentSession }) }));
});
const SubagentDirectoryContents = memo(function SubagentDirectoryContents({ tab, onOpenSubagentSession, }) {
    const { intl } = useZCodeIntl();
    const { layer } = useV4Conversation();
    const [lease, setLease] = useState(null);
    const projection = useConversationProjection(lease);
    const subagents = projection.snapshot?.subagents;
    useEffect(() => {
        const nextLease = layer.acquire(tab.parentSessionId);
        setLease(nextLease);
        return () => nextLease.release();
    }, [layer, tab.parentSessionId]);
    const directory = useSessionSubagents({
        enabled: projection.snapshot !== null,
        workspacePath: tab.workspacePath,
        workspaceIdentity: tab.workspaceIdentity,
        remoteSessionId: tab.remoteSessionId,
        sessionId: tab.parentSessionId,
        refreshKey: subagents?.revision ?? 0,
    });
    const running = subagents?.running ?? EMPTY_RUNNING;
    const endedTotal = subagents?.endedTotal ?? 0;
    const handleOpen = (item) => {
        onOpenSubagentSession(buildSubagentDirectoryOpenRequest(tab, item));
    };
    return (_jsxs("div", { className: "flex size-full min-h-0 flex-col bg-background", children: [_jsx("div", { className: "border-b border-border px-4 py-3", children: _jsx("h2", { className: "text-ui-base font-semibold text-foreground", children: intl.formatMessage({ id: "subagentDirectory.title" }) }) }), _jsxs("div", { className: "min-h-0 flex-1 overflow-y-auto px-2 py-3", children: [_jsxs("section", { children: [_jsxs("h3", { className: "px-3 pb-1.5 text-ui-sm font-medium text-foreground-subtlest", children: [intl.formatMessage({ id: "subagentDirectory.running" }), " \u00B7 ", running.length] }), running.length > 0 ? (running.map((item) => (_jsx(DirectoryRow, { item: item, onOpen: handleOpen }, item.childSessionId)))) : (_jsx("p", { className: "px-3 py-3 text-ui-base text-foreground-subtlest", children: intl.formatMessage({ id: "subagentDirectory.runningEmpty" }) }))] }), _jsxs("section", { className: "mt-5", children: [_jsxs("h3", { className: "px-3 pb-1.5 text-ui-sm font-medium text-foreground-subtlest", children: [intl.formatMessage({ id: "subagentDirectory.ended" }), " \u00B7 ", endedTotal] }), directory.ended.items.map((item) => (_jsx(DirectoryRow, { item: item, onOpen: handleOpen }, item.childSessionId))), directory.ended.nextCursor ? (_jsx("div", { className: "px-3 pt-2", children: _jsx(Button, { type: "button", variant: "ghost", size: "sm", disabled: directory.loading, onClick: () => void directory.loadMore(), children: intl.formatMessage({ id: "subagentDirectory.showMore" }) }) })) : null] }), directory.error ? (_jsx("p", { role: "alert", className: "mx-3 mt-4 text-ui-sm text-[var(--color-danger)]", children: intl.formatMessage({ id: "subagentDirectory.loadFailed" }) })) : null] })] }));
});
//# sourceMappingURL=SubagentDirectorySidePane.js.map