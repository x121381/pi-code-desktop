import { type StorageCategoryId, type StorageRootUsage } from "@zcode/shared";
export declare function StorageCategoryDetail({ categoryId, roots, cleaning, disabled, onBack, onClean, onReveal, }: {
    categoryId: StorageCategoryId;
    roots: StorageRootUsage[];
    cleaning: boolean;
    disabled: boolean;
    onBack: () => void;
    onClean: () => void;
    onReveal: (absolutePath: string) => Promise<void>;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=StorageCategoryDetail.d.ts.map