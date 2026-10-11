export declare function buildErrorFeedbackDescription({ message, detail, traceId, contextLines, formatMessage, }: {
    message: string;
    detail?: string;
    traceId?: string;
    contextLines?: readonly string[];
    formatMessage: (id: string, values?: Record<string, string>) => string;
}): string;
//# sourceMappingURL=errorFeedbackDraft.d.ts.map