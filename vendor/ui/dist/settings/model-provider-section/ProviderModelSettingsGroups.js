import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
import { JsonSlotEditor } from "@/settings/model-provider-section/ProviderModelMetadataFields.js";
import { ProviderModelReasoningLevelEditor } from "@/settings/model-provider-section/ProviderModelReasoningLevelEditor.js";
import { ModelConfigHelp } from "@/settings/model-provider-section/ModelConfigHelp.js";
export function ModelSettingsGroup({ group, children, }) {
    return (_jsx("section", { className: "space-y-4", "data-model-settings-group": group, children: children }));
}
export function ProviderModelReasoningSettings({ draft, personalConfig, inheritedConfig, overrideFields, onDraftChange, }) {
    const { intl } = useZCodeIntl();
    return (_jsxs(ModelSettingsGroup, { group: "reasoning", children: [_jsxs("div", { className: "space-y-1", children: [_jsxs("div", { className: "block text-ui-base text-foreground-subtle", children: [intl.formatMessage({ id: "settings.modelProvider.reasoningLevelsOrdered" }), _jsx(ModelConfigHelp, { field: "reasoningLevelsOrdered" })] }), _jsx(ProviderModelReasoningLevelEditor, { values: draft.reasoningLevelValuesValue, overridden: overrideFields
                            ? overrideFields.has("reasoningLevelValuesValue")
                            : personalConfig?.optionSpecs?.reasoningLevel?.values !== undefined, addLabel: intl.formatMessage({ id: "settings.modelProvider.reasoningLevelAdd" }), deleteLabel: intl.formatMessage({
                            id: "settings.modelProvider.reasoningLevelDelete",
                        }), onChange: (reasoningLevelValuesValue) => onDraftChange({ reasoningLevelValuesValue }) })] }), _jsx("div", { "data-model-reasoning-level-map-editor": "true", children: _jsx(JsonSlotEditor, { label: intl.formatMessage({ id: "settings.modelProvider.reasoningLevelMapping" }), labelHelp: _jsx(ModelConfigHelp, { field: "reasoningLevelMapping" }), value: draft.reasoningLevelMapValue, effectiveValue: draft.useRecommendedConfigValue === false
                        ? undefined
                        : (inheritedConfig?.optionSpecs?.reasoningLevel?.map ?? undefined), overridden: overrideFields
                        ? overrideFields.has("reasoningLevelMapValue")
                        : personalConfig?.optionSpecs?.reasoningLevel?.map !== undefined, onChange: (reasoningLevelMapValue) => onDraftChange({ reasoningLevelMapValue }) }) })] }));
}
//# sourceMappingURL=ProviderModelSettingsGroups.js.map