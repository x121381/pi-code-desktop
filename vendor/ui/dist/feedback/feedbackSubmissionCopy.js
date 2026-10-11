import { useMemo } from "react";
export function useFeedbackSubmissionCopy(formatMessage) {
    return useMemo(() => ({
        connectingLabel: formatMessage("feedback.submission.connectingLabel"),
        connectingDetail: formatMessage("feedback.submission.connectingDetail"),
        cancelingCreateLabel: formatMessage("feedback.submission.cancelingCreateLabel"),
        cancelingCreateDetail: formatMessage("feedback.submission.cancelingCreateDetail"),
        canceledLabel: formatMessage("feedback.submission.canceledLabel"),
        canceledDetail: formatMessage("feedback.submission.canceledDetail"),
        uploadingScreenshotLabel: formatMessage("feedback.submission.uploadingScreenshotLabel"),
        submittedLabel: formatMessage("feedback.submission.submittedLabel"),
        submittedDetail: formatMessage("feedback.submission.submittedDetail"),
        failedLabel: formatMessage("feedback.submission.failedLabel"),
        networkErrorDetail: formatMessage("feedback.submission.networkErrorDetail"),
        postCreateNetworkErrorDetail: formatMessage("feedback.submission.postCreateNetworkErrorDetail"),
        pausingLogLabel: formatMessage("feedback.submission.pausingLogLabel"),
        pausingLogDetail: formatMessage("feedback.submission.pausingLogDetail"),
        exportingLogLabel: formatMessage("feedback.submission.exportingLogLabel"),
        exportingLogDetail: formatMessage("feedback.submission.exportingLogDetail"),
        uploadingLogLabel: formatMessage("feedback.submission.uploadingLogLabel"),
        logUploadSuccessLabel: formatMessage("feedback.submission.logUploadSuccessLabel"),
        logUploadPausedLabel: formatMessage("feedback.submission.logUploadPausedLabel"),
        logUploadPausedDetail: formatMessage("feedback.submission.logUploadPausedDetail"),
        preparingUploadDetail: formatMessage("feedback.submission.preparingUploadDetail"),
    }), [formatMessage]);
}
//# sourceMappingURL=feedbackSubmissionCopy.js.map