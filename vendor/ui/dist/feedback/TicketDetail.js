import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronRight, Clock, CopyIcon, ListChecks } from "lucide-react";
import { Button } from "@/components/ui/button.js";
import { StatusIndicator } from "@/feedback/feedbackBadges.js";
import { FeedbackProgress } from "@/feedback/feedbackProgress.js";
import { FeedbackSupplementComposer } from "@/feedback/FeedbackSupplementComposer.js";
import { getFeedbackTimelineItems } from "@/feedback/feedbackTimeline.js";
import { formatRelativeTime, formatFeedbackStatusHint, formatSubmittedAt, getUserFacingDescription, } from "@/feedback/feedbackUserView.js";
import { cn } from "@/components/lib/utils.js";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
import { logger } from "@/logger.js";
export function TicketDetailView({ ticket, feedbackService, onRefresh, onOpenProcess, }) {
    const { intl } = useZCodeIntl();
    const formatMessage = intl.formatMessage;
    const copiedResetTimerRef = useRef(null);
    const [copiedIssueId, setCopiedIssueId] = useState(null);
    const issueIdCopied = copiedIssueId === ticket.id;
    const userDescription = useMemo(() => getUserFacingDescription(ticket.description), [ticket.description]);
    const imageAttachments = useMemo(() => ticket.attachments.filter((item) => item.kind === "image" && item.download_url), [ticket.attachments]);
    const submittedLabel = formatSubmittedAt(ticket.created_at, formatMessage);
    // Bugfix: 后端旧数据里可能已经持久化了中文系统摘要；详情页展示时按当前语言重新映射系统事件。
    const timelineItems = getFeedbackTimelineItems(ticket.events ?? [], ticket.comments, formatMessage);
    const latestTimelineItem = timelineItems.at(-1);
    const issueCopyLabel = formatMessage({
        id: issueIdCopied ? "feedback.detail.issueCopied" : "feedback.detail.issueCopy",
    });
    useEffect(() => {
        // Bugfix: TicketsView 切换工单详情时会复用当前组件实例，复制成功态必须按工单 id 失效，
        // 否则用户复制 A 后切到 B，会在 B 上短暂看到 A 的“已复制”状态。
        setCopiedIssueId(null);
        if (copiedResetTimerRef.current !== null) {
            globalThis.clearTimeout(copiedResetTimerRef.current);
            copiedResetTimerRef.current = null;
        }
        return () => {
            if (copiedResetTimerRef.current !== null) {
                globalThis.clearTimeout(copiedResetTimerRef.current);
                copiedResetTimerRef.current = null;
            }
        };
    }, [ticket.id]);
    const handleCopyIssueId = useCallback(() => {
        if (typeof navigator === "undefined" || !navigator.clipboard?.writeText) {
            logger.warn(formatMessage({ id: "feedback.detail.issueCopyFailed" }), {
                issueId: ticket.id,
                reason: "clipboard-unavailable",
            });
            return;
        }
        void navigator.clipboard.writeText(ticket.id).then(() => {
            setCopiedIssueId(ticket.id);
            if (copiedResetTimerRef.current !== null) {
                globalThis.clearTimeout(copiedResetTimerRef.current);
            }
            copiedResetTimerRef.current = globalThis.setTimeout(() => {
                setCopiedIssueId(null);
                copiedResetTimerRef.current = null;
            }, 1600);
        }, (error) => {
            logger.warn(formatMessage({ id: "feedback.detail.issueCopyFailed" }), {
                issueId: ticket.id,
                error: error instanceof Error ? error.message : String(error),
            });
        });
    }, [formatMessage, ticket.id]);
    return (_jsxs("div", { className: "flex h-full min-h-0 flex-col gap-4", children: [_jsxs("header", { className: "rounded-lg border border-card-border bg-card p-4", children: [_jsxs("div", { className: "flex flex-wrap items-start justify-between gap-3", children: [_jsxs("div", { className: "min-w-0", children: [_jsx(StatusIndicator, { status: ticket.status, className: "text-ui-base font-semibold" }), _jsxs("div", { className: "mt-2 flex min-w-0 items-center gap-1.5 text-ui-xs text-foreground-subtle", children: [_jsx("span", { className: "shrink-0", children: formatMessage({ id: "feedback.tickets.issuePrefix" }) }), _jsx("span", { className: "min-w-0 truncate font-mono text-foreground", children: ticket.id }), _jsx(Button, { type: "button", size: "icon-sm", variant: "ghost", "aria-label": issueCopyLabel, title: issueCopyLabel, onClick: handleCopyIssueId, className: "shrink-0 text-foreground-subtle hover:text-foreground", children: issueIdCopied ? (_jsx(Check, { className: "size-3 text-success" })) : (_jsx(CopyIcon, { className: "size-3" })) })] }), _jsx("h2", { className: "mt-3 text-lg font-semibold tracking-tight text-foreground", children: ticket.title }), _jsx("p", { className: "mt-2 max-w-2xl text-ui-base leading-6 text-foreground-subtle", children: formatFeedbackStatusHint(ticket.status, formatMessage) })] }), _jsx("div", { className: "flex shrink-0 flex-col items-end gap-1.5 text-ui-base text-foreground-subtle", children: submittedLabel ? (_jsxs("span", { className: "inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-2.5 py-1", children: [_jsx(Clock, { className: "size-3" }), submittedLabel] })) : null })] }), _jsx("div", { className: "mt-5", children: _jsx(FeedbackProgress, { status: ticket.status, assigneeDisplay: ticket.assignee_display }) }), _jsxs("div", { className: "mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-surface px-3 py-2.5", children: [_jsxs("div", { className: "flex min-w-0 items-center gap-2", children: [_jsx("span", { className: "flex size-7 shrink-0 items-center justify-center rounded-md bg-accent text-primary", children: _jsx(ListChecks, { className: "size-3.5" }) }), _jsxs("div", { className: "min-w-0", children: [_jsx("p", { className: "truncate text-ui-base font-medium text-foreground", children: latestTimelineItem
                                                    ? latestTimelineItem.summary ??
                                                        (latestTimelineItem.isStaff
                                                            ? formatMessage({ id: "feedback.timeline.officialReply" })
                                                            : formatMessage({ id: "feedback.timeline.yourSupplement" }))
                                                    : formatMessage({ id: "feedback.detail.noActivity" }) }), _jsxs("p", { className: "mt-0.5 truncate text-ui-xs text-foreground-subtle", children: [formatMessage({ id: "feedback.timeline.stepCount" }, { count: String(timelineItems.length) }), latestTimelineItem
                                                        ? ` · ${formatMessage({ id: "feedback.timeline.latestUpdate" }, { time: formatRelativeTime(latestTimelineItem.createdAt, formatMessage) })}`
                                                        : ` · ${formatMessage({ id: "feedback.timeline.syncWhenUpdated" })}`] })] })] }), _jsxs(Button, { type: "button", size: "sm", variant: "outline", onClick: onOpenProcess, className: "h-7 shrink-0 rounded-lg", children: [formatMessage({ id: "feedback.detail.viewFullProcess" }), _jsx(ChevronRight, {})] })] })] }), _jsx(FeedbackSupplementComposer, { ticketId: ticket.id, feedbackService: feedbackService, onSubmitted: onRefresh }), userDescription || imageAttachments.length > 0 ? (_jsxs("section", { className: "rounded-lg border border-card-border bg-card p-4", children: [_jsx("h3", { className: "text-ui-base font-semibold tracking-wide text-foreground-subtle", children: formatMessage({ id: "feedback.detail.yourDescription" }) }), userDescription ? (_jsx("p", { className: "mt-3 whitespace-pre-wrap text-ui-base leading-7 text-foreground", children: userDescription })) : null, imageAttachments.length > 0 ? (_jsx("div", { className: cn("grid gap-2 sm:grid-cols-2", userDescription ? "mt-3" : "mt-2"), children: imageAttachments.map((attachment) => (_jsx("a", { href: attachment.download_url ?? undefined, target: "_blank", rel: "noreferrer", className: "overflow-hidden rounded-lg border border-border bg-surface transition-colors hover:border-border-hover", children: _jsx("img", { src: attachment.download_url, alt: "", className: "max-h-40 w-full object-cover" }) }, attachment.id))) })) : null] })) : null] }));
}
//# sourceMappingURL=TicketDetail.js.map