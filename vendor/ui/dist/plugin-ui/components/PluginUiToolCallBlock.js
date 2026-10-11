import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from "../../components/ui/button.js";
import { PluginUiCard } from "../../plugin-ui/components/PluginUiCard.js";
import { TID_PLUGIN_UI_OPEN_SIDE_PANE } from "@zcode/shared";
import { PanelRightOpenIcon, PinIcon, PinOffIcon } from "lucide-react";
/** 纯工具卡片视图：平台能力、结果与侧栏归属都由适配器提供。 */
export function PluginUiToolCallView(props) {
    // 旧 UI 已被更新结果接管，继续画替代占位会让查询记录刷屏；只保留可展开的普通工具结果。
    if (!props.supported || props.superseded)
        return props.fallback;
    return (_jsxs("div", { className: "space-y-2", "data-plugin-ui-preferred-display-mode": props.preferredDisplayMode, ...(props.surface ? { "data-plugin-ui-surface": props.surface } : {}), children: [props.fallback, props.sidePaneActive ? (_jsx("div", { className: "flex items-center justify-between rounded-lg border border-border bg-surface px-3 py-2 text-ui-sm text-foreground-subtle", "data-testid": "plugin-ui-side-pane-placeholder", children: _jsx("span", { children: props.openedLabel }) })) : (_jsxs("div", { className: "relative", children: [_jsxs("div", { className: "mb-1 flex justify-end gap-1", children: [props.onTogglePin ? (_jsx(Button, { variant: "ghost", size: "icon-sm", className: "rounded-full bg-background/80", "data-testid": "plugin-ui-pin-toggle", "data-plugin-ui-pinned": String(props.pinned === true), "aria-label": props.pinned ? props.unpinLabel : props.pinLabel, title: props.pinned ? props.unpinLabel : props.pinLabel, onClick: props.onTogglePin, children: props.pinned ? (_jsx(PinOffIcon, { className: "size-3.5" })) : (_jsx(PinIcon, { className: "size-3.5" })) })) : null, props.onOpenSidePane ? (_jsx(Button, { variant: "ghost", size: "icon-sm", className: "rounded-full bg-background/80", "data-testid": TID_PLUGIN_UI_OPEN_SIDE_PANE, "aria-label": props.openLabel, title: props.openLabel, onClick: props.onOpenSidePane, children: _jsx(PanelRightOpenIcon, { className: "size-3.5" }) })) : null] }), _jsx(PluginUiCard, { pageKey: props.host.pageKey, handle: props.host.handle, phase: props.host.phase, height: props.host.height, prefersBorder: props.prefersBorder, error: props.host.error, loadingLabel: props.loadingLabel, errorLabel: props.errorLabel, retryLabel: props.retryLabel, onRetry: props.host.reload, onWidthChange: props.onWidthChange })] }))] }));
}
//# sourceMappingURL=PluginUiToolCallBlock.js.map