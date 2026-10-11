import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { AlertCircle, ChevronDown, ChevronUp, CheckCircle2, PauseCircle, Upload, X, } from "lucide-react";
import { Button } from "../components/ui/button.js";
import { cn } from "../components/lib/utils.js";
import { dismissFeedbackSubmissionJob, getFeedbackSubmissionJobsSnapshot, subscribeFeedbackSubmissionJobs, } from "../feedback/feedbackSubmissionJob.js";
import { useFeedbackStore } from "../feedback/feedbackStore.js";
import { useZCodeIntl } from "../i18n/IntlProvider.js";
import { logger } from "../logger.js";
const SUCCESS_DISMISS_DELAY_MS = 5_000;
export function shouldOpenExistingFeedbackTicket(status, ticketId) {
    return Boolean(ticketId) && (status === "success" || status === "error");
}
export function getFeedbackBackgroundOpenTarget(job) {
    if (shouldOpenExistingFeedbackTicket(job.status, job.ticketId)) {
        return { kind: "ticket", ticketId: job.ticketId };
    }
    return { kind: "submission", jobId: job.id };
}
export function FeedbackBackgroundUploadIndicator({ feedbackDialogOpen, }) {
    const [jobs, setJobs] = useState(() => getFeedbackSubmissionJobsSnapshot());
    const openSubmissionJob = useFeedbackStore((state) => state.openSubmissionJob);
    const openTickets = useFeedbackStore((state) => state.openTickets);
    useEffect(() => {
        const subscription = subscribeFeedbackSubmissionJobs(setJobs);
        return () => subscription.dispose();
    }, []);
    if (jobs.length === 0) {
        return null;
    }
    if (feedbackDialogOpen) {
        return null;
    }
    return (_jsx("div", { className: "pointer-events-none fixed right-3 bottom-3 z-[9998] flex max-h-[calc(100vh-1.5rem)] max-w-[calc(100vw-1.5rem)] flex-col items-end gap-2 overflow-y-auto sm:right-4 sm:bottom-4", children: jobs.map((job) => (_jsx(FeedbackBackgroundUploadJobCard, { job: job, onOpenSubmissionJob: openSubmissionJob, onOpenTicket: openTickets }, job.id))) }));
}
function FeedbackBackgroundUploadJobCard({ job, onOpenSubmissionJob, onOpenTicket, }) {
    useEffect(() => {
        if (job.status !== "success")
            return;
        const timer = window.setTimeout(() => {
            dismissFeedbackSubmissionJob(job.id);
        }, SUCCESS_DISMISS_DELAY_MS);
        return () => window.clearTimeout(timer);
    }, [job.id, job.status]);
    const handleOpen = () => {
        const target = getFeedbackBackgroundOpenTarget(job);
        logger.debug("[FeedbackBackgroundUploadIndicator] 打开后台反馈卡片", {
            jobId: job.id,
            status: job.status,
            target: target.kind,
        });
        if (target.kind === "ticket") {
            onOpenTicket(target.ticketId);
            dismissFeedbackSubmissionJob(job.id);
            return;
        }
        // 多个上传任务必须按被点击卡片的 jobId 打开，不能再回退到最后一个活动任务。
        onOpenSubmissionJob(target.jobId);
    };
    return (_jsx(FeedbackBackgroundUploadIndicatorView, { status: job.status, progress: job.progress, ticketId: job.ticketId, error: job.error, onOpen: handleOpen, onContinueUpload: job.job.continueLogUpload, onDismiss: () => dismissFeedbackSubmissionJob(job.id) }));
}
export function FeedbackBackgroundUploadIndicatorView({ status, progress, ticketId, error, onOpen, onContinueUpload, onDismiss, defaultExpanded = false, }) {
    const { intl } = useZCodeIntl();
    const progressValue = Math.max(0, Math.min(progress.progress ?? 0, 100));
    const isPaused = status === "paused-log";
    const isSuccess = status === "success";
    const isError = status === "error";
    const shouldDefaultExpanded = isPaused || isError;
    const [expanded, setExpanded] = useState(() => shouldDefaultExpanded || defaultExpanded);
    const Icon = isPaused ? PauseCircle : isSuccess ? CheckCircle2 : isError ? AlertCircle : Upload;
    const statusTone = isError
        ? "text-destructive"
        : isSuccess
            ? "text-success"
            : isPaused
                ? "text-warning"
                : "text-primary";
    return (_jsxs("div", { className: cn("pointer-events-auto overflow-hidden rounded-xl border border-popover-border bg-popover text-foreground shadow-lg transition-[width] duration-200", expanded ? "w-[min(380px,calc(100vw-1.5rem))]" : "w-[min(320px,calc(100vw-1.5rem))]"), children: [_jsxs("div", { className: cn("grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-2.5", expanded ? "px-3 py-2.5" : "px-3 py-2"), children: [_jsx(Icon
                    // 后台提示是 toast 语义，状态图标不应再包一层边框底座，
                    // 否则会被误读成独立按钮，也会和外层浮层圆角形成重复层级。
                    , { 
                        // 后台提示是 toast 语义，状态图标不应再包一层边框底座，
                        // 否则会被误读成独立按钮，也会和外层浮层圆角形成重复层级。
                        className: cn("mt-0.5 shrink-0", expanded ? "size-4" : "size-3.5", statusTone) }), _jsxs("button", { type: "button", onClick: onOpen, className: "min-w-0 flex-1 rounded-md text-left outline-none focus-visible:ring-2 focus-visible:ring-primary/40", "aria-label": intl.formatMessage({ id: "feedback.background.open" }), children: [_jsx("div", { className: "min-w-0 truncate text-ui-base font-medium leading-5 text-foreground", children: intl.formatMessage({ id: "feedback.background.title" }) }), _jsxs("div", { className: "flex min-w-0 items-center gap-2", children: [_jsx("span", { className: "min-w-0 truncate text-ui-base leading-5 text-foreground-subtle", children: progress.label }), progress.progress !== undefined ? (_jsxs("span", { className: "shrink-0 font-mono text-ui-xs text-foreground-subtle", children: [progressValue, "%"] })) : null] }), expanded ? (_jsxs("div", { className: "mt-0.5 flex min-w-0 items-center gap-2 text-ui-xs text-foreground-subtlest", children: [_jsx("span", { className: "min-w-0 truncate", children: error ||
                                            progress.detail ||
                                            ticketId ||
                                            intl.formatMessage({ id: "feedback.background.defaultDetail" }) }), _jsx("span", { className: "shrink-0 text-foreground-subtle", children: intl.formatMessage({ id: "feedback.background.openDetail" }) })] })) : null] }), _jsxs("div", { className: "flex shrink-0 items-center gap-0.5", children: [_jsx(Button, { type: "button", size: "icon-sm", variant: "ghost", onClick: () => {
                                    // 收起态再点“展开”只露出一小截状态条，用户还要二次操作；这里直接打开完整反馈页。
                                    if (!expanded) {
                                        onOpen();
                                        return;
                                    }
                                    setExpanded(false);
                                }, className: "shrink-0 text-foreground-subtle hover:bg-hover hover:text-foreground", "aria-label": intl.formatMessage({
                                    id: expanded ? "feedback.background.collapse" : "feedback.background.open",
                                }), children: expanded ? _jsx(ChevronDown, { className: "size-3" }) : _jsx(ChevronUp, { className: "size-3" }) }), !isPaused ? (_jsx(Button, { type: "button", size: "icon-sm", variant: "ghost", onClick: onDismiss, className: "shrink-0 text-foreground-subtle hover:bg-hover hover:text-foreground", "aria-label": intl.formatMessage({ id: "feedback.background.dismiss" }), children: _jsx(X, { className: "size-3" }) })) : null] })] }), _jsx("div", { className: cn("bg-border", expanded ? "h-1" : "h-0.5"), children: progress.indeterminate ? (_jsx("div", { className: "h-full w-1/3 animate-pulse rounded-r-full bg-primary" })) : (_jsx("div", { className: cn("h-full rounded-r-full transition-[width] duration-200", isError
                        ? "bg-destructive"
                        : isSuccess
                            ? "bg-success"
                            : isPaused
                                ? "bg-warning"
                                : "bg-primary"), style: { width: `${progressValue}%` } })) }), expanded && isPaused ? (_jsx("div", { className: "flex items-center justify-end gap-2 border-t border-border bg-surface px-3 py-2", children: _jsx(Button, { type: "button", size: "sm", onClick: onContinueUpload, children: intl.formatMessage({ id: "feedback.submit.continueUpload" }) }) })) : null] }));
}
//# sourceMappingURL=FeedbackBackgroundUploadIndicator.js.map