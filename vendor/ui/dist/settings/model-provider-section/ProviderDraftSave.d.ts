import { type ProviderApiType } from "@zcode/provider";
import { type ProviderSettingsFormProvider } from "@/lib/providerSettingsFormTypes.js";
export interface ProviderDraftValues {
    nameValue: string;
    apiFormat: ProviderApiType;
    baseUrlValue: string;
    apiKeyValue: string;
}
export declare function resolvePendingProviderDraftSave({ provider, draft, readOnlyEndpoints, nameConfirmed, }: {
    provider: ProviderSettingsFormProvider;
    draft: ProviderDraftValues;
    readOnlyEndpoints?: boolean;
    nameConfirmed?: boolean;
    now: () => number;
}): ProviderSettingsFormProvider | null;
//# sourceMappingURL=ProviderDraftSave.d.ts.map