import type { IServiceAccessor } from "@zcode/services";
type RootProviderStateServices = Pick<IServiceAccessor, "providerSettingsService">;
export declare function refreshRootProviderState(services: RootProviderStateServices): Promise<void>;
export declare function useRootProviderStateRefresh(services: IServiceAccessor): () => Promise<void>;
export {};
//# sourceMappingURL=useRootProviderStateRefresh.d.ts.map