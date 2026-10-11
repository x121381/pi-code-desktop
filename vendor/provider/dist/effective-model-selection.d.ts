import type { AccountProviderStates } from "./account-provider-state.js";
import type { EffectiveModelSelectionResult } from "@zcode/shared/model-selection";
export type { EffectiveModelSelectionResult } from "@zcode/shared/model-selection";
import { type ModelSelection, type ProviderRegistryView } from "./registry.js";
export type ModelSelectionProviderKind = "ordinary" | "account-plan" | "account-offpeak";
export type ModelSelectionProviderClassifier = (providerId: string) => ModelSelectionProviderKind;
/**
 * 只解析未来执行的意图，不改原选择、持久记录或已固定请求。
 * 原因：读取时清库会让临时失效永久丢失；账号对应也不能退化为同名模型跨任意供应商匹配。
 */
export declare function resolveEffectiveModelSelection(input: {
    readonly selection: ModelSelection | null;
    readonly registry: ProviderRegistryView;
    readonly accountStates?: AccountProviderStates;
    readonly classifyProvider: ModelSelectionProviderClassifier;
    readonly resolveLegacyReasoningLevel?: (selection: ModelSelection) => string | undefined;
}): EffectiveModelSelectionResult;
//# sourceMappingURL=effective-model-selection.d.ts.map