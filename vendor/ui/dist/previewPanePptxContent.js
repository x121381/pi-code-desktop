import { jsx as _jsx } from "react/jsx-runtime";
import { lazy, Suspense } from "react";
const PptxPreviewViewer = lazy(() => import("./components/ui/pptx-preview-viewer.js").then((module) => ({
    default: module.PptxPreviewViewer,
})));
export function PptxPreviewContent({ data, fileName, labels, onOpenBrowserUrl, referenceSource, referenceNavigation, referenceNavigationReady, }) {
    return (_jsx(Suspense, { fallback: _jsx("div", { className: "p-3 text-ui-base text-foreground-subtle", children: labels.loading }), children: _jsx(PptxPreviewViewer, { data: data, fileName: fileName, labels: labels, onOpenBrowserUrl: onOpenBrowserUrl, ...(referenceSource ? { referenceSource } : {}), ...(referenceNavigation ? { referenceNavigation } : {}), referenceNavigationReady: referenceNavigationReady, className: "h-full" }) }));
}
//# sourceMappingURL=previewPanePptxContent.js.map