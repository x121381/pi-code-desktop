import { type BuiltinModelProviderId, type ProviderFamilyConnectionSelectionSettings, type ModelConnectivityResult, type OAuthProviderId } from "@zcode/shared";
import { type ProviderSettingsFormProvider } from "@/lib/providerSettingsFormTypes.js";
import { type CodingPlanStatus, type CodingPlanProviderId, type ModelProviderNavItem } from "./constants.js";
import { type CodingPlanLoginOptions } from "./codingPlanPricingCards.js";
import { type EnterpriseCodingPlanProductGroup, type PurchaseAudience } from "./codingPlanEnterpriseTiers.js";
import { type CodingPlanProductDisplay } from "./codingPlanProductPresentation.js";
import { useUsageEntitlement } from "@/hooks/useUsageEntitlement.js";
import type { ProviderSettingsView } from "@zcode/services";
import type { SavePersonalModelDraftInput } from "@zcode/provider";
export declare function resolveTeamScopedPlanNavItem(item: Extract<ModelProviderNavItem, {
    type: "codingPlan" | "teamPlan";
}>, entitlement: ReturnType<typeof useUsageEntitlement>): Extract<ModelProviderNavItem, {
    type: "codingPlan" | "teamPlan";
}>;
export declare function resolveTeamPlanInspectionAccess(item: Extract<ModelProviderNavItem, {
    type: "teamPlan";
}>): {
    type: "zhipu-account";
    family: import("@zcode/shared").ModelProviderFamilyId;
    planKind: "team-coding-plan";
    productId: string;
    organizationId: string;
    projectId: string;
} | undefined;
export declare function resolvePlanSettingsProvider({ view, providerId, fallback, }: {
    view: ProviderSettingsView | null | undefined;
    providerId: string;
    fallback: ProviderSettingsFormProvider | null;
}): ProviderSettingsFormProvider | null;
export declare function ModelProviderSectionDetail({ selectedNavItem, navigationItems, connectionSettingsFailed, connectionSelections, startPlanSubscriptionCount, presetLoading, codingPlanPurchaseTokenAuthenticatedByProviderId, codingPlanAuthError, presetSubscriptionProviderId, codingPlanStatusSyncProviderId, codingPlanDisconnectProviderId, onSave, onAddPersonalModel, onSavePersonalModelDraft, onSetPersonalModelEnabled, onDeletePersonalModel, onDelete, onReorderProviderModels, onTestModel, onCodingPlanLogin, onRetryCodingPlan, onCodingPlanDisconnect, onOpenApiKeyUrl, onOpenBigModelRegistration, onCodingPlanPurchaseComplete, onSelectNavItem, providerSettingsView: providerSettingsViewOverride, }: {
    selectedNavItem: ModelProviderNavItem | null;
    navigationItems?: ModelProviderNavItem[];
    connectionSettingsFailed?: boolean;
    connectionSelections?: ProviderFamilyConnectionSelectionSettings;
    startPlanSubscriptionCount?: number;
    presetLoading: boolean;
    codingPlanPurchaseTokenAuthenticatedByProviderId: Partial<Record<BuiltinModelProviderId, boolean>>;
    codingPlanAuthError?: string | null;
    presetSubscriptionProviderId: BuiltinModelProviderId | null;
    codingPlanStatusSyncProviderId: BuiltinModelProviderId | null;
    codingPlanDisconnectProviderId: BuiltinModelProviderId | null;
    onSave: (config: ProviderSettingsFormProvider) => void | Promise<void>;
    onAddPersonalModel?: (providerId: string, modelId: string, config: ProviderSettingsFormProvider["models"][number]["personalConfig"], useRecommendedConfig?: boolean) => Promise<unknown>;
    onSavePersonalModelDraft?: (input: SavePersonalModelDraftInput) => Promise<unknown>;
    onSetPersonalModelEnabled?: (providerId: string, modelId: string, enabled: boolean) => Promise<unknown>;
    onDeletePersonalModel?: (providerId: string, modelId: string) => Promise<unknown>;
    onDelete: (provider: ProviderSettingsFormProvider) => Promise<void>;
    onReorderProviderModels?: (providerId: string, modelIds: string[]) => Promise<void>;
    onTestModel: (providerId: string, modelId: string) => Promise<ModelConnectivityResult>;
    onRetryCodingPlan?: () => void | Promise<void>;
    onCodingPlanLogin: (presetId: BuiltinModelProviderId, providerId: OAuthProviderId, providerName: string, status: CodingPlanStatus, options?: CodingPlanLoginOptions) => number | void;
    onCodingPlanDisconnect: (presetId: BuiltinModelProviderId, providerId: OAuthProviderId, providerName: string) => void;
    onOpenApiKeyUrl: (url: string) => void;
    onOpenBigModelRegistration: () => void;
    onCodingPlanPurchaseComplete: () => void | Promise<void>;
    onSelectNavItem?: (item: ModelProviderNavItem) => void;
    providerSettingsView?: ProviderSettingsView | null;
}): import("react/jsx-runtime").JSX.Element | null;
export declare function resolvePurchaseChoiceSelectionIntent(status: CodingPlanStatus): "login" | "purchase";
export declare function resolveEnterpriseTeamPlanBannerClass(tierKey: string): string;
export declare function resolveEnterpriseTeamPlanBannerIconClass(tierKey: string): string;
export declare function resolveEnterpriseTeamPlanBannerDescriptionId(tierKey: string): string;
export declare function resolvePurchaseChoiceBannerProductsProviderId(providerId: CodingPlanProviderId): CodingPlanProviderId;
export declare function resolvePurchaseChoiceBannerPrice({ providerId, audience, products, soldOutVisible, }: {
    providerId: BuiltinModelProviderId;
    audience: PurchaseAudience;
    products: CodingPlanProductDisplay[];
    soldOutVisible?: boolean;
}): {
    kind: "price";
    price: number;
    currency: string;
} | {
    kind: "soldOut";
} | null;
export declare function resolveEnterprisePurchaseChoiceBannerPrice(group: EnterpriseCodingPlanProductGroup): {
    kind: "price";
    price: number;
    currency: string;
} | null;
//# sourceMappingURL=Detail.d.ts.map