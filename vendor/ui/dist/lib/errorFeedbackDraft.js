import { redactFeedbackText } from "@zcode/shared";
export function buildErrorFeedbackDescription({ message, detail, traceId, contextLines = [], formatMessage, }) {
    return redactFeedbackText([
        formatMessage("feedback.submit.template.section.errorSummaryLine", {
            message,
        }),
        "",
        traceId ? formatMessage("feedback.submit.template.section.errorTraceId", { traceId }) : null,
        detail
            ? ["", formatMessage("feedback.submit.template.section.errorDetail"), detail].join("\n")
            : null,
        contextLines.length > 0 ? contextLines.join("\n") : null,
        "",
        formatMessage("feedback.submit.template.section.whatDoing"),
        formatMessage("feedback.submit.template.section.supplement"),
        "",
        formatMessage("feedback.submit.template.section.expectedResult"),
        formatMessage("feedback.submit.template.section.supplement"),
    ]
        .filter((line) => line != null)
        .join("\n"));
}
//# sourceMappingURL=errorFeedbackDraft.js.map