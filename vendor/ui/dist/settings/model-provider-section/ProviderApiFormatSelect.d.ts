import type { ProviderApiType } from "@zcode/provider";
export declare const PROVIDER_CONNECTION_API_FORMATS: readonly ProviderApiType[];
export declare function resolveProviderConnectionApiFormatOptions(): ProviderApiType[];
export declare function resolveProviderConnectionApiFormatDisplayLabel(intl: {
    formatMessage: (descriptor: {
        id: string;
    }) => string;
}, format: ProviderApiType): string;
export declare function ProviderApiFormatSelect({ apiFormatOptions, triggerId, value, onChange, }: {
    apiFormatOptions?: readonly ProviderApiType[];
    triggerId?: string;
    value: ProviderApiType;
    onChange: (value: ProviderApiType) => void;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=ProviderApiFormatSelect.d.ts.map