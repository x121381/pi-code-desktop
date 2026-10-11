import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { memo, useLayoutEffect, useRef } from "react";
import { ArrowDownIcon, LoaderCircleIcon } from "lucide-react";
import { Button } from "../components/ui/button.js";
import { ScrollFadeViewport } from "../components/ui/scroll-fade-viewport.js";
import { useZCodeIntl } from "../i18n/IntlProvider.js";
import { useBackgroundBashOutput } from "../hooks/useBackgroundBashOutput.js";
import { logger } from "../logger.js";
export const BackgroundBashOutputSidePane = memo(function BackgroundBashOutputSidePane({ tab, visible, onOpenCodeViewer, }) {
    const { intl } = useZCodeIntl();
    const preview = useBackgroundBashOutput(tab, visible);
    const { latest, display, following } = preview;
    const scroll = useRef(null);
    const previousTop = useRef(0);
    useLayoutEffect(() => {
        if (!visible || !following || !scroll.current)
            return;
        scroll.current.scrollTop = scroll.current.scrollHeight;
        previousTop.current = scroll.current.scrollTop;
    }, [visible, following, display?.output]);
    return (_jsxs("section", { "data-testid": "background-bash-details", "data-work-id": tab.workId, "data-status": latest?.status ?? "loading", "data-following": following, className: "flex h-full min-h-0 min-w-0 flex-col bg-panel text-ui-base text-foreground-subtle", children: [preview.error ? (_jsxs("div", { role: "alert", className: "flex shrink-0 items-center gap-2 px-4 py-2 text-danger", children: [_jsx("span", { children: intl.formatMessage({ id: `bashOutput.error.${preview.error}` }) }), _jsx(Button, { variant: "ghost", size: "sm", onClick: preview.refresh, children: intl.formatMessage({ id: "bashOutput.retry" }) })] })) : null, _jsxs("div", { "data-testid": "background-bash-statusbar", className: "flex shrink-0 flex-wrap items-center justify-between gap-x-3 gap-y-1 px-4 pt-3 text-ui-sm", children: [latest?.status === "running" ? (_jsxs("span", { role: "status", "data-testid": "background-bash-running", className: "flex shrink-0 items-center gap-2", children: [_jsx(LoaderCircleIcon, { className: "size-3 animate-spin" }), intl.formatMessage({ id: "bashOutput.status.running" })] })) : null, latest && onOpenCodeViewer ? (_jsx(Button, { variant: "link", size: "xs", className: "ml-auto h-auto px-0 text-ui-sm text-foreground-subtle", title: latest.outputPath, "data-testid": "background-bash-file", onClick: () => onOpenCodeViewer({
                            type: "file",
                            path: latest.outputPath,
                            title: latest.outputPath.split(/[\\/]/).pop() ?? latest.outputPath,
                            workspacePath: tab.workspacePath,
                            workspaceIdentity: tab.workspaceIdentity,
                            workspaceRemoteSessionId: tab.remoteSessionId,
                        }), children: intl.formatMessage({ id: "bashOutput.fullFile" }) })) : null] }), _jsxs("div", { className: "relative min-h-0 flex-1", children: [_jsx(ScrollFadeViewport, { ref: scroll, "data-testid": "background-bash-scroll", className: "h-full overflow-auto px-4 py-3", tabIndex: 0, onScroll: (event) => {
                            if (!visible)
                                return;
                            const el = event.currentTarget;
                            const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight <= 8;
                            if (following && el.scrollTop < previousTop.current && !atBottom) {
                                preview.pause();
                                logger.debug("Background Bash output following changed", {
                                    workId: tab.workId,
                                    following: false,
                                });
                            }
                            else if (!following && atBottom) {
                                // 手动滚到底部也要恢复查询跟随，否则已到底时悬浮箭头仍会常驻。
                                preview.resume();
                                logger.debug("Background Bash output following changed", {
                                    workId: tab.workId,
                                    following: true,
                                });
                            }
                            previousTop.current = el.scrollTop;
                        }, children: _jsx("pre", { "data-testid": "background-bash-output", className: "whitespace-pre-wrap break-words font-mono text-ui-base leading-5", children: display?.output || (display ? intl.formatMessage({ id: "bashOutput.empty" }) : "") }) }), !following ? (_jsx(Button, { variant: "outline", size: "icon", type: "button", className: "absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-card shadow-sm hover:bg-card-selected", "data-testid": "background-bash-resume", "aria-label": intl.formatMessage({ id: "chat.scrollToBottom" }), title: intl.formatMessage({ id: "chat.scrollToBottom" }), onClick: preview.resume, children: _jsx(ArrowDownIcon, { className: "size-4" }) })) : null] })] }));
});
//# sourceMappingURL=BackgroundBashOutputSidePane.js.map