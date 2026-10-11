import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ImageIcon } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog.js";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
export function CuaScreenshotSection({ screenshot }) {
    const { intl } = useZCodeIntl();
    const metadata = [];
    const titleId = screenshot.zoom
        ? "chat.toolCall.cua.details.zoomPreview"
        : "chat.toolCall.cua.details.screenshot";
    if (screenshot.fullScreen)
        metadata.push([
            "chat.toolCall.cua.details.scope",
            intl.formatMessage({ id: "chat.toolCall.cua.details.fullScreen" }),
        ]);
    if (screenshot.region)
        metadata.push(["chat.toolCall.cua.details.region", screenshot.region]);
    if (screenshot.width && screenshot.height)
        metadata.push([
            "chat.toolCall.cua.details.dimensions",
            `${screenshot.width} × ${screenshot.height}`,
        ]);
    if (screenshot.mimeType)
        metadata.push([
            "chat.toolCall.cua.details.format",
            screenshot.mimeType.replace(/^image\//u, "").toUpperCase(),
        ]);
    if (screenshot.clamped)
        metadata.push([
            "chat.toolCall.cua.details.bounds",
            intl.formatMessage({ id: "chat.toolCall.cua.details.clamped" }),
        ]);
    return (_jsxs("section", { className: "space-y-2 border-t border-border pt-3", children: [_jsx("h4", { className: "text-sm text-foreground-subtle", children: intl.formatMessage({ id: titleId }) }), screenshot.dataUrl ? (_jsxs(Dialog, { children: [_jsx(DialogTrigger, { asChild: true, children: _jsx("button", { type: "button", className: "block w-full overflow-hidden rounded-lg border border-border bg-surface outline-none focus-visible:ring-2 focus-visible:ring-ring", children: _jsx("img", { src: screenshot.dataUrl, alt: intl.formatMessage({ id: "chat.toolCall.cua.details.openScreenshot" }), className: "max-h-96 w-full object-contain" }) }) }), _jsxs(DialogContent, { className: "rounded-xl max-h-[calc(100vh-2rem)] max-w-[calc(100vw-2rem)] overflow-auto p-3", children: [_jsx(DialogTitle, { className: "sr-only", children: intl.formatMessage({ id: titleId }) }), _jsx("img", { src: screenshot.dataUrl, alt: "", className: "max-h-[calc(100vh-4rem)] w-full object-contain" })] })] })) : (_jsxs("div", { className: "flex min-h-28 flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-surface px-3 py-6 text-sm text-foreground-subtle", children: [_jsx(ImageIcon, { className: "size-5 text-foreground-subtlest" }), _jsx("span", { children: intl.formatMessage({
                            id: screenshot.zoom
                                ? "chat.toolCall.cua.details.zoomUnavailable"
                                : "chat.toolCall.cua.details.screenshotUnavailable",
                        }) })] })), metadata.length ? (_jsx("dl", { className: "grid grid-cols-[minmax(4rem,auto)_minmax(0,1fr)] gap-x-3 gap-y-1.5 text-sm", children: metadata.map(([labelId, value]) => (_jsxs("div", { className: "contents", children: [_jsx("dt", { className: "text-foreground-subtlest", children: intl.formatMessage({ id: labelId }) }), _jsx("dd", { className: "text-foreground", children: value })] }, labelId))) })) : null] }));
}
//# sourceMappingURL=CuaScreenshotSection.js.map