import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useId, useRef, useState } from "react";
import { Loader2Icon, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button.js";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog.js";
import { Input } from "@/components/ui/input.js";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
import { ProviderModelInputModalityOptions } from "@/settings/model-provider-section/ProviderModelModalityOptions.js";
import { BooleanModelOption } from "@/settings/model-provider-section/ProviderModelMetadataFields.js";
import { ModelSettingsGroup, ProviderModelReasoningSettings, } from "@/settings/model-provider-section/ProviderModelSettingsGroups.js";
import { isImeComposingKeyEvent } from "@/lib/imeComposition.js";
import { TECHNICAL_INPUT_ATTRIBUTES } from "@/lib/technicalInputAttributes.js";
import { ProviderModelMetadataDialogActions, ModelSmartConfigSwitch, ModelConfigDraftFeedback, ModelConfigRestoreButton, } from "@/settings/model-provider-section/ProviderModelMetadataDialogActions.js";
import { modelEditorControlStyle } from "@/settings/model-provider-section/modelEditorControlStyle.js";
import { cn } from "@/components/lib/utils.js";
import { ModelConfigHelp, ModelConfigInputLabel, } from "@/settings/model-provider-section/ModelConfigHelp.js";
import { ModelEditorAdvanced } from "@/settings/model-provider-section/ModelEditorAdvanced.js";
export function selectFocusedInputText(event) {
    event.currentTarget.select();
}
export function ProviderModelMetadataDialog({ mode = "edit", open, draft, draftErrorMessage, draftErrorField, personalConfig, overrideFields, inheritedConfig, onOpenChange, onDraftChange, onRestore, onCommit, modelConfigResolutionPending = false, modelIdReadOnly = false, saving = false, modelDefaultsLoaded = false, onModelIdBlur, }) {
    const { intl } = useZCodeIntl();
    const [validationAttempt, setValidationAttempt] = useState(0);
    const commit = async () => {
        const result = await onCommit();
        if (!result)
            setValidationAttempt((value) => value + 1);
    };
    const contextWindowInputId = useId();
    const maxOutputInputId = useId();
    const smart = draft.useRecommendedConfigValue !== false;
    const activeOverrides = smart ? overrideFields : new Set();
    const overridden = (field, legacy = false) => smart && (activeOverrides ? activeOverrides.has(field) : legacy);
    const editModelLabel = intl.formatMessage({
        id: "settings.modelProvider.editModel",
    });
    // 新增模型时模型 ID 为空，如果沿用编辑态的上下文窗口自动聚焦，会让用户先落到默认数值字段。
    // 编辑态仍保留上下文窗口自动聚焦和选中，方便直接修改已有模型配置。
    const shouldFocusModelIdInput = mode === "add";
    const shouldFocusContextWindowInput = mode === "edit";
    const addModelConfigResolutionPending = smart && modelConfigResolutionPending;
    const compositionActiveRef = useRef(false);
    const handleTechnicalInputKeyDown = (event) => {
        if (event.key !== "Enter") {
            return;
        }
        // 输入法候选确认也会发出 Enter。某些 Electron/macOS 版本的
        // nativeEvent.isComposing 会过早恢复 false，因此同时保留本地 composition 状态。
        if (isImeComposingKeyEvent({
            compositionActive: compositionActiveRef.current,
            nativeEvent: event.nativeEvent,
        })) {
            return;
        }
        event.preventDefault();
        void commit();
    };
    const handleCompositionStart = () => {
        compositionActiveRef.current = true;
    };
    const handleCompositionEnd = () => {
        compositionActiveRef.current = false;
    };
    const maxOutputTokensInputDisabled = mode === "add" && !draft.idValue.trim();
    return (_jsxs(Dialog, { open: open, onOpenChange: onOpenChange, children: [mode === "edit" ? (_jsx(DialogTrigger, { asChild: true, children: _jsx(Button, { type: "button", variant: "ghost", size: "icon-sm", className: "shrink-0 p-0", "aria-label": editModelLabel, title: editModelLabel, children: _jsx(Pencil, { className: "size-3.5 text-foreground-subtle" }) }) })) : null, _jsxs(DialogContent
            // overflow-hidden 仍允许聚焦触发外层滚动；语言换行后曾滚走标题。仅正文滚动，外框只裁切。
            , { 
                // overflow-hidden 仍允许聚焦触发外层滚动；语言换行后曾滚走标题。仅正文滚动，外框只裁切。
                className: "max-h-[min(48rem,calc(100vh-4rem))] max-w-2xl grid-rows-[auto_minmax(0,1fr)_auto_auto] overflow-clip", "data-no-model-drag": "true", children: [_jsxs(DialogHeader, { className: "pr-8", children: [_jsx(DialogTitle, { className: "truncate", children: intl.formatMessage({
                                    id: mode === "add"
                                        ? "settings.modelProvider.addModel"
                                        : "settings.modelProvider.editModel",
                                }) }), _jsx(DialogDescription, { className: "sr-only", children: intl.formatMessage({
                                    id: "settings.modelProvider.editModelDescription",
                                }) }), _jsx(ModelSmartConfigSwitch, { disabled: saving, checked: smart, onChange: (useRecommendedConfigValue) => onDraftChange({ useRecommendedConfigValue }) })] }), _jsxs("div", { inert: saving, className: "min-h-0 min-w-0 -mr-3 space-y-4 overflow-y-auto pr-4", "data-model-settings-scroll": "true", children: [_jsx(ModelSettingsGroup, { group: "basic", children: _jsx("div", { "data-model-identity-row": "true", className: "flex flex-col gap-4", children: _jsxs("div", { className: "min-w-0 flex-1", children: [_jsx("label", { className: "mb-1 block text-ui-base text-foreground-subtle", children: intl.formatMessage({ id: "settings.modelProvider.modelId" }) }), _jsx(Input, { ...TECHNICAL_INPUT_ATTRIBUTES, type: "text", autoFocus: shouldFocusModelIdInput, size: "lg", className: cn("font-mono", modelEditorControlStyle(false)), readOnly: modelIdReadOnly, value: draft.idValue, placeholder: intl.formatMessage({
                                                    id: "settings.modelProvider.modelId",
                                                }), onChange: (event) => {
                                                    onDraftChange({ idValue: event.target.value });
                                                }, onBlur: onModelIdBlur, onCompositionStart: handleCompositionStart, onCompositionEnd: handleCompositionEnd, onKeyDown: handleTechnicalInputKeyDown })] }) }) }), _jsx(ModelSettingsGroup, { group: "tokens", children: _jsx("div", { className: "space-y-3", children: _jsxs("div", { children: [_jsx("div", { className: "mb-1 block text-ui-base text-foreground-subtle", children: _jsx(ModelConfigInputLabel, { field: "contextWindow", htmlFor: contextWindowInputId }) }), _jsx(Input, { ...TECHNICAL_INPUT_ATTRIBUTES, id: contextWindowInputId, type: "text", autoFocus: shouldFocusContextWindowInput, inputMode: "numeric", pattern: "[0-9]*", size: "lg", value: draft.contextWindowValue, "data-personal-override": overridden("contextWindowValue", personalConfig?.properties?.contextWindow !== undefined), className: modelEditorControlStyle(overridden("contextWindowValue", personalConfig?.properties?.contextWindow !== undefined)), placeholder: draft.useRecommendedConfigValue === false ||
                                                    inheritedConfig?.properties?.contextWindow === undefined
                                                    ? undefined
                                                    : String(inheritedConfig.properties.contextWindow), onChange: (event) => {
                                                    onDraftChange({ contextWindowValue: event.target.value });
                                                }, onFocus: selectFocusedInputText, onCompositionStart: handleCompositionStart, onCompositionEnd: handleCompositionEnd, onKeyDown: handleTechnicalInputKeyDown })] }) }) }), _jsx(ModelSettingsGroup, { group: "tokens", children: _jsx("div", { className: "space-y-3", children: _jsxs("div", { "data-model-max-output": "true", children: [_jsxs("div", { className: "mb-1 flex items-center gap-2", children: [_jsx("div", { className: "text-ui-base text-foreground-subtle", children: _jsx(ModelConfigInputLabel, { field: "maxOutputTokens", htmlFor: maxOutputInputId }) }), addModelConfigResolutionPending ? (_jsxs("span", { className: "inline-flex shrink-0 items-center text-foreground-subtlest", role: "status", children: [_jsx(Loader2Icon, { className: "size-3.5 animate-spin", "aria-hidden": "true" }), _jsx("span", { className: "sr-only", children: intl.formatMessage({ id: "common.loading" }) })] })) : null] }), _jsx(Input, { ...TECHNICAL_INPUT_ATTRIBUTES, id: maxOutputInputId, type: "text", inputMode: "numeric", pattern: "[0-9]*", size: "lg", value: draft.maxOutputTokensValue, "data-personal-override": overridden("maxOutputTokensValue", personalConfig?.optionSpecs?.maxOutputTokens?.max !== undefined), className: modelEditorControlStyle(overridden("maxOutputTokensValue", personalConfig?.optionSpecs?.maxOutputTokens?.max !== undefined)), placeholder: draft.useRecommendedConfigValue === false ||
                                                    inheritedConfig?.optionSpecs?.maxOutputTokens?.max === undefined
                                                    ? undefined
                                                    : String(inheritedConfig.optionSpecs.maxOutputTokens.max), disabled: maxOutputTokensInputDisabled, "aria-label": intl.formatMessage({
                                                    id: "settings.modelProvider.maxOutputTokens",
                                                }), "aria-busy": addModelConfigResolutionPending, onChange: (event) => onDraftChange({ maxOutputTokensValue: event.target.value }), onFocus: selectFocusedInputText, onCompositionStart: handleCompositionStart, onCompositionEnd: handleCompositionEnd, onKeyDown: handleTechnicalInputKeyDown })] }) }) }), _jsxs(ModelEditorAdvanced, { open: open, errorField: draftErrorField, validationAttempt: validationAttempt, children: [_jsx(ModelSettingsGroup, { group: "modalities", children: _jsx("div", { className: "space-y-3", children: _jsxs("div", { children: [_jsxs("div", { className: "mb-1 block text-ui-base text-foreground-subtle", children: [intl.formatMessage({ id: "settings.modelProvider.inputModalities" }), _jsx(ModelConfigHelp, { field: "inputModalities" })] }), _jsx(ProviderModelInputModalityOptions, { value: draft.inputFormatValue, onChange: (inputFormatValue) => onDraftChange({ inputFormatValue }), personalValue: personalConfig?.properties?.inputFormat, overrideFields: activeOverrides })] }) }) }), _jsx(ModelSettingsGroup, { group: "capabilities", children: _jsxs("div", { children: [_jsxs("div", { className: "mb-1 block text-ui-base text-foreground-subtle", "data-model-capabilities-label": "true", children: [intl.formatMessage({ id: "settings.modelProvider.capabilities" }), _jsx(ModelConfigHelp, { field: "capabilities" })] }), _jsx("div", { className: "flex flex-wrap gap-2", "data-model-capabilities-options": "true", children: [
                                                        "supportsJsonSchemaOutput",
                                                        "supportsNativeWebSearch",
                                                        "supportsMidConversationSystem",
                                                    ].map((property) => {
                                                        const field = `${property}Value`;
                                                        return (_jsx(BooleanModelOption, { label: intl.formatMessage({ id: `settings.modelProvider.${property}` }), selected: draft[field] ?? false, onToggle: () => onDraftChange({ [field]: !(draft[field] ?? false) }), overridden: overridden(field, personalConfig?.properties?.[property] !== undefined) }, property));
                                                    }) })] }) }), _jsx(ProviderModelReasoningSettings, { draft: draft, personalConfig: personalConfig, overrideFields: activeOverrides, inheritedConfig: inheritedConfig, onDraftChange: onDraftChange })] })] }), _jsx(ModelConfigDraftFeedback, { error: draftErrorMessage, matched: modelDefaultsLoaded }), _jsx(ProviderModelMetadataDialogActions, { leadingAction: _jsx(ModelConfigRestoreButton, { disabled: saving, onRestore: onRestore }), saveLabel: intl.formatMessage({ id: "common.save" }), cancelLabel: intl.formatMessage({ id: "common.cancel" }), saving: saving, onSave: () => void commit(), onCancel: () => onOpenChange(false) })] })] }));
}
//# sourceMappingURL=ProviderModelMetadataDialog.js.map