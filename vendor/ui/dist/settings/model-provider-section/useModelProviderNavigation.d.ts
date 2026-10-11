import type { ProviderSettingsFormProvider } from "@/lib/providerSettingsFormTypes.js";
import type { ProviderFamilyConnectionSelection, ProviderFamilyConnectionSelectionSettings, ProviderFamilyDomain } from "@zcode/shared";
import { type OAuthProviderId } from "@zcode/shared";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
import { type CodingPlanEntitlementState, type ModelProviderNavGroup, type PresetProviderSpec } from "@/settings/model-provider-section/constants.js";
import { type ProviderOrderView } from "@/lib/modelProviderOrdering.js";
import type { EnterpriseCodingPlanProductDisplay } from "@/settings/model-provider-section/enterpriseCodingPlanProducts.js";
interface PresetProviderWithConfig extends PresetProviderSpec {
    provider: ProviderSettingsFormProvider | null;
}
interface UseModelProviderNavigationOptions {
    presetProviders: PresetProviderWithConfig[];
    modelProviders: ProviderSettingsFormProvider[];
    /**
     * 当前账号明确有权益的 Provider。缺省等价于尚无账号权益；生产设置页始终显式传入。
     */
    entitledAccountProviderIds?: ReadonlySet<string>;
    modelProvidersLoading?: boolean;
    displayOrder?: ProviderOrderView;
    codingPlanEntitlements?: Partial<Record<string, CodingPlanEntitlementState>>;
    providerFamilyDomain?: ProviderFamilyDomain | null;
    connectionSelections?: ProviderFamilyConnectionSelectionSettings;
    pendingConnectionSelections?: ProviderFamilyConnectionSelectionSettings;
    familyConnectionSettingsLoading?: boolean;
    familyConnectionSettingsFailed?: boolean;
    subscribedTeamProducts?: EnterpriseCodingPlanProductDisplay[];
    showPurchasedTeamPlanFallback?: boolean;
    selectedNodeKey: string | null;
    setSelectedNodeKey: (key: string | null) => void;
    intl: ReturnType<typeof useZCodeIntl>["intl"];
}
export declare function useModelProviderNavigation({ presetProviders, modelProviders, entitledAccountProviderIds, modelProvidersLoading, displayOrder, codingPlanEntitlements, providerFamilyDomain, connectionSelections, pendingConnectionSelections, familyConnectionSettingsLoading, familyConnectionSettingsFailed, subscribedTeamProducts, showPurchasedTeamPlanFallback, selectedNodeKey, setSelectedNodeKey, intl, }: UseModelProviderNavigationOptions): {
    navigationGroups: ModelProviderNavGroup[];
    navigationItems: import("@/settings/model-provider-section/constants.js").ModelProviderNavItem[];
    selectedNavItem: {
        key: string;
        type: "preset";
        logo?: ProviderSettingsFormProvider["config"]["logo"];
        statusProvider?: ProviderSettingsFormProvider | null;
        presetId: import("@zcode/shared").BuiltinModelProviderId;
        label: string;
        provider: ProviderSettingsFormProvider | null;
        displayName: string;
        statusActive: boolean;
    } | {
        key: string;
        type: "codingPlan";
        presetId: import("@/settings/model-provider-section/constants.js").CodingPlanProviderId;
        oauthProviderId: OAuthProviderId;
        label: string;
        providerName: string;
        provider: ProviderSettingsFormProvider | null;
        accountEntitled?: boolean;
        status: import("@/settings/model-provider-section/constants.js").CodingPlanStatus;
        planLevel?: string | null;
        currentProductId?: string | null;
        subscriptionBillingCycle?: string | null;
        subscriptionRenewTime?: string | null;
        subscriptionExpireTime?: string | null;
        subscriptionDetails?: import("@zcode/shared").UsageEntitlementSubscriptionDetail[];
        quotaLimits?: import("@zcode/shared").UsageQuotaLimit[];
        mcpQuotaLimit?: import("@zcode/shared").UsageQuotaLimit | null;
        purchaseUrl?: string;
        accountLoginRequired?: boolean;
        statusLabelId?: string;
        statusMessage?: string | null;
        inactivePlanTitle?: string | null;
        statusActive: boolean;
    } | {
        key: string;
        type: "teamPlan";
        presetId: import("@/settings/model-provider-section/constants.js").CodingPlanProviderId;
        oauthProviderId: OAuthProviderId;
        label: string;
        providerName: string;
        teamPlanName: string;
        organizationId?: string | null;
        projectId?: string | null;
        provider: ProviderSettingsFormProvider | null;
        accountEntitled?: boolean;
        status: import("@/settings/model-provider-section/constants.js").CodingPlanStatus;
        planLevel?: string | null;
        currentProductId?: string | null;
        subscriptionBillingCycle?: string | null;
        subscriptionRenewTime?: string | null;
        subscriptionExpireTime?: string | null;
        subscriptionDetails?: import("@zcode/shared").UsageEntitlementSubscriptionDetail[];
        quotaLimits?: import("@zcode/shared").UsageQuotaLimit[];
        mcpQuotaLimit?: import("@zcode/shared").UsageQuotaLimit | null;
        purchaseUrl?: string;
        statusLabelId?: string;
        statusMessage?: string | null;
        availabilityReason?: import("@/settings/model-provider-section/constants.js").TeamPlanAvailabilityReason;
        inactivePlanTitle?: string | null;
        statusActive: boolean;
    } | {
        key: string;
        type: "custom";
        label: string;
        provider: ProviderSettingsFormProvider;
        statusActive: boolean;
    } | null;
    navigationUnavailable: boolean;
};
export declare function resolveFallbackModelProviderNodeKey({ selectedNodeKey, selectableNavigationItems, }: {
    selectedNodeKey: string | null;
    selectableNavigationItems: Array<Exclude<ModelProviderNavGroup["items"][number], {
        type: "codingPlanLoading";
    }>>;
}): string | null;
export declare function resolveSelectedFamilyModeNodeKey({ selectedNavItem, selectableNavigationItems, connectionSelections, pendingConnectionSelections, }: {
    selectedNavItem: Exclude<ModelProviderNavGroup["items"][number], {
        type: "codingPlanLoading";
    }> | null;
    selectableNavigationItems: Array<Exclude<ModelProviderNavGroup["items"][number], {
        type: "codingPlanLoading";
    }>>;
    connectionSelections?: ProviderFamilyConnectionSelectionSettings;
    pendingConnectionSelections?: ProviderFamilyConnectionSelectionSettings;
}): string | null;
export declare function connectionSelectionMatchesNavigationItem(family: ProviderFamilyDomain, selection: ProviderFamilyConnectionSelection, item: Exclude<ModelProviderNavGroup["items"][number], {
    type: "codingPlanLoading";
}>): boolean;
export {};
//# sourceMappingURL=useModelProviderNavigation.d.ts.map