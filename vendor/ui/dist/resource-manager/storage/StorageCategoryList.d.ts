import { type StorageCategoryId } from "@zcode/shared";
import { type StorageCategoryTotal } from "./storageCategoryPresentation.js";
export declare function StorageCategoryList({ categories, cleaningCategory, disabled, onOpen, onClean, }: {
    categories: StorageCategoryTotal[];
    cleaningCategory: StorageCategoryId | null;
    disabled: boolean;
    onOpen: (id: StorageCategoryId) => void;
    onClean: (id: StorageCategoryId) => void;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=StorageCategoryList.d.ts.map