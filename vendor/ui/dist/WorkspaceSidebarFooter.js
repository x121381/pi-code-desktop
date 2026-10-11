import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { memo, useCallback, useEffect, useState } from "react";
import { DesktopCommandIds, TID_LOGIN_MENU_ITEM, TID_LOGIN_TRIGGER, TID_LOGOUT_BUTTON, TID_TASK_SETTINGS_BUTTON, } from "@zcode/shared";
import { ControlHintTooltip } from "@/ControlHintTooltip.js";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar.js";
import { cn } from "@/components/lib/utils.js";
import { Button } from "@/components/ui/button.js";
import { toast } from "@/components/ui/toast.js";
import { Badge } from "@/components/ui/badge.js";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu.js";
import { Copy, PencilRuler, Globe, Gift, Loader2, LogInIcon, LogOut, Maximize, Palette, Settings, User, ZoomIn, ZoomOut, } from "lucide-react";
import { usePlatform } from "@/hooks/usePlatform.js";
import { useOpenRewards } from "@/rewards/RewardsProvider.js";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
import { useShortcutCommandLabel } from "@/shortcuts/useShortcutBindings.js";
import { useZCodeStore } from "@/store/StoreProvider.js";
import { normalizeInterfaceMode } from "@/lib/interfaceMode.js";
import { WorkspaceWebRemoteControlTrigger } from "@/WorkspaceWebRemoteControlTrigger.js";
import { WorkspaceSidebarFooterPlanBadge, WorkspaceSidebarFooterUsageSummaryContent, useWorkspaceSidebarFooterUsageSummaryState, } from "@/WorkspaceSidebarFooterUsageSummary.js";
const DESKTOP_ZOOM_MIN_LEVEL = -3;
const DESKTOP_ZOOM_MAX_LEVEL = 5;
function getSidebarProfileName(user) {
    const displayName = user?.displayName?.trim();
    if (displayName) {
        return displayName;
    }
    const username = user?.username?.trim();
    if (username) {
        return username;
    }
    return "ZCode";
}
function getSidebarProfileBadge(user, formatMessage) {
    if (user) {
        return getSidebarProfileName(user);
    }
    return formatMessage({ id: "sidebar.profile.notLoggedIn" });
}
function getAvatarFallbackText(user) {
    const source = user?.displayName?.trim() || user?.username?.trim() || "Z";
    return source[0]?.toUpperCase() ?? "Z";
}
export const WorkspaceSidebarFooter = memo(function WorkspaceSidebarFooterComponent({ theme, localeMenuValue, onLocaleChange, onThemeChange, onSettingsButtonClick, onUsageClick, onUpgradeClick, onLogin, onLogout, settingsButtonMode = "settings", user, workspacePath, workspaceIdentity, workspaceRemoteSessionId, activeTaskId, isDesktop = false, banner, className, }) {
    const { intl } = useZCodeIntl();
    const platform = usePlatform();
    const openRewards = useOpenRewards();
    const interfaceMode = useZCodeStore((state) => state.interfaceMode);
    const setInterfaceMode = useZCodeStore((state) => state.setInterfaceMode);
    const zoomInShortcutLabel = useShortcutCommandLabel("zoomIn");
    const zoomOutShortcutLabel = useShortcutCommandLabel("zoomOut");
    const resetZoomShortcutLabel = useShortcutCommandLabel("resetZoom");
    const isRestoringOAuthSession = useZCodeStore((state) => state.isRestoringOAuthSession);
    const profileBadge = getSidebarProfileBadge(user, intl.formatMessage);
    const avatarFallbackText = getAvatarFallbackText(user);
    const avatarKey = user?.avatarUrl ?? user?.id ?? "guest";
    const showAuthRestoreLoading = !user && isRestoringOAuthSession;
    const usageSummaryState = useWorkspaceSidebarFooterUsageSummaryState({
        enabled: true,
        workspaceIdentity,
        workspacePath,
    });
    const copyUserId = async () => {
        if (!user?.id)
            return;
        try {
            await navigator.clipboard.writeText(user.id);
            toast(intl.formatMessage({ id: "sidebar.profile.userIdCopied" }));
        }
        catch {
            toast(intl.formatMessage({ id: "sidebar.profile.userIdCopyFailed" }));
        }
    };
    const profileContent = (_jsxs(_Fragment, { children: [_jsxs(Avatar, { size: "default", children: [user?.avatarUrl ? _jsx(AvatarImage, { src: user.avatarUrl, alt: profileBadge }) : null, _jsx(AvatarFallback, { className: "bg-background text-foreground", children: user ? (avatarFallbackText) : showAuthRestoreLoading ? (_jsxs(_Fragment, { children: [_jsx(Loader2, { className: "size-4 animate-spin" }), _jsx("span", { className: "sr-only", children: intl.formatMessage({ id: "common.loading" }) })] })) : (_jsx(User, { className: "size-4" })) })] }, avatarKey), _jsx("div", { className: "min-w-0 flex-1 overflow-hidden text-left", children: _jsx("div", { className: "flex min-w-0 items-center gap-1.5", children: _jsx("span", { className: "min-w-0 truncate text-ui-base font-semibold text-foreground", children: profileBadge }) }) })] }));
    const settingsButtonLabel = settingsButtonMode === "back"
        ? intl.formatMessage({ id: "workspace.backToWorkspace" })
        : intl.formatMessage({ id: "settings.title" });
    const usageButtonClick = onUsageClick ?? onSettingsButtonClick;
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const [desktopZoomLevel, setDesktopZoomLevel] = useState(0);
    const runDesktopZoomCommand = useCallback((command) => {
        void platform.executeDesktopCommand(command);
    }, [platform]);
    useEffect(() => {
        if (!isDesktop) {
            setDesktopZoomLevel(0);
            return;
        }
        let isCancelled = false;
        void platform.getDesktopZoomLevel?.().then((state) => {
            if (!isCancelled && Number.isFinite(state.zoomLevel)) {
                setDesktopZoomLevel(state.zoomLevel);
            }
        });
        const dispose = platform.onDesktopZoomLevelChanged?.((state) => {
            if (Number.isFinite(state.zoomLevel)) {
                setDesktopZoomLevel(state.zoomLevel);
            }
        });
        return () => {
            isCancelled = true;
            dispose?.();
        };
    }, [isDesktop, platform]);
    const canResetDesktopZoom = desktopZoomLevel !== 0;
    const canZoomIn = desktopZoomLevel < DESKTOP_ZOOM_MAX_LEVEL;
    const canZoomOut = desktopZoomLevel > DESKTOP_ZOOM_MIN_LEVEL;
    return (_jsxs("footer", { className: cn("flex shrink-0 flex-col gap-2.5 px-4 pt-2 pb-4", className), children: [banner, _jsxs("div", { className: "flex min-w-0 gap-2", children: [_jsxs(DropdownMenu, { open: profileMenuOpen, onOpenChange: setProfileMenuOpen, children: [_jsx(DropdownMenuTrigger, { asChild: true, children: _jsx(Button, { type: "button", variant: "ghost", size: "lg", className: "min-w-0 flex-1 justify-start gap-2 overflow-hidden rounded-tl-2xl rounded-bl-2xl border-0 pl-0", "data-testid": TID_LOGIN_TRIGGER, "aria-label": profileBadge, children: profileContent }) }), _jsxs(DropdownMenuContent, { align: "start", className: "w-max min-w-50 max-w-[calc(100vw-2rem)]", forceMount: true, children: [user ? (_jsxs(_Fragment, { children: [_jsxs("div", { "data-testid": "profile-menu-header", className: "flex max-w-80 items-center gap-2 px-2 py-1.5", children: [_jsxs(Avatar, { size: "default", children: [user.avatarUrl ? (_jsx(AvatarImage, { src: user.avatarUrl, alt: profileBadge })) : null, _jsx(AvatarFallback, { className: "bg-background text-foreground", children: avatarFallbackText })] }, avatarKey), _jsxs("div", { className: "flex min-w-0 flex-1 flex-col", children: [_jsxs("div", { className: "flex min-w-0 items-center gap-1.5", children: [_jsx("span", { "data-testid": "profile-menu-name", className: "truncate text-ui-base font-medium", children: profileBadge }), _jsx("span", { "data-testid": "profile-menu-plan", className: "flex shrink-0 [&>span]:border-border/50 [&>span]:bg-transparent [&>span]:font-normal", children: _jsx(WorkspaceSidebarFooterPlanBadge, { state: usageSummaryState }) })] }), user.id ? (_jsxs("div", { className: "flex min-w-0 items-center gap-1 text-ui-sm text-foreground-subtle", children: [_jsx("span", { "data-testid": "profile-menu-id", className: "min-w-0 truncate", children: intl.formatMessage({ id: "sidebar.profile.accountId" }, { id: user.id }) }), _jsx(DropdownMenuItem, { asChild: true, className: "data-[highlighted]:bg-transparent data-[highlighted]:hover:bg-menu-hover data-[highlighted]:focus-visible:bg-menu-hover", onSelect: (event) => {
                                                                            event.preventDefault();
                                                                            void copyUserId();
                                                                        }, children: _jsx(Button, { type: "button", variant: "ghost", size: "icon-xs", "data-testid": "copy-user-id", className: "min-h-0 p-0 text-foreground-subtle", "aria-label": intl.formatMessage({ id: "sidebar.profile.copyUserId" }), title: intl.formatMessage({ id: "sidebar.profile.copyUserId" }), children: _jsx(Copy, { className: "size-3" }) }) })] })) : null] })] }), _jsx(DropdownMenuSeparator, {})] })) : null, _jsxs(DropdownMenuSub, { children: [_jsxs(DropdownMenuSubTrigger, { children: [_jsx(Globe, { className: "size-4" }), intl.formatMessage({ id: "settings.locale" })] }), _jsx(DropdownMenuSubContent, { className: "w-48", children: _jsxs(DropdownMenuRadioGroup, { value: localeMenuValue, onValueChange: onLocaleChange, children: [_jsx(DropdownMenuRadioItem, { value: "system", children: intl.formatMessage({
                                                                id: "sidebar.settings.systemDefault",
                                                            }) }), _jsx(DropdownMenuRadioItem, { value: "en-US", children: intl.formatMessage({
                                                                id: "sidebar.settings.locale.en-US",
                                                            }) }), _jsx(DropdownMenuRadioItem, { value: "zh-CN", children: intl.formatMessage({
                                                                id: "sidebar.settings.locale.zh-CN",
                                                            }) })] }) })] }), _jsxs(DropdownMenuSub, { children: [_jsxs(DropdownMenuSubTrigger, { children: [_jsx(Palette, { className: "size-4" }), intl.formatMessage({ id: "settings.themeMode" })] }), _jsx(DropdownMenuSubContent, { className: "w-48", children: _jsxs(DropdownMenuRadioGroup, { value: theme, onValueChange: onThemeChange, children: [_jsx(DropdownMenuRadioItem, { value: "system", children: intl.formatMessage({
                                                                id: "sidebar.settings.systemDefault",
                                                            }) }), _jsx(DropdownMenuRadioItem, { value: "zai-dark", children: intl.formatMessage({
                                                                id: "sidebar.settings.theme.zai-dark",
                                                            }) }), _jsx(DropdownMenuRadioItem, { value: "zai-light", children: intl.formatMessage({
                                                                id: "sidebar.settings.theme.zai-light",
                                                            }) })] }) })] }), _jsxs(DropdownMenuSub, { children: [_jsxs(DropdownMenuSubTrigger, { children: [_jsx(PencilRuler, { className: "size-4" }), intl.formatMessage({ id: "settings.interfaceMode" })] }), _jsx(DropdownMenuSubContent, { className: "w-48", children: _jsxs(DropdownMenuRadioGroup, { value: interfaceMode, onValueChange: (value) => setInterfaceMode(normalizeInterfaceMode(value)), children: [_jsx(DropdownMenuRadioItem, { value: "coding", children: intl.formatMessage({ id: "settings.interfaceMode.coding" }) }), _jsx(DropdownMenuRadioItem, { value: "office", children: intl.formatMessage({ id: "settings.interfaceMode.office" }) })] }) })] }), isDesktop ? (_jsxs(DropdownMenuSub, { children: [_jsxs(DropdownMenuSubTrigger, { children: [_jsx(ZoomIn, { className: "size-4" }), intl.formatMessage({ id: "sidebar.settings.interfaceZoom" })] }), _jsxs(DropdownMenuSubContent, { className: "w-50", children: [_jsxs(DropdownMenuItem, { disabled: !canZoomIn, onSelect: () => runDesktopZoomCommand(DesktopCommandIds.ZoomIn), children: [_jsx(ZoomIn, { className: "size-4" }), intl.formatMessage({ id: "titleBar.menu.view.zoomIn" }), _jsx(DropdownMenuShortcut, { children: zoomInShortcutLabel })] }), _jsxs(DropdownMenuItem, { disabled: !canZoomOut, onSelect: () => runDesktopZoomCommand(DesktopCommandIds.ZoomOut), children: [_jsx(ZoomOut, { className: "size-4" }), intl.formatMessage({ id: "titleBar.menu.view.zoomOut" }), _jsx(DropdownMenuShortcut, { children: zoomOutShortcutLabel })] }), _jsxs(DropdownMenuItem, { disabled: !canResetDesktopZoom, onSelect: () => runDesktopZoomCommand(DesktopCommandIds.ResetZoom), children: [_jsx(Maximize, { className: "size-4" }), intl.formatMessage({ id: "titleBar.menu.view.actualSize" }), _jsx(DropdownMenuShortcut, { children: resetZoomShortcutLabel })] })] })] })) : null, _jsx(WorkspaceSidebarFooterUsageSummaryContent, { state: usageSummaryState, onUsageClick: usageButtonClick, onUpgradeClick: onUpgradeClick }), user ? (_jsxs(DropdownMenuItem, { onSelect: () => openRewards?.(), "data-testid": "rewards-menu-item", children: [_jsx(Gift, { className: "size-4" }), intl.formatMessage({ id: "rewards.menuTitle" }), _jsx(Badge, { "data-testid": "rewards-reward-badge", className: "-ml-0.5 h-auto border-0 px-1.5 py-0.5 text-ui-sm leading-none bg-[var(--color-plugin-paid-plan-badge)] text-[var(--color-plugin-paid-plan-badge-foreground)]", children: intl.formatMessage({ id: "rewards.menuBadge" }) })] })) : null, onLogin && !user ? (_jsxs(_Fragment, { children: [_jsx(DropdownMenuSeparator, {}), _jsxs(DropdownMenuItem, { onSelect: onLogin, "data-testid": TID_LOGIN_MENU_ITEM, children: [_jsx(LogInIcon, { className: "size-4" }), intl.formatMessage({ id: "app.login" })] })] })) : null, onLogout ? _jsx(DropdownMenuSeparator, {}) : null, onLogout ? (_jsxs(DropdownMenuItem, { onSelect: onLogout, "data-testid": TID_LOGOUT_BUTTON, children: [_jsx(LogOut, { className: "size-4" }), intl.formatMessage({ id: "app.logout" })] })) : null] })] }), _jsxs("div", { className: "flex shrink-0 items-center gap-1.5", children: [isDesktop && workspacePath ? (_jsx(WorkspaceWebRemoteControlTrigger, { workspacePath: workspacePath, workspaceIdentity: workspaceIdentity, remoteSessionId: workspaceRemoteSessionId, initialTaskId: activeTaskId ?? undefined, compact: true })) : null, _jsx(ControlHintTooltip, { title: settingsButtonLabel, children: _jsx(Button, { type: "button", variant: "ghost", size: "icon-lg", "data-testid": TID_TASK_SETTINGS_BUTTON, "aria-label": settingsButtonLabel, disabled: !onSettingsButtonClick, onClick: onSettingsButtonClick, children: _jsx(Settings, { className: "size-4" }) }) })] })] })] }));
});
//# sourceMappingURL=WorkspaceSidebarFooter.js.map