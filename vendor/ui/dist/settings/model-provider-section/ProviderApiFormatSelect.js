import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "../../components/ui/select.js";
import { useZCodeIntl } from "../../i18n/IntlProvider.js";
import { TID_MODEL_PROVIDER_API_FORMAT_ITEM, TID_MODEL_PROVIDER_API_FORMAT_TRIGGER, testId, } from "@zcode/shared";
export const PROVIDER_CONNECTION_API_FORMATS = [
    "anthropic-messages",
    "openai-chat-completions",
    "openai-responses",
];
const PROVIDER_CONNECTION_API_FORMAT_PATHS = {
    "anthropic-messages": "/v1/messages",
    "openai-chat-completions": "/chat/completions",
    "openai-responses": "/responses",
};
const PROVIDER_CONNECTION_API_FORMAT_TITLE_IDS = {
    "anthropic-messages": "settings.modelProvider.apiFormat.title.anthropicMessages",
    "openai-chat-completions": "settings.modelProvider.apiFormat.title.chatCompletions",
    "openai-responses": "settings.modelProvider.apiFormat.title.responses",
};
export function resolveProviderConnectionApiFormatOptions() {
    return [...PROVIDER_CONNECTION_API_FORMATS];
}
export function resolveProviderConnectionApiFormatDisplayLabel(intl, format) {
    const title = intl.formatMessage({
        id: PROVIDER_CONNECTION_API_FORMAT_TITLE_IDS[format],
    });
    return `${title} (${PROVIDER_CONNECTION_API_FORMAT_PATHS[format]})`;
}
export function ProviderApiFormatSelect({ apiFormatOptions = PROVIDER_CONNECTION_API_FORMATS, triggerId, value, onChange, }) {
    const { intl } = useZCodeIntl();
    return (_jsxs(Select, { value: value, onValueChange: (nextValue) => onChange(nextValue), children: [_jsx(SelectTrigger, { id: triggerId, "data-testid": TID_MODEL_PROVIDER_API_FORMAT_TRIGGER, size: "lg", className: "w-full justify-between", children: _jsx(SelectValue, {}) }), _jsx(SelectContent, { align: "start", children: apiFormatOptions.map((format) => (_jsx(SelectItem, { value: format, "data-testid": testId(TID_MODEL_PROVIDER_API_FORMAT_ITEM, format), children: resolveProviderConnectionApiFormatDisplayLabel(intl, format) }, format))) })] }));
}
//# sourceMappingURL=ProviderApiFormatSelect.js.map