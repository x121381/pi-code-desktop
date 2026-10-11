import { getErrorMessage } from "../lib/errorMessage.js";
import { logger } from "../logger.js";
const DEFAULT_SUBMISSION_COPY = {
    connectingLabel: "正在连接反馈服务",
    connectingDetail: "创建成功后会继续上传截图和日志",
    cancelingCreateLabel: "正在取消提交",
    cancelingCreateDetail: "已收到取消请求，正在停止创建反馈。",
    canceledLabel: "反馈提交已取消",
    canceledDetail: "反馈提交已取消",
    uploadingScreenshotLabel: "正在上传截图",
    submittedLabel: "反馈已提交",
    submittedDetail: "我们会尽快处理。",
    failedLabel: "反馈提交失败",
    networkErrorDetail: "无法连接反馈服务，请检查网络、VPN 或代理设置后重试。",
    postCreateNetworkErrorDetail: "反馈已创建，但后续材料上传失败。请打开已创建的反馈补充材料，不要重复提交。",
    pausingLogLabel: "正在暂停日志上传",
    pausingLogDetail: "已收到取消请求，稍等一下。",
    exportingLogLabel: "正在导出完整日志",
    exportingLogDetail: "会根据本机日志大小耗时数秒",
    uploadingLogLabel: "正在上传完整日志",
    logUploadSuccessLabel: "日志上传成功",
    logUploadPausedLabel: "已暂停日志上传",
    logUploadPausedDetail: "日志是定位问题的必需材料，请继续上传。",
    preparingUploadDetail: "准备上传",
};
let nextJobSeq = 0;
const submissionJobs = new Map();
const globalListeners = new Set();
function getSubmissionJobSnapshots() {
    return Array.from(submissionJobs.values()).map((job) => ({
        ...job.getState(),
        job,
    }));
}
function notifySubmissionJobSnapshots() {
    const snapshot = getSubmissionJobSnapshots();
    for (const listener of globalListeners) {
        listener(snapshot);
    }
}
export function getFeedbackSubmissionJobsSnapshot() {
    return getSubmissionJobSnapshots();
}
export function subscribeFeedbackSubmissionJobs(listener) {
    globalListeners.add(listener);
    listener(getSubmissionJobSnapshots());
    return {
        dispose: () => {
            globalListeners.delete(listener);
        },
    };
}
export function dismissFeedbackSubmissionJob(jobId) {
    const job = submissionJobs.get(jobId);
    // paused-log 正在等待用户继续上传。此时如果把 job 从全局队列删除，
    // waitForLogUploadAction 会永久悬挂，日志压缩包清理和最终状态都不会再推进。
    if (job?.getState().status === "paused-log") {
        return;
    }
    if (submissionJobs.delete(jobId)) {
        notifySubmissionJobSnapshots();
    }
}
export function getFeedbackSubmissionJob(jobId) {
    return submissionJobs.get(jobId) ?? null;
}
export async function cancelFeedbackCreateSubmissionJob(job, options = {}) {
    const state = job.getState();
    if (state.status !== "running" || state.ticketId) {
        return false;
    }
    try {
        await job.cancelSubmission();
        dismissFeedbackSubmissionJob(job.id);
        return true;
    }
    catch (error) {
        const message = getErrorMessage(error);
        // cancelCreate 是跨 RPC 的 host 命令，host 断开或调用失败时不能把
        // fire-and-forget rejection 漏到全局，也不能按成功取消把后台 job 隐藏掉。
        logger.warn("[FeedbackSubmissionJob] 取消反馈创建命令失败", {
            jobId: job.id,
            error: message,
        });
        options.onCancelError?.(message);
        return false;
    }
}
export function startFeedbackSubmissionJob(options) {
    const copy = options.copy ?? DEFAULT_SUBMISSION_COPY;
    const jobSeq = nextJobSeq++;
    const now = Date.now();
    const jobId = `feedback-submit-${now}-${jobSeq}`;
    const createOperationId = `feedback-create-${now}-${jobSeq}`;
    // 后端工单描述已经混入诊断信息，无法用于恢复用户原始输入。
    // 每个后台 job 必须在启动时复制自己的表单快照，避免多个并发反馈互相覆盖。
    const formDraft = createFeedbackSubmitDraftSnapshot(options.formDraft);
    const listeners = new Set();
    let state = {
        id: jobId,
        status: "running",
        progress: {
            kind: "working",
            label: copy.connectingLabel,
            detail: copy.connectingDetail,
            indeterminate: true,
        },
    };
    let activeUploadProgressId = null;
    let resolveLogUploadAction = null;
    let cancelRequested = false;
    let cancelNotified = false;
    function setState(patch) {
        state = { ...state, ...patch };
        for (const listener of listeners) {
            listener(state);
        }
        notifySubmissionJobSnapshots();
    }
    function setProgress(progress) {
        setState({ progress });
    }
    function markCreateCanceled() {
        if (cancelNotified)
            return;
        cancelNotified = true;
        setState({
            status: "error",
            error: copy.canceledDetail,
            progress: {
                kind: "working",
                label: copy.canceledLabel,
                detail: copy.canceledDetail,
                indeterminate: false,
            },
        });
        options.onError?.(copy.canceledDetail);
    }
    async function run() {
        try {
            logger.info("[FeedbackSubmissionJob] 开始后台提交反馈", { jobId });
            const ticket = await options.feedbackService.create(options.ticketInput, {
                operationId: createOperationId,
            });
            if (cancelRequested) {
                // 取消创建以用户点击为准；即使后端稍后返回 ticket，
                // 也不恢复旧提交 job 或继续上传附件，避免用户认为取消后还在后台运行。
                throw new FeedbackSubmissionCanceledError(copy.canceledDetail);
            }
            setState({ status: "running", ticketId: ticket.id, error: undefined });
            // 工单创建成功后前台弹窗可以收起；截图和日志继续由后台 job 负责上传。
            options.onTicketCreated?.(ticket.id);
            const failedScreenshots = [];
            for (const [index, screenshot] of options.screenshots.entries()) {
                try {
                    setProgress({
                        kind: "working",
                        label: copy.uploadingScreenshotLabel,
                        detail: `${index + 1}/${options.screenshots.length} · ${formatBytes(screenshot.size)}`,
                        indeterminate: true,
                    });
                    await options.feedbackService.uploadAttachmentData(ticket.id, "image", {
                        dataBase64: screenshot.dataBase64,
                        filename: screenshot.filename,
                        contentType: screenshot.contentType,
                    });
                }
                catch (screenshotError) {
                    failedScreenshots.push(`${screenshot.filename}: ${getErrorMessage(screenshotError)}`);
                }
            }
            if (failedScreenshots.length > 0) {
                await options.feedbackService
                    .comment(ticket.id, `系统提示：部分截图上传失败：${failedScreenshots.join("；")}`)
                    .catch(() => undefined);
            }
            if (options.includeLogs) {
                await uploadLogsUntilComplete(options.feedbackService, ticket.id, copy, {
                    setState,
                    setProgress,
                    getActiveProgressId: () => activeUploadProgressId,
                    setActiveProgressId: (id) => {
                        activeUploadProgressId = id;
                    },
                    waitForLogUploadAction: () => new Promise((resolve) => {
                        resolveLogUploadAction = resolve;
                    }),
                });
            }
            setState({
                status: "success",
                ticketId: ticket.id,
                progress: {
                    kind: "success",
                    label: copy.submittedLabel,
                    detail: copy.submittedDetail,
                    progress: 100,
                },
            });
            options.onCompleted?.(ticket.id);
            logger.info("[FeedbackSubmissionJob] 后台反馈提交完成", {
                jobId,
                ticketId: ticket.id,
            });
            return { ticketId: ticket.id };
        }
        catch (error) {
            if (!state.ticketId &&
                (cancelRequested || error instanceof FeedbackSubmissionCanceledError)) {
                markCreateCanceled();
                logger.info("[FeedbackSubmissionJob] 反馈提交已取消", { jobId });
                throw new FeedbackSubmissionCanceledError(copy.canceledDetail);
            }
            const rawMessage = getErrorMessage(error);
            // RPC 只把 Node fetch 的顶层消息带到 UI，底层建连错误会退化成 fetch failed。
            // 用户需要可执行的网络排查提示，原始错误仍保留在日志中供定位。
            const message = getFeedbackSubmissionErrorMessage(rawMessage, copy, {
                ticketCreated: Boolean(state.ticketId),
            });
            setState({
                status: "error",
                error: message,
                progress: {
                    kind: "working",
                    label: copy.failedLabel,
                    detail: message,
                    indeterminate: false,
                },
            });
            options.onError?.(message);
            logger.warn("[FeedbackSubmissionJob] 后台反馈提交失败", {
                jobId,
                error: rawMessage,
                displayError: message,
            });
            throw error;
        }
        finally {
            activeUploadProgressId = null;
            resolveLogUploadAction = null;
        }
    }
    const done = run();
    // 反馈日志上传是 host service 里的长耗时任务，不能被提交弹窗卸载牵着走。
    // job 保存在模块闭包里继续执行，前台组件只订阅状态；右上角关闭弹窗只会移除订阅者，不会取消后台上传。
    const job = {
        id: jobId,
        formDraft,
        done,
        getState: () => state,
        subscribe: (listener) => {
            listeners.add(listener);
            listener(state);
            return {
                dispose: () => {
                    listeners.delete(listener);
                },
            };
        },
        cancelActiveUpload: async () => {
            const progressId = activeUploadProgressId;
            if (!progressId)
                return;
            setProgress({
                kind: "working",
                label: copy.pausingLogLabel,
                detail: copy.pausingLogDetail,
                indeterminate: true,
            });
            await options.feedbackService.cancelUpload(progressId);
        },
        cancelSubmission: async () => {
            if (state.status !== "running" && state.status !== "paused-log")
                return;
            cancelRequested = true;
            if (!state.ticketId) {
                const previousProgress = state.progress;
                setProgress({
                    kind: "working",
                    label: copy.cancelingCreateLabel,
                    detail: copy.cancelingCreateDetail,
                    indeterminate: true,
                });
                try {
                    await options.feedbackService.cancelCreate(createOperationId);
                }
                catch (error) {
                    if (!cancelNotified && !state.ticketId) {
                        setProgress(previousProgress);
                    }
                    throw error;
                }
                markCreateCanceled();
                return;
            }
            await job.cancelActiveUpload();
        },
        continueLogUpload: () => {
            resolveLogUploadAction?.("continue");
            resolveLogUploadAction = null;
        },
    };
    submissionJobs.set(job.id, job);
    notifySubmissionJobSnapshots();
    return job;
}
function createFeedbackSubmitDraftSnapshot(draft) {
    const screenshots = draft.screenshots
        ? Object.freeze(draft.screenshots.map((screenshot) => Object.freeze({ ...screenshot })))
        : undefined;
    // job 暴露给全局卡片和弹窗共同读取，必须冻结复制后的快照，
    // 防止任一订阅者改写描述或附件后污染同一后台任务的恢复内容。
    return Object.freeze({
        ...draft,
        ...(screenshots ? { screenshots } : {}),
    });
}
function getFeedbackSubmissionErrorMessage(rawMessage, copy, options) {
    if (/^(?:fetch failed|failed to fetch|network request failed)$/i.test(rawMessage) ||
        /^request timed out after \d+ms$/i.test(rawMessage) ||
        /connect timeout error/i.test(rawMessage)) {
        return options.ticketCreated ? copy.postCreateNetworkErrorDetail : copy.networkErrorDetail;
    }
    return rawMessage;
}
class FeedbackSubmissionCanceledError extends Error {
    constructor(message) {
        super(message);
        this.name = "FeedbackSubmissionCanceledError";
    }
}
async function uploadLogsUntilComplete(feedbackService, ticketId, copy, callbacks) {
    let archive = null;
    const progressId = `feedback-log-${ticketId}-${Date.now()}`;
    // 完整日志需要先在本机压缩成 zip，只显示不确定进度会让用户误以为导出已经瞬间完成。
    const progressSubscription = feedbackService.onDynamicUploadProgress(progressId)((progress) => {
        callbacks.setProgress(formatUploadProgress(progress, copy));
    });
    try {
        callbacks.setActiveProgressId(progressId);
        callbacks.setProgress({
            kind: "working",
            label: copy.exportingLogLabel,
            detail: copy.exportingLogDetail,
            indeterminate: true,
        });
        archive = await feedbackService.prepareCompactLogArchive({ full: true, progressId });
        let shouldRetryLogUpload = true;
        while (shouldRetryLogUpload) {
            try {
                callbacks.setActiveProgressId(progressId);
                callbacks.setProgress({
                    kind: "uploading-log",
                    label: copy.uploadingLogLabel,
                    detail: `0 / ${formatBytes(archive.size)}`,
                    progress: 0,
                    uploadedBytes: 0,
                    totalBytes: archive.size,
                });
                await feedbackService.uploadAttachmentWithProgress(ticketId, "log", {
                    path: archive.path,
                    contentType: "application/zip",
                }, progressId);
                shouldRetryLogUpload = false;
                callbacks.setProgress({
                    kind: "success",
                    label: copy.logUploadSuccessLabel,
                    detail: copy.submittedDetail,
                    progress: 100,
                    uploadedBytes: archive.size,
                    totalBytes: archive.size,
                });
            }
            catch (logUploadError) {
                if (!isUploadCanceledError(logUploadError)) {
                    // 完整日志是排障必需附件，413/断网等自动上传失败不能降级成 compact 日志并继续成功。
                    // 否则研发侧会误以为拿到了完整现场，实际关键日志已经被客户端跳过。
                    throw logUploadError;
                }
                callbacks.setActiveProgressId(null);
                callbacks.setState({
                    status: "paused-log",
                    progress: {
                        kind: "paused-log",
                        label: copy.logUploadPausedLabel,
                        detail: copy.logUploadPausedDetail,
                        progress: 0,
                        uploadedBytes: 0,
                        totalBytes: archive.size,
                    },
                });
                await callbacks.waitForLogUploadAction();
                callbacks.setState({ status: "running" });
                shouldRetryLogUpload = true;
            }
            finally {
                callbacks.setActiveProgressId(null);
            }
        }
    }
    catch (logError) {
        const message = getErrorMessage(logError);
        await feedbackService
            .comment(ticketId, `系统提示：完整日志自动上传失败，请必要时让用户手动导出日志。错误：${message}`)
            .catch(() => undefined);
        // 日志上传是提交链路的一部分，非用户主动跳过时不能吞掉异常继续显示“提交成功”。
        // 否则用户会以为完整日志已经交付，但研发侧实际只收到缺日志的工单。
        throw logError;
    }
    finally {
        if (archive) {
            await feedbackService.cleanupPreparedLogArchive(archive.path).catch(() => undefined);
        }
        callbacks.setActiveProgressId(null);
        progressSubscription.dispose();
    }
}
export function formatBytes(size) {
    if (size < 1024)
        return `${size} B`;
    if (size < 1024 * 1024)
        return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / 1024 / 1024).toFixed(2)} MB`;
}
export function formatUploadProgress(progress, copy = DEFAULT_SUBMISSION_COPY) {
    const totalBytes = Math.max(progress.totalBytes, 0);
    const uploadedBytes = Math.min(Math.max(progress.uploadedBytes, 0), totalBytes);
    const percent = totalBytes > 0 ? Math.round((uploadedBytes / totalBytes) * 100) : 0;
    if (progress.phase === "preparing") {
        return {
            kind: "working",
            label: copy.exportingLogLabel,
            detail: totalBytes > 0
                ? `${formatBytes(uploadedBytes)} / ${formatBytes(totalBytes)}`
                : copy.exportingLogDetail,
            progress: percent,
            uploadedBytes,
            totalBytes,
        };
    }
    return {
        kind: progress.phase === "complete" ? "success" : "uploading-log",
        label: progress.phase === "complete" ? copy.logUploadSuccessLabel : copy.uploadingLogLabel,
        detail: totalBytes > 0
            ? `${formatBytes(uploadedBytes)} / ${formatBytes(totalBytes)}`
            : copy.preparingUploadDetail,
        progress: percent,
        uploadedBytes,
        totalBytes,
    };
}
function isUploadCanceledError(error) {
    return error instanceof Error && error.name === "FeedbackUploadCanceledError";
}
//# sourceMappingURL=feedbackSubmissionJob.js.map