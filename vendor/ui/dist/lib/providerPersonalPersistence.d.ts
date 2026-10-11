import type { IProviderSettingsService, ProviderSettingsView } from "@zcode/services";
export declare function persistPersonalProviderDeletion(params: {
    providerId: string;
    providerSettingsService: Pick<IProviderSettingsService, "deletePersonalProvider">;
}): Promise<ProviderSettingsView>;
//# sourceMappingURL=providerPersonalPersistence.d.ts.map