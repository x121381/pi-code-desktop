import { isApiKeyAccess } from "@zcode/provider";
function findSettingsProvider(view, providerId) {
    return view.providers.find((entry) => entry.providerId === providerId);
}
export function resolveSettingsProviderApiKey(view, providerId) {
    const provider = findSettingsProvider(view, providerId);
    if (!provider || !isApiKeyAccess(provider.effectiveConfig.access))
        return null;
    return provider.effectiveConfig.access.apiKey?.trim() ?? "";
}
export function resolveSettingsProviderApiKeyManagementUrl(view, providerId) {
    const provider = view ? findSettingsProvider(view, providerId) : undefined;
    if (!provider || !isApiKeyAccess(provider.effectiveConfig.access))
        return undefined;
    return provider.effectiveConfig.access.apiKeyManagementUrl?.trim() || undefined;
}
export async function loadProviderApiKey(params) {
    return (resolveSettingsProviderApiKey(await params.providerSettingsService.getView(), params.providerId) ?? "");
}
export async function persistProviderApiKey(params) {
    const settingsView = await params.providerSettingsService.getView();
    const provider = findSettingsProvider(settingsView, params.providerId);
    if (!provider || !isApiKeyAccess(provider.effectiveConfig.access)) {
        throw new Error(`Provider Settings View 中不存在 API Provider ${params.providerId}`);
    }
    const personal = provider.personalConfig ?? {};
    await params.providerSettingsService.savePersonalProviderOverlay(params.providerId, {
        ...personal,
        access: {
            ...(isApiKeyAccess(personal.access) ? personal.access : {}),
            type: provider.effectiveConfig.access.type,
            apiKey: params.apiKey,
        },
    });
}
//# sourceMappingURL=providerApiKeyPersistence.js.map