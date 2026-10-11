import { jsx as _jsx } from "react/jsx-runtime";
import { useZCodeIntl } from "../../i18n/IntlProvider.js";
export function PresetProviderApiKeyBanner({ onOpenApiKey }) {
    const { intl } = useZCodeIntl();
    // 获取入口不区分个人／团队；两个按钮和专用字段会偏离单一控制台入口的预期。
    return (_jsx("div", { className: "text-foreground-subtlest flex flex-wrap items-center justify-end gap-x-3 gap-y-1 text-ui-base", children: _jsx("button", { type: "button", className: "text-primary cursor-pointer rounded-sm font-medium hover:underline focus-visible:outline-2 focus-visible:outline-ring", onClick: onOpenApiKey, children: intl.formatMessage({ id: "settings.modelProvider.getApiKey" }) }) }));
}
//# sourceMappingURL=PresetProviderApiKeyBanner.js.map