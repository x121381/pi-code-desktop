import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from "../components/ui/button.js";
import { useZCodeIntl } from "../i18n/IntlProvider.js";
import { useBotPrivateDeliveryRetry } from "../hooks/useBotPrivateDeliveryRetry.js";
export function PrivateDeliveryRetry({ botId, deliveryId }) {
    const { intl } = useZCodeIntl();
    const { state, retry } = useBotPrivateDeliveryRetry(botId, deliveryId);
    if (state === "done")
        return null;
    return (_jsxs("div", { className: "space-y-2 text-ui-base", children: [_jsx("p", { className: "text-foreground-subtle", children: intl.formatMessage({ id: "bots.privateDelivery.retryHint" }) }), state === "error" ? (_jsx("p", { role: "alert", className: "text-destructive", children: intl.formatMessage({ id: "bots.privateDelivery.retryFailed" }) })) : null, _jsx(Button, { size: "sm", variant: "outline", disabled: state === "sending", onClick: () => void retry(), children: intl.formatMessage({
                    id: state === "sending" ? "common.loading" : "bots.privateDelivery.retry",
                }) })] }));
}
//# sourceMappingURL=PrivateDeliveryRetry.js.map