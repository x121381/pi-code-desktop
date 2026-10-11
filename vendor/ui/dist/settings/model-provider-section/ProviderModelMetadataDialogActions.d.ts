import type { ReactNode } from "react";
export declare function ModelConfigRestoreButton({ disabled, onRestore, }: {
    disabled: boolean;
    onRestore?: () => void;
}): import("react/jsx-runtime").JSX.Element;
export declare function ModelConfigDraftFeedback({ error, matched, }: {
    error?: string | null;
    matched?: boolean;
}): import("react/jsx-runtime").JSX.Element | null;
export declare function ModelSmartConfigSwitch({ checked, disabled, onChange, }: {
    checked: boolean;
    disabled: boolean;
    onChange: (checked: boolean) => void;
}): import("react/jsx-runtime").JSX.Element;
export declare function ProviderModelMetadataDialogActions({ saveLabel, cancelLabel, saving, onSave, onCancel, leadingAction, }: {
    saveLabel: string;
    cancelLabel: string;
    saving: boolean;
    onSave: () => void;
    onCancel: () => void;
    leadingAction?: ReactNode;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=ProviderModelMetadataDialogActions.d.ts.map