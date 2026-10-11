import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { ChevronDown, Cloud, Folder, Monitor } from "lucide-react";
import { testId } from "@zcode/shared";
import { Button } from "../components/ui/button.js";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger, } from "../components/ui/dropdown-menu.js";
import { useZCodeIntl } from "../i18n/IntlProvider.js";
import { getWorkspaceKey } from "../lib/workspaceKey.js";
export function getPluginWorkspaceKey(tab) {
    return getWorkspaceKey(tab.workspacePath, tab.workspaceIdentity);
}
export function isPluginScopeWorkspaceConnected(tab) {
    // 持久化 tab 会保留已经断开的远端项目和已失效的本地目录；Scope 若继续展示，
    // 用户会选中一个没有可用 service target 的项目。远端必须有当前 session，本地必须仍可用。
    if (tab.availability === "unavailable-local-directory") {
        return false;
    }
    const isRemote = Boolean(tab.workspaceIdentity?.trim() || tab.remoteTarget || tab.remoteSessionId);
    if (!isRemote) {
        return true;
    }
    return Boolean(tab.remoteSessionId);
}
export function PluginScopeMenu({ align = "start", disabled = false, includeUser = true, selectedScopeKey, triggerIconTestId, triggerTestId, userOptionTestId, workspaceOptionTestIdPrefix, workspaceOptions, workspaceTabs = [], onScopeKeyChange, }) {
    const { intl } = useZCodeIntl();
    const scopeWorkspaces = workspaceOptions ??
        workspaceTabs.filter(isPluginScopeWorkspaceConnected).map((tab) => ({
            key: getPluginWorkspaceKey(tab),
            label: tab.label,
            remote: Boolean(tab.remoteTarget || tab.remoteSessionId),
        }));
    const selectedWorkspace = scopeWorkspaces.find((workspace) => workspace.key === selectedScopeKey);
    const SelectedWorkspaceIcon = selectedWorkspace?.remote ? Cloud : Folder;
    // 用户作用域是本机配置范围，不能使用登录账号或设备用户名代替其语义。
    const userLabel = intl.formatMessage({ id: "settings.plugin.scope.user" });
    return (_jsxs(DropdownMenu, { children: [_jsx(DropdownMenuTrigger, { asChild: true, disabled: disabled, children: _jsxs(Button, { type: "button", variant: "outline", size: "default", "data-testid": triggerTestId, "data-plugin-scope-trigger": "true", "data-plugin-scope-key": selectedScopeKey, className: "rounded-full", children: [selectedWorkspace || !includeUser ? (_jsx(SelectedWorkspaceIcon, { className: "size-4", "aria-hidden": "true", "data-testid": triggerIconTestId })) : (_jsx(Monitor, { className: "size-4", "aria-hidden": "true", "data-testid": triggerIconTestId })), _jsx("span", { className: "max-w-48 truncate", children: selectedWorkspace?.label ?? userLabel }), _jsx(ChevronDown, { className: "size-4 text-foreground-subtlest", "aria-hidden": "true" })] }) }), _jsx(DropdownMenuContent, { align: align, className: "w-64 max-w-[calc(100vw-2rem)]", children: _jsxs(DropdownMenuRadioGroup, { value: selectedScopeKey, onValueChange: onScopeKeyChange, children: [includeUser ? (_jsxs(DropdownMenuRadioItem, { value: "user", "data-testid": userOptionTestId, children: [_jsx(Monitor, { className: "size-4", "aria-hidden": "true" }), _jsx("span", { className: "truncate text-ui-base font-medium text-foreground", children: userLabel })] })) : null, scopeWorkspaces.length > 0 ? (_jsxs(_Fragment, { children: [includeUser ? _jsx(DropdownMenuSeparator, {}) : null, _jsx(DropdownMenuLabel, { children: intl.formatMessage({
                                        id: "settings.plugin.scope.workspaces",
                                    }) }), scopeWorkspaces.map((workspace) => {
                                    const WorkspaceIcon = workspace.remote ? Cloud : Folder;
                                    return (_jsxs(DropdownMenuRadioItem, { value: workspace.key, "data-testid": workspaceOptionTestIdPrefix
                                            ? testId(workspaceOptionTestIdPrefix, workspace.key)
                                            : undefined, className: "items-start py-2", children: [_jsx(WorkspaceIcon, { className: "mt-0.5 size-4", "aria-hidden": "true" }), _jsx("span", { className: "min-w-0", children: _jsx("span", { className: "block truncate text-ui-base font-medium text-foreground", children: workspace.label }) })] }, workspace.key));
                                })] })) : null] }) })] }));
}
//# sourceMappingURL=PluginScopeMenu.js.map