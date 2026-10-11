import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/* oxlint-disable eslint(max-lines) -- 开发者工具面板集中展示 token 表和网络 headers，后续继续扩展时再按区块拆分。 */
import { ActivityIcon, BugIcon, NetworkIcon } from "lucide-react";
import { useZCodeIntl } from "./i18n/IntlProvider.js";
import { useSessionDebug } from "./hooks/useSessionDebug.js";
function formatNumber(locale, value) {
    if (value === undefined || !Number.isFinite(value)) {
        return "-";
    }
    return new Intl.NumberFormat(locale).format(value);
}
function formatPercent(locale, value) {
    if (value === null || value === undefined || !Number.isFinite(value)) {
        return "-";
    }
    return new Intl.NumberFormat(locale, {
        maximumFractionDigits: 1,
        style: "percent",
    }).format(Math.max(0, value));
}
function formatMilliseconds(locale, value) {
    if (value === undefined || !Number.isFinite(value)) {
        return "-";
    }
    return `${new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(value)} ms`;
}
function formatTimestamp(locale, value, fallback) {
    const parsedTimestamp = value ? Date.parse(value) : Number.NaN;
    const timestamp = Number.isFinite(parsedTimestamp) ? parsedTimestamp : fallback;
    return new Intl.DateTimeFormat(locale, {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    }).format(new Date(timestamp));
}
function networkStatusLabelId(statusType) {
    switch (statusType) {
        case "model_request_started":
            return "developerTools.network.status.started";
        case "model_request_completed":
            return "developerTools.network.status.completed";
        case "model_request_failed":
            return "developerTools.network.status.failed";
        case "model_retry_scheduled":
            return "developerTools.network.status.retry";
        case "model_stream_stalled":
            return "developerTools.network.status.stalled";
    }
}
function HeaderDetails({ title, headers, emptyLabel, }) {
    const entries = Object.entries(headers).sort(([left], [right]) => left.localeCompare(right));
    return (_jsxs("details", { className: "border-t border-border px-3 py-2", children: [_jsx("summary", { className: "cursor-default select-none text-ui-xs font-medium text-foreground-subtle", children: title }), entries.length === 0 ? (_jsx("div", { className: "pt-2 text-ui-xs text-foreground-subtle", children: emptyLabel })) : (_jsx("dl", { className: "grid grid-cols-[minmax(7rem,0.35fr)_minmax(0,1fr)] gap-x-3 gap-y-1 pt-2 text-ui-xs", children: entries.map(([key, value]) => (_jsxs("div", { className: "contents", children: [_jsx("dt", { className: "min-w-0 break-all font-mono text-foreground-subtle", children: key }), _jsx("dd", { className: "min-w-0 break-all font-mono text-foreground", children: value })] }, key))) }))] }));
}
export function DeveloperToolsPane({ workspacePath, workspaceIdentity, taskId, enabled = true, }) {
    const { intl, locale } = useZCodeIntl();
    const debugState = useSessionDebug({ workspacePath, workspaceIdentity, taskId, enabled });
    const networkEntries = [...debugState.networkEntries].reverse();
    return (_jsxs("div", { className: "flex h-full min-h-0 flex-col bg-background", "data-testid": "developer-tools-pane", children: [_jsxs("div", { className: "flex shrink-0 items-center gap-2 border-b border-border px-4 py-3", children: [_jsx(BugIcon, { className: "size-4 text-foreground-subtle", "aria-hidden": "true" }), _jsx("h2", { className: "text-ui-base font-semibold text-foreground", children: intl.formatMessage({ id: "developerTools.title" }) })] }), _jsxs("div", { className: "min-h-0 flex-1 space-y-5 overflow-auto px-4 py-4", children: [debugState.error ? (_jsx("div", { role: "alert", className: "text-ui-base text-foreground-subtle", children: intl.formatMessage({ id: "developerTools.loadError" }) })) : null, _jsxs("section", { className: "space-y-3", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(ActivityIcon, { className: "size-4 text-foreground-subtle", "aria-hidden": "true" }), _jsx("h3", { className: "text-ui-base font-semibold text-foreground", children: intl.formatMessage({ id: "developerTools.tokenSection" }) })] }), _jsxs("div", { className: "grid grid-cols-2 gap-x-4 gap-y-1 text-ui-base text-foreground-subtle", children: [_jsx("span", { children: intl.formatMessage({ id: "tokenDebug.summary.requests" }) }), _jsx("span", { className: "font-mono text-foreground", children: formatNumber(locale, debugState.cache?.hitRateRequestCount) }), _jsx("span", { children: intl.formatMessage({ id: "tokenDebug.summary.average" }) }), _jsx("span", { className: "font-mono text-foreground", children: formatPercent(locale, debugState.cache?.hitRate) }), _jsx("span", { children: intl.formatMessage({ id: "tokenDebug.summary.input" }) }), _jsx("span", { className: "font-mono text-foreground", children: formatNumber(locale, debugState.cache?.totalInputTokens) }), _jsx("span", { children: intl.formatMessage({ id: "tokenDebug.summary.cacheRead" }) }), _jsx("span", { className: "font-mono text-foreground", children: formatNumber(locale, debugState.cache?.totalCacheReadTokens) })] }), _jsx("div", { className: "overflow-auto rounded-md border border-border", children: _jsxs("table", { className: "w-full min-w-[38rem] border-collapse text-ui-xs", children: [_jsx("thead", { className: "sticky top-0 bg-background text-foreground-subtle", children: _jsxs("tr", { className: "border-b border-border", children: [_jsx("th", { className: "px-2 py-1.5 text-left font-medium", children: intl.formatMessage({ id: "tokenDebug.column.round" }) }), _jsx("th", { className: "px-2 py-1.5 text-right font-medium", children: intl.formatMessage({ id: "tokenDebug.column.input" }) }), _jsx("th", { className: "px-2 py-1.5 text-right font-medium", children: intl.formatMessage({ id: "tokenDebug.column.output" }) }), _jsx("th", { className: "px-2 py-1.5 text-right font-medium", title: intl.formatMessage({ id: "tokenDebug.tpsDescription" }), children: intl.formatMessage({ id: "tokenDebug.column.tps" }) }), _jsx("th", { className: "px-2 py-1.5 text-right font-medium", children: intl.formatMessage({ id: "tokenDebug.column.total" }) }), _jsx("th", { className: "px-2 py-1.5 text-right font-medium", children: intl.formatMessage({ id: "tokenDebug.column.reasoning" }) }), _jsx("th", { className: "px-2 py-1.5 text-right font-medium", children: intl.formatMessage({ id: "tokenDebug.column.cacheRead" }) }), _jsx("th", { className: "px-2 py-1.5 text-right font-medium", children: intl.formatMessage({ id: "tokenDebug.column.cacheWrite" }) }), _jsx("th", { className: "px-2 py-1.5 text-right font-medium", children: intl.formatMessage({ id: "tokenDebug.column.hitRate" }) })] }) }), _jsx("tbody", { children: debugState.rounds.length === 0 ? (_jsx("tr", { children: _jsx("td", { className: "px-2 py-3 text-center text-foreground-subtle", colSpan: 9, children: intl.formatMessage({ id: "tokenDebug.empty" }) }) })) : (debugState.rounds.map((round) => (_jsxs("tr", { className: "border-b border-border last:border-b-0", children: [_jsx("td", { className: "px-2 py-1.5 font-mono text-foreground", children: formatNumber(locale, round.requestIndex) }), _jsx("td", { className: "px-2 py-1.5 text-right font-mono text-foreground", children: formatNumber(locale, round.usage.inputTokens) }), _jsx("td", { className: "px-2 py-1.5 text-right font-mono text-foreground", children: formatNumber(locale, round.usage.outputTokens) }), _jsx("td", { className: "px-2 py-1.5 text-right font-mono text-foreground", "data-testid": "token-debug-tps", children: round.tokensPerSecond === null
                                                            ? "—"
                                                            : new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(round.tokensPerSecond) }), _jsx("td", { className: "px-2 py-1.5 text-right font-mono text-foreground", children: formatNumber(locale, round.usage.totalTokens) }), _jsx("td", { className: "px-2 py-1.5 text-right font-mono text-foreground", children: formatNumber(locale, round.usage.reasoningTokens) }), _jsx("td", { className: "px-2 py-1.5 text-right font-mono text-foreground", children: formatNumber(locale, round.usage.cachedInputTokens) }), _jsx("td", { className: "px-2 py-1.5 text-right font-mono text-foreground", children: formatNumber(locale, round.usage.cachedWriteInputTokens) }), _jsx("td", { className: "px-2 py-1.5 text-right font-mono text-foreground", children: formatPercent(locale, round.hitRate) })] }, round.eventKey)))) })] }) })] }), _jsxs("section", { className: "space-y-3", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(NetworkIcon, { className: "size-4 text-foreground-subtle", "aria-hidden": "true" }), _jsx("h3", { className: "text-ui-base font-semibold text-foreground", children: intl.formatMessage({ id: "developerTools.networkSection" }) })] }), networkEntries.length === 0 ? (_jsx("div", { className: "rounded-md border border-border px-3 py-4 text-center text-ui-base text-foreground-subtle", children: intl.formatMessage({ id: "developerTools.network.empty" }) })) : (_jsx("div", { className: "space-y-2", children: networkEntries.map((entry) => (_jsxs("div", { className: "overflow-hidden rounded-md border border-border", children: [_jsxs("div", { className: "space-y-2 px-3 py-2", children: [_jsxs("div", { className: "flex min-w-0 items-center justify-between gap-3", children: [_jsxs("div", { className: "min-w-0", children: [_jsx("div", { className: "truncate text-ui-base font-semibold text-foreground", children: intl.formatMessage({ id: networkStatusLabelId(entry.statusType) }) }), _jsx("div", { className: "truncate font-mono text-ui-xs text-foreground-subtle", children: entry.requestId ?? entry.eventKey })] }), _jsx("div", { className: "shrink-0 font-mono text-ui-xs text-foreground-subtle", children: formatTimestamp(locale, entry.timestamp, entry.recordedAt) })] }), _jsxs("div", { className: "grid grid-cols-2 gap-x-3 gap-y-1 text-ui-xs text-foreground-subtle", children: [_jsx("span", { children: intl.formatMessage({ id: "developerTools.network.model" }) }), _jsx("span", { className: "min-w-0 truncate font-mono text-foreground", children: entry.modelId ?? "-" }), _jsx("span", { children: intl.formatMessage({ id: "developerTools.network.provider" }) }), _jsx("span", { className: "min-w-0 truncate font-mono text-foreground", children: entry.providerId ?? entry.providerKind ?? "-" }), _jsx("span", { children: intl.formatMessage({ id: "developerTools.network.attempt" }) }), _jsx("span", { className: "font-mono text-foreground", children: entry.attempt !== undefined && entry.maxAttempts !== undefined
                                                                ? `${entry.attempt}/${entry.maxAttempts === 0 ? "∞" : entry.maxAttempts}`
                                                                : "-" }), _jsx("span", { children: intl.formatMessage({ id: "developerTools.network.http" }) }), _jsx("span", { className: "font-mono text-foreground", children: formatNumber(locale, entry.statusCode) }), _jsx("span", { children: intl.formatMessage({ id: "developerTools.network.duration" }) }), _jsx("span", { className: "font-mono text-foreground", children: formatMilliseconds(locale, entry.durationMs ?? entry.idleMs) }), _jsx("span", { children: intl.formatMessage({ id: "developerTools.network.retryDelay" }) }), _jsx("span", { className: "font-mono text-foreground", children: formatMilliseconds(locale, entry.delayMs) })] }), entry.baseURL ? (_jsx("div", { className: "min-w-0 truncate font-mono text-ui-xs text-foreground-subtle", children: entry.baseURL })) : null, entry.message ? (_jsx("div", { className: "break-words rounded-md bg-surface px-2 py-1.5 text-ui-xs text-foreground", children: entry.message })) : null] }), _jsx(HeaderDetails, { title: intl.formatMessage({ id: "developerTools.network.requestHeaders" }, { count: formatNumber(locale, entry.requestHeaderCount) }), headers: entry.requestHeaders, emptyLabel: intl.formatMessage({ id: "developerTools.network.noHeaders" }) }), _jsx(HeaderDetails, { title: intl.formatMessage({ id: "developerTools.network.responseHeaders" }, { count: formatNumber(locale, entry.responseHeaderCount) }), headers: entry.responseHeaders, emptyLabel: intl.formatMessage({ id: "developerTools.network.noHeaders" }) })] }, entry.eventKey))) }))] })] })] }));
}
//# sourceMappingURL=DeveloperToolsPane.js.map