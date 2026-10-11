import type { RefObject } from "react";
export declare function TaskRenameDialog({ open, value, inputRef, intl, onOpenChange, onChange, onCancel, onConfirm, }: {
    open: boolean;
    value: string;
    inputRef: RefObject<HTMLInputElement | null>;
    intl: {
        formatMessage: (desc: {
            id: string;
        }, values?: Record<string, string>) => string;
    };
    onOpenChange: (open: boolean) => void;
    onChange: (value: string) => void;
    onCancel: () => void;
    onConfirm: () => void;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=TaskRenameDialog.d.ts.map