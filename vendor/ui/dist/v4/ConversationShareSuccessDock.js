import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CheckCircle2, Copy, ExternalLink, X } from "lucide-react";
import { Button } from "@/components/ui/button.js";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
import { formatConversationShareAllowedArtifacts, formatConversationShareArtifactType, resolveConversationShareWarningMessageId, } from "@/lib/conversationShareError.js";
function formatValue(value, code) {
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
}
export function ConversationShareSuccessDock({ title, warnings = null, onOpen, onCopy, onDismiss, }) {
    const { intl, locale } = useZCodeIntl();
    return (_jsxs("section", { "data-conversation-share-keep-open": "success-dock", "data-testid": "conversation-share-success-dock", className: "w-full overflow-hidden rounded-2xl border border-input-border bg-input text-foreground", children: [_jsxs("div", { className: "flex items-start justify-between gap-3 p-3 pb-2", children: [_jsxs("div", { "data-testid": "conversation-share-success-status", role: "status", "aria-live": "polite", className: "flex min-w-0 items-start gap-2", children: [_jsx(CheckCircle2, { className: "mt-0.5 size-4 shrink-0 text-success", "aria-hidden": "true" }), _jsxs("div", { className: "min-w-0", children: [_jsx("p", { className: "text-ui-base font-medium text-foreground", children: intl.formatMessage({ id: "conversationShare.result.title" }) }), _jsx("p", { className: "mt-1 text-ui-sm leading-4 text-foreground-subtle", children: intl.formatMessage({ id: "conversationShare.result.description" }) })] })] }), _jsx("button", { type: "button", "data-testid": "conversation-share-success-dismiss", "aria-label": intl.formatMessage({ id: "conversationShare.result.dismiss" }), onClick: onDismiss, className: "flex size-7 shrink-0 items-center justify-center rounded-lg text-foreground-subtle outline-none transition-colors hover:bg-hover hover:text-foreground focus-visible:ring-2 focus-visible:ring-input-border-focused", children: _jsx(X, { className: "size-4", "aria-hidden": "true" }) })] }), _jsxs("div", { className: "grid gap-1 px-4 pb-3", children: [_jsx("span", { className: "text-ui-sm text-foreground-subtle", children: intl.formatMessage({ id: "conversationShare.shareTitle" }) }), _jsx("p", { "data-testid": "conversation-share-result-title", className: "min-w-0 truncate text-ui-base text-foreground", title: title, children: title })] }), warnings && warnings.issues.length > 0 ? (_jsxs("details", { "data-testid": "conversation-share-success-warning", className: "mx-4 mb-3 rounded-lg border border-warning/30 bg-warning/5 px-3 py-2 text-foreground", children: [_jsx("summary", { className: "cursor-pointer text-ui-sm font-medium text-warning", children: intl.formatMessage({ id: "conversationShare.warning.summary" }, { count: warnings.issueCount }) }), _jsx("ul", { className: "mt-2 grid gap-1.5 text-ui-sm leading-4", children: warnings.issues.map((issue, index) => (_jsx("li", { children: intl.formatMessage({ id: resolveConversationShareWarningMessageId(issue) }, {
                                turnOrdinal: issue.turnOrdinal ?? "—",
                                artifactDisplayName: issue.artifactDisplayName ?? "—",
                                artifactType: formatConversationShareArtifactType(issue, locale),
                                extension: issue.extension ?? "—",
                                mimeType: issue.mimeType ?? "—",
                                allowedFormats: formatConversationShareAllowedArtifacts(issue, locale),
                                actual: formatValue(issue.actual, issue.code),
                                limit: formatValue(issue.limit, issue.code),
                                phase: issue.phase ?? "—",
                            }) }, `${issue.code}-${issue.rowId ?? "global"}-${index}`))) }), warnings.omittedIssueCount ? (_jsx("p", { className: "mt-2 text-ui-xs text-foreground-subtle", children: intl.formatMessage({ id: "conversationShare.issue.more" }, { count: warnings.omittedIssueCount }) })) : null] })) : null, _jsxs("div", { "data-testid": "conversation-share-success-actions", className: "flex flex-wrap justify-end gap-2 border-t border-input-border px-4 pb-3 pt-2.5", children: [_jsxs(Button, { type: "button", size: "lg", variant: "outline", "data-testid": "conversation-share-open-browser", onClick: onOpen, children: [_jsx(ExternalLink, { "aria-hidden": "true" }), intl.formatMessage({ id: "conversationShare.result.openInBrowser" })] }), _jsxs(Button, { type: "button", size: "lg", "data-testid": "conversation-share-copy-link", onClick: onCopy, children: [_jsx(Copy, { "aria-hidden": "true" }), intl.formatMessage({ id: "conversationShare.copyLink" })] })] })] }));
}
//# sourceMappingURL=ConversationShareSuccessDock.js.map