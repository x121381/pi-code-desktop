import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Badge } from "@/components/ui/badge.js";
import { cn } from "@/components/lib/utils.js";
export function ContentPartView({ part, intl, sectionLabel, showToolHeader = true, }) {
    if (part.kind === "text") {
        if (!part.text) {
            return null;
        }
        const content = (_jsx("p", { className: "whitespace-pre-wrap break-words text-ui-sm leading-relaxed text-foreground", children: part.text }));
        return sectionLabel ? _jsx(DetailSection, { label: sectionLabel, children: content }) : content;
    }
    if (part.kind === "reasoning") {
        if (!part.text) {
            return null;
        }
        return (_jsx(DetailSection, { label: intl.formatMessage({ id: "modelTrajectory.reasoning" }), children: _jsx("p", { className: "whitespace-pre-wrap break-words font-mono text-ui-sm leading-relaxed text-foreground-subtle", children: part.text }) }));
    }
    if (part.kind === "tool-call") {
        return (_jsx(ToolPayload, { id: part.toolCallId, label: `${intl.formatMessage({ id: "modelTrajectory.toolCall" })} · ${part.toolName}`, payloadLabel: intl.formatMessage({ id: "modelTrajectory.toolInput" }), value: part.input, intl: intl, showHeader: showToolHeader }));
    }
    if (part.kind === "tool-result") {
        return (_jsx(ToolPayload, { id: part.toolCallId, label: part.toolName
                ? `${intl.formatMessage({ id: "modelTrajectory.toolResult" })} · ${part.toolName}`
                : intl.formatMessage({ id: "modelTrajectory.toolResult" }), payloadLabel: intl.formatMessage({ id: "modelTrajectory.toolOutput" }), value: part.output, intl: intl, showHeader: showToolHeader }));
    }
    if (part.kind === "image") {
        return (_jsxs("span", { className: "text-ui-sm italic text-foreground-subtle", children: ["[image", part.mediaType ? ` · ${part.mediaType}` : "", "]"] }));
    }
    return _jsx(CodeBlock, { value: formatValue(part.raw) });
}
function ToolPayload({ label, id, payloadLabel, value, intl, showHeader, }) {
    const payload = (_jsxs("div", { className: "flex flex-col gap-1.5 rounded-md border border-border bg-card px-2.5 py-2", children: [_jsx("div", { className: "flex min-w-0 flex-wrap items-center gap-1.5", children: _jsx("span", { className: "text-ui-sm font-medium text-foreground-subtle", children: payloadLabel }) }), _jsx(CodeBlock, { value: formatValue(value) })] }));
    return showHeader ? (_jsx(DetailSection, { label: label, meta: id ? _jsx(ToolIdBadge, { id: id, intl: intl }) : null, children: payload })) : (payload);
}
function ToolIdBadge({ id, intl }) {
    return (_jsxs(Badge, { variant: "outline", className: "max-w-full truncate font-mono text-foreground-subtle", title: id, children: [intl.formatMessage({ id: "modelTrajectory.toolId" }), ": ", id] }));
}
function DetailSection({ label, meta, children, }) {
    return (_jsxs("section", { className: "flex min-w-0 flex-col gap-1", children: [_jsxs("div", { className: "flex min-w-0 items-center gap-1 px-1.5 py-1 text-ui-sm font-medium text-foreground-subtle", children: [_jsx("span", { className: "min-w-0 flex-1 break-words font-mono", children: label }), meta ? _jsx("span", { className: "min-w-0 shrink", children: meta }) : null] }), children] }));
}
function CodeBlock({ value }) {
    return (_jsx("pre", { className: "max-h-64 min-w-0 overflow-auto whitespace-pre rounded-md bg-surface px-2 py-1.5 font-mono text-ui-sm leading-relaxed text-foreground", children: value || "—" }));
}
export function UsageBadges({ usage, intl, }) {
    if (!usage) {
        return null;
    }
    const parts = [];
    if (typeof usage.inputTokens === "number") {
        parts.push(intl.formatMessage({ id: "modelTrajectory.usage.input" }, { count: usage.inputTokens.toLocaleString() }));
    }
    if (typeof usage.outputTokens === "number") {
        parts.push(intl.formatMessage({ id: "modelTrajectory.usage.output" }, { count: usage.outputTokens.toLocaleString() }));
    }
    if (parts.length === 0) {
        return null;
    }
    return (_jsx(Badge, { variant: "outline", className: "font-mono text-foreground-subtle", children: parts.join("  ") }));
}
export function EmptyState({ text, detail, tone, }) {
    return (_jsxs("div", { className: "flex flex-col items-center gap-1 px-4 py-10 text-center", children: [_jsx("p", { className: cn("text-ui-base", tone === "error" ? "text-destructive" : "text-foreground-subtle"), children: text }), detail ? (_jsx("p", { className: "max-w-full break-words font-mono text-ui-base text-foreground-subtlest", children: detail })) : null] }));
}
export function summarizeRecords(records) {
    let totalTokens = 0;
    const models = new Set();
    for (const record of records) {
        const total = record.response?.usage?.totalTokens;
        if (typeof total === "number") {
            totalTokens += total;
        }
        const model = record.model.modelId ?? record.response?.modelId;
        if (model) {
            models.add(model);
        }
    }
    return { totalTokens, models: [...models] };
}
function formatValue(value) {
    if (value === undefined || value === null) {
        return "";
    }
    if (typeof value === "string") {
        return value;
    }
    try {
        return JSON.stringify(value, null, 2);
    }
    catch {
        return String(value);
    }
}
//# sourceMappingURL=ModelTrajectoryPaneDetails.js.map