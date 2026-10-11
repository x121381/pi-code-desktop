import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
export function SettingsResourceGroupHeader({ count, hint, title, }) {
    const { intl } = useZCodeIntl();
    const itemCountLabel = intl.formatMessage({
        id: count === 1 ? "settings.resourceGroup.item.one" : "settings.resourceGroup.item.other",
    }, { count: String(count) });
    return (_jsxs("div", { className: "flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 px-1", children: [_jsxs("div", { className: "flex min-w-0 items-baseline gap-2", children: [_jsx("span", { className: "truncate text-ui-base font-medium text-foreground", children: title }), _jsx("span", { className: "shrink-0 text-ui-base text-foreground-subtlest", children: itemCountLabel })] }), hint ? _jsx("div", { className: "min-w-0 text-ui-base text-foreground-subtle", children: hint }) : null] }));
}
//# sourceMappingURL=SettingsResourceGroupHeader.js.map