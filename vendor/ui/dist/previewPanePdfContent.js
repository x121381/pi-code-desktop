import { jsx as _jsx } from "react/jsx-runtime";
import { Suspense, lazy } from "react";
// react-pdf（含 pdf.js 与 worker）体积较大，懒加载让它只在首次打开 PDF 预览时进入 bundle，
// 不拖慢没有用到 PDF 的会话的启动。
const PdfViewer = lazy(() => import("@/components/ui/pdf-viewer.js").then((module) => ({
    default: module.PdfViewer,
})));
export function PdfPreviewContent({ source, labels }) {
    return (_jsx(Suspense, { fallback: _jsx("div", { className: "p-3 text-ui-base text-foreground-subtle", children: labels.loading }), children: _jsx(PdfViewer, { source: source, labels: labels, className: "h-full" }) }));
}
//# sourceMappingURL=previewPanePdfContent.js.map