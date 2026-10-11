export function resolveProviderLabel(providerId, registryView) {
    const normalizedId = providerId?.trim() ?? "";
    if (!normalizedId)
        return "";
    const registryProvider = registryView?.providers.find((provider) => provider.providerId === normalizedId);
    if (registryProvider) {
        return registryProvider.providerName?.trim() || normalizedId;
    }
    return normalizedId;
}
export function resolveProviderBaseURL(providerId, registryView) {
    const normalizedId = providerId?.trim() ?? "";
    if (!normalizedId)
        return undefined;
    const registryProvider = registryView?.providers.find((provider) => provider.providerId === normalizedId);
    if (registryProvider) {
        return registryProvider.config.api?.baseUrl?.trim() || undefined;
    }
    return undefined;
}
//# sourceMappingURL=registryProviderView.js.map