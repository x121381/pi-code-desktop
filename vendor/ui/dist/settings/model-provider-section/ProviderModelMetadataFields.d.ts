import type { ReactNode } from "react";
export declare function BooleanModelOption({ label, selected, onToggle, overridden, }: {
    label: string;
    selected: boolean;
    onToggle: () => void;
    overridden?: boolean;
}): import("react/jsx-runtime").JSX.Element;
/** 外层按钮负责完整点击与键盘语义；指示框不可再嵌一个可聚焦控件。 */
export declare function ModelOptionCheckbox({ selected }: {
    selected: boolean;
}): import("react/jsx-runtime").JSX.Element;
export declare function JsonSlotEditor({ label, labelHelp, value, effectiveValue, overridden, onChange, }: {
    label: string;
    labelHelp?: ReactNode;
    value: string;
    effectiveValue?: string;
    overridden?: boolean;
    onChange: (value: string) => void;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=ProviderModelMetadataFields.d.ts.map