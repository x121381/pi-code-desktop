import type { ModelSelectionView } from "@zcode/services";
export interface ProviderAvailabilityState {
    readonly source: "registry";
    readonly hydrated: boolean;
    readonly providerCount: number;
    readonly hasUsableProvider: boolean;
}
export declare function resolveProviderAvailabilityState(params: {
    modelSelectionView: ModelSelectionView | null;
}): ProviderAvailabilityState;
//# sourceMappingURL=modelProviderAvailability.d.ts.map