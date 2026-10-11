import type { ModelId, ProviderId } from "./config/index.js";
import { type ModelSelection, type ModelSelectionValidation, type ProviderRegistryView } from "./registry.js";
import { ProviderConfigResolver, type ProviderConfigResolution, type Provider, type ProviderModel } from "./resolver.js";
import type { AccountProviderConfigSnapshot, ProviderConfigSnapshot, ProviderSource } from "./sources.js";
export interface ProviderRegistryServiceSnapshot {
    readonly sourceRevisions: {
        readonly config: string;
        readonly account: string;
    };
    readonly config: ProviderConfigSnapshot;
    readonly account: AccountProviderConfigSnapshot;
    readonly resolution: ProviderConfigResolution;
    readonly registry: ProviderRegistryView;
}
export interface ProviderRegistryServiceChangedEvent {
    readonly snapshot: ProviderRegistryServiceSnapshot;
    readonly reasons: readonly string[];
}
export interface ProviderRegistryServiceRefreshErrorEvent {
    readonly error: unknown;
    readonly reasons: readonly string[];
}
export interface ProviderRegistryServiceDependencies {
    readonly configSource: ProviderSource<ProviderConfigSnapshot>;
    readonly accountSource: ProviderSource<AccountProviderConfigSnapshot>;
    readonly resolver?: ProviderConfigResolver;
}
export declare class ProviderRegistryService {
    #private;
    constructor(dependencies: ProviderRegistryServiceDependencies);
    start(): Promise<void>;
    refresh(reason?: string): Promise<ProviderRegistryServiceSnapshot>;
    getSnapshot(): ProviderRegistryServiceSnapshot | null;
    getView(): ProviderRegistryView;
    listProviders(): readonly Provider[];
    getProvider(providerId: ProviderId): Provider | undefined;
    getModel(providerId: ProviderId, modelId: ModelId): ProviderModel | undefined;
    validateSelection(selection: ModelSelection): ModelSelectionValidation;
    onDidChange(listener: (event: ProviderRegistryServiceChangedEvent) => void): () => void;
    onDidRefreshError(listener: (event: ProviderRegistryServiceRefreshErrorEvent) => void): () => void;
    dispose(): void;
}
//# sourceMappingURL=registry-service.d.ts.map