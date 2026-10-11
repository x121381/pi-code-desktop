/**
 * 构建任务反馈的 description 文本模版
 * 所有展示文本通过 formatMessage 实现 i18n
 */
export declare function buildTaskFeedbackDescription({ taskTitle, taskId, workspacePath, taskSessionPath, taskLogPath, formatMessage, }: {
    taskTitle: string;
    taskId?: string;
    workspacePath: string;
    taskSessionPath?: string | null;
    taskLogPath?: string | null;
    formatMessage: (id: string, values?: Record<string, string>) => string;
}): string;
//# sourceMappingURL=taskFeedbackDraft.d.ts.map