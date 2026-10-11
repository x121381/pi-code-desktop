import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { PluginIcon } from "../../components/PluginIcon.js";
export function PluginMentionOptionContent({ item }) {
    return (_jsxs("span", { className: "min-w-0 flex flex-1 items-center gap-2", children: [_jsx(PluginIcon, { pluginId: item.data?.pluginId ?? item.value, src: item.data?.icon, className: "size-5 rounded-md", iconClassName: "size-3" }), _jsx("span", { className: "shrink-0 whitespace-nowrap text-ui-base font-medium text-foreground", children: item.displayLabel ?? item.label }), _jsx("span", { className: "min-w-0 truncate text-ui-xs text-foreground-subtlest", children: item.disabled && item.disabledReason ? item.disabledReason : item.description })] }));
}
//# sourceMappingURL=PluginMentionOptionContent.js.map