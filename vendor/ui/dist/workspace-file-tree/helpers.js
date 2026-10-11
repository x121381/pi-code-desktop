import { sortInstalledEditorsForOpenWith } from "../lib/openWithEditors.js";
import { toFileUrl } from "../lib/path.js";
export function toError(value) {
    return value instanceof Error ? value : new Error(String(value));
}
export function replaceSetValue(set, value, present) {
    const next = new Set(set);
    if (present) {
        next.add(value);
    }
    else {
        next.delete(value);
    }
    return next;
}
function isMacLike() {
    if (typeof navigator === "undefined") {
        return false;
    }
    return /mac/i.test(navigator.userAgent);
}
function isWindowsLike() {
    if (typeof navigator === "undefined") {
        return false;
    }
    return /windows/i.test(navigator.userAgent);
}
export function getFileManagerLabel(intl) {
    if (isMacLike()) {
        return intl.formatMessage({ id: "appHeader.openInFinder" });
    }
    if (isWindowsLike()) {
        return intl.formatMessage({ id: "appHeader.openInFileExplorer" });
    }
    return intl.formatMessage({ id: "appHeader.openInFileManager" });
}
export function isWorkspaceFileTreeHtmlFile(row) {
    if (row.type !== "file") {
        return false;
    }
    return /\.(?:html|htm)$/i.test(row.path);
}
export function createWorkspaceFileTreeHtmlBrowserUrl(row) {
    if (!isWorkspaceFileTreeHtmlFile(row)) {
        return null;
    }
    return toFileUrl(row.path);
}
export const sortInstalledEditorsForFileTree = sortInstalledEditorsForOpenWith;
//# sourceMappingURL=helpers.js.map