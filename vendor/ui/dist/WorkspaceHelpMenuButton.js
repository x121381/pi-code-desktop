import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { DesktopCommandIds, TID_WORKSPACE_HELP_MENU_RESOURCE_MANAGER, TID_WORKSPACE_HELP_MENU_TRIGGER, } from "@zcode/shared";
import { ActivityIcon, BookOpenIcon, CircleHelpIcon, DownloadIcon, LightbulbIcon, InfoIcon, MessageSquareIcon, UsersIcon, RefreshCwIcon, ShieldAlertIcon, } from "lucide-react";
import { Badge } from "./components/ui/badge.js";
import { Button } from "./components/ui/button.js";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, } from "./components/ui/dropdown-menu.js";
import { cn } from "./components/lib/utils.js";
import { ControlHintTooltip } from "./ControlHintTooltip.js";
import { useFeedbackStore } from "./feedback/feedbackStore.js";
import { useDesktopUpdateMenu } from "./hooks/useDesktopUpdateMenu.js";
import { usePlatform } from "./hooks/usePlatform.js";
import { useVulnerabilityReportUrl } from "./hooks/useVulnerabilityReportUrl.js";
import { useZCodeIntl } from "./i18n/IntlProvider.js";
import { createHelpMenuActionHandlers } from "./lib/helpMenuActions.js";
export function WorkspaceHelpMenuButton({ className, isDesktop = false, }) {
    const { intl } = useZCodeIntl();
    const platform = usePlatform();
    const [open, setOpen] = useState(false);
    const { url: vulnerabilityReportUrl, loading: vulnerabilityReportLoading } = useVulnerabilityReportUrl(open);
    const updateMenu = useDesktopUpdateMenu(isDesktop);
    const openFeedbackSubmit = useFeedbackStore((state) => state.openSubmit);
    const openFeatureRequest = useFeedbackStore((state) => state.openFeatureRequest);
    const helpMenuLabel = intl.formatMessage({ id: "workspaceHeader.help.menu" });
    const helpMenuActions = createHelpMenuActionHandlers({
        platform,
        intl,
        openSubmit: openFeedbackSubmit,
    });
    const handleOpenCommunity = () => {
        void platform.openCommunity();
    };
    const handleOpenResourceManager = () => {
        void platform.executeDesktopCommand(DesktopCommandIds.OpenResourceManager);
    };
    const handleShowAbout = () => {
        void platform.executeDesktopCommand(DesktopCommandIds.ShowAbout);
    };
    return (_jsxs(DropdownMenu, { open: open, onOpenChange: setOpen, children: [_jsx(ControlHintTooltip, { title: helpMenuLabel, side: "bottom", children: _jsx(DropdownMenuTrigger, { asChild: true, children: _jsx(Button, { type: "button", variant: "ghost", size: "icon-md", 
                        // Settings 页会把帮助按钮绝对定位在 Electron 顶部拖拽区上方。
                        // 只依赖外层容器 no-drag 时，真实 trigger 仍可能被标题栏 drag 区吞掉点击。
                        className: cn("text-foreground hover:bg-hover hover:text-foreground [app-region:no-drag]", className), "aria-label": helpMenuLabel, "data-testid": TID_WORKSPACE_HELP_MENU_TRIGGER, children: _jsx(CircleHelpIcon, { className: "size-4" }) }) }) }), _jsxs(DropdownMenuContent, { align: "end", className: "min-w-0 w-max [&_[data-slot=dropdown-menu-item]]:pr-6", children: [_jsxs(DropdownMenuItem, { onSelect: helpMenuActions.openProductDocs, children: [_jsx(BookOpenIcon, { className: "size-4" }), intl.formatMessage({ id: "workspaceHeader.help.docs" })] }), _jsxs(DropdownMenuItem, { onSelect: handleOpenCommunity, children: [_jsx(UsersIcon, { className: "size-4" }), intl.formatMessage({ id: "workspaceHeader.help.community" })] }), _jsxs(DropdownMenuItem, { onSelect: helpMenuActions.openIssueReport, children: [_jsx(MessageSquareIcon, { className: "size-4" }), intl.formatMessage({ id: "workspaceHeader.help.issueReport" })] }), vulnerabilityReportLoading || vulnerabilityReportUrl ? (_jsxs(DropdownMenuItem, { disabled: vulnerabilityReportLoading, "aria-busy": vulnerabilityReportLoading, onSelect: vulnerabilityReportUrl
                            ? () => platform.openExternal(vulnerabilityReportUrl)
                            : undefined, children: [_jsx(ShieldAlertIcon, { className: "size-4" }), intl.formatMessage({ id: "workspaceHeader.help.reportVulnerability" })] })) : null, _jsxs(DropdownMenuItem, { onSelect: openFeatureRequest, children: [_jsx(LightbulbIcon, { className: "size-4" }), intl.formatMessage({ id: "workspaceHeader.help.productRequest" })] }), isDesktop ? (_jsxs(_Fragment, { children: [_jsx(DropdownMenuSeparator, {}), _jsxs(DropdownMenuItem, { onSelect: helpMenuActions.exportLogs, children: [_jsx(DownloadIcon, { className: "size-4" }), intl.formatMessage({ id: "titleBar.menu.help.exportLogs" })] }), _jsxs(DropdownMenuItem, { "data-testid": TID_WORKSPACE_HELP_MENU_RESOURCE_MANAGER, onSelect: handleOpenResourceManager, children: [_jsx(ActivityIcon, { className: "size-4" }), intl.formatMessage({ id: "titleBar.menu.help.resourceManager" })] }), updateMenu.visible ? (_jsxs(DropdownMenuItem, { disabled: updateMenu.disabled, onSelect: updateMenu.checkForUpdates, children: [_jsx(RefreshCwIcon, { className: "size-4" }), updateMenu.labelId === "desktopMenu.help.restartToUpdate" ? (_jsxs(_Fragment, { children: [_jsx("span", { className: "whitespace-nowrap", children: intl.formatMessage({ id: "desktopMenu.help.restartUpdateAction" }) }), _jsx(Badge, { variant: "secondary", className: "h-4 px-1.5 py-0 bg-success/10 text-success", children: updateMenu.labelValues?.version })] })) : (intl.formatMessage({ id: updateMenu.labelId }, updateMenu.labelValues))] })) : null, _jsxs(DropdownMenuItem, { onSelect: handleShowAbout, children: [_jsx(InfoIcon, { className: "size-4" }), intl.formatMessage({ id: "titleBar.menu.help.about" })] })] })) : null] })] }));
}
//# sourceMappingURL=WorkspaceHelpMenuButton.js.map