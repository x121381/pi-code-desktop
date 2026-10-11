import type { ProviderSettingsView } from "@zcode/services";
type ProviderTemplateCreate = (templateId: string) => Promise<void>;
type CustomProviderCreate = (label: string) => Promise<void>;
export declare function ProviderTemplatePicker({ templates, onBack, onCreateFromTemplate, onCreateCustom, creating, }: {
    templates: ProviderSettingsView["providerTemplates"];
    onBack: () => void;
    onCreateFromTemplate: ProviderTemplateCreate;
    onCreateCustom: CustomProviderCreate;
    creating: boolean;
}): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=ProviderTemplatePicker.d.ts.map