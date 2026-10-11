import type { ReactNode } from "react";
import type { ModelConfigObject } from "@zcode/provider";
import type { ProviderModelDraftValues } from "@/settings/model-provider-section/ProviderModelMetadata.js";
export declare function ModelSettingsGroup({ group, children, }: {
    group: "basic" | "tokens" | "modalities" | "capabilities" | "reasoning" | "advanced";
    children: ReactNode;
}): import("react/jsx-runtime").JSX.Element;
export declare function ProviderModelReasoningSettings({ draft, personalConfig, inheritedConfig, overrideFields, onDraftChange, }: {
    draft: ProviderModelDraftValues;
    personalConfig?: ModelConfigObject;
    inheritedConfig?: ModelConfigObject;
    overrideFields?: ReadonlySet<string>;
    onDraftChange: (patch: Partial<ProviderModelDraftValues>) => void;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=ProviderModelSettingsGroups.d.ts.map