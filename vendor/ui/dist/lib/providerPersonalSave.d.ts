import type { IProviderSettingsService, ProviderSettingsView } from "@zcode/services";
import type { ProviderSettingsFormProvider } from "@/lib/providerSettingsFormTypes.js";
/**
 * 保存设置页明确维护的稀疏 Personal Overlay。
 */
export declare function persistPersonalProvider(params: {
    provider: ProviderSettingsFormProvider;
    providerSettingsService: Pick<IProviderSettingsService, "savePersonalProviderOverlay">;
}): Promise<ProviderSettingsView>;
//# sourceMappingURL=providerPersonalSave.d.ts.map