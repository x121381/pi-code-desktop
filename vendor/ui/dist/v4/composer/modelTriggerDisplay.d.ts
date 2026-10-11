import type { IntlInstance } from "@/i18n/IntlProvider.js";
import type { ModelSelectGroup } from "@/ModelConfigSelect.js";
export interface V4ModelTriggerDisplay {
    fullLabel: string;
    modelLabel: string;
    providerPrefix?: string;
}
export declare function formatModelChangeLabel(providerId: string | undefined, providerName: string | undefined, modelName: string, intl: Pick<IntlInstance, "formatMessage">): string;
export declare function formatProviderModelLabel(providerId: string | undefined, providerName: string | undefined, modelName: string): string;
export declare function resolveV4ModelTriggerLabel({ modelGroups, normalizedValue, fallbackLabel, providerId, providerName, }: {
    modelGroups: readonly ModelSelectGroup[];
    normalizedValue: string;
    fallbackLabel: string;
    providerId: string | undefined;
    providerName?: string;
}): string;
export declare function resolveV4ModelTriggerDisplay({ modelGroups, normalizedValue, fallbackLabel, providerId, providerName, }: {
    modelGroups: readonly ModelSelectGroup[];
    normalizedValue: string;
    fallbackLabel: string;
    providerId: string | undefined;
    providerName?: string;
}): V4ModelTriggerDisplay;
//# sourceMappingURL=modelTriggerDisplay.d.ts.map