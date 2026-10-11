import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from "@/components/ui/button.js";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
export function BigModelRegistrationHint({ onOpenRegistration, }) {
    const { intl } = useZCodeIntl();
    return (_jsxs("span", { className: "flex flex-wrap items-center gap-x-1.5 gap-y-1 text-ui-base text-foreground-subtle", children: [intl.formatMessage({
                id: "settings.modelProvider.codingPlan.bigmodel.unregisteredHint",
            }), onOpenRegistration ? (_jsx(Button, { type: "button", variant: "link", size: "xs", className: "h-auto p-0 text-ui-base/relaxed", onClick: onOpenRegistration, children: intl.formatMessage({
                    id: "settings.modelProvider.codingPlan.bigmodel.registerAction",
                }) })) : null] }));
}
export function isBigModelUnregisteredAuthError(error) {
    if (!error) {
        return false;
    }
    const normalized = error.toLowerCase();
    return (error.includes("BigModel 账号未注册") ||
        normalized.includes("bigmodel account is not registered") ||
        normalized.includes("not registered"));
}
//# sourceMappingURL=BigModelRegistrationHint.js.map