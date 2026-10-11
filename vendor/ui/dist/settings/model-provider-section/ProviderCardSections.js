import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
/* eslint-disable max-lines -- 模型供应商卡片仍在迁移期集中维护多个紧耦合区块，后续拆分时再移除。 */
import { useCallback, useRef, useState, } from "react";
import { TID_MODEL_PROVIDER_ADD_MODEL_BUTTON, TID_MODEL_PROVIDER_BASE_URL_INPUT, TID_MODEL_PROVIDER_MODEL_DELETE_BUTTON, TID_MODEL_PROVIDER_MODEL_INPUT, TID_MODEL_PROVIDER_NAME_EDIT_BUTTON, TID_MODEL_PROVIDER_NAME_INPUT, testId, } from "@zcode/shared";
import { InfoIcon, LockKeyholeIcon, Plus, Pencil, Trash2, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button.js";
import { Input } from "@/components/ui/input.js";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, } from "@/components/ui/dropdown-menu.js";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
import { useServices } from "@/hooks/useServices.js";
import { TECHNICAL_INPUT_ATTRIBUTES } from "@/lib/technicalInputAttributes.js";
import { ApiKeyInput } from "./ApiKeyInput.js";
import { ModelRowInput } from "./ProviderFormControls.js";
import { PresetProviderApiKeyBanner } from "./PresetProviderApiKeyBanner.js";
import {} from "@/settings/model-provider-section/ProviderModelMetadata.js";
import { ProviderModelMetadataDialog } from "@/settings/model-provider-section/ProviderModelMetadataDialog.js";
import { PROVIDER_CONNECTION_API_FORMATS, ProviderApiFormatSelect, resolveProviderConnectionApiFormatDisplayLabel, } from "@/settings/model-provider-section/ProviderApiFormatSelect.js";
import { SortableProviderModelList } from "@/settings/model-provider-section/SortableProviderModelList.js";
import { useProviderModelDraft } from "@/settings/model-provider-section/useProviderModelDraft.js";
import { ProviderLogo } from "@/settings/model-provider-section/ProviderLogo.js";
export { resolveProviderConnectionApiFormatDisplayLabel, resolveProviderConnectionApiFormatOptions, } from "@/settings/model-provider-section/ProviderApiFormatSelect.js";
export { formatModelContextWindowLabel } from "@/lib/tokenNumberFormat.js";
export function resolveProviderApiFormatOptions(_provider) {
    return [...PROVIDER_CONNECTION_API_FORMATS];
}
export function shouldShowProviderApiFormat(_provider) {
    return true;
}
export function ProviderCardHeader({ providerName, logo, editingName, nameValue, nameInputRef, nameEditable = true, onNameChange, onNameBlur, onNameKeyDown, onNameCompositionEnd, onNameCompositionStart, onStartEditName, onDelete, actionsVisible = true, providerToggle, }) {
    const { intl } = useZCodeIntl();
    const renameRequestedRef = useRef(false);
    const secondaryActionsVisible = actionsVisible && (nameEditable || Boolean(onDelete));
    return (_jsxs("div", { className: "flex items-center justify-between gap-3", "data-testid": "model-provider-header", children: [_jsxs("div", { className: "flex min-w-0 items-center gap-2", children: [_jsx(ProviderLogo, { logo: logo, className: "size-5" }), editingName ? (_jsx(Input, { ...TECHNICAL_INPUT_ATTRIBUTES, ref: nameInputRef, "data-testid": TID_MODEL_PROVIDER_NAME_INPUT, type: "text", size: "lg", className: "w-auto min-w-0 text-ui-lg font-semibold", value: nameValue, onChange: (event) => onNameChange(event.target.value), onCompositionEnd: onNameCompositionEnd, onCompositionStart: onNameCompositionStart, onBlur: onNameBlur, onKeyDown: onNameKeyDown })) : (_jsx(_Fragment, { children: _jsx("div", { className: "min-w-0 truncate text-ui-lg font-semibold text-foreground", children: providerName }) }))] }), _jsxs("div", { className: "flex shrink-0 items-center gap-2", children: [providerToggle, secondaryActionsVisible ? (_jsxs(DropdownMenu, { children: [_jsx(DropdownMenuTrigger, { asChild: true, children: _jsx(Button, { type: "button", variant: "ghost", size: "icon-sm", "data-testid": "model-provider-actions-button", "aria-label": intl.formatMessage({ id: "common.more" }), children: _jsx(MoreHorizontal, { className: "size-4" }) }) }), _jsxs(DropdownMenuContent, { align: "end", onCloseAutoFocus: (event) => {
                                    // 重命名后的焦点交给输入框，不能被菜单关闭时重新抢回触发按钮。
                                    if (renameRequestedRef.current) {
                                        event.preventDefault();
                                        renameRequestedRef.current = false;
                                    }
                                }, children: [nameEditable ? (_jsxs(DropdownMenuItem, { "data-testid": TID_MODEL_PROVIDER_NAME_EDIT_BUTTON, onSelect: () => {
                                            renameRequestedRef.current = true;
                                            onStartEditName();
                                        }, children: [_jsx(Pencil, { className: "size-3.5" }), intl.formatMessage({ id: "settings.modelProvider.renameProvider" })] })) : null, nameEditable && onDelete ? _jsx(DropdownMenuSeparator, {}) : null, onDelete ? (_jsxs(DropdownMenuItem, { variant: "destructive", onSelect: onDelete, children: [_jsx(Trash2, { className: "size-3.5" }), intl.formatMessage({ id: "common.delete" })] })) : null] })] })) : null] })] }));
}
export function ProviderConnectionSection({ provider, readOnly, apiFormat, baseUrlValue, onApiFormatChange, onBaseUrlChange, onBaseUrlBlur, onBaseUrlKeyDown, onBaseUrlCompositionStart, onBaseUrlCompositionEnd, }) {
    const { intl } = useZCodeIntl();
    const showApiFormat = shouldShowProviderApiFormat(provider);
    const readOnlyBaseUrl = provider.config.api?.baseUrl ?? "";
    const resolvedApiFormat = provider.config.api?.type ?? "anthropic-messages";
    const renderReadOnlyField = (label, value) => (_jsxs("div", { children: [_jsx("label", { className: "mb-1 block text-ui-base text-foreground-subtle", children: label }), _jsxs("div", { className: "flex min-h-8 items-center gap-2 rounded-lg border border-input-border bg-input px-3 py-1.5 text-ui-base text-foreground", children: [_jsx("span", { className: "min-w-0 flex-1 break-all", children: value || "-" }), _jsx("span", { role: "img", "aria-label": intl.formatMessage({ id: "settings.modelProvider.readOnlyField" }, { field: label }), className: "shrink-0 text-foreground-subtle", children: _jsx(LockKeyholeIcon, { className: "size-3.5", "aria-hidden": "true" }) })] })] }));
    if (readOnly) {
        return (_jsxs(_Fragment, { children: [renderReadOnlyField(intl.formatMessage({ id: "settings.modelProvider.baseUrl" }), readOnlyBaseUrl), showApiFormat
                    ? renderReadOnlyField(intl.formatMessage({ id: "settings.modelProvider.apiFormat" }), resolveProviderConnectionApiFormatDisplayLabel(intl, resolvedApiFormat))
                    : null] }));
    }
    return (_jsxs(_Fragment, { children: [_jsxs("div", { children: [_jsx("label", { className: "mb-1 block text-ui-base text-foreground-subtle", children: intl.formatMessage({ id: "settings.modelProvider.baseUrl" }) }), _jsx(Input, { ...TECHNICAL_INPUT_ATTRIBUTES, type: "text", size: "lg", "data-testid": TID_MODEL_PROVIDER_BASE_URL_INPUT, value: baseUrlValue, placeholder: intl.formatMessage({
                            id: "settings.modelProvider.baseUrlPlaceholder",
                        }), onChange: (event) => onBaseUrlChange(event.target.value), onBlur: onBaseUrlBlur, onKeyDown: onBaseUrlKeyDown, onCompositionStart: onBaseUrlCompositionStart, onCompositionEnd: onBaseUrlCompositionEnd })] }), showApiFormat ? (_jsxs("div", { children: [_jsx("label", { className: "mb-1 block text-ui-base text-foreground-subtle", children: intl.formatMessage({ id: "settings.modelProvider.apiFormat" }) }), _jsx(ProviderApiFormatSelect, { value: apiFormat, onChange: onApiFormatChange })] })) : null] }));
}
export function ProviderApiKeySection({ apiKeyValue, apiKeyVisible, readOnly, presetApiKeyUrl, onOpenPresetApiKey, onApiKeyChange, onApiKeyBlur, onApiKeyKeyDown, onApiKeyCompositionStart, onApiKeyCompositionEnd, onToggleApiKeyVisibility, }) {
    const { intl } = useZCodeIntl();
    return (_jsxs("div", { children: [_jsxs("div", { className: "mb-1 flex items-center justify-between gap-2", children: [_jsx("label", { className: "block text-ui-base text-foreground-subtle", children: intl.formatMessage({ id: "settings.modelProvider.apiKey" }) }), presetApiKeyUrl && onOpenPresetApiKey ? (_jsx(PresetProviderApiKeyBanner, { onOpenApiKey: onOpenPresetApiKey })) : null] }), _jsx(ApiKeyInput, { value: apiKeyValue, visible: apiKeyVisible, readOnly: readOnly, onChange: onApiKeyChange, onBlur: onApiKeyBlur, onKeyDown: onApiKeyKeyDown, onCompositionStart: onApiKeyCompositionStart, onCompositionEnd: onApiKeyCompositionEnd, onToggleVisibility: onToggleApiKeyVisibility })] }));
}
function createEmptyModel() {
    return {
        kind: "candidate",
        modelId: "",
        builtin: false,
        personalConfig: {},
        // 空 ID 尚未解析模型配置，硬编码档位会被误认为智能推荐。
        config: {
            properties: { supportsToolCall: true },
        },
        hasPersonalConfig: false,
        executable: false,
        selectable: false,
    };
}
export function ProviderModelsSection({ providerId, providerName, providerEnabled = true, providerAccess, models, onTestModel, onModelCommit, onModelEnabledChange, onDeleteModel, onAddModel, onReorderModelIds, settingsRevision = 0, }) {
    const { intl } = useZCodeIntl();
    const { providerSettingsService } = useServices();
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [addSaving, setAddSaving] = useState(false);
    const addSavingRef = useRef(false);
    const [addCommitError, setAddCommitError] = useState(null);
    const [addModel] = useState(createEmptyModel);
    const [addDraftErrorField, setAddDraftErrorField] = useState(null);
    const resolveAddModelConfig = useCallback((modelId) => providerSettingsService.resolveModelConfig({ providerId, modelId }), [providerId, providerSettingsService]);
    const editor = useProviderModelDraft({
        model: addModel,
        open: addDialogOpen,
        scopeKey: providerId,
        resolve: resolveAddModelConfig,
    });
    const { draft: addDraft } = editor;
    const openAddDialog = useCallback(() => {
        editor.reset(createEmptyModel());
        setAddDraftErrorField(null);
        setAddCommitError(null);
        setAddDialogOpen(true);
    }, [editor.reset]);
    const updateAddDraft = (patch) => {
        editor.change(patch);
        setAddDraftErrorField(null);
    };
    const cancelAddDialog = () => {
        setAddDialogOpen(false);
        editor.reset(createEmptyModel());
        setAddDraftErrorField(null);
        editor.cancel();
    };
    const handleAddDialogOpenChange = useCallback((open) => {
        // 保存中的关闭/再打开会让旧请求结束掉新草稿，等待本次提交完成再结束编辑。
        if (addSavingRef.current)
            return;
        if (!open) {
            cancelAddDialog();
            return;
        }
        setAddDialogOpen(true);
    }, [cancelAddDialog]);
    const commitAddDraft = useCallback(async () => {
        if (addSavingRef.current)
            return false;
        addSavingRef.current = true;
        setAddSaving(true);
        setAddCommitError(null);
        try {
            const result = await editor.commit();
            if (result.status === "invalid") {
                setAddDraftErrorField(result.field);
                return false;
            }
            // 过去只发起异步添加就关闭弹窗，失败后输入也丢了；以实际保存完成作为结束边界。
            await onAddModel(result.model);
            setAddDialogOpen(false);
            editor.reset(createEmptyModel());
            return true;
        }
        catch (error) {
            setAddCommitError(error instanceof Error ? error.message : String(error));
            return false;
        }
        finally {
            addSavingRef.current = false;
            setAddSaving(false);
        }
    }, [editor, onAddModel]);
    const addDraftErrorMessage = addDraftErrorField
        ? intl.formatMessage({
            id: `settings.modelProvider.modelMetadata.invalid.${addDraftErrorField}`,
        })
        : null;
    return (_jsxs("div", { children: [_jsxs("div", { className: "mb-1 flex flex-wrap items-center justify-between gap-3", children: [_jsx("span", { className: "text-ui-base text-foreground-subtle", children: intl.formatMessage({ id: "settings.modelProvider.models" }) }), _jsxs(Button, { type: "button", variant: "secondary", size: "default", className: "rounded-lg", "data-testid": TID_MODEL_PROVIDER_ADD_MODEL_BUTTON, onClick: openAddDialog, children: [_jsx(Plus, { "data-icon": "inline-start", "aria-hidden": "true" }), intl.formatMessage({ id: "settings.modelProvider.addModel" })] })] }), models.length > 0 ? (_jsx("div", { className: "overflow-hidden rounded-lg border border-input-border bg-input", children: _jsx(SortableProviderModelList, { modelIds: models.map((model) => model.modelId), sortableModelIds: models.map((model) => model.modelId), onReorder: onReorderModelIds, renderModel: (_modelId, index) => {
                        const model = models[index];
                        const inputFormat = model.config.properties?.inputFormat;
                        const outputFormat = model.config.properties?.outputFormat;
                        const completeProperties = model.config.properties?.contextWindow != null &&
                            inputFormat?.supportsText != null &&
                            inputFormat.supportsImage != null &&
                            inputFormat.supportsVideo != null &&
                            inputFormat.supportsAudio != null &&
                            inputFormat.supportsPdf != null &&
                            outputFormat?.supportsText != null;
                        return (_jsxs(_Fragment, { children: [_jsx(ModelRowInput, { providerId: providerId, providerName: providerName, providerEnabled: providerEnabled, providerAccess: providerAccess, inputTestId: testId(TID_MODEL_PROVIDER_MODEL_INPUT, String(index)), deleteTestId: testId(TID_MODEL_PROVIDER_MODEL_DELETE_BUTTON, String(index)), model: model, onCommit: (value, basedOnRevision) => onModelCommit(model.modelId, value, basedOnRevision), onResolveDraft: (nextModelId, personalConfig) => providerSettingsService.resolveModelConfig({
                                        providerId,
                                        originalModelId: model.modelId,
                                        modelId: nextModelId,
                                        personalConfig: structuredClone(personalConfig),
                                    }), settingsRevision: settingsRevision, onDelete: !model.builtin ? () => onDeleteModel(model.modelId) : undefined, onEnabledChange: (enabled) => {
                                        void Promise.resolve(onModelEnabledChange?.(model.modelId, enabled)).catch(() => undefined);
                                    }, onTest: onTestModel }, `${providerId}/${model.modelId}`), !completeProperties && (_jsx("div", { className: "px-3 pb-2 text-ui-sm text-destructive", children: model.issues?.[0]?.message ??
                                        intl.formatMessage({ id: "settings.modelProvider.modelConfigIncomplete" }) }))] }));
                    } }) })) : (_jsxs("div", { className: "mt-1 flex h-12 items-center justify-start gap-2 rounded-lg border border-dashed border-border px-4 text-left text-ui-base text-foreground-subtle", children: [_jsx(InfoIcon, { className: "size-4 shrink-0", "aria-hidden": "true" }), intl.formatMessage({ id: "settings.modelProvider.modelsEmpty" })] })), _jsx(_Fragment, { children: _jsx(ProviderModelMetadataDialog, { onRestore: () => {
                        setAddDraftErrorField(null);
                        setAddCommitError(null);
                        void editor
                            .restore()
                            .catch((error) => setAddCommitError(error instanceof Error ? error.message : String(error)));
                    }, mode: "add", open: addDialogOpen, draft: addDraft, draftErrorMessage: addCommitError ?? addDraftErrorMessage, draftErrorField: addDraftErrorField, inheritedConfig: editor.inheritedConfig, overrideFields: editor.overrides, onOpenChange: handleAddDialogOpenChange, onDraftChange: updateAddDraft, onCommit: commitAddDraft, saving: addSaving, modelConfigResolutionPending: editor.pending, modelDefaultsLoaded: editor.defaultsLoaded, onModelIdBlur: () => {
                        void editor.flush().catch(() => undefined);
                    } }) })] }));
}
//# sourceMappingURL=ProviderCardSections.js.map