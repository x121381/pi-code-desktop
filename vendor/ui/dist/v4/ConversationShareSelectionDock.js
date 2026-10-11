import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { memo } from "react";
import { AlertCircle, AlertTriangle, Info, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button.js";
import { Checkbox } from "@/components/ui/checkbox.js";
import { Popover, PopoverContent, PopoverTitle, PopoverTrigger } from "@/components/ui/popover.js";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
import { formatConversationShareAllowedArtifacts, formatConversationShareArtifactType, resolveConversationShareIssueMessageId, resolveConversationShareWarningMessageId, } from "@/lib/conversationShareError.js";
// memo 组件的默认对象每次创建会破坏引用稳定性；idle 默认值仅供读取。
const DEFAULT_PREFLIGHT = { status: "idle" };
function ConversationShareSelectionDockImpl({ selectedCount, totalCount, onCancel, onNext, onSelectAll, onDeselectAll, onDeselectTurn, onRetryPreflight, preflight = DEFAULT_PREFLIGHT, pending = false, }) {
    const { intl, locale } = useZCodeIntl();
    const selectAllState = selectedCount === 0 ? false : selectedCount === totalCount ? true : "indeterminate";
    const bulkActionMessageId = totalCount > 0 && selectedCount === totalCount
        ? "conversationShare.partial.deselectAll"
        : "conversationShare.partial.selectAll";
    const blockingIssues = "blockingIssues" in preflight ? preflight.blockingIssues : [];
    const skippableWarnings = "skippableWarnings" in preflight ? preflight.skippableWarnings : [];
    const deferredIssues = "deferredIssues" in preflight ? preflight.deferredIssues : [];
    const checking = preflight.status === "checking" ||
        preflight.status === "stale" ||
        (preflight.status === "idle" && selectedCount > 0);
    const statusCount = blockingIssues.length || skippableWarnings.length || deferredIssues.length;
    const statusLabel = checking
        ? intl.formatMessage({ id: "conversationShare.partial.preflightChecking" })
        : blockingIssues.length > 0
            ? intl.formatMessage({ id: "conversationShare.partial.preflightBlocked" })
            : skippableWarnings.length > 0
                ? intl.formatMessage({ id: "conversationShare.partial.preflightSkipped" }, { count: skippableWarnings.length })
                : deferredIssues.length > 0
                    ? intl.formatMessage({ id: "conversationShare.partial.preflightDeferred" })
                    : "";
    const formatValue = (value, code) => {
        if (value === undefined)
            return "—";
        if (code.includes("size") || code === "payload_size_limit") {
            if (value >= 1024 * 1024)
                return `${(value / (1024 * 1024)).toFixed(1)} MB`;
            if (value >= 1024)
                return `${Math.round(value / 1024)} KB`;
            return `${value} B`;
        }
        return String(value);
    };
    const formatIssueValues = (issue) => ({
        turnOrdinal: issue.turnOrdinal ?? "—",
        artifactDisplayName: issue.artifactDisplayName ?? "—",
        artifactType: formatConversationShareArtifactType(issue, locale),
        extension: issue.extension ?? "—",
        mimeType: issue.mimeType ?? "—",
        allowedFormats: formatConversationShareAllowedArtifacts(issue, locale),
        actual: formatValue(issue.actual, issue.code),
        limit: formatValue(issue.limit, issue.code),
        phase: issue.phase ?? "—",
    });
    return (_jsxs("section", { "data-conversation-share-keep-open": "selection-dock", "data-testid": "conversation-share-selection-dock", className: "w-full overflow-hidden rounded-2xl border border-input-border bg-input text-foreground", children: [_jsx("p", { "data-testid": "conversation-share-selection-stage-hint", className: "p-3.5 text-ui-base font-medium leading-5", children: intl.formatMessage({ id: "conversationShare.partial.selectionStageHint" }) }), _jsxs("div", { "data-testid": "conversation-share-selection-actions", className: "flex flex-wrap content-center items-center justify-between gap-3 px-3 pb-3", children: [_jsxs("div", { "data-testid": "conversation-share-bulk-actions", className: "flex h-8 shrink-0 items-center gap-3", children: [_jsxs("div", { "data-testid": "conversation-share-bulk-toggle", className: "flex items-center gap-1", children: [_jsx("div", { "data-testid": "conversation-share-bulk-checkbox-slot", className: "flex size-5 shrink-0 items-center justify-center", children: _jsx(Checkbox, { "aria-label": intl.formatMessage({ id: bulkActionMessageId }), checked: selectAllState, disabled: pending || checking || totalCount === 0, checkIconStrokeWidth: 1.33, onCheckedChange: (checked) => {
                                                if (checked === true)
                                                    onSelectAll();
                                                else if (checked === false)
                                                    onDeselectAll();
                                            }, className: "size-3.5 rounded-sm [&_[data-slot=checkbox-checked-icon]]:size-2.5 [&_[data-slot=checkbox-indeterminate-icon]]:size-2.5" }) }), _jsx("span", { "data-testid": "conversation-share-bulk-label", className: "shrink-0 whitespace-nowrap text-ui-sm leading-4", children: intl.formatMessage({ id: bulkActionMessageId }) })] }), _jsx("p", { role: "status", className: "shrink-0 text-ui-sm leading-4 tabular-nums", children: intl.formatMessage({ id: "conversationShare.partial.selectionCount" }, { selected: selectedCount, total: totalCount }) }), _jsx("span", { className: "flex size-5 shrink-0 items-center justify-center", children: statusCount > 0 || checking ? (_jsxs(Popover, { children: [_jsx(PopoverTrigger, { asChild: true, children: _jsxs("button", { type: "button", "data-testid": "conversation-share-selection-preflight-status", "aria-label": statusLabel, title: statusLabel, "aria-busy": checking, className: "flex size-5 items-center justify-center rounded-md text-foreground-subtle outline-none focus-visible:ring-2 focus-visible:ring-input-border-focused", children: [checking ? (_jsx(LoaderCircle, { className: "size-4 animate-spin", "aria-hidden": "true" })) : blockingIssues.length > 0 ? (_jsx(AlertCircle, { className: "size-4 text-destructive", "aria-hidden": "true" })) : skippableWarnings.length > 0 ? (_jsx(AlertTriangle, { className: "size-4 text-warning", "aria-hidden": "true" })) : (_jsx(Info, { className: "size-4", "aria-hidden": "true" })), _jsx("span", { className: "sr-only", children: statusLabel })] }) }), _jsxs(PopoverContent, { side: "top", align: "start", collisionPadding: 12, "data-testid": "conversation-share-selection-preflight-popover", className: "w-96 max-w-[calc(100vw-1.5rem)] gap-2 p-3", children: [_jsx(PopoverTitle, { className: "text-ui-sm font-medium", children: statusLabel }), !checking ? (_jsx("ul", { className: "grid max-h-56 gap-2 overflow-y-auto text-ui-sm", children: [...blockingIssues, ...skippableWarnings, ...deferredIssues]
                                                        .slice(0, 5)
                                                        .map((issue, index) => (_jsxs("li", { className: "grid gap-1", children: [_jsx("span", { children: intl.formatMessage({
                                                                    id: blockingIssues.includes(issue)
                                                                        ? resolveConversationShareIssueMessageId(issue)
                                                                        : resolveConversationShareWarningMessageId(issue),
                                                                }, formatIssueValues(issue)) }), blockingIssues.includes(issue) &&
                                                                issue.productTurnId !== undefined &&
                                                                onDeselectTurn ? (_jsx("button", { type: "button", className: "w-fit text-ui-xs font-medium text-foreground underline underline-offset-2", onClick: () => onDeselectTurn(issue.productTurnId), children: intl.formatMessage({ id: "conversationShare.issue.deselectTurn" }) })) : null, blockingIssues.includes(issue) &&
                                                                issue.scope === "transport" &&
                                                                onRetryPreflight ? (_jsx("button", { type: "button", "data-testid": "conversation-share-preflight-retry", className: "w-fit text-ui-xs font-medium text-foreground underline underline-offset-2", onClick: onRetryPreflight, children: intl.formatMessage({
                                                                    id: "conversationShare.issue.retryPreflight",
                                                                }) })) : null] }, `${issue.code}-${issue.rowId ?? "global"}-${index}`))) })) : null] })] })) : null })] }), _jsxs("div", { className: "ml-auto flex shrink-0 items-center justify-end gap-3", children: [_jsx(Button, { type: "button", variant: "outline", size: "lg", disabled: pending, onClick: onCancel, className: "px-3", children: intl.formatMessage({ id: "conversationShare.partial.cancel" }) }), _jsx(Button, { type: "button", size: "lg", disabled: pending || checking || blockingIssues.length > 0 || selectedCount === 0, onClick: onNext, "data-testid": "conversation-share-next", className: "px-3", children: intl.formatMessage({ id: "conversationShare.partial.next" }) })] })] })] }));
}
export const ConversationShareSelectionDock = memo(ConversationShareSelectionDockImpl);
//# sourceMappingURL=ConversationShareSelectionDock.js.map