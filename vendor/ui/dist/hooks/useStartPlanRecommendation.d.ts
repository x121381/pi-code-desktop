import type { ModelSelectionView } from "@zcode/provider";
import { type ModelSelection } from "@zcode/shared";
/** 推荐只编辑本次提交的选择；设置与额度仍由 App/Host 的原服务拥有。 */
export declare function useStartPlanRecommendation(view: ModelSelectionView | null | undefined, surface?: "subagent"): (selection: ModelSelection) => Promise<ModelSelection | null>;
//# sourceMappingURL=useStartPlanRecommendation.d.ts.map