import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { XIcon } from "lucide-react";
import { Button } from "../components/ui/button.js";
import { Dialog, DialogContent, DialogHeader, DialogTitle, } from "../components/ui/dialog.js";
import { Input } from "../components/ui/input.js";
import { Textarea } from "../components/ui/textarea.js";
import { FeedbackErrorTip } from "../feedback/feedbackBadges.js";
import { readFeedbackContactPreference, rememberFeedbackContactInput, } from "../feedback/feedbackContactPreference.js";
import { ScrollFadeViewport } from "../components/ui/scroll-fade-viewport.js";
import { SubmitProgressView } from "../feedback/FeedbackSubmitProgressView.js";
import { cancelFeedbackCreateSubmissionJob, dismissFeedbackSubmissionJob, } from "../feedback/feedbackSubmissionJob.js";
import { useFeedbackSubmissionCopy } from "../feedback/feedbackSubmissionCopy.js";
import { startSimplifiedFeedbackSubmission } from "../feedback/feedbackSubmitSubmission.js";
import { getErrorMessage } from "../lib/errorMessage.js";
import { useZCodeIntl } from "../i18n/IntlProvider.js";
import { useFeedbackStore } from "../feedback/feedbackStore.js";
import { toast } from "../components/ui/toast.js";
const FEATURE_TEXT_MAX = 2000;
const CONTACT_MAX = 200;
export const FeatureRequestDialog = memo(function FeatureRequestDialogComponent({ feedbackService, }) {
    const open = useFeedbackStore((state) => state.featureRequestOpen);
    const close = useFeedbackStore((state) => state.close);
    const openTickets = useFeedbackStore((state) => state.openTickets);
    const { intl, locale } = useZCodeIntl();
    const formatMessage = useCallback((id, values) => intl.formatMessage({ id }, values), [intl]);
    const [description, setDescription] = useState("");
    const [solution, setSolution] = useState("");
    const [contact, setContact] = useState(() => readFeedbackContactPreference());
    const [submitting, setSubmitting] = useState(false);
    const [submitProgress, setSubmitProgress] = useState(null);
    const [submissionJob, setSubmissionJob] = useState(null);
    const [error, setError] = useState(null);
    const mountedRef = useRef(true);
    const activeSubmissionJobRef = useRef(null);
    const copy = useFeedbackSubmissionCopy(formatMessage);
    const submitDisabled = submitting || !description.trim() || !solution.trim();
    useEffect(() => {
        mountedRef.current = true;
        return () => {
            mountedRef.current = false;
            const activeJob = activeSubmissionJobRef.current;
            const activeState = activeJob?.getState();
            if (activeJob && activeState?.status === "running" && !activeState.ticketId) {
                void cancelFeedbackCreateSubmissionJob(activeJob);
            }
        };
    }, []);
    useEffect(() => {
        if (!submissionJob)
            return;
        const subscription = submissionJob.subscribe((jobState) => {
            setSubmitProgress(jobState.progress);
            setSubmitting(jobState.status === "running" || jobState.status === "paused-log");
            if (jobState.status === "error") {
                setError(jobState.error ?? formatMessage("feedback.submission.failedLabel"));
            }
        });
        return () => subscription.dispose();
    }, [formatMessage, submissionJob]);
    const cancelActiveCreate = useCallback(() => {
        const activeJob = activeSubmissionJobRef.current;
        const activeState = activeJob?.getState();
        if (activeJob && activeState?.status === "running" && !activeState.ticketId) {
            void cancelFeedbackCreateSubmissionJob(activeJob, { onCancelError: setError });
            return true;
        }
        return false;
    }, []);
    const handleClose = useCallback(() => {
        if (submitting && cancelActiveCreate())
            return;
        if (submitting)
            return;
        close();
    }, [cancelActiveCreate, close, submitting]);
    const handleReset = useCallback(() => {
        if (submitting)
            return;
        setDescription("");
        setSolution("");
        setError(null);
    }, [submitting]);
    const handleSubmit = useCallback(async () => {
        const trimmedDescription = description.trim();
        const trimmedSolution = solution.trim();
        if (!trimmedDescription || !trimmedSolution) {
            setError(formatMessage("feedback.featureRequest.missingRequired"));
            return;
        }
        setSubmitting(true);
        setSubmitProgress({
            kind: "working",
            label: formatMessage("feedback.submission.connectingLabel"),
            detail: formatMessage("feedback.submission.connectingDetail"),
            indeterminate: true,
        });
        setError(null);
        try {
            const structuredDescription = buildFeatureRequestDescription({
                description: trimmedDescription,
                solution: trimmedSolution,
                source: formatMessage("feedback.featureRequest.source"),
                formatMessage,
            });
            const job = await startSimplifiedFeedbackSubmission({
                feedbackService,
                title: trimmedDescription,
                description: structuredDescription,
                contact,
                screenshots: [],
                includeLogs: false,
                ticketType: "feature",
                ticketSeverity: "P3-低",
                ticketModule: "其它",
                modelContext: {},
                locale,
                copy,
                formatMessage: intl.formatMessage,
                onCompleted: (ticketId) => {
                    toast(formatMessage("feedback.featureRequest.submittedToast"), { durationMs: 3000 });
                    if (!mountedRef.current)
                        return;
                    window.setTimeout(() => {
                        if (mountedRef.current && activeSubmissionJobRef.current?.id === job.id) {
                            openTickets(ticketId);
                        }
                    }, 900);
                },
                onError: (message) => {
                    if (mountedRef.current)
                        setError(message);
                },
            });
            activeSubmissionJobRef.current = job;
            setSubmissionJob(job);
            void job.done
                .catch(() => undefined)
                .finally(() => {
                dismissFeedbackSubmissionJob(job.id);
                if (mountedRef.current && activeSubmissionJobRef.current?.id === job.id) {
                    setSubmitting(false);
                }
            });
        }
        catch (submitError) {
            setError(getErrorMessage(submitError));
            setSubmitting(false);
        }
    }, [
        contact,
        copy,
        description,
        feedbackService,
        formatMessage,
        locale,
        openTickets,
        solution,
    ]);
    return (_jsx(Dialog, { open: open, onOpenChange: (next) => {
            if (!next)
                handleClose();
        }, children: _jsxs(DialogContent, { showCloseButton: false, className: "grid h-[min(38rem,calc(100vh-2rem))] w-[min(34rem,calc(100vw-2rem))] max-w-[calc(100vw-2rem)] grid-rows-[auto_minmax(0,1fr)_auto] gap-0 overflow-hidden rounded-2xl border border-popover-border bg-popover p-0 text-foreground shadow-md backdrop-blur-2xl max-sm:h-[calc(100vh-1rem)] max-sm:w-[calc(100vw-1rem)]", children: [_jsxs(DialogHeader, { className: "flex-row items-center justify-between gap-2 p-6 pb-0", children: [_jsx(DialogTitle, { className: "min-w-0 truncate text-ui-lg font-medium text-foreground", children: formatMessage("feedback.featureRequest.title") }), _jsx(Button, { type: "button", variant: "ghost", size: "icon-lg", className: "shrink-0 rounded-xl", "aria-label": formatMessage("common.close"), onClick: handleClose, children: _jsx(XIcon, { className: "size-4" }) })] }), _jsx(ScrollFadeViewport, { className: "px-6 pb-4 pt-3", children: _jsxs("div", { className: "mx-auto flex max-w-[720px] flex-col gap-3", children: [_jsx(FeatureRequestTextarea, { autoFocus: true, required: true, title: formatMessage("feedback.featureRequest.descriptionLabel"), value: description, max: FEATURE_TEXT_MAX, placeholder: formatMessage("feedback.featureRequest.descriptionPlaceholder"), onChange: setDescription }), _jsx(FeatureRequestTextarea, { required: true, title: formatMessage("feedback.featureRequest.solutionLabel"), value: solution, max: FEATURE_TEXT_MAX, placeholder: formatMessage("feedback.featureRequest.solutionPlaceholder"), onChange: setSolution }), _jsxs("section", { className: "space-y-2", children: [_jsx("h3", { className: "text-ui-base font-semibold text-foreground", children: formatMessage("feedback.featureRequest.contactLabel") }), _jsx(Input, { type: "text", inputMode: "email", autoComplete: "email", value: contact, onChange: (event) => {
                                            setContact(rememberFeedbackContactInput(event.target.value));
                                        }, maxLength: CONTACT_MAX, placeholder: formatMessage("feedback.submit.contact.placeholder"), className: "h-10 rounded-xl border-input-border bg-input px-3 text-ui-base text-foreground placeholder:text-foreground-subtlest hover:border-input-border-hover focus-visible:border-input-border-focused focus-visible:bg-input-focused" })] }), error ? _jsx(FeedbackErrorTip, { message: error }) : null] }) }), _jsxs("div", { className: "shrink-0 px-6 pb-6 pt-2", children: [submitting && submitProgress ? (_jsx(SubmitProgressView, { progress: submitProgress, processingLabel: formatMessage("feedback.submit.processing") })) : null, _jsxs("div", { className: submitting && submitProgress
                                ? "mt-2.5 flex items-center justify-between gap-3"
                                : "flex items-center justify-between gap-3", children: [_jsx(Button, { type: "button", variant: "link", size: "lg", disabled: submitting, className: "px-0 text-primary", onClick: handleReset, children: formatMessage("feedback.featureRequest.reset") }), _jsxs("div", { className: "flex shrink-0 justify-end gap-2", children: [_jsx(Button, { variant: "outline", size: "lg", onClick: handleClose, children: formatMessage("common.cancel") }), _jsx(Button, { size: "lg", onClick: () => void handleSubmit(), disabled: submitDisabled, className: "rounded-lg", children: submitting ? (_jsxs(_Fragment, { children: [_jsx("span", { className: "size-3.5 animate-spin rounded-full border border-current border-t-transparent" }), formatMessage("feedback.submit.submitting")] })) : (formatMessage("feedback.featureRequest.submit")) })] })] })] })] }) }));
});
function FeatureRequestTextarea({ autoFocus, required, title, value, max, placeholder, onChange, }) {
    return (_jsxs("section", { className: "space-y-2", children: [_jsxs("div", { className: "flex items-center justify-between gap-2", children: [_jsxs("h3", { className: "text-ui-base font-semibold text-foreground", children: [required ? _jsx("span", { className: "mr-1 text-destructive", children: "*" }) : null, title] }), _jsxs("span", { className: "text-ui-xs tabular-nums text-foreground-subtle", children: [value.length, "/", max] })] }), _jsx(Textarea, { autoFocus: autoFocus, value: value, onChange: (event) => onChange(event.target.value), rows: 4, maxLength: max, placeholder: placeholder, 
                // Textarea 默认的 field-sizing-content 会按无换行长文本扩张宽度。
                // 产品需求弹窗和问题反馈弹窗同宽，必须固定输入框尺寸并允许长词在框内换行。
                className: "field-sizing-fixed h-[136px] max-h-[136px] min-w-0 max-w-full resize-none overflow-y-auto rounded-xl border-input-border bg-input text-ui-base leading-6 whitespace-pre-wrap break-words text-foreground placeholder:text-foreground-subtlest hover:border-input-border-hover focus-visible:border-input-border-focused focus-visible:bg-input-focused" })] }));
}
export function buildFeatureRequestDescription({ description, solution, source, formatMessage, }) {
    return [
        `## ${formatMessage("feedback.featureRequest.descriptionLabel")}`,
        description.trim(),
        "",
        `## ${formatMessage("feedback.featureRequest.solutionLabel")}`,
        solution.trim(),
        "",
        `## ${formatMessage("feedback.submit.template.section.featureSource")}`,
        source.trim(),
    ].join("\n");
}
//# sourceMappingURL=FeatureRequestDialog.js.map