/**
 * 存储分类目录：把 .zcode 根下的相对路径映射到类别、聚合 key 与可清理性。
 * 纯函数、单一事实源。
 * 匹配顺序：根级特例 → 文件规则（精确）→ 前缀规则（最长前缀优先）→ 其他。
 */
import type { StorageCategoryId, StorageCleanability, StorageRootId } from "@zcode/shared";
export interface StorageCatalogContext {
    rootId: StorageRootId;
    hasCustomDataBaseDir: boolean;
}
export interface StorageClassification {
    categoryId: StorageCategoryId;
    /** 下钻明细的聚合 key：规则命中路径的下一级。 */
    entryKey: string;
}
/** 清理时需要枚举的范围；recursive=false 表示只看该目录直接子项（用于文件规则）。 */
export interface StorageCleanScope {
    prefix: string;
    recursive: boolean;
}
export declare function normalizeStorageRelativePath(relativePath: string): string;
export declare function classifyStoragePath(rawPath: string, context: StorageCatalogContext): StorageClassification;
export declare function getStorageCategoryCleanability(categoryId: StorageCategoryId): StorageCleanability;
export declare function isProtectedStoragePath(rawPath: string): boolean;
export declare function getStorageCleanScopes(categoryId: StorageCategoryId): StorageCleanScope[];
//# sourceMappingURL=storageCatalog.d.ts.map