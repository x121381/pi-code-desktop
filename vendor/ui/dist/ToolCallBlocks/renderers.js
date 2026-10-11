import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { FileDisplayIcon, getFileDisplayPath, resolveFileDisplayDescriptor, } from "../lib/fileDisplay.js";
import { FlipMetricValue } from "../components/ui/flip-metric-value.js";
import { getPathLeaf } from "../lib/path.js";
import { inferEditOperation } from "../ToolCallBlocks/fileSummaries.js";
export function renderDiffCount(changeStat, options) {
    if (!changeStat) {
        return null;
    }
    if (changeStat.added <= 0 && changeStat.removed <= 0) {
        return null;
    }
    return (_jsxs("span", { className: "inline-flex items-center gap-1 whitespace-nowrap font-mono leading-none tabular-nums", children: [changeStat.added > 0 ? (_jsxs("span", { "aria-label": `+${changeStat.added}`, className: "inline-flex items-center text-diff-added", role: "text", title: `+${changeStat.added}`, children: ["+", _jsx(FlipMetricValue, { value: String(changeStat.added), animateInitial: options?.animateInitial })] })) : null, changeStat.removed > 0 ? (_jsxs("span", { "aria-label": `-${changeStat.removed}`, className: "inline-flex items-center text-diff-removed", role: "text", title: `-${changeStat.removed}`, children: ["-", _jsx(FlipMetricValue, { value: String(changeStat.removed), animateInitial: options?.animateInitial })] })) : null] }));
}
export function renderFileChip({ summary, clickable = false, onClick, title, basePath, }) {
    const descriptor = resolveFileDisplayDescriptor(summary.path, {
        basePath,
    });
    const chipTitle = title ?? getFileDisplayPath(summary.path, basePath);
    if (clickable) {
        return (_jsxs("button", { type: "button", className: "inline-flex min-w-0 max-w-full items-center gap-1.5 text-foreground-subtle hover:underline", title: chipTitle, onMouseDown: (event) => {
                event.preventDefault();
                event.stopPropagation();
            }, onClick: (event) => {
                event.stopPropagation();
                onClick?.();
            }, children: [_jsx(FileDisplayIcon, { src: descriptor.fileIconSrc, size: 16, className: "size-4 shrink-0" }), _jsx("span", { className: "min-w-0 truncate text-foreground-subtle", children: getPathLeaf(summary.path) })] }));
    }
    return (_jsxs("span", { className: "inline-flex min-w-0 max-w-full items-center gap-1.5 text-foreground-subtle", title: chipTitle, children: [_jsx(FileDisplayIcon, { src: descriptor.fileIconSrc, size: 16, className: "size-4 shrink-0" }), _jsx("span", { className: "min-w-0 truncate", children: getPathLeaf(summary.path) })] }));
}
export function renderFilePath(path, basePath) {
    if (!path) {
        return null;
    }
    return (_jsx("span", { className: "min-w-0 truncate text-foreground-subtlest @max-[360px]/conversation:hidden", children: getFileDisplayPath(path, basePath) }));
}
export function getEditKindLabelMessageId(operationKinds, actionLabels, isRunning, source) {
    const inferredOperation = inferEditOperation(operationKinds, actionLabels, source);
    if (inferredOperation === "write") {
        return isRunning ? "chat.toolCall.edit.writing" : "chat.toolCall.kind.write";
    }
    if (inferredOperation === "delete") {
        return isRunning ? "chat.toolCall.edit.deleting" : "chat.toolCall.kind.delete";
    }
    if (actionLabels.length === 0) {
        return isRunning ? "chat.toolCall.edit.editing" : "chat.toolCall.kind.edit";
    }
    return isRunning ? "chat.toolCall.edit.editing" : "chat.toolCall.kind.edit";
}
export function renderJoinedFileChips(summaries, options = {}) {
    return (_jsx("div", { className: "inline-flex min-w-0 items-center", children: summaries.map((summary, index) => (_jsxs("span", { className: "inline-flex min-w-0 items-center", children: [index > 0 ? _jsx("span", { className: "mx-1 text-foreground-subtlest", children: "," }) : null, renderFileChip({
                    summary,
                    clickable: options.clickable,
                    basePath: options.basePath,
                    onClick: options.onClick ? () => options.onClick?.(summary) : undefined,
                })] }, summary.path))) }));
}
//# sourceMappingURL=renderers.js.map