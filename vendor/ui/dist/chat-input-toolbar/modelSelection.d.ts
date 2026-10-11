import type { ModelSelectGroup } from "@/ModelConfigSelect.js";
export declare function shouldShowManageModelsAction(onManageModels?: () => void, options?: {
    isWebRemoteControl?: boolean;
}): boolean;
export declare function resolveModelSelectTriggerDisplay(normalizedValue: string, modelGroups: readonly ModelSelectGroup[], showManageModelsAction: boolean, manageModelsLabel?: string, options?: {
    allowUnavailableCustomModelPlaceholder?: boolean;
    allowUnavailableModelPlaceholder?: boolean;
}): {
    value: string | undefined;
    placeholder: string | undefined;
};
//# sourceMappingURL=modelSelection.d.ts.map