import { BUILTIN_PROVIDER_TEMPLATE_IDS, } from "@zcode/shared";
import { encodeCustomModelValue } from "../lib/zcodeCustomModelValue.js";
export function resolveLoginApiKeyDefaultProvider(locale) {
    return locale === "zh-CN" ? "bigmodel" : "zai";
}
export function resolveLoginApiKeyTemplateId(choice) {
    return choice === "zai"
        ? BUILTIN_PROVIDER_TEMPLATE_IDS.zai
        : BUILTIN_PROVIDER_TEMPLATE_IDS.bigmodel;
}
export function resolveLoginApiKeyProviderLabel(choice) {
    // Welcome Screen API Key 错误提示需要使用 BigModel 品牌固定写法。
    return choice === "zai" ? "Z.ai" : "BigModel";
}
export function resolveLoginApiKeyProviderFamilyDomain(choice) {
    return choice;
}
export function buildLoginApiKeySkipSettings(choice, now) {
    return {
        providerFamilyDomain: resolveLoginApiKeyProviderFamilyDomain(choice),
        providerFamilyDomainUpdatedAt: now,
        providerFamilyDomainMigrated: true,
    };
}
export function shouldShowLoginApiKeyLink(apiKeyValue, apiKeyUrl) {
    return Boolean(apiKeyUrl) && apiKeyValue.trim().length === 0;
}
export function buildLoginApiKeyDefaultModelPreferenceFromSelection(view, providerId) {
    const firstModel = view.providers.find((provider) => provider.providerId === providerId)
        ?.models[0]?.modelId;
    return firstModel ? encodeCustomModelValue(providerId, firstModel) : null;
}
export function resolveHydratedLoginApiKeyValue({ savedApiKey, userEdited, }) {
    if (userEdited) {
        return null;
    }
    return savedApiKey.trim();
}
//# sourceMappingURL=LoginApiKeyForm.helpers.js.map