export function createPdfJsDocumentOptions(viteBaseUrl, documentUrl) {
    const applicationBaseUrl = new URL(viteBaseUrl, documentUrl);
    return {
        cMapPacked: true,
        cMapUrl: new URL("pdfjs/cmaps/", applicationBaseUrl).href,
    };
}
//# sourceMappingURL=pdfJsAssets.js.map