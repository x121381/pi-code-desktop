export async function captureFeedbackScreenshotDraft(platform) {
    const screenshot = await platform.captureWindowScreenshot?.().catch(() => null);
    return screenshot ? [screenshot] : [];
}
//# sourceMappingURL=feedbackScreenshotDraft.js.map