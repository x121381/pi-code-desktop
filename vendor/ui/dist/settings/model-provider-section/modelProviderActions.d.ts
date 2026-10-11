import type { ConfirmDialogRequest } from "@/store/confirmDialogStore.js";
import type { ProviderSettingsFormProvider } from "@/lib/providerSettingsFormTypes.js";
import type { IntlInstance } from "@/i18n/IntlProvider.js";
export declare function confirmAndDeleteModelProvider({ provider, confirmDialog, intl, deleteProvider, }: {
    provider: ProviderSettingsFormProvider;
    confirmDialog: (payload: ConfirmDialogRequest) => Promise<boolean>;
    intl: IntlInstance;
    deleteProvider: (providerId: string) => Promise<void>;
}): Promise<void>;
export declare function refreshModelProviderSection({ refresh, refreshTeamPlanProducts, }: {
    refresh: () => Promise<void>;
    refreshTeamPlanProducts?: () => Promise<void>;
}): Promise<void>;
export declare function refreshProviderPanelAfterAuthChange({ refreshModelProviders, refreshCodingPlanEntitlements, refreshTeamPlanProducts, refreshCodingPlanProducts, refreshPurchaseTokenState, refreshPlanSnapshots, }: {
    refreshModelProviders: () => Promise<void>;
    refreshCodingPlanEntitlements: () => Promise<void>;
    refreshTeamPlanProducts: (options?: {
        force?: boolean;
    }) => Promise<void>;
    refreshCodingPlanProducts: () => void;
    refreshPurchaseTokenState: () => Promise<unknown>;
    refreshPlanSnapshots?: boolean;
}): Promise<void>;
//# sourceMappingURL=modelProviderActions.d.ts.map