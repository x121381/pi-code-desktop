import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { CalendarDays } from "lucide-react";
import { cn } from "./components/lib/utils.js";
import { Button } from "./components/ui/button.js";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, } from "./components/ui/dialog.js";
import { Checkbox } from "./components/ui/checkbox.js";
import { Progress } from "./components/ui/progress.js";
const macosDockIconUrl = new URL("../../../public/icon_512@2x.png", import.meta.url).href;
export function UpdateStatusDialog({ displayVersion, edgeToEdge = false, intl, isUpdateActionPending, autoDownloadAndInstallUpdates, onAutoDownloadAndInstallUpdatesChange, onCancelDownload, onDownloadUpdate, onOpenChange, onRestartUpdate, onSkipUpdate, open, phase, progressLabel, progressValue, releaseDateLabel, showOverlay = true, skippableVersion, }) {
    const isBeforeDownload = phase === "before-download";
    const isDownloading = phase === "downloading";
    const isDownloaded = phase === "downloaded";
    const dialogTitleId = isDownloaded
        ? "updateDialog.readyTitle"
        : isDownloading
            ? "updateDialog.downloadingTitle"
            : "updateDialog.availableTitle";
    const titleParts = getDialogTitleParts({
        displayVersion,
        intl,
        titleId: dialogTitleId,
    });
    const showSkipVersion = isBeforeDownload && Boolean(skippableVersion);
    const showLaterButton = !isDownloading;
    const titleClassName = "flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-ui-base font-medium leading-5 text-foreground";
    const titleContent = (_jsxs(_Fragment, { children: [titleParts.prefix ? _jsx("span", { children: titleParts.prefix }) : null, titleParts.hasVersion ? (_jsx("span", { className: "whitespace-nowrap", children: titleParts.versionText })) : null, titleParts.suffix ? _jsx("span", { children: titleParts.suffix }) : null] }));
    const contentClassName = cn("max-h-[calc(100vh-2rem)] max-w-[calc(100vw-2rem)] overflow-hidden p-5 sm:max-w-lg", edgeToEdge && !isDownloading
        ? // 普通/下载完成状态没有中间内容，不能继续使用 minmax(0,1fr)。
            // 否则 footer 会占满剩余窗口高度，按钮被垂直居中后看起来像中间有大块空白。
            "grid-rows-[auto_auto]"
        : "grid-rows-[auto_minmax(0,1fr)_auto]", edgeToEdge
        ? // 独立更新窗口已经由 BrowserWindow 提供窗口边框和阴影。
            // 这里不能再保留页内 DialogContent 的边框、阴影和视口边距，否则会出现“窗中窗”。
            "grid h-dvh max-h-none w-dvw max-w-none gap-5 border-0 bg-popover/98 pt-10 text-ui-base/relaxed text-foreground shadow-none sm:max-w-none [app-region:drag]"
        : "gap-5");
    const content = (_jsxs(_Fragment, { children: [_jsx(DialogHeader, { className: "gap-0", children: _jsxs("div", { className: "flex min-w-0 items-center gap-3 [app-region:no-drag]", children: [_jsx("img", { src: macosDockIconUrl, alt: "", "aria-hidden": "true", className: "pointer-events-none -ml-[5px] size-12 shrink-0 select-none shadow-none drop-shadow-none", draggable: false }), _jsxs("div", { className: "min-w-0 flex-1 space-y-1.5", children: [edgeToEdge ? (_jsx("h2", { className: titleClassName, children: titleContent })) : (_jsx(DialogTitle, { className: titleClassName, children: titleContent })), releaseDateLabel ? (_jsxs("div", { className: "inline-flex max-w-full items-center gap-1 text-ui-xs font-normal leading-4 text-foreground-subtle", children: [_jsx(CalendarDays, { className: "size-3 shrink-0", "aria-hidden": "true" }), _jsx("span", { className: "truncate", children: releaseDateLabel })] })) : null] })] }) }), isDownloading ? (_jsx("div", { className: "min-h-0 overflow-y-auto [app-region:no-drag]", children: _jsxs("section", { className: "space-y-2", "aria-live": "polite", children: [_jsxs("div", { className: "flex items-center justify-between gap-3", children: [_jsx("span", { className: "text-ui-base font-medium leading-5 text-foreground", children: intl.formatMessage({ id: "updateDialog.downloadProgress" }) }), progressLabel ? (_jsx("span", { className: "font-mono text-ui-base leading-5 text-foreground", children: progressLabel })) : null] }), _jsx(Progress, { value: progressValue, className: "zcode-update-charge-progress h-2 bg-primary/15 dark:bg-primary/20", indicatorClassName: "bg-primary" })] }) })) : null, _jsxs("div", { className: cn("[app-region:no-drag]", isDownloading ? "-mt-2" : null), children: [isBeforeDownload ? (_jsxs("label", { className: "mb-4 flex min-w-0 items-center gap-2 text-ui-base leading-5 text-foreground", children: [_jsx(Checkbox, { checked: autoDownloadAndInstallUpdates, disabled: isUpdateActionPending, onCheckedChange: (checked) => {
                                    void onAutoDownloadAndInstallUpdatesChange(checked === true);
                                } }), _jsx("span", { className: "min-w-0", children: intl.formatMessage({
                                    id: "updateDialog.autoDownloadAndInstall",
                                }) })] })) : null, _jsxs(DialogFooter, { className: cn("p-0 [app-region:no-drag]", edgeToEdge
                            ? // 独立更新窗口宽度只有 480px，小于 Tailwind 的 sm 断点。
                                // 继续依赖 sm:flex-row 会退化成移动端竖排，导致底部按钮布局和原桌面弹窗不一致。
                                cn("flex-row items-center gap-3", showSkipVersion ? "justify-between" : "justify-end")
                            : showSkipVersion
                                ? "sm:justify-between"
                                : "sm:justify-end"), children: [showSkipVersion ? (_jsx("div", { className: cn("flex w-full flex-col-reverse gap-2 sm:w-auto sm:flex-row", edgeToEdge ? "w-auto flex-row" : null), children: _jsx(Button, { type: "button", variant: "secondary", size: "lg", className: "h-9 self-start px-4", disabled: isUpdateActionPending, onClick: () => void onSkipUpdate(), children: intl.formatMessage({ id: "updateDialog.skipVersion" }) }) })) : null, _jsxs("div", { className: cn("flex w-full flex-col-reverse gap-2 sm:w-auto sm:flex-row sm:justify-end", edgeToEdge ? "w-auto flex-row justify-end" : null), children: [showLaterButton ? (_jsx(Button, { type: "button", variant: "secondary", size: "lg", className: "h-9 px-4", disabled: isUpdateActionPending, onClick: () => onOpenChange(false), children: intl.formatMessage({ id: "updateDialog.later" }) })) : null, isDownloaded ? (_jsx(Button, { type: "button", size: "lg", className: "h-9 px-4", disabled: isUpdateActionPending, onClick: () => void onRestartUpdate(), children: intl.formatMessage({ id: "updateDialog.restartToUpdate" }) })) : isDownloading ? (_jsx(Button, { type: "button", variant: "secondary", size: "lg", className: "h-9 px-4", disabled: isUpdateActionPending, onClick: () => void onCancelDownload(), children: intl.formatMessage({ id: "updateDialog.cancelDownload" }) })) : (_jsx(Button, { type: "button", size: "lg", className: "h-9 px-4", disabled: isUpdateActionPending, onClick: () => void onDownloadUpdate(), children: intl.formatMessage({ id: "updateDialog.downloadAndUpdate" }) }))] })] })] })] }));
    if (edgeToEdge) {
        if (!open) {
            return null;
        }
        return (_jsx("div", { role: "dialog", "aria-modal": "true", "aria-describedby": undefined, className: contentClassName, children: content }));
    }
    return (_jsx(Dialog, { open: open, onOpenChange: onOpenChange, children: _jsx(DialogContent
        // 去掉标题下方可见描述后，显式关闭 aria-describedby，避免 Radix 在开发环境提示缺少 Description。
        , { "aria-describedby": undefined, showOverlay: showOverlay, showCloseButton: false, className: contentClassName, children: content }) }));
}
function getDialogTitleParts({ displayVersion, intl, titleId, }) {
    const marker = "__ZCODE_UPDATE_VERSION__";
    const text = intl.formatMessage({ id: titleId }, { version: marker });
    const index = text.indexOf(marker);
    const rawPrefix = index >= 0 ? text.slice(0, index) : "";
    const versionPrefix = rawPrefix.endsWith("v") ? "v" : "";
    const prefix = (versionPrefix ? rawPrefix.slice(0, -versionPrefix.length) : rawPrefix).trim();
    return {
        hasVersion: index >= 0,
        prefix,
        suffix: index >= 0 ? text.slice(index + marker.length).trim() : text.trim(),
        versionText: `${versionPrefix}${displayVersion}`,
    };
}
//# sourceMappingURL=UpdateStatusDialog.js.map