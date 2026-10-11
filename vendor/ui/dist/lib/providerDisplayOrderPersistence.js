export async function persistProviderDisplayOrder(params) {
    return params.providerSettingsService.reorderPersonalProviders(params.state.providerIds);
}
//# sourceMappingURL=providerDisplayOrderPersistence.js.map