import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog.js";
import { Tabs, TabsContent } from "@/components/ui/tabs.js";
import { Button } from "@/components/ui/button.js";
import { useFeedbackStore } from "@/feedback/feedbackStore.js";
import { FeedbackSubmitForm } from "@/feedback/FeedbackSubmitForm.js";
import { FeatureRequestDialog } from "@/feedback/FeatureRequestDialog.js";
import { TicketsView } from "@/feedback/TicketsView.js";
import { FeedbackBackgroundUploadIndicator } from "@/feedback/FeedbackBackgroundUploadIndicator.js";
import { ArrowLeftIcon, XIcon } from "lucide-react";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
import { memo } from "react";
export const FeedbackCenter = memo(function FeedbackCenterComponent({ feedbackService, platform, }) {
    const open = useFeedbackStore((state) => state.open);
    const featureRequestOpen = useFeedbackStore((state) => state.featureRequestOpen);
    const tab = useFeedbackStore((state) => state.tab);
    const submitDraft = useFeedbackStore((state) => state.submitDraft);
    const submissionJobId = useFeedbackStore((state) => state.submissionJobId);
    const setTab = useFeedbackStore((state) => state.setTab);
    const close = useFeedbackStore((state) => state.close);
    const openTickets = useFeedbackStore((state) => state.openTickets);
    const { intl } = useZCodeIntl();
    const titleId = tab === "tickets" ? "feedback.center.ticketsTitle" : "feedback.center.submitTitle";
    if (!feedbackService)
        return null;
    return (_jsxs(_Fragment, { children: [_jsx(FeedbackBackgroundUploadIndicator, { feedbackDialogOpen: open || featureRequestOpen }), _jsx(FeatureRequestDialog, { feedbackService: feedbackService }), _jsx(Dialog, { open: open, onOpenChange: (next) => {
                    if (!next)
                        close();
                }, children: _jsxs(DialogContent, { showCloseButton: false, className: "grid h-[min(38rem,calc(100vh-2rem))] w-[min(34rem,calc(100vw-2rem))] max-w-[calc(100vw-2rem)] grid-rows-[auto_minmax(0,1fr)] gap-0 overflow-hidden rounded-2xl border border-popover-border bg-popover p-0 text-foreground shadow-md backdrop-blur-2xl max-sm:h-[calc(100vh-1rem)] max-sm:w-[calc(100vw-1rem)]", children: [_jsxs(DialogHeader, { className: "flex-row items-center justify-between gap-2 p-6 pb-0", children: [_jsxs("div", { className: "flex min-w-0 items-center gap-2", children: [tab === "tickets" ? (_jsx(Button, { type: "button", variant: "ghost", size: "icon-md", className: "shrink-0 rounded-lg text-foreground-subtle hover:text-foreground", "aria-label": intl.formatMessage({ id: "feedback.center.backToSubmit" }), "data-feedback-back-to-submit": "true", onClick: () => setTab("submit"), children: _jsx(ArrowLeftIcon, { className: "size-4" }) })) : null, _jsx(DialogTitle, { className: "min-w-0 truncate text-ui-lg font-medium text-foreground", children: intl.formatMessage({ id: titleId }) })] }), _jsx(Button, { type: "button", variant: "ghost", size: "icon-lg", className: "shrink-0 rounded-xl", "aria-label": intl.formatMessage({ id: "common.close" }), onClick: close, children: _jsx(XIcon, { className: "size-4" }) })] }), _jsxs(Tabs, { value: tab, onValueChange: (value) => setTab(value), className: "flex min-h-0 flex-1 flex-col gap-0", children: [_jsx(TabsContent, { value: "submit", className: "min-h-0 flex-1 overflow-hidden outline-none", children: _jsx(FeedbackSubmitForm, { feedbackService: feedbackService, platform: platform, initialDraft: submitDraft, submissionJobId: submissionJobId, onSubmitted: (ticketId) => openTickets(ticketId), onViewTickets: () => setTab("tickets"), onCancel: close }, submissionJobId ?? "new-feedback") }), _jsx(TabsContent, { value: "tickets", className: "flex min-h-0 flex-1 flex-col overflow-hidden outline-none", children: _jsx(TicketsView, { feedbackService: feedbackService, onCreateNew: () => setTab("submit") }) })] })] }) })] }));
});
//# sourceMappingURL=FeedbackCenter.js.map