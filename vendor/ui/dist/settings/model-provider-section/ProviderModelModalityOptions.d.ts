import type { ProviderModelInputFormatDraft } from "@/settings/model-provider-section/ProviderModelMetadata.js";
type ProviderModelInputFormatOverlay = Partial<Record<keyof ProviderModelInputFormatDraft, boolean | null>>;
export declare function ProviderModelInputModalityOptions({ value, onChange, personalValue, overrideFields, }: {
    value: ProviderModelInputFormatDraft;
    onChange: (value: ProviderModelInputFormatDraft) => void;
    personalValue?: ProviderModelInputFormatOverlay | null;
    overrideFields?: ReadonlySet<string>;
}): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=ProviderModelModalityOptions.d.ts.map