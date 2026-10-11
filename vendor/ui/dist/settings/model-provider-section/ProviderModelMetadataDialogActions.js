import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Loader2Icon, CircleAlertIcon, CheckCircle2Icon } from "lucide-react";
import { Button } from "@/components/ui/button.js";
import { Switch } from "@/components/ui/switch.js";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
import { ModelConfigHelp } from "@/settings/model-provider-section/ModelConfigHelp.js";
export function ModelConfigRestoreButton({ disabled, onRestore, }) {
    const { intl } = useZCodeIntl();
    return (_jsx(Button, { type: "button", variant: "ghost", size: "sm", className: "shrink-0 px-0 text-ui-sm text-foreground-subtle underline underline-offset-4 hover:bg-transparent", disabled: disabled, onClick: onRestore, children: intl.formatMessage({ id: "settings.modelProvider.resetForm" }) }));
}
export function ModelConfigDraftFeedback({ error, matched, }) {
    const { intl } = useZCodeIntl();
    if (!error && !matched)
        return null;
    const Icon = error ? CircleAlertIcon : CheckCircle2Icon;
    return (_jsxs("div", { role: error ? "alert" : "status", className: error
            ? "flex min-h-10 items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-destructive"
            : "flex min-h-10 items-center gap-2 rounded-lg border border-success/30 bg-success/10 px-3 py-2 text-success", children: [_jsx(Icon, { className: "size-4 shrink-0", "aria-hidden": "true" }), _jsx("span", { className: "text-ui-sm font-medium", children: error ?? intl.formatMessage({ id: "settings.modelProvider.modelDefaultsLoaded" }) })] }));
}
export function ModelSmartConfigSwitch({ checked, disabled, onChange, }) {
    const { intl } = useZCodeIntl();
    const label = intl.formatMessage({ id: "settings.modelProvider.followRecommendedConfig" });
    return (_jsxs("div", { "data-model-recommended-config": "true", className: "flex shrink-0 items-center justify-start gap-2 pt-2 text-ui-base text-foreground", children: [_jsxs("span", { className: "inline-flex items-center whitespace-nowrap", children: [label, _jsx(ModelConfigHelp, { field: "followRecommendedConfig" })] }), _jsx(Switch, { disabled: disabled, "aria-label": label, checked: checked, onCheckedChange: onChange })] }));
}
export function ProviderModelMetadataDialogActions({ saveLabel, cancelLabel, saving, onSave, onCancel, leadingAction, }) {
    return (_jsxs("div", { "data-model-settings-footer": "true", className: "flex items-center justify-between gap-2 pt-1", children: [leadingAction, _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Button, { type: "button", variant: "ghost", size: "lg", disabled: saving, onClick: onCancel, children: cancelLabel }), _jsxs(Button, { type: "button", variant: "default", size: "lg", disabled: saving, onClick: onSave, children: [saving ? _jsx(Loader2Icon, { className: "size-3.5 animate-spin", "aria-hidden": "true" }) : null, saveLabel] })] })] }));
}
//# sourceMappingURL=ProviderModelMetadataDialogActions.js.map