import type { ProviderSettingsFormModel } from "@/lib/providerSettingsFormTypes.js";
import { type ProviderModelDraftValues } from "@/settings/model-provider-section/ProviderModelMetadata.js";
/** 只投影未覆盖控件；Host 是推荐规则的唯一解析者，草稿不保存第二份可写 Effective Config。 */
export declare function projectModelDraft(draft: ProviderModelDraftValues, model: ProviderSettingsFormModel): ProviderModelDraftValues;
export declare function updateModelDraft(draft: ProviderModelDraftValues, patch: Partial<ProviderModelDraftValues>, model: ProviderSettingsFormModel): ProviderModelDraftValues;
/** 恢复是显式草稿动作，即使原本已开启智能配置也要清除可编辑覆盖。 */
export declare function restoreModelDraft(draft: ProviderModelDraftValues, model: ProviderSettingsFormModel): ProviderModelDraftValues;
export declare function modelDraftOverrides(draft: ProviderModelDraftValues): ReadonlySet<string>;
//# sourceMappingURL=ProviderModelDraftState.d.ts.map