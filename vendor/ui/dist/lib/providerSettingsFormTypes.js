import { isApiKeyAccess } from "@zcode/provider";
export function getProviderFormLabel(provider) {
    return provider.providerName?.trim() || provider.providerId;
}
export function getProviderFormApiKey(provider) {
    return isApiKeyAccess(provider.config.access) ? (provider.config.access.apiKey ?? "") : "";
}
export function getProviderFormApiKeyManagementUrl(provider) {
    return isApiKeyAccess(provider.config.access)
        ? (provider.config.access.apiKeyManagementUrl ?? undefined)
        : undefined;
}
//# sourceMappingURL=providerSettingsFormTypes.js.map