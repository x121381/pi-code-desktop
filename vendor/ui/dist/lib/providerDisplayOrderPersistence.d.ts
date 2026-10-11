import type { IProviderSettingsService, ProviderSettingsView } from "@zcode/services";
import type { ProviderOrderView } from "@/lib/modelProviderOrdering.js";
export declare function persistProviderDisplayOrder(params: {
    state: ProviderOrderView;
    providerSettingsService: Pick<IProviderSettingsService, "reorderPersonalProviders">;
}): Promise<ProviderSettingsView>;
//# sourceMappingURL=providerDisplayOrderPersistence.d.ts.map