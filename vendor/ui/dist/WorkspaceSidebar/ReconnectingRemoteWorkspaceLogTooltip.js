import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { LoaderCircle } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useZCodeIntl } from "../i18n/IntlProvider.js";
import { cn } from "../components/lib/utils.js";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, } from "../components/ui/tooltip.js";
export function scrollRemoteConnectionLogsToLatest(viewport) {
    viewport.scrollTop = viewport.scrollHeight;
}
export function scheduleRemoteConnectionLogsScrollToLatest(viewport, scheduleFrame = (callback) => window.requestAnimationFrame(callback), cancelFrame = (frameId) => window.cancelAnimationFrame(frameId)) {
    scrollRemoteConnectionLogsToLatest(viewport);
    const frameId = scheduleFrame(() => scrollRemoteConnectionLogsToLatest(viewport));
    return () => cancelFrame(frameId);
}
export function ReconnectingRemoteWorkspaceLogTooltip({ logs, children, }) {
    const { intl } = useZCodeIntl();
    const [open, setOpen] = useState(false);
    const logViewportRef = useRef(null);
    const cancelScheduledScrollRef = useRef(() => { });
    const scrollLogsToLatest = useCallback((viewport) => {
        cancelScheduledScrollRef.current();
        // Tooltip 每次 hover 都会重新展示日志浮层，浏览器默认从 scrollTop=0 开始。
        // 连接日志需要优先看到最新进度，因此在节点挂载时先滚一次，并在下一帧布局稳定后再补滚一次。
        cancelScheduledScrollRef.current =
            scheduleRemoteConnectionLogsScrollToLatest(viewport);
    }, []);
    const setLogViewportRef = useCallback((viewport) => {
        logViewportRef.current = viewport;
        if (viewport) {
            scrollLogsToLatest(viewport);
        }
    }, [scrollLogsToLatest]);
    useEffect(() => {
        if (open && logViewportRef.current) {
            scrollLogsToLatest(logViewportRef.current);
        }
        return undefined;
    }, [logs.length, open, scrollLogsToLatest]);
    useEffect(() => () => cancelScheduledScrollRef.current(), []);
    return (_jsx(TooltipProvider, { children: _jsxs(Tooltip, { onOpenChange: setOpen, children: [_jsx(TooltipTrigger, { asChild: true, children: children ? (children) : (_jsxs("div", { className: "flex shrink-0 items-center gap-1 text-ui-base text-foreground-subtle", "aria-label": intl.formatMessage({
                            id: "workspaceSidebar.connecting",
                        }), children: [_jsx(LoaderCircle, { className: "h-3 w-3 animate-spin" }), _jsx("span", { children: intl.formatMessage({ id: "workspaceSidebar.connecting" }) })] })) }), _jsx(TooltipContent, { side: "right", align: "start", sideOffset: 6, className: "w-[min(24rem,calc(100vw-1rem))] max-w-[min(24rem,calc(100vw-1rem))] overflow-hidden px-3 py-2", children: _jsxs("div", { className: "space-y-2", children: [_jsx("div", { className: "text-ui-sm font-medium text-tooltip-foreground", children: intl.formatMessage({ id: "remote.connectionLog" }) }), _jsx("div", { ref: setLogViewportRef, className: "max-h-56 space-y-1 overflow-x-hidden overflow-y-auto font-mono text-ui-sm", children: logs.length > 0 ? (logs.map((entry) => (_jsxs("div", { className: "flex min-w-0 items-start leading-5", children: [_jsx("span", { className: "shrink-0 text-tooltip-foreground/60", children: entry.timestamp }), _jsxs("span", { className: cn("mx-2 shrink-0", entry.level === "success"
                                                ? "text-success"
                                                : entry.level === "warn"
                                                    ? "text-warning"
                                                    : entry.level === "error"
                                                        ? "text-destructive"
                                                        : "text-tooltip-foreground/70"), children: ["[", entry.level.toUpperCase(), "]"] }), _jsx("span", { className: "min-w-0 flex-1 break-all whitespace-pre-wrap text-tooltip-foreground", children: entry.message })] }, entry.id)))) : (_jsxs("div", { className: "text-tooltip-foreground/70", children: ["[INFO] ", intl.formatMessage({ id: "remote.connectionLogEmpty" })] })) })] }) })] }) }));
}
//# sourceMappingURL=ReconnectingRemoteWorkspaceLogTooltip.js.map