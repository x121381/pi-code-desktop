import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { DesktopCommandIds } from "@zcode/shared";
import { useCallback, useEffect, useState } from "react";
import { useFeedbackStore } from "@/feedback/feedbackStore.js";
import { usePlatform } from "@/hooks/usePlatform.js";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
import { createHelpMenuActionHandlers } from "@/lib/helpMenuActions.js";
import { useShortcutCommandLabel } from "@/shortcuts/useShortcutBindings.js";
import { logger } from "@/logger.js";
import { cn } from "@/components/lib/utils.js";
import { toast } from "@/components/ui/toast.js";
import { Button } from "@/components/ui/button.js";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu.js";
import { WINDOWS_CAPTION_CONTROL_CLASS } from "@/windowCaptionControls.js";
import { ChevronDownIcon } from "lucide-react";
import { shouldShowDesktopUpdateEntry, getUpdateMenuLabelId, getUpdateMenuLabelValues, } from "@/lib/desktopUpdateMenu.js";
export { shouldShowDesktopUpdateEntry } from "@/lib/desktopUpdateMenu.js";
const WINDOWS_CAPTION_MENU_ALIGN_OFFSET = -12;
export function WindowsCaptionMenuButton({ readOnlyReason, workspaceAbsPath, onCreateTask, onOpenWorkspace, allowOpenWorkspace = true, allowOpenInFileManager = true, onToggleTerminal: _onToggleTerminal, onToggleBrowser: _onToggleBrowser, triggerPresentation = "header", useWindowsCaptionSpacing = false, }) {
    const platform = usePlatform();
    const { intl, locale } = useZCodeIntl();
    const newTaskShortcutLabel = useShortcutCommandLabel("newTask");
    const openWorkspaceShortcutLabel = useShortcutCommandLabel("openWorkspace");
    const openFeedbackSubmit = useFeedbackStore((state) => state.openSubmit);
    const openFeatureRequest = useFeedbackStore((state) => state.openFeatureRequest);
    const helpMenuActions = createHelpMenuActionHandlers({
        platform,
        intl,
        openSubmit: openFeedbackSubmit,
    });
    const [updateState, setUpdateState] = useState(null);
    const [stdioTapDevState, setStdioTapDevState] = useState({
        enabled: false,
        visible: false,
    });
    const [showCommunityMenuItem, setShowCommunityMenuItem] = useState(false);
    const showDesktopUpdateEntry = shouldShowDesktopUpdateEntry();
    const syncUpdateState = useCallback(async () => {
        if (!platform.getUpdateState) {
            return;
        }
        try {
            const payload = await platform.getUpdateState();
            setUpdateState(payload);
        }
        catch (error) {
            logger.warn("[WindowsCaptionMenuButton] 同步自动更新状态失败", { error });
        }
    }, [platform]);
    const syncStdioTapDevState = useCallback(async () => {
        if (!platform.getZCodeStdioTapDevState) {
            setStdioTapDevState({ enabled: false, visible: false });
            return;
        }
        try {
            const state = await platform.getZCodeStdioTapDevState();
            setStdioTapDevState({ enabled: state.enabled, visible: state.visible });
        }
        catch (error) {
            logger.warn("[WindowsCaptionMenuButton] 同步 stdio tap 状态失败", { error });
            setStdioTapDevState({ enabled: false, visible: false });
        }
    }, [platform]);
    useEffect(() => {
        if (showDesktopUpdateEntry) {
            void syncUpdateState();
        }
        void syncStdioTapDevState();
        return showDesktopUpdateEntry
            ? (platform.onUpdateStateChanged?.((payload) => {
                setUpdateState(payload);
            }) ?? (() => { }))
            : undefined;
    }, [platform, showDesktopUpdateEntry, syncStdioTapDevState, syncUpdateState]);
    useEffect(() => {
        let isCancelled = false;
        void platform.canOpenCommunity(locale).then((visible) => {
            if (!isCancelled) {
                setShowCommunityMenuItem(visible);
            }
        }, () => {
            if (!isCancelled) {
                setShowCommunityMenuItem(false);
            }
        });
        return () => {
            isCancelled = true;
        };
    }, [locale, platform]);
    const handleOpenWorkspaceInFileManager = async () => {
        if (readOnlyReason) {
            return;
        }
        const result = await platform.openInFileManager(workspaceAbsPath);
        if (!result.success) {
            toast(intl.formatMessage({ id: "appHeader.openInFileManagerFailed" }));
        }
    };
    const handleExecuteDesktopCommand = (command) => {
        void (async () => {
            await platform.executeDesktopCommand(command);
            if (command === DesktopCommandIds.CheckForUpdates) {
                // Bugfix: 这个 Windows 合并菜单才是截图里的入口。
                // 点击后菜单会关闭，重新打开前主动拉取 main 中的 updater 状态，避免一直显示静态“检查更新”。
                await syncUpdateState();
            }
        })();
    };
    const handleToggleStdioTapDevProxy = () => {
        void (async () => {
            await platform.executeDesktopCommand(DesktopCommandIds.ToggleZCodeStdioTapDevProxy);
            await syncStdioTapDevState();
        })();
    };
    return (_jsxs(DropdownMenu, { onOpenChange: (open) => {
            if (open) {
                if (showDesktopUpdateEntry) {
                    void syncUpdateState();
                }
                void syncStdioTapDevState();
            }
        }, children: [_jsx(DropdownMenuTrigger, { asChild: true, children: _jsx(Button, { type: "button", variant: "ghost", size: "icon-lg", className: cn("text-foreground-subtle hover:text-foreground [app-region:no-drag]", useWindowsCaptionSpacing
                        ? WINDOWS_CAPTION_CONTROL_CLASS
                        : "h-full w-[45px] rounded-none", "border-0 hover:bg-hover", triggerPresentation === "header" && "border-l border-border/50"), "aria-label": intl.formatMessage({ id: "titleBar.windowMenu" }), children: _jsx(ChevronDownIcon, { className: "size-5 text-foreground" }) }) }), _jsxs(DropdownMenuContent, { align: "end", 
                // Bugfix: Windows titleBarOverlay 的原生窗口按钮宽度会受 DPI / 系统主题 / Electron 取整影响，
                // 菜单右对齐到 45px 自绘入口时，浮层边缘可能压到最小化按钮下方；轻微左移只影响这颗 caption 菜单。
                alignOffset: WINDOWS_CAPTION_MENU_ALIGN_OFFSET, side: "bottom", sideOffset: 8, className: "w-72 border border-popover-border bg-menu p-2", children: [_jsxs(DropdownMenuItem, { disabled: Boolean(readOnlyReason), title: readOnlyReason, onSelect: () => {
                            if (!readOnlyReason) {
                                onCreateTask();
                            }
                        }, children: [intl.formatMessage({ id: "titleBar.menu.file.newTask" }), _jsx(DropdownMenuShortcut, { children: newTaskShortcutLabel })] }), allowOpenWorkspace ? (_jsxs(DropdownMenuItem, { onSelect: onOpenWorkspace, children: [intl.formatMessage({ id: "workspace.openWorkspace" }), _jsx(DropdownMenuShortcut, { children: openWorkspaceShortcutLabel })] })) : null, allowOpenInFileManager ? (_jsx(DropdownMenuItem, { disabled: Boolean(readOnlyReason), title: readOnlyReason, onSelect: handleOpenWorkspaceInFileManager, children: intl.formatMessage({ id: "appHeader.openInFileExplorer" }) })) : null, _jsx(DropdownMenuSeparator, {}), _jsx(DropdownMenuItem, { onSelect: () => handleExecuteDesktopCommand(DesktopCommandIds.ShowAbout), children: intl.formatMessage({ id: "titleBar.menu.help.about" }) }), showDesktopUpdateEntry ? (_jsx(DropdownMenuItem, { disabled: updateState?.enabled === false, onSelect: () => handleExecuteDesktopCommand(DesktopCommandIds.CheckForUpdates), children: intl.formatMessage({ id: getUpdateMenuLabelId(updateState) }, getUpdateMenuLabelValues(updateState)) })) : null, _jsx(DropdownMenuItem, { onSelect: () => handleExecuteDesktopCommand(DesktopCommandIds.OpenResourceManager), children: intl.formatMessage({ id: "titleBar.menu.help.resourceManager" }) }), _jsx(DropdownMenuSeparator, {}), _jsx(DropdownMenuItem, { onSelect: helpMenuActions.openIssueReport, children: intl.formatMessage({ id: "titleBar.menu.help.feedback" }) }), _jsx(DropdownMenuItem, { onSelect: openFeatureRequest, children: intl.formatMessage({ id: "workspaceHeader.help.productRequest" }) }), showCommunityMenuItem ? (_jsx(DropdownMenuItem, { onSelect: () => handleExecuteDesktopCommand(DesktopCommandIds.OpenCommunity), children: intl.formatMessage({ id: "sidebar.menu.community" }) })) : null, _jsx(DropdownMenuItem, { onSelect: helpMenuActions.openProductDocs, children: intl.formatMessage({ id: "workspaceHeader.help.docs" }) }), _jsx(DropdownMenuItem, { onSelect: helpMenuActions.exportLogs, children: intl.formatMessage({ id: "titleBar.menu.help.exportLogs" }) }), stdioTapDevState.visible ? (_jsxs(_Fragment, { children: [_jsx(DropdownMenuSeparator, {}), _jsx(DropdownMenuCheckboxItem, { checked: stdioTapDevState.enabled, onCheckedChange: handleToggleStdioTapDevProxy, children: intl.formatMessage({ id: "titleBar.menu.help.toggleZCodeStdioTap" }) }), _jsx(DropdownMenuItem, { onSelect: () => handleExecuteDesktopCommand(DesktopCommandIds.ToggleDevTools), children: intl.formatMessage({ id: "titleBar.menu.help.toggleDevTools" }) })] })) : null, _jsx(DropdownMenuSeparator, {}), _jsx(DropdownMenuItem, { onSelect: () => handleExecuteDesktopCommand(DesktopCommandIds.CloseWindow), children: intl.formatMessage({ id: "titleBar.menu.file.closeWindow" }) })] })] }));
}
//# sourceMappingURL=WindowsCaptionMenuButton.js.map