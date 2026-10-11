import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CheckCircle2, CornerDownRight, MessageSquare, Sparkle, UserCheck2, } from "lucide-react";
import { filterUserVisibleComments, formatRelativeTime } from "../feedback/feedbackUserView.js";
import { getUserFacingEventSummary } from "../feedback/feedbackTimelineSummary.js";
import { cn } from "../components/lib/utils.js";
import { useZCodeIntl } from "../i18n/IntlProvider.js";
const EVENT_ICON = {
    created: Sparkle,
    status_changed: CheckCircle2,
    assignee_changed: UserCheck2,
    staff_replied: MessageSquare,
    user_replied: CornerDownRight,
};
export function getFeedbackTimelineItems(events, comments, formatMessage) {
    const visibleComments = filterUserVisibleComments(comments);
    // 用 comment_id 去重：如果事件里已经有 staff_replied/ user_replied 指向某条评论，
    // 评论就以事件形式呈现，不再额外加一条。
    const eventCommentIds = new Set();
    for (const ev of events) {
        const payload = ev.payload;
        if ((ev.type === "staff_replied" || ev.type === "user_replied") && payload?.comment_id) {
            eventCommentIds.add(payload.comment_id);
        }
    }
    const items = [];
    for (const ev of events) {
        items.push({
            id: `event-${ev.id}`,
            kind: "event",
            createdAt: ev.created_at,
            type: ev.type,
            summary: getUserFacingEventSummary(ev, formatMessage),
            actor: getUserFacingEventActor(ev, formatMessage),
        });
        // 如果是回复事件，附带正文（从评论里查）
        const payload = ev.payload;
        if (payload?.comment_id) {
            const comment = visibleComments.find((c) => c.id === payload.comment_id);
            if (comment) {
                items[items.length - 1].body = comment.body;
                items[items.length - 1].attachments = comment.attachments ?? [];
                items[items.length - 1].isStaff = comment.is_staff;
            }
        }
    }
    // 兜底：评论里没有对应 event 的（旧数据）也展示
    for (const c of visibleComments) {
        if (eventCommentIds.has(c.id))
            continue;
        items.push({
            id: `reply-${c.id}`,
            kind: "reply",
            createdAt: c.created_at,
            body: c.body,
            attachments: c.attachments ?? [],
            isStaff: c.is_staff,
            actor: c.is_staff
                ? formatOptionalMessage(formatMessage, "feedback.actor.productManager", "产品经理")
                : formatOptionalMessage(formatMessage, "feedback.actor.user", "用户"),
        });
    }
    return items.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
}
function getUserFacingEventActor(event, formatMessage) {
    switch (event.type) {
        case "created":
        case "user_replied":
            return formatOptionalMessage(formatMessage, "feedback.actor.user", "用户");
        case "assignee_changed":
            return formatOptionalMessage(formatMessage, "feedback.actor.productManager", "产品经理");
        case "staff_replied":
            return formatOptionalMessage(formatMessage, "feedback.actor.productManager", "产品经理");
        case "status_changed": {
            const payload = event.payload;
            const toStatus = typeof payload?.to === "string" ? payload.to : "";
            return ["开发中", "已解决", "已上线"].includes(toStatus)
                ? formatOptionalMessage(formatMessage, "feedback.actor.dev", "研发")
                : formatOptionalMessage(formatMessage, "feedback.actor.productManager", "产品经理");
        }
        default:
            return null;
    }
}
export function FeedbackTimeline({ events, comments, showDurations = false, }) {
    const { intl } = useZCodeIntl();
    const formatMessage = intl.formatMessage;
    const items = getFeedbackTimelineItems(events, comments, formatMessage);
    if (items.length === 0) {
        return (_jsx("p", { className: "rounded-lg border border-dashed border-border bg-surface px-3 py-4 text-center text-ui-base leading-6 text-foreground-subtle", children: formatMessage({ id: "feedback.timeline.empty" }) }));
    }
    return (_jsxs("ol", { className: "relative space-y-4 pl-5", children: [_jsx("span", { className: "absolute bottom-1 left-[7px] top-1 w-px bg-border" }), items.map((item, index) => {
                const Icon = item.kind === "event" && item.type
                    ? EVENT_ICON[item.type]
                    : item.isStaff
                        ? MessageSquare
                        : CornerDownRight;
                const isStaff = item.kind === "reply" ? item.isStaff : item.type === "staff_replied";
                const previousItem = index > 0 ? items[index - 1] : null;
                const durationLabel = showDurations && previousItem
                    ? formatStepDuration(previousItem.createdAt, item.createdAt, formatMessage)
                    : null;
                return (_jsxs("li", { className: "relative", children: [_jsx("span", { className: cn("absolute -left-5 top-0.5 flex size-4 items-center justify-center rounded-full ring-4 ring-card", isStaff
                                ? "bg-primary text-primary-foreground"
                                : item.type === "user_replied" || item.kind === "reply"
                                    ? "bg-secondary text-foreground"
                                    : "bg-success text-success-foreground"), children: _jsx(Icon, { className: "size-2.5" }) }), _jsxs("div", { className: "space-y-1", children: [_jsxs("div", { className: "flex flex-wrap items-baseline gap-x-2 gap-y-0.5 text-ui-xs leading-5", children: [_jsx("span", { className: "font-medium text-foreground", children: item.summary ??
                                                (item.isStaff
                                                    ? formatMessage({ id: "feedback.timeline.officialReply" })
                                                    : formatMessage({ id: "feedback.timeline.yourSupplement" })) }), item.actor && item.kind === "event" ? (_jsxs("span", { className: "text-foreground-subtle", children: ["\u00B7 ", item.actor] })) : null, _jsxs("span", { className: "text-foreground-subtle", children: ["\u00B7 ", formatRelativeTime(item.createdAt, formatMessage)] }), durationLabel ? (_jsx("span", { className: "rounded-full bg-surface px-1.5 py-0.5 text-ui-xs text-foreground-subtle", children: formatMessage({ id: "feedback.timeline.duration" }, { time: durationLabel }) })) : null] }), item.body || item.attachments?.length ? (_jsxs("div", { className: cn("rounded-lg border px-3 py-2.5 text-ui-base leading-6", isStaff
                                        ? "border-primary/25 bg-accent text-foreground"
                                        : "border-border bg-surface text-foreground"), children: [item.body ? _jsx("p", { className: "whitespace-pre-wrap", children: item.body }) : null, !!item.attachments?.length && (_jsx("div", { className: cn("grid gap-2 sm:grid-cols-2", item.body ? "mt-2" : ""), children: item.attachments.map((attachment) => {
                                                const href = attachment.preview_url || attachment.download_url || undefined;
                                                const isImage = isTimelineImageAttachment(attachment);
                                                return (_jsx("a", { href: href, target: "_blank", rel: "noreferrer", className: "min-w-0 overflow-hidden rounded-lg border border-border bg-card transition-colors hover:border-border-hover", children: isImage && href ? (_jsx("img", { src: href, alt: "", className: "max-h-40 w-full object-cover" })) : (_jsx("span", { className: "block truncate px-3 py-2 text-ui-base text-foreground-subtle", children: attachment.filename })) }, attachment.id));
                                            }) }))] })) : null] })] }, item.id));
            })] }));
}
function isTimelineImageAttachment(attachment) {
    if (attachment.content_type?.startsWith("image/"))
        return true;
    return /\.(png|jpe?g|gif|webp|bmp)$/i.test(attachment.filename);
}
function formatStepDuration(from, to, formatMessage) {
    const diffMs = new Date(to).getTime() - new Date(from).getTime();
    if (!Number.isFinite(diffMs) || diffMs <= 0) {
        return formatOptionalMessage(formatMessage, "feedback.duration.instant", "即时");
    }
    const minutes = Math.round(diffMs / 60_000);
    if (minutes < 1) {
        return formatOptionalMessage(formatMessage, "feedback.duration.lessThanMinute", "不到 1 分钟");
    }
    if (minutes < 60) {
        return formatOptionalMessage(formatMessage, "feedback.duration.minutes", `${minutes} 分钟`, { count: String(minutes) });
    }
    const hours = Math.round(minutes / 60);
    if (hours < 24) {
        return formatOptionalMessage(formatMessage, "feedback.duration.hours", `${hours} 小时`, { count: String(hours) });
    }
    const days = Math.round(hours / 24);
    return formatOptionalMessage(formatMessage, "feedback.duration.days", `${days} 天`, { count: String(days) });
}
function formatOptionalMessage(formatMessage, id, fallback, values) {
    return formatMessage ? formatMessage({ id }, values) : fallback;
}
//# sourceMappingURL=feedbackTimeline.js.map