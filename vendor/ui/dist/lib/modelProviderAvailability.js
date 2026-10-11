export function resolveProviderAvailabilityState(params) {
    const providers = params.modelSelectionView?.providers ?? [];
    return {
        source: "registry",
        hydrated: params.modelSelectionView !== null,
        providerCount: providers.length,
        hasUsableProvider: params.modelSelectionView !== null &&
            providers.some((provider) => provider.models.length > 0),
    };
}
//# sourceMappingURL=modelProviderAvailability.js.map