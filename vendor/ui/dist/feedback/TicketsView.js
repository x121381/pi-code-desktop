import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useEffect, useRef, useState } from "react";
import { Check, CopyIcon, Inbox, Loader2, PlusCircle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button.js";
import { cn } from "@/components/lib/utils.js";
import { FeedbackErrorTip, StatusIndicator } from "@/feedback/feedbackBadges.js";
import { ScrollFadeViewport } from "@/components/ui/scroll-fade-viewport.js";
import { useFeedbackStore } from "@/feedback/feedbackStore.js";
import { formatRelativeTime } from "@/feedback/feedbackUserView.js";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
import { getErrorMessage } from "@/lib/errorMessage.js";
import { logger } from "@/logger.js";
export function TicketsView({ feedbackService, onCreateNew, }) {
    const selectedTicketId = useFeedbackStore((state) => state.selectedTicketId);
    const { intl } = useZCodeIntl();
    const formatMessage = intl.formatMessage;
    const copiedResetTimerRef = useRef(null);
    const [items, setItems] = useState([]);
    const [loadingList, setLoadingList] = useState(true);
    const [error, setError] = useState(null);
    const [copiedTicketId, setCopiedTicketId] = useState(null);
    const loadList = useCallback(async () => {
        setLoadingList(true);
        setError(null);
        try {
            const result = await feedbackService.list({ mine: true, limit: 50 });
            setItems(result.items);
        }
        catch (loadError) {
            setError(getErrorMessage(loadError));
        }
        finally {
            setLoadingList(false);
        }
    }, [feedbackService]);
    useEffect(() => {
        void loadList();
    }, [loadList]);
    useEffect(() => {
        return () => {
            if (copiedResetTimerRef.current !== null) {
                globalThis.clearTimeout(copiedResetTimerRef.current);
            }
        };
    }, []);
    const handleCopyTicketId = useCallback((ticketId) => {
        if (typeof navigator === "undefined" || !navigator.clipboard?.writeText) {
            logger.warn(formatMessage({ id: "feedback.detail.issueCopyFailed" }), {
                issueId: ticketId,
                reason: "clipboard-unavailable",
            });
            return;
        }
        void navigator.clipboard.writeText(ticketId).then(() => {
            setCopiedTicketId(ticketId);
            if (copiedResetTimerRef.current !== null) {
                globalThis.clearTimeout(copiedResetTimerRef.current);
            }
            copiedResetTimerRef.current = globalThis.setTimeout(() => {
                setCopiedTicketId(null);
                copiedResetTimerRef.current = null;
            }, 1600);
        }, (copyError) => {
            logger.warn(formatMessage({ id: "feedback.detail.issueCopyFailed" }), {
                issueId: ticketId,
                error: copyError instanceof Error ? copyError.message : String(copyError),
            });
        });
    }, [formatMessage]);
    return (_jsxs("div", { className: "flex min-h-0 flex-1 flex-col overflow-hidden bg-popover", children: [loadingList && items.length === 0 ? (_jsx(TicketsInitialLoadingState, {})) : (_jsxs(ScrollFadeViewport, { className: "px-6 pb-4 pt-3", children: [error && items.length === 0 ? (_jsx("div", { className: "pb-2", children: _jsx(FeedbackErrorTip, { message: error }) })) : null, !loadingList && items.length === 0 && !error ? (_jsx(EmptyState, { onCreateNew: onCreateNew })) : null, _jsx(FeedbackTicketList, { items: items, selectedTicketId: selectedTicketId, copiedTicketId: copiedTicketId, onCopyTicketId: handleCopyTicketId }), loadingList && items.length > 0 ? (_jsxs("div", { className: "flex items-center justify-center py-2 text-ui-xs text-foreground-subtle", children: [_jsx(Loader2, { className: "mr-1.5 size-3 animate-spin" }), formatMessage({ id: "common.loading" })] })) : null] })), _jsxs("div", { className: "flex shrink-0 items-center justify-between gap-2 px-6 pb-6 pt-2", children: [_jsx(Button, { type: "button", variant: "ghost", size: "icon-lg", onClick: () => void loadList(), disabled: loadingList, "aria-label": formatMessage({ id: "common.refresh" }), className: "rounded-xl text-foreground-subtle hover:text-foreground", children: loadingList ? (_jsx(Loader2, { className: "size-4 animate-spin" })) : (_jsx(RefreshCcw, { className: "size-4" })) }), _jsxs(Button, { size: "lg", onClick: onCreateNew, className: "rounded-lg", children: [_jsx(PlusCircle, {}), formatMessage({ id: "feedback.tickets.newFeedback" })] })] })] }));
}
export function TicketsInitialLoadingState() {
    const { intl } = useZCodeIntl();
    return (_jsxs("div", { className: "flex min-h-0 flex-1 flex-col items-center justify-center gap-2 px-6 py-8 text-center text-ui-base text-foreground-subtle", children: [_jsx(Loader2, { className: "size-4 animate-spin text-primary" }), _jsx("span", { children: intl.formatMessage({ id: "common.loading" }) })] }));
}
export function FeedbackTicketList({ items, selectedTicketId, copiedTicketId, onCopyTicketId, }) {
    const { intl } = useZCodeIntl();
    const formatMessage = intl.formatMessage;
    if (items.length === 0)
        return null;
    return (_jsxs("div", { className: "overflow-hidden rounded-lg border border-border bg-card", children: [_jsxs("div", { className: "hidden grid-cols-[7.5rem_minmax(0,1fr)_13rem] gap-3 border-b border-border px-3 py-2 text-ui-xs font-medium text-foreground-subtle md:grid", children: [_jsx("span", { children: formatMessage({ id: "feedback.tickets.column.status" }) }), _jsx("span", { children: formatMessage({ id: "feedback.tickets.column.description" }) }), _jsx("span", { children: formatMessage({ id: "feedback.tickets.column.id" }) })] }), _jsx("ul", { className: "divide-y divide-border", children: items.map((item) => {
                    const selected = selectedTicketId === item.id;
                    const copied = copiedTicketId === item.id;
                    const copyLabel = formatMessage({
                        id: copied ? "feedback.detail.issueCopied" : "feedback.detail.issueCopy",
                    });
                    return (_jsxs("li", { className: cn("grid gap-2 px-3 py-2.5 md:grid-cols-[7.5rem_minmax(0,1fr)_13rem] md:items-center md:gap-3", selected ? "bg-card-selected" : "bg-card"), children: [_jsxs("div", { className: "flex min-w-0 items-center justify-between gap-2 md:block", children: [_jsx(StatusIndicator, { status: item.status }), _jsx("span", { className: "shrink-0 text-ui-xs text-foreground-subtle md:hidden", children: formatRelativeTime(item.created_at, formatMessage) })] }), _jsxs("div", { className: "min-w-0", children: [_jsx("div", { className: "line-clamp-2 text-ui-base leading-5 text-foreground md:truncate", children: item.title }), _jsx("div", { className: "mt-1 hidden text-ui-xs text-foreground-subtle md:block", children: formatRelativeTime(item.created_at, formatMessage) })] }), _jsxs("div", { className: "flex min-w-0 items-center gap-1.5", children: [_jsx("span", { className: "shrink-0 text-ui-xs text-foreground-subtle md:hidden", children: formatMessage({ id: "feedback.tickets.issuePrefix" }) }), _jsx("span", { className: "min-w-0 flex-1 truncate font-mono text-ui-xs text-foreground", children: item.id }), _jsx(Button, { type: "button", size: "icon-sm", variant: "ghost", "aria-label": copyLabel, title: copyLabel, onClick: () => onCopyTicketId(item.id), className: "shrink-0 text-foreground-subtle hover:text-foreground", children: copied ? (_jsx(Check, { className: "size-3 text-success" })) : (_jsx(CopyIcon, { className: "size-3" })) })] })] }, item.id));
                }) })] }));
}
function EmptyState({ onCreateNew }) {
    const { intl } = useZCodeIntl();
    const formatMessage = intl.formatMessage;
    return (_jsxs("div", { className: "flex flex-col items-center justify-center gap-2 px-4 pt-12 text-center", children: [_jsx("div", { className: "flex size-9 items-center justify-center rounded-lg border border-border bg-card", children: _jsx(Inbox, { className: "size-4 text-foreground-subtle" }) }), _jsx("div", { className: "text-ui-base font-medium text-foreground", children: formatMessage({ id: "feedback.tickets.empty.title" }) }), _jsx("p", { className: "text-ui-base leading-5 text-foreground-subtle", children: formatMessage({ id: "feedback.tickets.empty.description" }) }), _jsxs(Button, { size: "sm", variant: "outline", onClick: onCreateNew, className: "mt-1 rounded-lg", children: [_jsx(PlusCircle, {}), formatMessage({ id: "feedback.tickets.empty.action" })] })] }));
}
//# sourceMappingURL=TicketsView.js.map