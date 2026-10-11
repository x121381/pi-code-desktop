import { type AppSettings, type Locale, type ProviderFamilyDomain } from "@zcode/shared";
import type { ModelSelectionView } from "@zcode/services";
export type ApiKeyProviderChoice = "zai" | "bigmodel";
export declare function resolveLoginApiKeyDefaultProvider(locale: Locale): ApiKeyProviderChoice;
export declare function resolveLoginApiKeyTemplateId(choice: ApiKeyProviderChoice): "zai-api" | "bigmodel-api";
export declare function resolveLoginApiKeyProviderLabel(choice: ApiKeyProviderChoice): string;
export declare function resolveLoginApiKeyProviderFamilyDomain(choice: ApiKeyProviderChoice): ProviderFamilyDomain;
export declare function buildLoginApiKeySkipSettings(choice: ApiKeyProviderChoice, now: number): Pick<AppSettings, "providerFamilyDomain" | "providerFamilyDomainUpdatedAt" | "providerFamilyDomainMigrated">;
export declare function shouldShowLoginApiKeyLink(apiKeyValue: string, apiKeyUrl: string | undefined): boolean;
export declare function buildLoginApiKeyDefaultModelPreferenceFromSelection(view: ModelSelectionView, providerId: string): string | null;
export declare function resolveHydratedLoginApiKeyValue({ savedApiKey, userEdited, }: {
    savedApiKey: string;
    userEdited: boolean;
}): string | null;
//# sourceMappingURL=LoginApiKeyForm.helpers.d.ts.map