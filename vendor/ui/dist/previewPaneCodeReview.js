export function resolveCodeReviewContentProjection(source, content) {
    const { review } = source;
    const startLine = review.startLine;
    const endLine = review.endLine ?? startLine;
    const hasRange = Number.isInteger(startLine) &&
        Number.isInteger(endLine) &&
        startLine !== undefined &&
        endLine !== undefined &&
        startLine > 0 &&
        endLine >= startLine;
    const lineCount = content.split(/\r\n|\r|\n/).length;
    const rangeIsVisible = hasRange && endLine <= lineCount;
    const comment = {
        id: review.requestId,
        sourcePath: source.path,
        sourceTitle: source.title,
        startLine: hasRange ? startLine : 1,
        endLine: hasRange ? endLine : 1,
        selectedText: "",
        comment: review.body,
    };
    return {
        focusedRange: rangeIsVisible ? { startLine, endLine } : null,
        inlineComments: rangeIsVisible ? [comment] : [],
        targetLineOutOfRange: hasRange && !rangeIsVisible,
        topComment: rangeIsVisible ? null : comment,
    };
}
//# sourceMappingURL=previewPaneCodeReview.js.map