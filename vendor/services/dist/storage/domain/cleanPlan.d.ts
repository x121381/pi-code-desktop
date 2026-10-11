/**
 * 清理计划：给定类别与候选文件列表，决定哪些能删。纯函数，删除动作由 adapters 执行。
 */
import { type StorageCatalogContext } from "./storageCatalog.js";
import type { StorageCategoryId } from "@zcode/shared";
export interface StorageCleanCandidate {
    relativePath: string;
    bytes: number;
    mtimeMs: number;
}
export interface StorageCleanPlan {
    targets: StorageCleanCandidate[];
    skippedCount: number;
}
/** 子代理产物：会话目录 24 小时内有更新就整个跳过，避免删掉进行中 subagent 的 transcript。 */
export declare const SUBAGENT_ACTIVE_WINDOW_MS: number;
export declare function planStorageClean(params: {
    categoryId: StorageCategoryId;
    candidates: StorageCleanCandidate[];
    context: StorageCatalogContext;
    now: number;
}): StorageCleanPlan;
//# sourceMappingURL=cleanPlan.d.ts.map