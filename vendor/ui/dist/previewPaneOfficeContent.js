import { jsx as _jsx } from "react/jsx-runtime";
import { Component, lazy, Suspense, useMemo } from "react";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
import { decodeBase64ToArrayBuffer } from "@/lib/officeFilePreview.js";
import { logger } from "@/logger.js";
const LazyXlsxContent = lazy(async () => {
    const module = await import("@/previewPaneOfficeXlsxContent.js");
    return { default: module.PreviewPaneOfficeXlsxContent };
});
const LazyDocxContent = lazy(async () => {
    const module = await import("@/previewPaneOfficeDocxContent.js");
    return { default: module.PreviewPaneOfficeDocxContent };
});
const LazyLegacyDocContent = lazy(async () => {
    const module = await import("@/previewPaneOfficeLegacyDocContent.js");
    return { default: module.PreviewPaneOfficeLegacyDocContent };
});
class OfficePreviewErrorBoundary extends Component {
    state = { hasError: false };
    static getDerivedStateFromError() {
        return { hasError: true };
    }
    componentDidCatch(error, info) {
        logger.error("[PreviewPane] Office 预览组件渲染失败", {
            error: error.message,
            componentStack: info.componentStack ?? "",
        });
    }
    componentDidUpdate(previousProps) {
        if (this.state.hasError && previousProps.resetKey !== this.props.resetKey) {
            this.setState({ hasError: false });
        }
    }
    render() {
        return this.state.hasError ? this.props.fallback : this.props.children;
    }
}
function OfficePreviewLoading() {
    return (_jsx("div", { "aria-busy": "true", className: "h-full min-h-0 w-full bg-background", "data-office-preview-pending": true }));
}
function OfficePreviewErrorMessage({ children }) {
    return (_jsx("div", { className: "p-3 text-ui-base text-destructive", role: "alert", children: children }));
}
export function PreviewPaneOfficeContent({ error, kind, loading, onOpenBrowserUrl, preview, resolvedTheme, sourcePath, }) {
    const { intl } = useZCodeIntl();
    const errorMessage = intl.formatMessage({
        id: "codeViewer.officeUnavailable",
    });
    const buffer = useMemo(() => (preview ? decodeBase64ToArrayBuffer(preview.dataBase64) : null), [preview]);
    if (loading || (!error && !buffer)) {
        return _jsx(OfficePreviewLoading, {});
    }
    if (error || !buffer) {
        return _jsx(OfficePreviewErrorMessage, { children: error ?? errorMessage });
    }
    const fallback = _jsx(OfficePreviewErrorMessage, { children: errorMessage });
    return (_jsx(OfficePreviewErrorBoundary, { fallback: fallback, resetKey: `${kind}:${sourcePath}:${preview?.totalBytes ?? 0}`, children: _jsx(Suspense, { fallback: _jsx(OfficePreviewLoading, {}), children: kind === "excel" ? (_jsx(LazyXlsxContent, { buffer: buffer, errorMessage: errorMessage, isDark: resolvedTheme === "dark", onOpenBrowserUrl: onOpenBrowserUrl, sourcePath: sourcePath })) : kind === "docx" ? (_jsx(LazyDocxContent, { buffer: buffer, errorMessage: errorMessage, onOpenBrowserUrl: onOpenBrowserUrl, sourcePath: sourcePath })) : (_jsx(LazyLegacyDocContent, { buffer: buffer, errorMessage: errorMessage, onOpenBrowserUrl: onOpenBrowserUrl, sourcePath: sourcePath })) }) }));
}
//# sourceMappingURL=previewPaneOfficeContent.js.map