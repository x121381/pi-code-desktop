import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, LoaderIcon } from "lucide-react";
import { resolveWebRemoteControlWorkspaceKey, } from "@zcode/shared";
import { Button } from "@/components/ui/button.js";
import { WebRemoteControlMobileTaskHome, persistWebRemoteControlMobileTaskHomePreferences, readWebRemoteControlMobileTaskHomePreferences, } from "@/WebRemoteControlMobileTaskHome.js";
import { WebRemoteControlThemeMenu } from "@/WebRemoteControlThemeMenu.js";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
import { logger } from "@/logger.js";
import { useWebRemoteControlTerminalTransportState } from "@/webRemoteControlTerminalTransportState.js";
export function isWebRemoteControlMobileChatHistoryState(state) {
    return (typeof state === "object" &&
        state !== null &&
        state.zcodeMobilePage === "chat");
}
function pushWebRemoteControlMobileChatHistory() {
    if (typeof window === "undefined") {
        return;
    }
    if (isWebRemoteControlMobileChatHistoryState(window.history.state)) {
        return;
    }
    window.history.pushState({ zcodeMobilePage: "chat" }, "");
}
function resolveInitialWebRemoteControlMobilePage(initialNavigationIntent) {
    if (initialNavigationIntent === "chat") {
        return "chat";
    }
    // Bugfix: 手机端在聊天页刷新时，React 内存状态会丢失，但浏览器会保留当前 history.state。
    // 这里复用点击进入聊天页时写入的 history state，避免刷新后只恢复 task 选中态却回到任务首页。
    if (typeof window !== "undefined" &&
        isWebRemoteControlMobileChatHistoryState(window.history.state)) {
        return "chat";
    }
    return "home";
}
export function WebRemoteControlMobileShell({ activeTaskId, activeWorkspaceIdentity, activeWorkspacePath, chatContent, chatOverlay, initialNavigationIntent, initialWorkspaceList, isSidePaneOpen = false, onCloseSidePane, onSelectTask, onStartDraftInWorkspace, renderChatHeader, sidePaneContent, switcher, webRemoteControlTerminalTransportState, }) {
    const { intl } = useZCodeIntl();
    const [currentPage, setCurrentPage] = useState(() => resolveInitialWebRemoteControlMobilePage(initialNavigationIntent));
    const [taskHomePreferences, setTaskHomePreferences] = useState(() => readWebRemoteControlMobileTaskHomePreferences());
    const [homeRefreshKey, setHomeRefreshKey] = useState(0);
    const [switchingWorkspace, setSwitchingWorkspace] = useState(false);
    const terminalTransportState = useWebRemoteControlTerminalTransportState(webRemoteControlTerminalTransportState);
    const syncedMobileViewStateRef = useRef(null);
    const shouldInertChatSurface = Boolean(sidePaneContent) && isSidePaneOpen;
    const navigateToChat = useCallback(() => {
        setCurrentPage("chat");
        pushWebRemoteControlMobileChatHistory();
    }, []);
    const handleTaskHomePreferencesChange = useCallback((preferences) => {
        // Bugfix: 手机远控任务首页进入 task 后只是卸载组件，shell 内存 state 足够保留排序；
        // 但刷新页面会重建整个 React tree，之前的默认值会覆盖用户选择。
        // 这里在更新 shell state 的同时写入 localStorage，让刷新后也能恢复同一排序/分组偏好。
        persistWebRemoteControlMobileTaskHomePreferences(preferences);
        logger.debug("[WebRemoteControlMobileShell] 更新手机端任务首页偏好", preferences);
        setTaskHomePreferences(preferences);
    }, []);
    const navigateHome = useCallback(() => {
        setHomeRefreshKey((key) => key + 1);
        if (typeof window !== "undefined" &&
            isWebRemoteControlMobileChatHistoryState(window.history.state)) {
            window.history.back();
            return;
        }
        setCurrentPage("home");
    }, []);
    useEffect(() => {
        if (initialNavigationIntent !== "chat") {
            return;
        }
        navigateToChat();
    }, [initialNavigationIntent, navigateToChat]);
    useEffect(() => {
        if (typeof window === "undefined") {
            return;
        }
        const handlePopState = (event) => {
            const nextPage = isWebRemoteControlMobileChatHistoryState(event.state) ? "chat" : "home";
            setCurrentPage(nextPage);
            if (nextPage === "home") {
                setHomeRefreshKey((key) => key + 1);
            }
        };
        window.addEventListener("popstate", handlePopState);
        return () => {
            window.removeEventListener("popstate", handlePopState);
        };
    }, []);
    useEffect(() => {
        if (!switcher.updateMobileViewState) {
            return;
        }
        const workspaceKey = resolveWebRemoteControlWorkspaceKey({
            workspacePath: activeWorkspacePath,
            workspaceIdentity: activeWorkspaceIdentity,
        });
        const dedupeKey = `${workspaceKey}:${activeTaskId ?? ""}`;
        if (syncedMobileViewStateRef.current === dedupeKey) {
            return;
        }
        syncedMobileViewStateRef.current = dedupeKey;
        // Bugfix: 手机端“新建任务/分叉”会自动切到新 task，但之前只有点任务列表项才会上报 mobileViewState。
        // 这样桌面端会继续认为手机还在旧 task，导致新 task 列表刷新滞后。
        // 这里在 activeTaskId 变化时立即同步，确保跨端选中态和任务列表收敛一致。
        void switcher
            .updateMobileViewState(workspaceKey, activeTaskId ?? undefined)
            .catch((error) => {
            const message = error instanceof Error ? error.message : String(error);
            logger.warn("[WebRemoteControlMobileShell] 同步 mobileViewState 失败", {
                error: message,
                workspaceKey,
                taskId: activeTaskId ?? null,
            });
        });
    }, [
        activeTaskId,
        activeWorkspaceIdentity,
        activeWorkspacePath,
        switcher,
    ]);
    // Bugfix: 移动端聊天/侧栏都是 flex 子树，默认 min-width:auto 会按长消息的
    // min-content 宽度撑开抽屉；窄屏随后从左侧裁掉正文。沿整条宽度链显式允许收缩，
    // 让 subagent 输出、进程面板和正文在抽屉内换行。
    return (_jsxs("div", { className: "relative flex h-full min-h-0 min-w-0 flex-col bg-background", children: [currentPage === "home" ? (_jsx(WebRemoteControlMobileTaskHome, { activeTaskId: activeTaskId, activeWorkspaceIdentity: activeWorkspaceIdentity, activeWorkspacePath: activeWorkspacePath, initialResult: initialWorkspaceList, onCrossWorkspaceSwitchingChange: setSwitchingWorkspace, onNavigateHome: navigateHome, onNavigateToChat: navigateToChat, preferences: taskHomePreferences, onPreferencesChange: handleTaskHomePreferencesChange, refreshKey: homeRefreshKey, onSelectTask: onSelectTask, onStartDraftInWorkspace: onStartDraftInWorkspace, switcher: switcher })) : (_jsxs("section", { className: "flex h-full min-h-0 min-w-0 flex-col bg-background text-foreground", "data-mobile-page": "chat", children: [_jsxs("div", { className: "flex h-11 shrink-0 items-center gap-2 border-b border-border bg-header px-2", children: [_jsx(Button, { type: "button", variant: "ghost", size: "icon-sm", "aria-label": intl.formatMessage({
                                    id: "webRemoteControl.mobileShell.backHome",
                                }), onClick: navigateHome, children: _jsx(ArrowLeft, { className: "size-4" }) }), _jsx("span", { className: "min-w-0 flex-1 truncate text-ui-base font-medium", children: intl.formatMessage({ id: "webRemoteControl.mobileShell.chatTitle" }) }), _jsx(WebRemoteControlThemeMenu, {})] }), renderChatHeader({ onBackHome: navigateHome }), _jsxs("div", { className: "relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden", children: [_jsx("main", { className: "flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden", "aria-hidden": shouldInertChatSurface ? true : undefined, "data-mobile-chat-surface": shouldInertChatSurface ? "inert" : undefined, inert: shouldInertChatSurface ? true : undefined, children: chatContent }), sidePaneContent ? (_jsxs("div", { className: [
                                    "absolute inset-0 z-30 transition-opacity duration-200 ease-out",
                                    isSidePaneOpen ? "opacity-100" : "pointer-events-none opacity-0",
                                ].join(" "), "aria-hidden": !isSidePaneOpen, "data-mobile-side-pane-overlay": "true", children: [_jsx("button", { type: "button", className: "absolute inset-0 bg-background/60 backdrop-blur-[1px]", "aria-label": intl.formatMessage({ id: "sidePane.collapse" }), onClick: onCloseSidePane }), _jsx("div", { className: [
                                            "absolute top-0 right-0 h-full w-[min(88vw,28rem)] max-w-full border-l border-border bg-background shadow-2xl transition-transform duration-200 ease-out",
                                            isSidePaneOpen ? "translate-x-0" : "translate-x-full",
                                        ].join(" "), children: sidePaneContent })] })) : null, chatOverlay ? (_jsx("div", { className: "pointer-events-none absolute inset-0 z-40", "data-mobile-chat-overlay": "true", children: _jsx("div", { className: "pointer-events-auto", children: chatOverlay }) })) : null] })] })), switchingWorkspace ? (_jsx("div", { className: "absolute inset-0 z-40 flex items-center justify-center bg-background/72 backdrop-blur-[1px]", "aria-live": "polite", "aria-busy": "true", children: _jsxs("div", { className: "flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-ui-base text-foreground-subtle shadow-sm", children: [_jsx(LoaderIcon, { className: "size-4 animate-spin" }), intl.formatMessage({ id: "common.loading" })] }) })) : null, terminalTransportState === "reconnecting" ? (_jsx("div", { className: "pointer-events-none absolute top-3 left-1/2 z-50 flex -translate-x-1/2 justify-center px-3", "aria-live": "polite", "aria-busy": "true", "data-web-remote-control-reconnect-notice": "true", children: _jsxs("div", { className: "flex max-w-[calc(100vw-1.5rem)] items-center gap-2 rounded-lg border border-border bg-toast px-3 py-2 text-ui-base text-foreground shadow-lg", children: [_jsx(LoaderIcon, { className: "size-4 shrink-0 animate-spin text-foreground-subtle" }), _jsx("span", { className: "min-w-0 whitespace-nowrap", children: intl.formatMessage({ id: "webRemoteControl.mobileShell.reconnecting" }) })] }) })) : null] }));
}
//# sourceMappingURL=WebRemoteControlMobileShell.js.map