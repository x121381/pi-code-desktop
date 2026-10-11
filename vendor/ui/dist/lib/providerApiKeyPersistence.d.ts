import type { IProviderSettingsService, ProviderSettingsView } from "@zcode/services";
type ProviderSettingsApiKeyService = Pick<IProviderSettingsService, "getView" | "savePersonalProviderOverlay">;
export declare function resolveSettingsProviderApiKey(view: ProviderSettingsView, providerId: string): string | null;
export declare function resolveSettingsProviderApiKeyManagementUrl(view: ProviderSettingsView | null, providerId: string): string | undefined;
export declare function loadProviderApiKey(params: {
    providerId: string;
    providerSettingsService: Pick<IProviderSettingsService, "getView">;
}): Promise<string>;
export declare function persistProviderApiKey(params: {
    providerId: string;
    apiKey: string;
    providerSettingsService: ProviderSettingsApiKeyService;
}): Promise<void>;
export {};
//# sourceMappingURL=providerApiKeyPersistence.d.ts.map