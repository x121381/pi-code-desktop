import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function SettingsResourceGroupHeader({ actions, count, title, }) {
    const heading = (_jsxs("h3", { className: "flex h-7 items-center gap-1.5 text-ui-base font-medium text-foreground", children: [title, _jsx("span", { className: "text-ui-sm font-normal text-foreground-subtle", children: count })] }));
    return actions ? (_jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3", children: [heading, actions] })) : (heading);
}
export function SettingsResourceList({ getKey, items, renderItem, }) {
    if (items.length === 0)
        return null;
    return (_jsx("div", { className: "overflow-hidden rounded-xl bg-surface", children: items.map((item, index) => (_jsxs("div", { children: [index > 0 ? _jsx("div", { className: "h-px bg-border/50", "aria-hidden": "true" }) : null, renderItem(item)] }, getKey(item)))) }));
}
//# sourceMappingURL=SettingsResourceGroup.js.map