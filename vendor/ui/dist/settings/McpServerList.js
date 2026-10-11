import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { TID_MCP_OPEN_AUTHORIZATION_BUTTON, TID_MCP_SERVER_ROW, testId, } from "@zcode/shared";
import { Button } from "@/components/ui/button.js";
import { Switch } from "@/components/ui/switch.js";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
import { ControlHintTooltip } from "@/ControlHintTooltip.js";
import { settingsResourceRowInteraction } from "@/settings/settingsResourceRowInteraction.js";
import { SettingsScopeBadge } from "@/settings/SettingsScopeBadge.js";
import { McpFailurePresentation, resolveMcpFailureMessageId, } from "@/settings/McpFailurePresentation.js";
import { SettingsResourceList } from "@/settings/SettingsResourceGroup.js";
import { runUserAction } from "@/lib/userActionTelemetry.js";
import { CircleIcon, Cable, Loader2Icon, ExternalLink, Plus } from "lucide-react";
export function McpStatusDot({ status, attention = false, disabled = false, reason, }) {
    const color = disabled
        ? "text-foreground-subtlest"
        : status === "connected"
            ? "text-green-500"
            : status === "connecting"
                ? "text-yellow-500"
                : status === "error"
                    ? "text-red-500"
                    : attention
                        ? "text-yellow-500"
                        : "text-foreground-subtlest";
    const icon = !disabled && status === "connecting" ? (_jsx(Loader2Icon, { className: `size-3 shrink-0 animate-spin ${color}`, "aria-hidden": "true" })) : (_jsx(CircleIcon, { className: `size-2.5 shrink-0 fill-current ${color}`, "aria-hidden": "true" }));
    return (_jsx(ControlHintTooltip, { title: reason, className: "max-w-64", children: _jsx("span", { className: "inline-flex cursor-help items-center", children: icon }) }));
}
function ScopeBadge({ scope }) {
    const normalizedScope = scope === "workspace" ? "workspace" : "user";
    return _jsx(SettingsScopeBadge, { scope: normalizedScope, includeMcpTestAttribute: true });
}
function McpServerItem({ server, onEdit, onToggle, onOpenAuthorization, hideMetadata, }) {
    const { intl } = useZCodeIntl();
    const typeLabel = server.config.command
        ? "stdio"
        : (server.config.type ?? (server.config.url ? "http" : "?"));
    const canEdit = !server.location || server.location.source === "zcode";
    const canOpenAuthorization = Boolean(server.authorization?.authorizationUrl);
    const openAuthorizationLabel = intl.formatMessage({
        id: "settings.mcp.oauth.openAuthorization",
    });
    const statusReason = intl.formatMessage({
        id: server.status === "error"
            ? resolveMcpFailureMessageId(server.failureKind)
            : server.status === "connected"
                ? "settings.mcp.status.connectedReason"
                : server.status === "connecting"
                    ? "settings.mcp.status.connectingReason"
                    : server.status === "disconnected"
                        ? "settings.mcp.status.disconnectedReason"
                        : "settings.mcp.status.unknownReason",
    });
    const description = server.config.url
        ? `${typeLabel} · ${server.config.url}`
        : server.config.command
            ? `${typeLabel} · ${server.config.command} ${(server.config.args ?? []).join(" ")}`
            : typeLabel;
    return (_jsxs("div", { className: `grid cursor-default grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 transition-colors ${canEdit ? "hover:bg-hover" : ""}`, ...settingsResourceRowInteraction(canEdit ? () => onEdit(server) : undefined), "data-mcp-status": server.status ?? "", "data-mcp-tool-count": server.toolCount, "data-testid": testId(TID_MCP_SERVER_ROW, server.name), children: [_jsxs("div", { className: "relative flex size-9 shrink-0 items-center justify-center rounded-xl bg-background text-foreground-subtle", "data-mcp-status-dot-placement": "icon-corner", children: [_jsx(Cable, { className: "size-4", "aria-hidden": "true" }), _jsx("span", { className: "absolute -right-1 -bottom-1 flex size-4 items-center justify-center rounded-full bg-background", children: _jsx(McpStatusDot, { status: server.status, reason: statusReason }) })] }), _jsxs("div", { className: "min-w-0", children: [_jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [_jsx("span", { className: "truncate text-ui-base font-medium text-foreground", children: server.name }), !hideMetadata ? _jsx(ScopeBadge, { scope: server.scope }) : null, !hideMetadata && typeof server.toolCount === "number" && (_jsx("span", { className: "inline-flex rounded-md bg-surface px-1.5 py-0.5 text-ui-sm text-foreground-subtle ring-1 ring-border", children: intl.formatMessage({ id: "settings.mcp.status.toolCount" }, { count: String(server.toolCount) }) }))] }), _jsx("div", { className: "mt-1 truncate text-ui-sm text-foreground-subtle", children: description }), server.status === "error" ? (_jsx(McpFailurePresentation, { error: server.error, failureKind: server.failureKind })) : null] }), _jsxs("div", { className: "flex shrink-0 items-center gap-2", children: [canOpenAuthorization && (_jsxs(Button, { variant: "link", size: "sm", className: "text-sky-500 hover:text-sky-600 dark:text-sky-400 dark:hover:text-sky-300", "aria-label": openAuthorizationLabel, "data-testid": testId(TID_MCP_OPEN_AUTHORIZATION_BUTTON, server.name), title: openAuthorizationLabel, onClick: () => runUserAction({
                            input: { featureId: "extension.mcp", action: "authorize", trigger: "button" },
                            operation: () => onOpenAuthorization?.(server),
                            completed: { resultSource: "platform_result" },
                            failureStage: "mcp_authorize",
                        }), children: [_jsx(ExternalLink, { className: "size-4", "aria-hidden": "true" }), _jsx("span", { className: "hidden sm:inline", children: openAuthorizationLabel })] })), _jsx(Switch, { checked: server.enabled, onCheckedChange: (v) => onToggle(server.id, v) })] })] }));
}
export function McpServerList({ servers, onCreate, onEdit, onToggle, onOpenAuthorization, emptyTitle, emptyDescription, hideMetadata = false, }) {
    const { intl } = useZCodeIntl();
    if (servers.length === 0) {
        return (_jsx("div", { className: "overflow-hidden rounded-xl border border-dashed border-border", children: _jsxs("div", { className: "flex flex-col items-center justify-center gap-3 px-4 py-10 text-center", children: [_jsxs("div", { className: "space-y-1", children: [_jsx("div", { className: "text-ui-base font-medium text-foreground", children: emptyTitle }), _jsx("div", { className: "text-ui-base text-foreground-subtle", children: emptyDescription })] }), _jsxs(Button, { variant: "outline", size: "sm", onClick: onCreate, children: [_jsx(Plus, { className: "size-4" }), _jsx("span", { children: intl.formatMessage({ id: "settings.mcp.create.open" }) })] })] }) }));
    }
    return (_jsx(SettingsResourceList, { items: servers, getKey: (server) => server.id, renderItem: (server) => (_jsx(McpServerItem, { server: server, onEdit: onEdit, onToggle: onToggle, onOpenAuthorization: onOpenAuthorization, hideMetadata: hideMetadata })) }));
}
//# sourceMappingURL=McpServerList.js.map