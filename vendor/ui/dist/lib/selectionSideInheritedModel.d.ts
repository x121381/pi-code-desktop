import type { ModelSelectionView } from "@zcode/provider";
import type { SessionConfigState } from "@zcode/shared/zcode-protocol-v4";
/** 副屏继承父 runtime 的生效模型；不能把主 Composer 未提交的草稿带进新 child。 */
export declare function resolveSelectionSideInheritedModel(config: SessionConfigState | null | undefined, view: ModelSelectionView | null): {
    providerId: string;
    modelId: string;
    options?: {
        reasoningLevel?: string | undefined;
    } | undefined;
} | null;
//# sourceMappingURL=selectionSideInheritedModel.d.ts.map