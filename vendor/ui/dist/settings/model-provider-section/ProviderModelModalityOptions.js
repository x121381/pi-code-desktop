import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { LockKeyholeIcon } from "lucide-react";
import { cn } from "@/components/lib/utils.js";
import { Button } from "@/components/ui/button.js";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
import { modelEditorControlStyle } from "@/settings/model-provider-section/modelEditorControlStyle.js";
import { ModelOptionCheckbox } from "@/settings/model-provider-section/ProviderModelMetadataFields.js";
// PDF 已经是正式的模型输入事实和可执行附件能力，旧列表漏掉它后用户无法修正该事实。
// Audio 仍没有设置页附件入口，因此继续只在 Draft 中无损保留。
const INPUT_MODALITY_OPTIONS = ["text", "image", "video", "pdf"];
const INPUT_MODALITY_FIELDS = {
    image: "supportsImage",
    video: "supportsVideo",
    pdf: "supportsPdf",
};
function ModalityOption({ modality, selected, disabled = false, overridden = false, onToggle, }) {
    const { intl } = useZCodeIntl();
    return (_jsxs(Button, { type: "button", variant: "outline", size: "lg", "aria-pressed": selected, disabled: disabled, "data-selected": selected, "data-personal-override": overridden, "data-model-input-modality": modality, className: cn("gap-2 px-3 disabled:opacity-100", modelEditorControlStyle(overridden, selected)), onClick: onToggle, children: [_jsx(ModelOptionCheckbox, { selected: selected }), _jsx("span", { children: intl.formatMessage({ id: `settings.modelProvider.modality.${modality}` }) }), disabled ? (_jsx(LockKeyholeIcon, { className: "size-3.5 shrink-0 text-foreground-subtle", "aria-hidden": "true", "data-model-modality-lock": "true" })) : null] }));
}
export function ProviderModelInputModalityOptions({ value, onChange, personalValue, overrideFields, }) {
    const selected = {
        text: value.supportsText,
        image: value.supportsImage,
        video: value.supportsVideo,
        pdf: value.supportsPdf,
    };
    return (_jsx("div", { className: "flex flex-wrap gap-2", children: INPUT_MODALITY_OPTIONS.map((modality) => {
            const disabled = modality === "text";
            const field = disabled ? "supportsText" : INPUT_MODALITY_FIELDS[modality];
            const overridden = !disabled &&
                (overrideFields
                    ? overrideFields.has(`inputFormatValue.${field}`)
                    : personalValue?.[field] !== undefined);
            return (_jsx("div", { children: _jsx(ModalityOption, { modality: modality, selected: disabled || selected[modality], disabled: disabled, overridden: overridden, onToggle: disabled
                        ? undefined
                        : () => onChange({ ...value, supportsText: true, [field]: !value[field] }) }) }, modality));
        }) }));
}
//# sourceMappingURL=ProviderModelModalityOptions.js.map