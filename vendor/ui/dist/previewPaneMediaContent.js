import { jsx as _jsx } from "react/jsx-runtime";
export function PreviewPaneMediaContent({ source, loading, url, error, labels, onMediaError, onMediaLoadedMetadata, }) {
    if (loading || (!error && !url)) {
        return _jsx("div", { className: "p-3 text-ui-base text-foreground-subtle", children: labels.loading });
    }
    if (error || !url) {
        return (_jsx("div", { className: "p-3 text-ui-base text-destructive", role: "alert", children: error ?? labels.unavailable }));
    }
    return (_jsx("div", { className: "flex h-full min-h-0 items-center justify-center overflow-auto bg-background p-6", children: source.kind === "video" ? (_jsx("video", { controls: true, playsInline: true, className: "max-h-full max-w-full rounded-lg", preload: "metadata", src: url, onError: onMediaError, onLoadedMetadata: onMediaLoadedMetadata, children: labels.unsupported })) : (_jsx("audio", { controls: true, className: "w-full max-w-2xl", preload: "metadata", src: url, onError: onMediaError, onLoadedMetadata: onMediaLoadedMetadata, children: labels.unsupported })) }));
}
//# sourceMappingURL=previewPaneMediaContent.js.map