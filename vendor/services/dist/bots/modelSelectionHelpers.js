import {} from "@zcode/shared";
const BOT_NATIVE_MODEL_PROVIDER_PREFIX = "native:";
export function resolveTaskModel(model) {
    return model && model !== "default" ? model : undefined;
}
export function getNativeModelProviderId(zcodeProvider) {
    return `${BOT_NATIVE_MODEL_PROVIDER_PREFIX}${zcodeProvider}`;
}
//# sourceMappingURL=modelSelectionHelpers.js.map