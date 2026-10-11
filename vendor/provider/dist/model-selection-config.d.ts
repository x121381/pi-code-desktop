import { type ModelSelection, type ProviderRegistryView } from "./registry.js";
export type InitialModelSelectionResolution = {
    readonly source: "configured-default" | "registry-fallback";
    readonly selection: ModelSelection;
} | {
    readonly source: "none";
};
interface ModelSelectionCompletionView {
    readonly providers: readonly {
        readonly providerId: string;
        readonly models: readonly {
            readonly modelId: string;
            readonly config: {
                readonly optionSpecs: {
                    readonly reasoningLevel: {
                        readonly values: readonly string[];
                    };
                };
            };
        }[];
    }[];
}
export declare function resolveInitialModelSelection(input: {
    readonly configuredDefault?: ModelSelection;
    readonly registry: ProviderRegistryView;
}): InitialModelSelectionResolution;
/** 仅在用户主动选模型或全新初始化时构造最高档；不能用于恢复/重解析已有选择。 */
export declare function completeNewModelSelection(registry: ModelSelectionCompletionView, selection: ModelSelection): ModelSelection | undefined;
/**
 * 规范化一份待提交的 Selection。
 * 已有选择缺失或失效时只保留模型身份，等待用户选择档位；主动选模型另走 completion。
 * 任何执行入口都必须在此之后再次确认 Selection 完整，不能静默补档位。
 */
export declare function normalizeModelSelection(registry: ModelSelectionCompletionView, selection: ModelSelection): ModelSelection | undefined;
export {};
//# sourceMappingURL=model-selection-config.d.ts.map