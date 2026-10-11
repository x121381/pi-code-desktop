import { create } from "zustand";
export const useFeedbackStore = create((set) => ({
    open: false,
    featureRequestOpen: false,
    tab: "submit",
    submitDraft: null,
    submissionJobId: null,
    selectedTicketId: null,
    openSubmit: (draft) => set({
        // “问题上报”是新建入口，不能隐式续接上一次仍在上传的 job，
        // 否则新表单会继承旧 job 的 submitting 状态并阻止用户继续提交。
        open: true,
        featureRequestOpen: false,
        tab: "submit",
        submitDraft: draft ?? null,
        submissionJobId: null,
        selectedTicketId: null,
    }),
    openSubmissionJob: (jobId) => set({
        open: true,
        featureRequestOpen: false,
        tab: "submit",
        submitDraft: null,
        submissionJobId: jobId,
        selectedTicketId: null,
    }),
    openFeatureRequest: () => set({
        // 需求反馈和问题上报是两个独立 Dialog，必须互斥打开，避免后台浮层或快捷入口叠出双弹窗。
        open: false,
        featureRequestOpen: true,
        submitDraft: null,
        submissionJobId: null,
        selectedTicketId: null,
    }),
    openTickets: (ticketId) => set({
        open: true,
        featureRequestOpen: false,
        tab: "tickets",
        submitDraft: null,
        submissionJobId: null,
        selectedTicketId: ticketId ?? null,
    }),
    setTab: (tab) => set({
        tab,
        ...(tab === "submit" ? { submissionJobId: null } : {}),
    }),
    setSelectedTicketId: (ticketId) => set({ selectedTicketId: ticketId }),
    close: () => set({
        open: false,
        featureRequestOpen: false,
        submitDraft: null,
        submissionJobId: null,
        selectedTicketId: null,
    }),
}));
//# sourceMappingURL=feedbackStore.js.map