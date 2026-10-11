import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/* eslint-disable max-lines -- Side pane 当前集中承载 tabs、browser/git/code-viewer 内容；完整拆分需按 pane 功能边界继续推进。 */
import { ServiceProvider } from "@/hooks/useServices.js";
import { useEffect, useMemo, useRef, useState } from "react";
import { closestCenter, DndContext, DragOverlay, PointerSensor, useSensor, useSensors, } from "@dnd-kit/core";
import { horizontalListSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import { PreviewPane } from "@/PreviewPane.js";
import { SidePaneTerminalPane } from "@/SidePaneTerminalPane.js";
import { useIsOfficeMode } from "@/hooks/useInterfaceMode.js";
import { WorkspaceSidePaneToggleButton } from "@/WorkspaceSidePaneToggleButton.js";
import { DesktopWindowControls } from "@/DesktopWindowControls.js";
import { BrowserUseSidePaneContent } from "@/browser-use/BrowserUseSidePaneContent.js";
import { BrowserSitePermissionsPage } from "@/browser-use/BrowserSitePermissionsPage.js";
import { findScreenshotSurfaceTabForRender } from "@/browser-use/useBrowserScreenshotSurfaceRequest.js";
import { HumanBrowserView } from "@/browser-use/HumanBrowserView.js";
import { ScopedErrorBoundary } from "@/ErrorBoundary.js";
import { GitPane } from "@/GitPane.js";
import { TreemappingPane } from "@/TreemappingPane.js";
import { WhiteboardPane } from "@/WhiteboardPane.js";
import { ModelTrajectoryPane } from "@/ModelTrajectoryPane.js";
import { DeveloperToolsPane } from "@/DeveloperToolsPane.js";
import { cn } from "@/components/lib/utils.js";
import { Button } from "@/components/ui/button.js";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu.js";
import { ResizableHandle, ResizablePanel } from "@/components/ui/resizable.js";
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs.js";
import { SidePaneTabOverview } from "@/app-shell/SidePaneTabOverview.js";
import { SubagentSessionSidePane } from "@/app-shell/SubagentSessionSidePane.js";
import { SubagentDirectorySidePane } from "@/app-shell/SubagentDirectorySidePane.js";
import { SelectionSideChatPane } from "@/app-shell/SelectionSideChatPane.js";
import { BackgroundBashOutputSidePane } from "@/app-shell/BackgroundBashOutputSidePane.js";
import { PlanDetailSidePane } from "@/app-shell/PlanDetailSidePane.js";
import { PluginUiLauncherItems, PluginUiSidePane, useOpenPluginUi } from "@/plugin-ui/index.js";
import { WorkflowRunSidePane } from "@/app-shell/WorkflowRunSidePane.js";
import { WorkflowRunDirectorySidePane } from "@/app-shell/WorkflowRunDirectorySidePane.js";
import { WorkflowActorSessionSidePane } from "@/app-shell/WorkflowActorSessionSidePane.js";
import { WorkflowWorkspaceSidePane } from "@/app-shell/WorkflowWorkspaceSidePane.js";
import { WorkflowArtifactSidePane } from "@/app-shell/WorkflowArtifactSidePane.js";
import { getSidePaneTabTitle, SidePaneTabDragOverlay, SortableSidePaneTabTrigger, } from "@/app-shell/SidePaneTabTrigger.js";
import { resolveSidePaneTabsOverflow, SIDE_PANE_DEFAULT_EXPANDED_RATIO, } from "@/app-shell/sidePaneLayout.js";
import { resolveAnimatedSidePanePanelLayout, resolveOpenTabLauncherItemIds, shouldOfferSelectionSideConversation, shouldRenderPreviewPaneHeavyContent, } from "@/app-shell/animatedSidePanePanelModel.js";
import { useDeveloperToolsVisibility } from "@/hooks/useDeveloperToolsVisibility.js";
import { usePlatform } from "@/hooks/usePlatform.js";
import { useIsMobileTextInputViewport } from "@/lib/mobileTextInput.js";
import { logger } from "@/logger.js";
import { formatTaskRelativeTime } from "@/lib/taskListItemPresentation.js";
import { shouldMountSidePaneContent, shouldMountBrowserTabGuest, } from "@/lib/workspaceSidePane.js";
import { inferMediaPreview } from "@/lib/codeViewer.js";
import { getVisibleSidePaneTabs } from "@/lib/workspaceSidePane.js";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
import { BugIcon, FileDiffIcon, GlobeIcon, MessageSquareTextIcon, PlusIcon, SquareTerminalIcon, } from "lucide-react";
const SIDE_PANE_CONTENT_WIDTH_LOCK_DURATION_MS = 200;
const PREVIEW_PANE_RESIZE_SETTLE_DELAY_MS = 220;
const OPEN_TAB_LAUNCHER_BUTTON_CLASS = "side-pane-open-tab-button flex h-12 min-w-0 items-center gap-3 rounded-xl bg-surface px-3 text-ui-base font-medium text-foreground transition-colors hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";
const EMPTY_SIDE_PANE_TABS = [];
const EMPTY_TABS_SCROLL_MASK_EDGES = {
    left: false,
    right: false,
};
function SuspendedBrowserSidePaneContent({ tab, }) {
    const platform = usePlatform();
    const tabId = tab.type === "browser-use" ? tab.tabId : tab.id;
    const generation = tab.residencyGeneration ?? 0;
    useEffect(() => {
        if (tab.residency !== "suspended")
            return;
        // React effect 在旧 UnifiedBrowserView 提交 unmount 后运行；此时回 ack，main 才能安全
        // 关闭对应 guest WebContents，避免 suspend 被 render-process-gone 当成 crash 立即重建。
        // info 级打点：挂起换壳会先卸载 <webview>，若卸载瞬间
        // CDP 仍 attached 即打开主进程 UAF 窗口；这条日志把换壳时刻与 UnifiedBrowserView 的
        // 卸载打点对齐，用于归因 guest destroyed 的销毁者。
        logger.info("[browser-use] tab 换挂起壳，suspend ready ack", { generation, tabId });
        void platform.browserViewSuspendReady?.({ tabId, generation }).catch((error) => {
            logger.debug("[browser-use] suspend ready ack 失败", {
                error: error instanceof Error ? error.message : String(error),
                generation,
                tabId,
            });
        });
    }, [generation, platform, tab.residency, tabId]);
    return (_jsx(TabsContent, { value: tab.id, forceMount: true, "data-browser-tab-residency": "suspended", className: "relative z-10 h-full min-h-0 bg-background data-[state=inactive]:hidden" }));
}
function readViewportInlineIntersectionSize(element) {
    if (!element || typeof window === "undefined") {
        return null;
    }
    const viewportWidth = window.innerWidth || document.documentElement.clientWidth || 0;
    if (viewportWidth <= 0) {
        return null;
    }
    const rect = element.getBoundingClientRect();
    const visibleLeft = Math.max(0, rect.left);
    const visibleRight = Math.min(viewportWidth, rect.right);
    return Math.max(0, Math.round(visibleRight - visibleLeft));
}
function useViewportInlineIntersectionSize(elementRef, enabled) {
    const [visibleInlineSizePx, setVisibleInlineSizePx] = useState(null);
    useEffect(() => {
        if (!enabled || typeof window === "undefined") {
            setVisibleInlineSizePx(null);
            return;
        }
        const element = elementRef.current;
        if (!element) {
            setVisibleInlineSizePx(null);
            return;
        }
        let frameId = null;
        const update = () => {
            frameId = null;
            const next = readViewportInlineIntersectionSize(element);
            setVisibleInlineSizePx((current) => (current === next ? current : next));
        };
        const scheduleUpdate = () => {
            if (frameId !== null) {
                return;
            }
            if (typeof window.requestAnimationFrame !== "function") {
                update();
                return;
            }
            frameId = window.requestAnimationFrame(update);
        };
        update();
        window.addEventListener("resize", scheduleUpdate, { passive: true });
        window.addEventListener("scroll", scheduleUpdate, {
            capture: true,
            passive: true,
        });
        const resizeObserver = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(scheduleUpdate);
        resizeObserver?.observe(element);
        return () => {
            window.removeEventListener("resize", scheduleUpdate);
            window.removeEventListener("scroll", scheduleUpdate, { capture: true });
            resizeObserver?.disconnect();
            if (frameId !== null) {
                window.cancelAnimationFrame(frameId);
            }
        };
    }, [elementRef, enabled]);
    return visibleInlineSizePx;
}
function useWindowResizeSettling(enabled) {
    const [isResizeSettling, setIsResizeSettling] = useState(false);
    const resizeSettleTimerRef = useRef(null);
    useEffect(() => {
        if (!enabled || typeof window === "undefined") {
            setIsResizeSettling(false);
            return;
        }
        const finishSettling = () => {
            resizeSettleTimerRef.current = null;
            setIsResizeSettling(false);
        };
        const markSettling = () => {
            // 窗口 resize 期间，大文件 PreviewPane 的千行 Shadow DOM 会在每帧参与
            // React commit + Layout。这里只把 resize 视为短暂的不稳定阶段，等尺寸停止抖动后再恢复重内容。
            setIsResizeSettling((current) => (current ? current : true));
            if (resizeSettleTimerRef.current !== null) {
                window.clearTimeout(resizeSettleTimerRef.current);
            }
            resizeSettleTimerRef.current = window.setTimeout(finishSettling, PREVIEW_PANE_RESIZE_SETTLE_DELAY_MS);
        };
        window.addEventListener("resize", markSettling, { passive: true });
        window.visualViewport?.addEventListener("resize", markSettling, {
            passive: true,
        });
        return () => {
            window.removeEventListener("resize", markSettling);
            window.visualViewport?.removeEventListener("resize", markSettling);
            if (resizeSettleTimerRef.current !== null) {
                window.clearTimeout(resizeSettleTimerRef.current);
                resizeSettleTimerRef.current = null;
            }
        };
    }, [enabled]);
    return isResizeSettling;
}
export function AnimatedSidePanePanel({ services, isDesktop, isWindowsDesktop, isVisible, sidePaneState, recentClosedSidePaneTabs, isBrowserOpen, supportsEmbeddedBrowser = true, workspaceAbsPath, workspaceIdentity, workspaceRemoteSessionId, activeTaskId, sidePaneOwnerId, gitState, activeGitSourceId, panelRef, panelElementRef, browserNavigationRequest, browserRestoreUrls, screenshotSurfaceRequest: screenshotSurfaceRequestProp = null, screenshotSurfaceTabId = null, fileChangeFindActiveIndex, fileChangeFindNavigationRequestId, fileChangeFindQuery, onFileChangeFindMatchCountChange, onCloseCodeViewer, onCloseGit, onActivateTab, onReorderTab, onCloseTab, onCloseOtherTabs, onCloseAllTabs, onReopenClosedTab, onOpenBrowserTab, onOpenBrowserPermissionSettings, onOpenWhiteboard: _onOpenWhiteboard, onOpenDeveloperTools, onOpenTerminalTab, onOpenReviewTab, onOpenSelectionSideConversation, onRevealGitFileInTree, onOpenBrowserUrl, onOpenCodeViewer, onOpenFileLink, onOpenSubagentSession, onOpenWorkflowActorSession, onOpenWorkflowWorkspace, onOpenWorkflowArtifact, onOpenWorkflowRun, onOpenBackgroundBash, onRefreshGit, onBrowserNavigationRequestHandled, onBrowserUrlChange, onBrowserPageMetadataChange, onSelectGitSource, frameClassName = "rounded-xl border border-border", captionControlsStyle, showWindowControls, onCloseSidePane, toggleSidePaneShortcutLabel, mobileOverlay = false, mobileStacked = false, }) {
    const onOpenPluginUi = useOpenPluginUi();
    const { intl } = useZCodeIntl();
    const isOfficeMode = useIsOfficeMode();
    const developerToolsEnabled = useDeveloperToolsVisibility();
    const isMobileTextInputViewport = useIsMobileTextInputViewport();
    const isDragCollapsible = !isVisible;
    const isResizeDisabled = !isVisible;
    const workspaceKey = workspaceIdentity?.trim() || workspaceAbsPath;
    const tabs = sidePaneState?.tabs ?? EMPTY_SIDE_PANE_TABS;
    const screenshotSurfaceRequest = screenshotSurfaceRequestProp;
    const isScreenshotSurfaceActive = Boolean(screenshotSurfaceRequest);
    const screenshotSurfaceTab = screenshotSurfaceTabId
        ? tabs.find((tab) => tab.id === screenshotSurfaceTabId)
        : screenshotSurfaceRequest
            ? findScreenshotSurfaceTabForRender(tabs, screenshotSurfaceRequest)
            : undefined;
    const visibleTabs = useMemo(() => getVisibleSidePaneTabs(tabs, {
        workspaceKey,
        ownerTaskId: sidePaneOwnerId,
    }), [sidePaneOwnerId, tabs, workspaceKey]);
    const activeTabId = sidePaneState?.activeTabId ?? "";
    const visibleActiveTabId = visibleTabs.some((tab) => tab.id === activeTabId)
        ? activeTabId
        : (visibleTabs.at(-1)?.id ?? "");
    const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
    const tabsScrollViewportRef = useRef(null);
    const tabsScrollContentRef = useRef(null);
    const [lockedContentWidthPx, setLockedContentWidthPx] = useState(null);
    const shouldMountContent = shouldMountSidePaneContent(isVisible, tabs);
    const [hasRenderedSidePane, setHasRenderedSidePane] = useState(shouldMountContent);
    const [isTabsOverflowing, setIsTabsOverflowing] = useState(false);
    const [tabsScrollMaskEdges, setTabsScrollMaskEdges] = useState({
        left: false,
        right: false,
    });
    const [draggingTabId, setDraggingTabId] = useState(null);
    const sidePaneVisibleInlineSizePx = useViewportInlineIntersectionSize(panelElementRef, hasRenderedSidePane);
    const isWindowResizeSettling = useWindowResizeSettling(hasRenderedSidePane);
    const widthUnlockTimerRef = useRef(null);
    const previousIsVisibleRef = useRef(isVisible);
    const panelLayout = resolveAnimatedSidePanePanelLayout({ mobileOverlay });
    const hasReviewTab = visibleTabs.some((tab) => tab.type === "git");
    const canOpenSelectionSideConversation = shouldOfferSelectionSideConversation({
        activeTaskId,
        isMobileTextInputViewport,
        mobileOverlay,
    });
    const tabDragSensors = useSensors(useSensor(PointerSensor, {
        activationConstraint: {
            distance: 4,
        },
    }));
    const handleTabDragStart = (event) => {
        setDraggingTabId(String(event.active.id));
    };
    const handleTabDragEnd = (event) => {
        setDraggingTabId(null);
        const { active, over } = event;
        if (!over || active.id === over.id) {
            return;
        }
        onReorderTab(String(active.id), String(over.id));
    };
    const handleTabDragCancel = () => {
        setDraggingTabId(null);
    };
    const readInitialExpandedContentWidthPx = () => {
        const panelElement = panelElementRef.current;
        const panelGroupElement = panelElement?.parentElement;
        const panelGroupWidthPx = Math.round(panelGroupElement?.getBoundingClientRect().width ?? 0);
        if (!Number.isFinite(panelGroupWidthPx) || panelGroupWidthPx <= 0) {
            return null;
        }
        return Math.round(panelGroupWidthPx * SIDE_PANE_DEFAULT_EXPANDED_RATIO);
    };
    useEffect(() => {
        if (shouldMountContent) {
            // side pane 收起动画原本依赖外层 panel 的 opacity/flex-grow 过渡，
            // 但这里之前把内容写成 `isVisible && sidePaneState ? ... : null`，
            // 一收起就会先把 Tabs/Git/Browser 整块卸载，动画还没走完内容就没了。
            // 改成首次打开后保持挂载，后续收起只隐藏不卸载，这样动画和内部状态都能一起保留。
            setHasRenderedSidePane(true);
        }
    }, [shouldMountContent]);
    useEffect(() => {
        const previousIsVisible = previousIsVisibleRef.current;
        previousIsVisibleRef.current = isVisible;
        if (widthUnlockTimerRef.current !== null) {
            window.clearTimeout(widthUnlockTimerRef.current);
            widthUnlockTimerRef.current = null;
        }
        if (previousIsVisible && !isVisible) {
            const currentPanelWidthPx = Math.round(panelElementRef.current?.getBoundingClientRect().width ?? 0);
            // side pane 收起时内容层会跟着外层 panel 一起参与过渡，
            // 这里在收起前锁住当前像素宽度，避免内部 Tabs/Git/Browser 先重新排版后再淡出。
            setLockedContentWidthPx(currentPanelWidthPx > 0 ? currentPanelWidthPx : null);
            return;
        }
        if (!previousIsVisible && isVisible) {
            // 首次展开没有“上一次收起前宽度”可复用，内容会先以 0 宽度参与布局再被撑开。
            // 这里用 PanelGroup 的真实像素宽度换算默认展开宽度，先给内容层一个接近最终态的锁宽；
            // 等 200ms 过渡结束后再移除固定宽度，恢复成普通自适应布局。
            setLockedContentWidthPx((currentWidthPx) => currentWidthPx ?? readInitialExpandedContentWidthPx());
            widthUnlockTimerRef.current = window.setTimeout(() => {
                setLockedContentWidthPx(null);
                widthUnlockTimerRef.current = null;
            }, SIDE_PANE_CONTENT_WIDTH_LOCK_DURATION_MS);
        }
    }, [isVisible, panelElementRef]);
    useEffect(() => {
        return () => {
            if (widthUnlockTimerRef.current !== null) {
                window.clearTimeout(widthUnlockTimerRef.current);
            }
        };
    }, []);
    const lockedContentStyle = lockedContentWidthPx !== null
        ? {
            width: `${lockedContentWidthPx}px`,
        }
        : undefined;
    useEffect(() => {
        const viewport = tabsScrollViewportRef.current;
        const content = tabsScrollContentRef.current;
        if (!viewport || !content) {
            setIsTabsOverflowing(false);
            // sidePaneState 为空或内容尚未挂载时 refs 会持续为空。
            // 这里不能每次写入新的 mask 对象，否则 effect 会在空 tabs 阶段反复触发更新。
            setTabsScrollMaskEdges((current) => current.left || current.right ? EMPTY_TABS_SCROLL_MASK_EDGES : current);
            return;
        }
        const updateOverflowState = () => {
            const maxScrollLeft = Math.max(0, viewport.scrollWidth - viewport.clientWidth);
            const addButton = viewport.parentElement?.querySelector("[data-side-pane-add-tab-trigger]");
            const addButtonWidth = addButton?.getBoundingClientRect().width ?? 0;
            // 旧判定直接读取 content.scrollWidth，但 overflow 状态本身会把新增按钮
            // 移进/移出 content 并改变 viewport 宽度，临界区会形成 ResizeObserver 反馈环。
            // 这里统一还原“新增按钮位于 tabs 末尾”的假想布局，只用稳定的最小宽度预算判定。
            const isOverflowing = resolveSidePaneTabsOverflow({
                addButtonInside: Boolean(addButton && content.contains(addButton)),
                addButtonWidth,
                tabCount: visibleTabs.length,
                viewportWidth: viewport.clientWidth,
            });
            // 新增按钮在 tabs 尚可等宽收缩时跟随末尾，只有达到 60px 下限仍溢出后才固定到右侧。
            setIsTabsOverflowing(isOverflowing);
            // tabs 溢出时不能两侧一直显示渐变 mask：滚动到起点/终点也像还能继续滚。
            // 这里把 mask 和实际 scrollLeft 绑定，只提示仍可继续滚动的一侧。
            setTabsScrollMaskEdges((current) => {
                const next = {
                    left: isOverflowing && viewport.scrollLeft > 1,
                    right: isOverflowing && viewport.scrollLeft < maxScrollLeft - 1,
                };
                if (current.left === next.left && current.right === next.right) {
                    return current;
                }
                return next;
            });
        };
        // RAF-based debounce to coalesce resize events
        let rafId = null;
        let latestCallback = updateOverflowState;
        const debouncedUpdate = () => {
            if (rafId !== null)
                return;
            rafId = requestAnimationFrame(() => {
                rafId = null;
                latestCallback();
            });
        };
        updateOverflowState();
        viewport.addEventListener("scroll", updateOverflowState, {
            passive: true,
        });
        if (typeof ResizeObserver === "undefined") {
            window.addEventListener("resize", debouncedUpdate);
            return () => {
                viewport.removeEventListener("scroll", updateOverflowState);
                window.removeEventListener("resize", debouncedUpdate);
                if (rafId !== null)
                    cancelAnimationFrame(rafId);
            };
        }
        const resizeObserver = new ResizeObserver(() => {
            latestCallback = updateOverflowState;
            debouncedUpdate();
        });
        resizeObserver.observe(viewport);
        resizeObserver.observe(content);
        window.addEventListener("resize", debouncedUpdate);
        return () => {
            resizeObserver.disconnect();
            viewport.removeEventListener("scroll", updateOverflowState);
            window.removeEventListener("resize", debouncedUpdate);
            if (rafId !== null)
                cancelAnimationFrame(rafId);
        };
    }, [visibleTabs]);
    useEffect(() => {
        const viewport = tabsScrollViewportRef.current;
        const content = tabsScrollContentRef.current;
        if (!visibleActiveTabId || !viewport || !content) {
            return;
        }
        let frameId = requestAnimationFrame(() => {
            frameId = null;
            const activeTab = Array.from(content.querySelectorAll("[data-side-pane-tab-id]")).find((element) => element.dataset.sidePaneTabId === visibleActiveTabId);
            if (!activeTab) {
                return;
            }
            const viewportRect = viewport.getBoundingClientRect();
            const activeTabRect = activeTab.getBoundingClientRect();
            const leftOverflow = activeTabRect.left - viewportRect.left;
            const rightOverflow = activeTabRect.right - viewportRect.right;
            if (leftOverflow < 0) {
                // 从外部激活 tab（例如打开文件或切回旧 Browser）时，
                // active tab 可能已经被横向滚动区域遮住。这里按真实 DOM 宽度滚回可视区，
                // 避免使用固定宽度估算导致长标题 / favicon tab 对不齐。
                viewport.scrollBy({ left: leftOverflow, behavior: "smooth" });
                return;
            }
            if (rightOverflow > 0) {
                viewport.scrollBy({ left: rightOverflow, behavior: "smooth" });
            }
        });
        return () => {
            if (frameId !== null) {
                cancelAnimationFrame(frameId);
            }
        };
    }, [visibleActiveTabId, visibleTabs]);
    const addTabMenu = (_jsxs(DropdownMenu, { open: isAddMenuOpen, onOpenChange: setIsAddMenuOpen, children: [_jsx(DropdownMenuTrigger, { asChild: true, children: _jsx(Button, { type: "button", variant: "ghost", size: "icon-md", className: "shrink-0", "data-side-pane-add-trigger": true, "data-side-pane-add-tab-trigger": "", "aria-label": intl.formatMessage({
                        id: "sidePane.addTab",
                    }), children: _jsx(PlusIcon, { className: "size-4" }) }) }), _jsxs(DropdownMenuContent, { align: "end", className: "w-48", children: [canOpenSelectionSideConversation ? (_jsxs(DropdownMenuItem, { "data-side-pane-add-item": "selection-side-conversation", onSelect: onOpenSelectionSideConversation, children: [_jsx(MessageSquareTextIcon, { className: "size-4" }), _jsx("span", { children: intl.formatMessage({ id: "sidePane.selectionChat" }) })] })) : null, !isOfficeMode && !hasReviewTab ? (_jsxs(DropdownMenuItem, { onSelect: () => {
                            onOpenReviewTab();
                        }, children: [_jsx(FileDiffIcon, { className: "size-4" }), _jsx("span", { children: intl.formatMessage({ id: "sidePane.review" }) })] })) : null, !isOfficeMode ? (_jsxs(DropdownMenuItem, { "data-side-pane-add-item": "terminal", onSelect: () => {
                            onOpenTerminalTab();
                        }, children: [_jsx(SquareTerminalIcon, { className: "size-4" }), _jsx("span", { children: intl.formatMessage({ id: "terminal.title" }) })] })) : null, supportsEmbeddedBrowser ? (_jsxs(DropdownMenuItem, { "data-side-pane-add-item": "browser", onSelect: () => {
                            onOpenBrowserTab();
                        }, children: [_jsx(GlobeIcon, { className: "size-4" }), _jsx("span", { children: intl.formatMessage({ id: "browser.title" }) })] })) : null, developerToolsEnabled ? (_jsxs(DropdownMenuItem, { "data-side-pane-add-item": "developer-tools", onSelect: () => {
                            onOpenDeveloperTools();
                        }, children: [_jsx(BugIcon, { className: "size-4" }), _jsx("span", { children: intl.formatMessage({ id: "developerTools.title" }) })] })) : null, onOpenPluginUi ? (_jsx(PluginUiLauncherItems, { variant: "menu", workspacePath: workspaceAbsPath, workspaceIdentity: workspaceIdentity, remoteSessionId: workspaceRemoteSessionId, sessionId: activeTaskId, onOpenPluginUi: onOpenPluginUi })) : null] })] }));
    const openTabLauncherItemById = {
        "selection-side-conversation": {
            id: "selection-side-conversation",
            label: intl.formatMessage({ id: "sidePane.selectionChat" }),
            icon: MessageSquareTextIcon,
            onOpen: onOpenSelectionSideConversation,
        },
        review: {
            id: "review",
            label: intl.formatMessage({ id: "sidePane.review" }),
            icon: FileDiffIcon,
            onOpen: onOpenReviewTab,
        },
        terminal: {
            id: "terminal",
            label: intl.formatMessage({ id: "terminal.title" }),
            icon: SquareTerminalIcon,
            onOpen: onOpenTerminalTab,
        },
        browser: {
            id: "browser",
            label: intl.formatMessage({ id: "browser.title" }),
            icon: GlobeIcon,
            onOpen: onOpenBrowserTab,
        },
        "developer-tools": {
            id: "developer-tools",
            label: intl.formatMessage({ id: "developerTools.title" }),
            icon: BugIcon,
            onOpen: onOpenDeveloperTools,
        },
    };
    const openTabLauncherItems = resolveOpenTabLauncherItemIds({
        canOpenSelectionSideConversation,
        developerToolsEnabled,
        hasReviewTab,
        supportsEmbeddedBrowser,
    })
        .filter((itemId) => !isOfficeMode || (itemId !== "terminal" && itemId !== "review"))
        .map((itemId) => openTabLauncherItemById[itemId]);
    const closeSidePaneButton = isVisible && !mobileOverlay && onCloseSidePane ? (_jsxs("div", { className: "flex shrink-0 items-center gap-0.5 [app-region:no-drag]", children: [_jsx(WorkspaceSidePaneToggleButton, { isSidePaneOpen: true, onToggleSidePane: onCloseSidePane, shortcutLabel: toggleSidePaneShortcutLabel }), showWindowControls ? _jsx(DesktopWindowControls, {}) : null] })) : null;
    const openTabLauncher = (_jsxs("div", { className: "side-pane-open-tab-shell flex h-full min-h-0 flex-col bg-background", children: [!mobileOverlay ? (_jsx("div", { className: cn("flex h-12 shrink-0 items-center justify-end px-2", isDesktop && "[app-region:drag]"), style: captionControlsStyle, children: closeSidePaneButton })) : null, _jsx("div", { className: "flex min-h-0 flex-1 items-center justify-center overflow-y-auto px-5 py-10", children: _jsxs("div", { className: "side-pane-open-tab-content flex w-full max-w-[20rem] flex-col gap-5", children: [_jsxs("div", { className: "flex flex-col gap-2 text-center", children: [_jsx("h2", { className: "text-xl font-semibold leading-7 text-foreground", children: intl.formatMessage({ id: "sidePane.openTab" }) }), _jsx("p", { className: "text-ui-base leading-5 text-foreground-subtle", children: intl.formatMessage({ id: "sidePane.openTabDescription" }) })] }), _jsxs("div", { className: "side-pane-open-tab-list flex w-full flex-col gap-2", children: [openTabLauncherItems.map((item) => {
                                    const Icon = item.icon;
                                    return (_jsxs("button", { type: "button", "data-side-pane-open-tab-item": item.id, className: OPEN_TAB_LAUNCHER_BUTTON_CLASS, onClick: item.onOpen, children: [_jsx(Icon, { className: "size-4 text-foreground-subtle" }), _jsx("span", { className: "side-pane-open-tab-button-label min-w-0 flex-1 truncate text-left", children: item.label })] }, item.id));
                                }), onOpenPluginUi ? (_jsx(PluginUiLauncherItems, { workspacePath: workspaceAbsPath, workspaceIdentity: workspaceIdentity, remoteSessionId: workspaceRemoteSessionId, sessionId: activeTaskId, onOpenPluginUi: onOpenPluginUi, itemClassName: OPEN_TAB_LAUNCHER_BUTTON_CLASS })) : null] })] }) })] }));
    const sidePaneTabOverview = (_jsx(SidePaneTabOverview, { tabs: visibleTabs, activeTabId: visibleActiveTabId, recentClosedTabs: recentClosedSidePaneTabs, labels: {
            title: intl.formatMessage({ id: "sidePane.tabOverview" }),
            searchPlaceholder: intl.formatMessage({
                id: "sidePane.searchTabs",
            }),
            openTabs: intl.formatMessage({ id: "sidePane.openTabs" }),
            recentlyClosedTabs: intl.formatMessage({
                id: "sidePane.recentlyClosedTabs",
            }),
            noResults: intl.formatMessage({ id: "sidePane.noTabsFound" }),
            closeTab: (title) => intl.formatMessage({ id: "sidePane.closeTab" }, { title }),
            relativeTime: (timestamp) => formatTaskRelativeTime(timestamp, intl),
            browserTitle: intl.formatMessage({ id: "browser.title" }),
            reviewTitle: intl.formatMessage({ id: "sidePane.review" }),
            codeViewerTitle: intl.formatMessage({ id: "codeViewer.title" }),
            treemappingTitle: intl.formatMessage({ id: "treemapping.title" }),
            whiteboardTitle: intl.formatMessage({ id: "whiteboard.title" }),
            modelTrajectoryTitle: intl.formatMessage({
                id: "modelTrajectory.title",
            }),
            developerToolsTitle: intl.formatMessage({
                id: "developerTools.title",
            }),
            browserPermissionsTitle: intl.formatMessage({
                id: "browser.permission.settings",
            }),
            terminalTitle: intl.formatMessage({ id: "terminal.title" }),
            subagentTypeLabel: intl.formatMessage({ id: "sidePane.subagent" }),
            subagentDirectoryTitle: intl.formatMessage({
                id: "sidePane.subagentDirectory",
            }),
            selectionChatTitle: intl.formatMessage({
                id: "sidePane.selectionChat",
            }),
            planTitle: intl.formatMessage({ id: "planTool.panel.planTab" }),
            workflowRunTitle: intl.formatMessage({ id: "sidePane.workflowRun" }),
            workflowDirectoryTitle: intl.formatMessage({ id: "sidePane.workflowDirectory" }),
            workflowActorTitle: intl.formatMessage({ id: "sidePane.workflowActor" }),
            workflowScriptTitle: intl.formatMessage({ id: "sidePane.workflowScript" }),
            workflowArtifactTitle: intl.formatMessage({ id: "sidePane.workflowArtifact" }),
        }, onActivateTab: onActivateTab, onCloseTab: onCloseTab, onReopenClosedTab: onReopenClosedTab }));
    const draggingTab = draggingTabId
        ? (visibleTabs.find((tab) => tab.id === draggingTabId) ?? null)
        : null;
    const panelContent = (_jsx("div", { "aria-hidden": !isVisible, "data-workspace-side-frame": mobileOverlay ? undefined : "true", className: cn(
        // 独立外框放在内容层：关闭仍保留 Browser Guest 和 tab 实例，不改变面板持久化边界。
        "h-full overflow-hidden bg-background", !mobileOverlay && frameClassName, mobileStacked && "max-md:rounded-none max-md:border-0", mobileOverlay && "min-w-0", mobileStacked && "max-md:!w-full"), style: mobileOverlay ? undefined : lockedContentStyle, children: _jsx(ScopedErrorBoundary, { scope: "workspace-side-pane", resetKeys: [workspaceKey, visibleActiveTabId], variant: "panel", className: "h-full", children: hasRenderedSidePane && sidePaneState ? (_jsxs(_Fragment, { children: [visibleTabs.length === 0 ? openTabLauncher : null, _jsx("div", { className: cn("h-full min-h-0", visibleTabs.length === 0 && !screenshotSurfaceRequest && "hidden"), children: _jsxs(Tabs, { value: visibleActiveTabId, onValueChange: onActivateTab, className: "relative h-full gap-0", children: [_jsx(TabsList, { style: mobileOverlay ? undefined : captionControlsStyle, className: cn("flex justify-start w-full rounded-none p-0 border-0 border-b border-border/50 bg-transparent shadow-none !h-12 overflow-hidden", 
                                    // 独立面板将标签栏移至窗口顶部，需补充窗口拖拽区域；标签和按钮仍处理自身交互。
                                    isDesktop &&
                                        !mobileOverlay &&
                                        "[app-region:drag] [&_button]:[app-region:no-drag] [&_[data-side-pane-tab-id]]:[app-region:no-drag]"), children: _jsxs("div", { className: "flex items-center justify-start flex-1 min-w-0", children: [_jsx("div", { className: "flex h-full shrink-0 items-center p-2", children: sidePaneTabOverview }), _jsxs(DndContext, { sensors: tabDragSensors, collisionDetection: closestCenter, onDragStart: handleTabDragStart, onDragEnd: handleTabDragEnd, onDragCancel: handleTabDragCancel, children: [_jsx("div", { ref: tabsScrollViewportRef, "data-side-pane-tabs-viewport": "", className: cn("min-w-0 flex-1 overflow-x-auto !scrollbar-hide h-12 items-center", tabsScrollMaskEdges.left &&
                                                            tabsScrollMaskEdges.right &&
                                                            "[mask-image:linear-gradient(to_right,transparent_0%,black_16px,black_calc(100%-16px),transparent_100%)] [-webkit-mask-image:linear-gradient(to_right,transparent_0%,black_16px,black_calc(100%-16px),transparent_100%)]", tabsScrollMaskEdges.left &&
                                                            !tabsScrollMaskEdges.right &&
                                                            "[mask-image:linear-gradient(to_right,transparent_0%,black_16px,black_100%)] [-webkit-mask-image:linear-gradient(to_right,transparent_0%,black_16px,black_100%)]", !tabsScrollMaskEdges.left &&
                                                            tabsScrollMaskEdges.right &&
                                                            "[mask-image:linear-gradient(to_right,black_0%,black_calc(100%-16px),transparent_100%)] [-webkit-mask-image:linear-gradient(to_right,black_0%,black_calc(100%-16px),transparent_100%)]"), children: _jsxs("div", { ref: tabsScrollContentRef, "data-side-pane-tabs-content": "", className: "flex w-full gap-1 py-2.5", children: [_jsx(SortableContext, { items: visibleTabs.map((tab) => tab.id), strategy: horizontalListSortingStrategy, children: visibleTabs.map((tab) => {
                                                                        const title = getSidePaneTabTitle(tab, intl.formatMessage);
                                                                        return (_jsx(SortableSidePaneTabTrigger, { tab: tab, title: title, closeTabLabel: intl.formatMessage({ id: "sidePane.closeTab" }, { title }), closeTabMenuLabel: intl.formatMessage({
                                                                                id: "sidePane.closeCurrentTab",
                                                                            }), closeOtherTabsLabel: intl.formatMessage({
                                                                                id: "sidePane.closeOtherTabs",
                                                                            }), closeAllTabsLabel: intl.formatMessage({
                                                                                id: "sidePane.closeAllTabs",
                                                                            }), diffBadgeLabel: intl.formatMessage({
                                                                                id: "diff.title",
                                                                            }), isActive: tab.id === visibleActiveTabId, onActivateTab: onActivateTab, onCloseTab: onCloseTab, onCloseOtherTabs: onCloseOtherTabs, onCloseAllTabs: onCloseAllTabs, canCloseOtherTabs: visibleTabs.length > 1 }, tab.id));
                                                                    }) }), !isTabsOverflowing ? addTabMenu : null] }) }), _jsx(DragOverlay, { dropAnimation: null, children: draggingTab ? (_jsx(SidePaneTabDragOverlay, { tab: draggingTab, title: getSidePaneTabTitle(draggingTab, intl.formatMessage), diffBadgeLabel: intl.formatMessage({
                                                                id: "diff.title",
                                                            }) })) : null })] }), _jsxs("div", { className: "ml-auto flex h-full shrink-0 items-center gap-1 px-2", children: [isTabsOverflowing ? addTabMenu : null, closeSidePaneButton] })] }) }), _jsx("div", { className: cn("relative min-h-0 flex-1 isolate", mobileOverlay && "min-w-0"), children: tabs.map((tab) => {
                                        if ((tab.type === "browser" || tab.type === "browser-use") &&
                                            !shouldMountBrowserTabGuest(tab)) {
                                            return _jsx(SuspendedBrowserSidePaneContent, { tab: tab }, tab.id);
                                        }
                                        if (tab.type === "browser-use") {
                                            return (_jsx(BrowserUseSidePaneContent, { tab: tab, onOpenPermissionSettings: onOpenBrowserPermissionSettings, isPanelVisible: isVisible, isSelected: tab.id === visibleActiveTabId, isCurrentTask: tab.sessionId === sidePaneOwnerId, screenshotSurfaceRequest: screenshotSurfaceTab?.id === tab.id ? screenshotSurfaceRequest : null, 
                                                // restoring guest 的完整 history 由 main 在 did-attach 后写入；
                                                // renderer 同时消费 initialUrl 会抢先提交导航，使 Chromium 拒绝 restore。
                                                initialUrl: tab.residency === "restoring" ? undefined : browserRestoreUrls[tab.id], workspacePath: workspaceAbsPath, workspaceIdentity: workspaceIdentity, residencyGeneration: tab.residencyGeneration, onUrlChange: (url) => onBrowserUrlChange(tab.id, url), onPageMetadataChange: (metadata) => onBrowserPageMetadataChange(tab.id, metadata) }, tab.id));
                                        }
                                        return (_jsx(TabsContent, { value: tab.id, forceMount: true, className: cn("relative z-10 h-full min-h-0 bg-background data-[state=inactive]:hidden", mobileOverlay && "min-w-0"), children: tab.type === "bash-output" ? (_jsx(BackgroundBashOutputSidePane, { tab: tab, visible: isVisible && tab.id === visibleActiveTabId, onOpenCodeViewer: onOpenCodeViewer })) : tab.type === "subagent-session" ? (_jsx(SubagentSessionSidePane, { tab: tab, focused: isVisible && tab.id === visibleActiveTabId, compactForRemoteControl: mobileOverlay, onOpenBrowserUrl: onOpenBrowserUrl, onOpenCodeViewer: onOpenCodeViewer, onOpenFileLink: onOpenFileLink, onOpenSubagentSession: onOpenSubagentSession, onOpenBackgroundBash: onOpenBackgroundBash })) : tab.type === "subagent-directory" ? (_jsx(SubagentDirectorySidePane, { tab: tab, onOpenSubagentSession: onOpenSubagentSession })) : tab.type === "selection-side-chat" ? (_jsx(SelectionSideChatPane, { tab: tab, focused: isVisible && tab.id === visibleActiveTabId, onOpenBrowserUrl: onOpenBrowserUrl, onOpenCodeViewer: onOpenCodeViewer, onOpenFileLink: onOpenFileLink, onUnavailable: onCloseTab })) : tab.type === "plugin-ui" ? (_jsx(PluginUiSidePane, { tab: tab, onOpenBrowserUrl: onOpenBrowserUrl, onCloseTab: onCloseTab })) : tab.type === "plan-detail" ? (_jsx(PlanDetailSidePane, { tab: tab, onOpenBrowserUrl: onOpenBrowserUrl, onOpenCodeViewer: onOpenCodeViewer, onOpenFileLink: onOpenFileLink })) : tab.type === "workflow-run" ? (_jsx(WorkflowRunSidePane, { tab: tab, ...(onOpenWorkflowActorSession === undefined
                                                    ? {}
                                                    : { onOpenWorkflowActorSession }), ...(onOpenWorkflowArtifact === undefined
                                                    ? {}
                                                    : { onOpenWorkflowArtifact }), ...(onOpenWorkflowRun === undefined ? {} : { onOpenWorkflowRun }), ...(onOpenWorkflowWorkspace === undefined
                                                    ? {}
                                                    : { onOpenWorkflowWorkspace }) })) : tab.type === "workflow-directory" ? (
                                            // 类型分支必须先收窄，回调缺席在**分支内部**处理：把
                                            // `&& onOpenWorkflowRun` 写进条件会让这个 tab 类型继续留在后面
                                            // 那些分支的联合里（browser 分支于是拿它去读 residency）。
                                            onOpenWorkflowRun ? (_jsx(WorkflowRunDirectorySidePane, { tab: tab, onOpenWorkflowRun: onOpenWorkflowRun })) : null) : tab.type === "workflow-actor-session" ? (_jsx(WorkflowActorSessionSidePane, { tab: tab, focused: isVisible && tab.id === visibleActiveTabId, onOpenBrowserUrl: onOpenBrowserUrl, onOpenCodeViewer: onOpenCodeViewer, onOpenFileLink: onOpenFileLink })) : tab.type === "workflow-workspace" ? (_jsx(WorkflowWorkspaceSidePane, { tab: tab, focused: isVisible && tab.id === visibleActiveTabId, onOpenCodeViewer: onOpenCodeViewer })) : tab.type === "workflow-artifact" ? (_jsx(WorkflowArtifactSidePane, { tab: tab, onOpenBrowserUrl: onOpenBrowserUrl, ...(onRevealGitFileInTree === undefined
                                                    ? {}
                                                    : { onRevealFileInTree: onRevealGitFileInTree }) })) : tab.type === "code-viewer" ? (_jsx(PreviewPane, { markdownSelectionTarget: { sessionId: activeTaskId, workspaceKey }, source: tab.source, onClose: onCloseCodeViewer, workspacePath: workspaceAbsPath, onOpenBrowserUrl: onOpenBrowserUrl, onOpenCodeViewer: onOpenCodeViewer, 
                                                // inactive/窄条/resize 中的 code preview 不应继续让
                                                // @pierre/diffs 的千行 Shadow DOM 参与布局；这里只裁剪 body，保留 tab/source/file state。
                                                renderHeavyContent: shouldRenderPreviewPaneHeavyContent({
                                                    isActiveTab: tab.id === visibleActiveTabId,
                                                    // video/audio 原生全屏会触发 resize，resize settling
                                                    // 期间必须保持当前媒体节点挂载，否则浏览器会立即退出全屏。
                                                    isMediaPreview: tab.source.type === "media" ||
                                                        (tab.source.type === "file" &&
                                                            inferMediaPreview(tab.source.path) !== null),
                                                    isMobileOverlay: mobileOverlay,
                                                    isResizeSettling: isWindowResizeSettling,
                                                    isSidePaneVisible: isVisible,
                                                    visibleInlineSizePx: sidePaneVisibleInlineSizePx,
                                                }) })) : tab.type === "git" ? (_jsx(GitPane, { workspacePath: workspaceAbsPath, workspaceIdentity: workspaceIdentity, workspaceRemoteSessionId: workspaceRemoteSessionId, gitState: gitState, isDesktop: isDesktop, selectedSourceId: activeGitSourceId, fileChangeFindActiveIndex: fileChangeFindActiveIndex, fileChangeFindNavigationRequestId: fileChangeFindNavigationRequestId, fileChangeFindQuery: fileChangeFindQuery, onFileChangeFindMatchCountChange: onFileChangeFindMatchCountChange, onSelectSource: onSelectGitSource, onClose: onCloseGit, onRefresh: onRefreshGit, onRevealFileInTree: onRevealGitFileInTree })) : tab.type === "treemapping" ? (_jsx(TreemappingPane, { activeTaskId: activeTaskId, workspacePath: workspaceAbsPath, workspaceIdentity: workspaceIdentity, source: tab.source ?? { kind: "current" } })) : tab.type === "whiteboard" ? (_jsx(WhiteboardPane, { workspacePath: workspaceAbsPath, workspaceIdentity: workspaceIdentity, boardId: tab.boardId })) : tab.type === "model-trajectory" ? (_jsx(ModelTrajectoryPane, { taskId: tab.taskId, title: tab.title, workspacePath: workspaceAbsPath, workspaceIdentity: workspaceIdentity, onClose: () => onCloseTab(tab.id) })) : tab.type === "developer-tools" ? (_jsx(ServiceProvider, { services: services, children: _jsx(DeveloperToolsPane, { workspacePath: workspaceAbsPath, workspaceIdentity: workspaceIdentity, taskId: activeTaskId, enabled: isVisible && tab.id === visibleActiveTabId }) })) : tab.type === "terminal" ? (_jsx(SidePaneTerminalPane, { services: services, sessionId: tab.id, workspaceKey: workspaceKey, cwd: tab.cwd ?? workspaceAbsPath, isVisible: isVisible && tab.id === visibleActiveTabId, isWindowsDesktop: isWindowsDesktop, onOpenBrowserUrl: onOpenBrowserUrl })) : tab.type === "browser-permissions" ? (_jsx(BrowserSitePermissionsPage, { origin: tab.origin, isVisible: isVisible && tab.id === visibleActiveTabId })) : (_jsx(HumanBrowserView, { browserKey: tab.id, onOpenPermissionSettings: onOpenBrowserPermissionSettings, agentOpened: tab.agentOpened, deferEmptyGuest: true, isResidencyRestore: tab.residency === "restoring", isVisible: isVisible && isBrowserOpen && tab.id === visibleActiveTabId, isSelected: tab.id === visibleActiveTabId, isCurrentTask: tab.ownerTaskId === sidePaneOwnerId, 
                                                // restoring 只挂载不会提交 document 的 bootstrap URL，
                                                // 由 main 独占 pageState/URL 恢复事务。
                                                initialUrl: tab.residency === "restoring"
                                                    ? undefined
                                                    : (browserRestoreUrls[tab.id] ?? tab.initialUrl), faviconUrl: tab.faviconUrl, workspacePath: workspaceAbsPath, workspaceIdentity: workspaceIdentity, remoteSessionId: tab.remoteSessionId ?? workspaceRemoteSessionId, residencyGeneration: tab.residencyGeneration, sessionId: tab.ownerTaskId ?? "unscoped", onUrlChange: (url) => onBrowserUrlChange(tab.id, url), onPageMetadataChange: (metadata) => onBrowserPageMetadataChange(tab.id, metadata), navigationRequest: browserNavigationRequest?.targetTabId === tab.id
                                                    ? {
                                                        id: browserNavigationRequest.id,
                                                        url: browserNavigationRequest.url,
                                                    }
                                                    : null, onNavigationRequestHandled: onBrowserNavigationRequestHandled })) }, tab.id));
                                    }) })] }) })] })) : hasRenderedSidePane ? (openTabLauncher) : null }) }));
    if (!panelLayout.useResizablePanel) {
        return (_jsx(_Fragment, { children: _jsx("div", { ref: panelElementRef, "aria-hidden": !isVisible, className: cn("h-full w-full min-w-0 border-l border-border bg-background transition-opacity duration-200 ease-out", isVisible || isScreenshotSurfaceActive
                    ? "opacity-100"
                    : "pointer-events-none opacity-0"), children: panelContent }) }));
    }
    return (_jsxs(_Fragment, { children: [isVisible ? (_jsx(ResizableHandle, { "data-workspace-side-pane-resize-handle": "true", className: cn(
                // 拖动条占据真实 4px 间距，关闭时随 handle 一起移除，不为隐藏面板保留空隙。
                "aria-[orientation=vertical]:w-1 aria-[orientation=vertical]:translate-x-0 aria-[orientation=vertical]:my-0 aria-[orientation=vertical]:h-full", "hover:bg-transparent data-[separator=hover]:bg-transparent data-[separator=active]:bg-transparent focus-visible:bg-transparent", "aria-[orientation=vertical]:[mask-image:none] aria-[orientation=vertical]:[-webkit-mask-image:none]", "after:pointer-events-none after:absolute after:rounded-full after:bg-foreground-subtlest/50 after:opacity-0 after:transition-opacity after:content-[''] after:inset-y-[var(--workspace-panel-radius,var(--radius-xl))] after:w-0.5", "hover:after:opacity-100 data-[separator=hover]:after:opacity-100 data-[separator=active]:after:opacity-100 focus-visible:after:opacity-100", mobileStacked && "max-md:hidden") })) : null, _jsx(ResizablePanel, { id: "browser", panelRef: panelRef, elementRef: panelElementRef, defaultSize: panelLayout.defaultSize, minSize: panelLayout.minSize, maxSize: panelLayout.maxSize, collapsedSize: panelLayout.collapsedSize, 
                // 右侧面板常驻声明成 collapsible 时，拖到最小宽度会被库判定为 collapse。
                // 这里改成只在显式关闭时允许折叠，避免用户只是想拖到最小宽度时面板自动收起。
                collapsible: isDragCollapsible, 
                // preview/side pane 收起时没有 ResizableHandle，但库仍会暴露 collapsed panel 边缘拖拽区。
                // 收起后禁用面板 resize target，避免用户绕过显式开关从右侧边缘拖出面板。
                disabled: isResizeDisabled, className: cn("!overflow-hidden transition-opacity duration-200 ease-out", mobileOverlay &&
                    "max-md:!h-full max-md:!w-full max-md:!min-w-0 max-md:!max-w-none max-md:!flex-1 max-md:!basis-auto max-md:border-l", mobileStacked &&
                    !mobileOverlay &&
                    "max-md:!h-[min(45dvh,24rem)] max-md:!w-full max-md:!min-w-0 max-md:!max-w-none max-md:!flex-none max-md:!basis-auto max-md:border-l-0 max-md:border-t", 
                // 截图期间 panel 仍保持 opacity=1，避免 opacity=0 让 Chromium 丢弃 guest
                // compositor surface；实际 browser surface 已 fixed 到窗口内的低透明合成层，不会露出 tab 栏。
                isVisible || isScreenshotSurfaceActive ? "opacity-100" : "pointer-events-none opacity-0"), children: panelContent })] }));
}
//# sourceMappingURL=AnimatedSidePanePanel.js.map