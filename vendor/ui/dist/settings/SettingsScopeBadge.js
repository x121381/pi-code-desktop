import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CircleDashed, Folder, UserRound } from "lucide-react";
import { Badge } from "@/components/ui/badge.js";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
export function SettingsScopeBadge({ scope, label, includeMcpTestAttribute = false, }) {
    const { intl } = useZCodeIntl();
    return (_jsxs(Badge, { variant: "secondary", className: "rounded-full border-border bg-surface text-ui-sm", "data-settings-scope": scope, "data-mcp-scope": includeMcpTestAttribute ? scope : undefined, children: [_jsx("span", { "data-icon": "inline-start", className: "size-3.5", "aria-hidden": "true", children: scope === "workspace" ? (_jsx(Folder, { className: "size-full" })) : scope === "user" ? (_jsx(UserRound, { className: "size-full" })) : (_jsx(CircleDashed, { className: "size-full" })) }), label ?? intl.formatMessage({ id: `settings.scope.${scope}` })] }));
}
//# sourceMappingURL=SettingsScopeBadge.js.map