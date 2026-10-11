interface RootStartupGateState {
    isResolvingStartupAuthState: boolean;
    isResolvingProviderStartupState: boolean;
    isRestoring: boolean;
    isBootstrappingInitialWorkspace: boolean;
}
interface RootStartupLoadingVisibilityState extends RootStartupGateState {
    isDesktop: boolean | undefined;
    welcomeScreenOpen: boolean;
}
interface FallbackWorkspaceCreateState {
    isMounted: boolean;
    activeWorkspacePath: string | null;
}
interface ProviderStartupSyncState {
    providerFamilyDomainMigrationComplete: boolean;
    modelSelectionViewHydrated: boolean;
}
interface ProviderAvailabilityLoginEntryGuardState {
    isWebRemoteControlRoot: boolean;
}
interface ProviderStartupResolutionState {
    isWebRemoteControlRoot: boolean;
    providerStartupSyncPending: boolean;
    providerAvailabilityStartupCheckCompleted: boolean;
}
export declare function shouldBlockRootRender(state: RootStartupGateState): boolean;
export declare function shouldShowRootStartupLoading(state: RootStartupLoadingVisibilityState): boolean;
export declare function shouldEnableProviderAvailabilityLoginEntryGuard(state: ProviderAvailabilityLoginEntryGuardState): boolean;
export declare function shouldResolveProviderStartupState(state: ProviderStartupResolutionState): boolean;
export declare function shouldOpenFallbackWorkspaceAfterCreate(state: FallbackWorkspaceCreateState): boolean;
export declare function isProviderStartupSyncPending(state: ProviderStartupSyncState): boolean;
export {};
//# sourceMappingURL=rootStartupGate.d.ts.map