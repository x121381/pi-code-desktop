import type { UserInfo } from "@zcode/shared";
import type { ModelSelectionView } from "@zcode/services";
export interface ProviderAvailabilityLoginEntryGuardResult {
    hasUsableProvider: boolean;
    providerCount: number;
    shouldOpenLoginEntry: boolean;
}
export declare function useProviderAvailabilityLoginEntryGuard({ enabled, user, isRestoringOAuthSession, providerFamilyDomain, modelSelectionView, modelSelectionError, refreshProviderState, readModelSelectionView, setLoginEntryOpen, }: {
    enabled?: boolean;
    user: UserInfo | null;
    isRestoringOAuthSession: boolean;
    providerFamilyDomain: string | null | undefined;
    modelSelectionView: ModelSelectionView | null;
    modelSelectionError?: Error;
    refreshProviderState: () => Promise<void>;
    readModelSelectionView: () => Promise<ModelSelectionView>;
    setLoginEntryOpen: (open: boolean) => void;
}): {
    startupCheckCompleted: boolean;
    syncLoginEntryWithProviderAvailability: (options: {
        forceRefresh?: boolean;
        reason: string;
    }) => Promise<{
        hasUsableProvider: boolean;
        providerCount: number;
        shouldOpenLoginEntry: boolean;
    }>;
};
//# sourceMappingURL=useProviderAvailabilityLoginEntryGuard.d.ts.map