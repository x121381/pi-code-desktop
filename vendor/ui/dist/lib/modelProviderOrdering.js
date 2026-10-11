export function sortModelProvidersForDisplay(providers, displayOrder) {
    const orderIndexById = new Map((displayOrder?.providerIds ?? []).map((providerId, index) => [providerId, index]));
    return providers
        .map((provider, index) => ({ provider, index }))
        .sort((left, right) => {
        const leftOrder = orderIndexById.get(left.provider.providerId);
        const rightOrder = orderIndexById.get(right.provider.providerId);
        if (leftOrder !== undefined || rightOrder !== undefined) {
            return ((leftOrder ?? Number.MAX_SAFE_INTEGER) - (rightOrder ?? Number.MAX_SAFE_INTEGER) ||
                left.index - right.index);
        }
        return left.index - right.index;
    })
        .map(({ provider }) => provider);
}
//# sourceMappingURL=modelProviderOrdering.js.map