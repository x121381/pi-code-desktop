import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from "@/components/lib/utils.js";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
import { getPatchPreviewLineContent, parseTruncatedMarkerOmittedLineCount, } from "@/lib/patchDiffPreview.js";
export function getLightweightDiffLineParts(line) {
    if (line.startsWith("+")) {
        return {
            content: getPatchPreviewLineContent(line),
            kind: "added",
            marker: "+",
            raw: line,
        };
    }
    if (line.startsWith("-")) {
        return {
            content: getPatchPreviewLineContent(line),
            kind: "removed",
            marker: "-",
            raw: line,
        };
    }
    if (line.startsWith(" ")) {
        return {
            content: getPatchPreviewLineContent(line),
            kind: "context",
            marker: " ",
            raw: line,
        };
    }
    return {
        content: getPatchPreviewLineContent(line),
        kind: "context",
        marker: "",
        raw: line,
    };
}
function getLightweightDiffLineStyles(kind) {
    if (kind === "added") {
        return {
            lineNumberClassName: "text-diff-added",
            rowStyle: {
                backgroundColor: "color-mix(in srgb, var(--color-diff-added) 14%, transparent)",
                boxShadow: "inset 3px 0 0 var(--color-diff-added)",
            },
            gutterStyle: {
                backgroundColor: "color-mix(in srgb, var(--color-diff-added) 18%, var(--color-background))",
                boxShadow: "inset 3px 0 0 var(--color-diff-added)",
                color: "var(--color-diff-added)",
            },
        };
    }
    if (kind === "removed") {
        return {
            lineNumberClassName: "text-diff-removed",
            rowStyle: {
                backgroundColor: "color-mix(in srgb, var(--color-diff-removed) 14%, transparent)",
                boxShadow: "inset 3px 0 0 var(--color-diff-removed)",
            },
            gutterStyle: {
                backgroundColor: "color-mix(in srgb, var(--color-diff-removed) 18%, var(--color-background))",
                boxShadow: "inset 3px 0 0 var(--color-diff-removed)",
                color: "var(--color-diff-removed)",
            },
        };
    }
    return {
        lineNumberClassName: "text-foreground-subtlest",
        gutterStyle: {
            backgroundColor: "var(--color-background)",
        },
    };
}
export function LightweightDiffPreview({ className, codePreviewSettings, lines, renderLineContent, ...props }) {
    const { intl } = useZCodeIntl();
    return (_jsx("div", { className: cn("w-full min-w-0 overflow-auto bg-background", className), "data-lightweight-diff-preview": true, ...props, children: _jsx("div", { className: cn("min-w-full font-mono leading-relaxed text-foreground", !codePreviewSettings.wrapLongLines && "w-max"), "data-lightweight-diff-scroll-content": true, style: { fontSize: codePreviewSettings.fontSizePx }, children: lines.map((line, index) => {
                const omittedLineCount = parseTruncatedMarkerOmittedLineCount(line);
                if (omittedLineCount !== null) {
                    return (_jsx("div", { className: "px-3 py-1 text-foreground-subtle", children: intl.formatMessage({ id: "diff.preview.truncatedLines" }, { count: String(omittedLineCount) }) }, index));
                }
                const lineParts = getLightweightDiffLineParts(line);
                const lineStyles = getLightweightDiffLineStyles(lineParts.kind);
                return (_jsxs("div", { className: "flex min-w-full w-full", style: lineStyles.rowStyle, children: [codePreviewSettings.showLineNumbers ? (_jsx("span", { "aria-hidden": "true", className: cn("sticky left-0 z-[1] w-12 shrink-0 select-none border-r border-border px-2 text-right tabular-nums", lineStyles.lineNumberClassName), style: lineStyles.gutterStyle, children: index + 1 })) : null, _jsx("code", { className: cn("block flex-1 px-3", codePreviewSettings.wrapLongLines
                                ? "whitespace-pre-wrap break-words"
                                : "whitespace-pre"), children: renderLineContent?.(lineParts, index) ?? (lineParts.content || " ") })] }, index));
            }) }) }));
}
//# sourceMappingURL=lightweight-diff-preview.js.map