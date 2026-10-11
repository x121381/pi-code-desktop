import type { ProviderSettingsFormProvider } from "@/lib/providerSettingsFormTypes.js";
export interface ProviderOrderView {
    readonly providerIds: readonly string[];
}
export declare function sortModelProvidersForDisplay<T extends Pick<ProviderSettingsFormProvider, "providerId">>(providers: readonly T[], displayOrder?: ProviderOrderView | null): T[];
//# sourceMappingURL=modelProviderOrdering.d.ts.map