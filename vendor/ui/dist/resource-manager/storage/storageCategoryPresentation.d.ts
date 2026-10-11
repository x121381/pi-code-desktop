import { Folder } from "lucide-react";
import type { StorageCategoryId, StorageCategoryUsage, StorageRootUsage } from "@zcode/shared";
export declare const STORAGE_CATEGORY_ICONS: Record<StorageCategoryId, typeof Folder>;
export declare const STORAGE_LEGEND_MAX_ITEMS: 6;
export declare const STORAGE_LEGEND_REST_COLOR = "var(--color-foreground-subtlest)";
export declare function storageCategoryTitleId(id: StorageCategoryId): string;
export declare function storageCategoryDescriptionId(id: StorageCategoryId): string;
export interface StorageCategoryTotal {
    id: StorageCategoryId;
    bytes: number;
    fileCount: number;
    cleanability: StorageCategoryUsage["cleanability"];
}
/** 把多个根的同类别占用合并，按 bytes 降序（同为 0 时保持目录顺序）。 */
export declare function sumCategoriesAcrossRoots(roots: StorageRootUsage[]): StorageCategoryTotal[];
export interface StorageLegendItem {
    id: StorageCategoryId | "rest";
    bytes: number;
    color: string;
    restCount?: number;
}
/** 图例与进度条：最多 N 个彩色类别，其余非零类别折叠成一个灰色「其余」项。 */
export declare function buildStorageLegend(totals: StorageCategoryTotal[]): StorageLegendItem[];
/** 明细里「在文件管理器中显示」需要绝对路径；根路径来自 host，按其分隔符拼接。 */
export declare function joinStoragePath(rootPath: string, relativePath: string): string;
//# sourceMappingURL=storageCategoryPresentation.d.ts.map