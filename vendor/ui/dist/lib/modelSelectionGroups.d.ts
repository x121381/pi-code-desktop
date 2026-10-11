import { type ZCodeProvider } from "@zcode/shared";
import type { ModelSelectionView } from "@zcode/services";
import type { ModelSelectGroup } from "@/ModelConfigSelect.js";
export interface ModelProviderGroupLabelOptions {
    apiKeyLabel?: string;
    apiKeyBadgeLabel?: string;
    codingPlanLabel?: string;
    codingPlanBadgeLabel?: string;
    startPlanLabel?: string;
    startPlanBadgeLabel?: string;
    teamPlanBadgeLabel?: string;
    teamPlanFallbackLabel?: string;
}
export declare function buildRegistryModelSelectGroups(selectedProvider: ZCodeProvider, view: ModelSelectionView, labels?: ModelProviderGroupLabelOptions): ModelSelectGroup[];
export declare function resolveModelDisplayName(modelGroups: readonly ModelSelectGroup[], value: string): string | null;
//# sourceMappingURL=modelSelectionGroups.d.ts.map