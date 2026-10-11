import { decodeCustomModelValue, ZCODE_MODEL_REASONING_SEPARATOR, } from "@zcode/shared";
function normalizeModelIdentity(value) {
    const trimmed = value?.trim();
    if (!trimmed) {
        return null;
    }
    const customModel = decodeCustomModelValue(trimmed);
    if (customModel?.providerId && customModel.modelName) {
        return `${customModel.providerId}/${customModel.modelName}`;
    }
    const separatorIndex = trimmed.indexOf("/");
    if (separatorIndex <= 0 || separatorIndex >= trimmed.length - 1) {
        return trimmed;
    }
    const providerId = trimmed.slice(0, separatorIndex).trim();
    const rawModelId = trimmed.slice(separatorIndex + 1).trim();
    // Bugfix：冒号可能属于 OpenRouter modelId，模型身份 guard 只忽略 `$variant`。
    const reasoningSeparatorIndex = rawModelId.indexOf(ZCODE_MODEL_REASONING_SEPARATOR);
    const modelId = reasoningSeparatorIndex > 0 ? rawModelId.slice(0, reasoningSeparatorIndex).trim() : rawModelId;
    return providerId && modelId ? `${providerId}/${modelId}` : trimmed;
}
export function readModelCurrentValueForModelStateGuard(configOptions) {
    const modelOption = configOptions.find((option) => option.category === "model" && option.type === "select");
    return typeof modelOption?.currentValue === "string" ? modelOption.currentValue : null;
}
export function shouldApplyModelStateUpdateForTaskModel(params) {
    if (params.reason === "model_changed") {
        return true;
    }
    const currentIdentity = normalizeModelIdentity(params.currentModelValue);
    const incomingIdentity = normalizeModelIdentity(params.incomingModelValue);
    if (!currentIdentity || !incomingIdentity) {
        return true;
    }
    return currentIdentity === incomingIdentity;
}
//# sourceMappingURL=modelStateUpdateGuard.js.map