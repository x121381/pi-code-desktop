import type { CreateFeedbackTicketInput } from "@zcode/shared";
import type { FeedbackUploadProgress, IFeedbackService } from "@zcode/services";
import type { FeedbackSubmitDraft } from "@/feedback/feedbackStore.js";
export interface FeedbackSubmissionAttachmentDraft {
    filename: string;
    contentType: string;
    dataBase64: string;
    size: number;
}
export interface FeedbackSubmissionProgressState {
    kind?: "working" | "uploading-log" | "paused-log" | "success";
    label: string;
    detail?: string;
    progress?: number;
    uploadedBytes?: number;
    totalBytes?: number;
    indeterminate?: boolean;
}
export interface FeedbackSubmissionCopy {
    connectingLabel: string;
    connectingDetail: string;
    cancelingCreateLabel: string;
    cancelingCreateDetail: string;
    canceledLabel: string;
    canceledDetail: string;
    uploadingScreenshotLabel: string;
    submittedLabel: string;
    submittedDetail: string;
    failedLabel: string;
    networkErrorDetail: string;
    postCreateNetworkErrorDetail: string;
    pausingLogLabel: string;
    pausingLogDetail: string;
    exportingLogLabel: string;
    exportingLogDetail: string;
    uploadingLogLabel: string;
    logUploadSuccessLabel: string;
    logUploadPausedLabel: string;
    logUploadPausedDetail: string;
    preparingUploadDetail: string;
}
export type FeedbackSubmissionJobStatus = "running" | "paused-log" | "success" | "error";
export interface FeedbackSubmissionJobState {
    id: string;
    status: FeedbackSubmissionJobStatus;
    progress: FeedbackSubmissionProgressState;
    ticketId?: string;
    error?: string;
}
export interface FeedbackSubmissionJob {
    readonly id: string;
    /** 提交瞬间的用户表单快照，用于按 jobId 重新打开对应反馈。 */
    readonly formDraft: FeedbackSubmitDraft;
    readonly done: Promise<{
        ticketId: string;
    }>;
    getState: () => FeedbackSubmissionJobState;
    subscribe: (listener: (state: FeedbackSubmissionJobState) => void) => {
        dispose: () => void;
    };
    cancelSubmission: () => Promise<void>;
    cancelActiveUpload: () => Promise<void>;
    continueLogUpload: () => void;
}
export interface FeedbackSubmissionJobSnapshot extends FeedbackSubmissionJobState {
    job: FeedbackSubmissionJob;
}
export interface StartFeedbackSubmissionJobOptions {
    feedbackService: IFeedbackService;
    ticketInput: CreateFeedbackTicketInput;
    screenshots: FeedbackSubmissionAttachmentDraft[];
    includeLogs: boolean;
    formDraft: FeedbackSubmitDraft;
    copy?: FeedbackSubmissionCopy;
    onTicketCreated?: (ticketId: string) => void;
    onCompleted?: (ticketId: string) => void;
    onError?: (message: string) => void;
}
export declare function getFeedbackSubmissionJobsSnapshot(): FeedbackSubmissionJobSnapshot[];
export declare function subscribeFeedbackSubmissionJobs(listener: (jobs: FeedbackSubmissionJobSnapshot[]) => void): {
    dispose: () => void;
};
export declare function dismissFeedbackSubmissionJob(jobId: string): void;
export declare function getFeedbackSubmissionJob(jobId: string): FeedbackSubmissionJob | null;
export declare function cancelFeedbackCreateSubmissionJob(job: FeedbackSubmissionJob, options?: {
    onCancelError?: (message: string) => void;
}): Promise<boolean>;
export declare function startFeedbackSubmissionJob(options: StartFeedbackSubmissionJobOptions): FeedbackSubmissionJob;
export declare function formatBytes(size: number): string;
export declare function formatUploadProgress(progress: FeedbackUploadProgress, copy?: FeedbackSubmissionCopy): FeedbackSubmissionProgressState;
//# sourceMappingURL=feedbackSubmissionJob.d.ts.map