import { type StorageCategoryId } from "@zcode/shared";
export interface StorageCleanConfirmTarget {
    categoryId: StorageCategoryId;
    bytes: number;
}
export declare function StorageCleanConfirmDialog({ target, pending, onCancel, onConfirm, }: {
    target: StorageCleanConfirmTarget | null;
    pending: boolean;
    onCancel: () => void;
    onConfirm: () => void;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=StorageCleanConfirmDialog.d.ts.map