import type { ProviderSettingsView } from "@zcode/services";
import type { ProviderSettingsFormProvider } from "@/lib/providerSettingsFormTypes.js";
import type { ProviderOrderView } from "@/lib/modelProviderOrdering.js";
/** 把正式 Settings View 复制成当前编辑会话使用的可变表单状态。 */
export declare function projectProviderSettingsViewToFormProviders(view: ProviderSettingsView): ProviderSettingsFormProvider[];
export declare function resolveProviderSettingsFormProviders(params: {
    view: ProviderSettingsView | null;
}): ProviderSettingsFormProvider[];
export declare function resolvePersonalProviderIds(view: ProviderSettingsView): string[];
export declare function resolveProviderOrdering(params: {
    view?: ProviderSettingsView | null;
    providers: readonly ProviderSettingsFormProvider[];
}): {
    displayOrder: ProviderOrderView;
    reorderableProviderIds?: ReadonlySet<string>;
};
//# sourceMappingURL=providerSettingsFormProjection.d.ts.map