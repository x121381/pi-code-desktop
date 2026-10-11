import { type ModelSelection, type ZCodeConfigOption, type ZCodeProvider } from "@zcode/shared";
import type { ModelSelectionView } from "@zcode/services";
import type { ModelSelectGroup, ModelSelectGroupItem } from "@/ModelConfigSelect.js";
import { type ModelProviderGroupLabelOptions } from "@/lib/modelSelectionGroups.js";
/** 权限模式默认值：Ask before changes。 */
export declare const AUTOMATION_DEFAULT_MODE = "build";
/** 新建任务必须把目标 Host 的 preferredSelection 固化为具体模型，而不是保存虚拟“默认模型”。 */
export declare function resolveAutomationPreferredModelValue(view: Pick<ModelSelectionView, "preferredSelection">): string | null;
export declare function buildAutomationModelSelectGroups(params: {
    selectedProvider: ZCodeProvider;
    labels: ModelProviderGroupLabelOptions;
    registrySelectionView: ModelSelectionView;
}): ModelSelectGroup[];
export declare function buildAutomationModeOption(currentValue: string): ZCodeConfigOption;
export declare function resolveAutomationModelItem(modelGroups: readonly ModelSelectGroup[], modelValue: string): ModelSelectGroupItem | null;
export declare function resolveAutomationModelTriggerLabel(params: {
    modelGroups: readonly ModelSelectGroup[];
    modelSelectionView?: ModelSelectionView | null;
    modelValue: string;
    fallbackLabel: string;
}): string;
export declare function buildAutomationThoughtLevelOption(runtimeOption: ZCodeConfigOption | undefined, currentValue: string): ZCodeConfigOption | null;
/**
 * 更新已有定时任务时必须用 null 显式清掉不支持 Think 的目标模型旧值；
 * undefined 在 update 协议里表示“不修改”，会把源模型的档位残留到下次派发。
 */
export declare function resolveAutomationThoughtLevelUpdate(params: {
    editing: boolean;
    explicitlyChanged: boolean;
    modelChanged: boolean;
    persistedReasoningLevel?: string;
    resolvedThoughtLevel: string;
    thoughtLevel: string;
}): string | null | undefined;
/** Automation 只持久化模型选择；输出预算由执行链按本次请求决定。 */
export declare function buildAutomationModelSelection(params: {
    selected: ModelSelection;
    reasoningLevel?: string | null;
    previous?: ModelSelection;
}): ModelSelection;
//# sourceMappingURL=automationAgentConfigOptions.d.ts.map