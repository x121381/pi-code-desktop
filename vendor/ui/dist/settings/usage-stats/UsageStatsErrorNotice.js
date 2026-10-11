import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AlertTriangle, InfoIcon } from "lucide-react";
import { Button } from "../../components/ui/button.js";
import { useZCodeIntl } from "../../i18n/IntlProvider.js";
import { setPendingSettingsSection } from "../../lib/settingsNavigation.js";
import { formatUsageErrorMessage, isUsageCredentialError, isUsageTeamPlanBusinessError, } from "../../lib/usageErrorCopy.js";
export function UsageStatsErrorNotice({ error }) {
    const { intl } = useZCodeIntl();
    // 团队套餐业务错误（如"您当前暂无有效的团队套餐授权记录…"）含"授权"字样，
    // 直接 isUsageCredentialError 会误判成凭据问题（显示检查 API Key 按钮），业务错误优先。
    const usageErrorIsTeamPlanBusiness = isUsageTeamPlanBusinessError(error);
    const usageErrorIsCredential = !usageErrorIsTeamPlanBusiness && isUsageCredentialError(error);
    return (_jsxs("div", { className: "flex w-fit min-w-0 items-center gap-1.5 text-ui-base", children: [usageErrorIsTeamPlanBusiness ? (_jsx(InfoIcon, { className: "size-3 shrink-0 text-warning", "aria-hidden": "true" })) : (_jsx(AlertTriangle, { className: usageErrorIsCredential
                    ? "size-3 shrink-0 text-warning"
                    : "size-3 shrink-0 text-destructive" })), _jsx("span", { className: usageErrorIsTeamPlanBusiness
                    ? "min-w-0 truncate text-warning"
                    : usageErrorIsCredential
                        ? "min-w-0 truncate whitespace-nowrap text-foreground"
                        : "min-w-0 truncate whitespace-nowrap text-destructive", children: formatUsageErrorMessage(intl, "stats", error) }), usageErrorIsCredential ? (_jsx(Button, { type: "button", size: "sm", variant: "outline", className: "h-7 shrink-0 rounded-md bg-background", onClick: () => setPendingSettingsSection("modelProvider"), children: intl.formatMessage({ id: "settings.usage.checkApiKey" }) })) : null] }));
}
//# sourceMappingURL=UsageStatsErrorNotice.js.map