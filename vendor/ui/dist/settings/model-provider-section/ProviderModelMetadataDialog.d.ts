import { type FocusEvent } from "react";
import type { ModelConfigObject } from "@zcode/provider";
import type { ProviderModelDraftValues, ProviderModelDraftCommitResult } from "@/settings/model-provider-section/ProviderModelMetadata.js";
export declare function selectFocusedInputText(event: Pick<FocusEvent<HTMLInputElement>, "currentTarget">): void;
export declare function ProviderModelMetadataDialog({ mode, open, draft, draftErrorMessage, draftErrorField, personalConfig, overrideFields, inheritedConfig, onOpenChange, onDraftChange, onRestore, onCommit, modelConfigResolutionPending, modelIdReadOnly, saving, modelDefaultsLoaded, onModelIdBlur, }: {
    mode?: "add" | "edit";
    open: boolean;
    draft: ProviderModelDraftValues;
    draftErrorMessage: string | null;
    draftErrorField?: Extract<ProviderModelDraftCommitResult, {
        status: "invalid";
    }>["field"] | null;
    personalConfig?: ModelConfigObject;
    overrideFields?: ReadonlySet<string>;
    inheritedConfig?: ModelConfigObject;
    onOpenChange: (open: boolean) => void;
    onDraftChange: (patch: Partial<ProviderModelDraftValues>) => void;
    onRestore?: () => void;
    onCommit: () => boolean | Promise<boolean>;
    modelConfigResolutionPending?: boolean;
    modelIdReadOnly?: boolean;
    saving?: boolean;
    modelDefaultsLoaded?: boolean;
    onModelIdBlur?: () => void;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=ProviderModelMetadataDialog.d.ts.map