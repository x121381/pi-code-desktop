import type { ZCodeConfigOption } from "@zcode/shared";
import type { ModelSelectionView } from "@zcode/services";
/** 从 Registry 的 ModelConfig Option Specs 读取思考档位。 */
export declare function resolveModelThoughtOption(params: {
    modelSelectionView: ModelSelectionView;
    providerId: string;
    modelId: string;
    currentValue?: string;
    formatLevelName?: (level: string) => string;
}): ZCodeConfigOption | null;
//# sourceMappingURL=modelThoughtOption.d.ts.map