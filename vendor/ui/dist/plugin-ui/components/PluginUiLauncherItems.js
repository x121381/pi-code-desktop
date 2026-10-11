import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { PuzzleIcon } from "lucide-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu.js";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
import { resolvePluginUiSurfaceTitle, usePluginUiSurfaces, } from "@/plugin-ui/adapters/usePluginUiSurfaces.js";
export function buildPluginUiLauncherItemId(pluginId, surfaceId) {
    return `plugin-ui:${pluginId}/${surfaceId}`;
}
/**
 * "打开标签页"里的插件面板入口，与内建项共用列表/网格。
 * 旧分组容器会占据一个网格单元，导致插件全部挤在同一列；使用 Fragment 让按钮直接参与父级布局。
 */
export function PluginUiLauncherItems(props) {
    const { locale } = useZCodeIntl();
    const surfaces = usePluginUiSurfaces({
        workspacePath: props.workspacePath,
        ...(props.workspaceIdentity ? { workspaceIdentity: props.workspaceIdentity } : {}),
        enabled: props.sessionId !== null,
    });
    if (props.sessionId === null || surfaces.length === 0)
        return null;
    const sessionId = props.sessionId;
    return (_jsx(_Fragment, { children: surfaces.map((surface) => {
            const title = resolvePluginUiSurfaceTitle(surface.title, locale) || surface.id;
            const itemId = buildPluginUiLauncherItemId(surface.pluginId, surface.id);
            const open = () => props.onOpenPluginUi({
                parentSessionId: sessionId,
                surfaceId: surface.id,
                serverName: surface.server,
                pluginId: surface.pluginId,
                resourceUri: surface.resourceUri,
                title,
                workspacePath: props.workspacePath,
                ...(props.workspaceIdentity ? { workspaceIdentity: props.workspaceIdentity } : {}),
                remoteSessionId: props.remoteSessionId ?? null,
            });
            if (props.variant === "menu") {
                return (_jsxs(DropdownMenuItem, { "data-side-pane-add-item": itemId, onSelect: open, children: [_jsx(PuzzleIcon, { className: "size-4 text-foreground-subtle" }), _jsx("span", { className: "min-w-0 truncate", children: title })] }, itemId));
            }
            return (_jsxs("button", { type: "button", "data-side-pane-open-tab-item": itemId, className: props.itemClassName, onClick: open, children: [_jsx(PuzzleIcon, { className: "size-4 text-foreground-subtle" }), _jsx("span", { className: "side-pane-open-tab-button-label min-w-0 flex-1 truncate text-left", children: title }), _jsx("span", { className: "truncate text-ui-sm text-foreground-subtlest", children: surface.pluginName })] }, itemId));
        }) }));
}
//# sourceMappingURL=PluginUiLauncherItems.js.map