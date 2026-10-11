import type { ModelId, ProviderId } from "./config/index.js";
import type { Provider, ProviderModel } from "./resolver.js";
import type { ModelSelection } from "@zcode/shared/model-selection";
export type { ModelSelection } from "@zcode/shared/model-selection";
export type ModelSelectionOptions = NonNullable<ModelSelection["options"]>;
export type ModelSelectionValidation = {
    readonly ok: true;
} | {
    readonly ok: false;
    readonly code: "provider-not-found";
    readonly providerId: ProviderId;
} | {
    readonly ok: false;
    readonly code: "model-not-found";
    readonly providerId: ProviderId;
    readonly modelId: ModelId;
} | {
    readonly ok: false;
    readonly code: "reasoning-level-missing";
    readonly providerId: ProviderId;
    readonly modelId: ModelId;
} | {
    readonly ok: false;
    readonly code: "reasoning-level-not-supported";
    readonly providerId: ProviderId;
    readonly modelId: ModelId;
    readonly reasoningLevel: string;
    readonly supportedLevels: readonly string[];
};
export interface ProviderRegistryView {
    readonly revision: number;
    readonly providers: readonly Provider[];
}
export interface ProviderRegistryChangedEvent {
    readonly revision: number;
    readonly reason: string;
}
export declare class ProviderRegistry {
    #private;
    constructor(providers?: readonly Provider[]);
    getView(): ProviderRegistryView;
    listProviders(): readonly Provider[];
    getProvider(providerId: ProviderId): Provider | undefined;
    getModel(providerId: ProviderId, modelId: ModelId): ProviderModel | undefined;
    validateSelection(selection: ModelSelection): ModelSelectionValidation;
    replace(providers: readonly Provider[], reason: string): void;
    onDidChange(listener: (event: ProviderRegistryChangedEvent) => void): () => void;
}
/** Registry 与默认选择初始化共用同一套通用 Model Option 校验。 */
export declare function validateModelSelectionOptions(model: {
    readonly config: {
        readonly optionSpecs: {
            readonly reasoningLevel: {
                readonly values: readonly string[];
            };
        };
    };
}, selection: ModelSelection): ModelSelectionValidation;
//# sourceMappingURL=registry.d.ts.map