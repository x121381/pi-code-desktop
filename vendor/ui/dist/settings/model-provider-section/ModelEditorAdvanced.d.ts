import { type ReactNode } from "react";
import type { ProviderModelDraftCommitResult } from "@/settings/model-provider-section/ProviderModelMetadata.js";
type ErrorField = Extract<ProviderModelDraftCommitResult, {
    status: "invalid";
}>["field"];
export declare function ModelEditorAdvanced({ open, errorField, validationAttempt, children, }: {
    open: boolean;
    errorField?: ErrorField | null;
    validationAttempt: number;
    children: ReactNode;
}): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=ModelEditorAdvanced.d.ts.map