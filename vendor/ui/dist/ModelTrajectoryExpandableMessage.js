import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ArrowRightIcon, ChevronRightIcon, CircleAlertIcon, CopyIcon } from "lucide-react";
import { useContext, useState } from "react";
import { Badge } from "./components/ui/badge.js";
import { Button } from "./components/ui/button.js";
import { cn } from "./components/lib/utils.js";
import { Collapsible, CollapsibleContent, CollapsibleTrigger, } from "./components/ui/collapsible.js";
import { logger } from "./logger.js";
import { TrajectoryExpansionCommandContext, TrajectoryExpansionRegistryContext, } from "./ModelTrajectoryExpansion.js";
import { TrajectoryExpandedContent } from "./ModelTrajectoryExpandedContent.js";
import { TrajectorySearchRevealContext } from "./ModelTrajectorySearch.js";
import { trajectoryRoleTextClass } from "./ModelTrajectoryRoleStyles.js";
import { trajectoryToolHasError, trajectoryToolMetadata, trajectoryToolOutputs, trajectoryToolPayloadErrorText, } from "./ModelTrajectoryToolPayload.js";
export function ExpandableTrajectoryMessage({ message, role, visualRole, roleLabel, callDurationLabel, callDatetimeLabel, callDatetimeTitle, isAlt = false, intl, expansionKey, }) {
    const expansionCommands = useContext(TrajectoryExpansionCommandContext);
    const expansionRegistry = useContext(TrajectoryExpansionRegistryContext);
    const searchRevealKey = useContext(TrajectorySearchRevealContext);
    const [localExpansion, setLocalExpansion] = useState({ open: true, commandVersion: 0 });
    const copyLabel = intl.formatMessage({ id: "chat.message.copy" });
    const copyText = messageClipboardText(message);
    const toolResultMeta = trajectoryToolMetadata(message);
    const toolPayloadHasError = trajectoryToolHasError(message);
    const payloadDirection = message.parts.some((part) => part.kind === "tool-result")
        ? intl.formatMessage({ id: "modelTrajectory.toolOutput" })
        : message.parts.some((part) => part.kind === "tool-call")
            ? intl.formatMessage({ id: "modelTrajectory.toolInput" })
            : null;
    const resolvedVisualRole = visualRole ??
        (message.parts.some((part) => part.kind === "tool-result")
            ? "tool-result"
            : message.parts.some((part) => part.kind === "tool-call")
                ? "tool-call"
                : role === "tool"
                    ? "tool-result"
                    : role);
    const expansionCommand = expansionCommands?.[resolvedVisualRole];
    const persistedExpansion = expansionKey
        ? expansionRegistry?.overrides.get(expansionKey)
        : undefined;
    const rowExpansion = persistedExpansion ?? localExpansion;
    const userOpen = expansionCommand && expansionCommand.version > rowExpansion.commandVersion
        ? expansionCommand.expanded
        : rowExpansion.open;
    const searchRevealed = Boolean(expansionKey && expansionKey === searchRevealKey);
    const open = userOpen || searchRevealed;
    const handleCopy = () => {
        if (!copyText || typeof navigator === "undefined" || !navigator.clipboard?.writeText)
            return;
        void navigator.clipboard.writeText(copyText).catch((error) => {
            logger.warn("[ModelTrajectory] copy expanded content failed", error);
        });
    };
    const handleOpenChange = (nextOpen) => {
        const override = {
            open: nextOpen,
            commandVersion: expansionCommand?.version ?? rowExpansion.commandVersion,
        };
        if (expansionKey && expansionRegistry) {
            expansionRegistry.setOverride(expansionKey, override);
        }
        else {
            setLocalExpansion(override);
        }
    };
    return (_jsxs(Collapsible, { open: open, onOpenChange: handleOpenChange, "data-trajectory-message-role": role, "data-trajectory-message-collapsible": "", "data-trajectory-expandable-role": resolvedVisualRole, "data-trajectory-search-target-key": expansionKey, "data-trajectory-row-alt": isAlt || undefined, "data-trajectory-user-container": role === "user" ? "" : undefined, className: cn("group relative col-span-full grid w-full min-w-0 grid-cols-subgrid", isAlt && "bg-surface/30"), children: [_jsxs("div", { "data-trajectory-user-summary-card": "", className: "col-span-full grid min-h-8 w-full min-w-0 grid-cols-subgrid items-center", children: [_jsxs(CollapsibleTrigger, { "data-trajectory-message-trigger": "", className: "col-span-2 grid min-h-8 min-w-0 grid-cols-subgrid items-center py-0 pl-3 text-left text-ui-sm text-foreground-subtle", children: [_jsx("span", { "data-trajectory-role-label": resolvedVisualRole, className: cn("pr-1 font-mono text-ui-sm uppercase", trajectoryRoleTextClass(resolvedVisualRole)), children: roleLabel }), _jsxs("span", { className: "flex min-w-0 items-center", children: [payloadDirection ? (toolPayloadHasError ? (_jsx(CircleAlertIcon, { "data-trajectory-payload-error-icon": "", "aria-hidden": "true", className: "mr-1 size-3.5 shrink-0 text-destructive" })) : null) : null, payloadDirection ? (_jsx("span", { "data-trajectory-payload-direction": "", className: cn("mr-2 shrink-0 font-mono text-ui-sm uppercase", toolPayloadHasError ? "text-destructive" : "text-foreground"), children: payloadDirection })) : null, payloadDirection ? (_jsx(ArrowRightIcon, { "data-trajectory-payload-arrow": "", className: "mr-2 size-3 shrink-0 text-foreground-subtlest group-data-[state=open]:hidden" })) : null, _jsx("span", { "data-trajectory-message-preview": "", "data-trajectory-search-field": "content", className: "min-w-0 flex-1 truncate font-mono group-data-[state=open]:hidden", children: messagePreview(message, role) }), toolResultMeta.names ? (_jsx(Badge, { "data-trajectory-tool-result-name": "", "data-trajectory-search-field": "tool-name", variant: "outline", className: "ml-1.5 h-5 rounded-full border-border bg-tag px-2 font-mono text-ui-xs text-foreground-subtle group-data-[state=open]:hidden", title: toolResultMeta.names, children: toolResultMeta.names })) : null, toolResultMeta.ids ? (_jsx(Badge, { "data-trajectory-tool-result-id": "", "data-trajectory-search-field": "tool-id", variant: "outline", className: "ml-1 h-5 max-w-[40%] truncate rounded-full border-border bg-tag px-2 font-mono text-ui-xs text-foreground-subtle group-data-[state=open]:hidden", title: toolResultMeta.ids, children: toolResultMeta.ids })) : null, _jsxs("span", { "data-trajectory-call-metadata": "", "data-trajectory-user-call-metadata": role === "user" ? "" : undefined, className: "ml-auto mr-7 hidden min-w-0 items-center gap-1 font-mono text-ui-xs text-foreground-subtlest group-data-[state=open]:flex", children: [_jsx("span", { children: callDurationLabel }), _jsx("span", { "aria-hidden": "true", children: "\u00B7" }), _jsx("span", { "data-trajectory-call-datetime": "", "data-trajectory-user-call-datetime": role === "user" ? "" : undefined, className: "truncate", title: callDatetimeTitle, children: callDatetimeLabel })] })] }), _jsx("span", { className: "sr-only group-data-[state=open]:hidden", children: intl.formatMessage({ id: "modelTrajectory.expand" }) }), _jsx("span", { className: "sr-only hidden group-data-[state=open]:inline", children: intl.formatMessage({ id: "modelTrajectory.collapse" }) })] }), _jsxs("span", { "data-trajectory-message-actions": "", className: "relative -ml-1 mr-1 flex items-center justify-end", children: [_jsx(Button, { "data-trajectory-message-copy": "", "data-trajectory-user-copy": role === "user" ? "" : undefined, type: "button", variant: "ghost", size: "icon-sm", className: "absolute right-full mr-1 hidden text-foreground-subtlest group-data-[state=open]:inline-flex", "aria-label": copyLabel, title: copyLabel, disabled: !copyText, onClick: handleCopy, children: _jsx(CopyIcon, { className: "size-3" }) }), _jsx(CollapsibleTrigger, { asChild: true, children: _jsxs(Button, { "data-trajectory-message-chevron-trigger": "", "data-trajectory-user-chevron-trigger": role === "user" ? "" : undefined, type: "button", variant: "ghost", size: "icon-sm", className: "size-5 rounded-sm text-foreground-subtlest", children: [_jsx(ChevronRightIcon, { "data-trajectory-message-chevron": "", "data-trajectory-user-chevron": role === "user" ? "" : undefined, className: "size-3 transition-transform group-data-[state=open]:rotate-90" }), _jsx("span", { className: "sr-only group-data-[state=open]:hidden", children: intl.formatMessage({ id: "modelTrajectory.expand" }) }), _jsx("span", { className: "sr-only hidden group-data-[state=open]:inline", children: intl.formatMessage({ id: "modelTrajectory.collapse" }) })] }) })] })] }), _jsx(CollapsibleContent, { "data-trajectory-message-expanded": "", className: "col-span-full", children: _jsx(TrajectoryExpandedContent, { message: message, role: role, open: open, searchRevealed: searchRevealed, intl: intl }) })] }));
}
function messagePreview(message, role) {
    if (role === "tool" && message.parts.some((part) => part.kind === "tool-result")) {
        return trajectoryToolOutputs(message).join(" ").replaceAll(/\s+/g, " ").trim() || "—";
    }
    const toolCallNames = message.parts.flatMap((part) => part.kind === "tool-call" ? [part.toolName] : []);
    if (toolCallNames.length > 0) {
        return message.parts
            .flatMap((part) => (part.kind === "tool-call" ? [compactPreviewValue(part.input)] : []))
            .join(", ");
    }
    if (role === "user" || role === "assistant")
        return compactTextPreview(message);
    return firstLinePreview(message);
}
function compactTextPreview(message) {
    const text = message.parts
        .flatMap((part) => ("text" in part && typeof part.text === "string" ? [part.text] : []))
        .join(" ")
        .replaceAll(/\s+/g, " ")
        .trim();
    return text || "—";
}
function compactPreviewValue(value) {
    if (typeof value === "string")
        return value.replaceAll(/\s+/g, " ").trim() || "—";
    const errorText = trajectoryToolPayloadErrorText(value);
    if (errorText !== undefined)
        return errorText.replaceAll(/\s+/g, " ").trim() || "—";
    if (value === undefined)
        return "—";
    try {
        return JSON.stringify(value) ?? String(value);
    }
    catch {
        return String(value);
    }
}
function firstLinePreview(message) {
    for (const part of message.parts) {
        if ("text" in part && typeof part.text === "string") {
            const firstLine = part.text
                .split(/\r?\n/)
                .map((line) => line.trim())
                .find(Boolean);
            if (firstLine)
                return firstLine;
        }
    }
    return "—";
}
function messageClipboardText(message) {
    if (message.role === "tool")
        return trajectoryToolOutputs(message).join("\n\n");
    return message.parts
        .map((part) => {
        if ("text" in part && typeof part.text === "string")
            return part.text;
        return JSON.stringify(part, null, 2);
    })
        .filter(Boolean)
        .join("\n\n");
}
//# sourceMappingURL=ModelTrajectoryExpandableMessage.js.map