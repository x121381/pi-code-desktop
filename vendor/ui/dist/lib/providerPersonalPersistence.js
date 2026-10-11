export async function persistPersonalProviderDeletion(params) {
    return params.providerSettingsService.deletePersonalProvider(params.providerId);
}
//# sourceMappingURL=providerPersonalPersistence.js.map