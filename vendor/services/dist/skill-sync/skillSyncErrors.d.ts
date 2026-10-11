import { SKILL_SYNC_SIZE_LIMIT_ERROR_CODE, type SkillSyncSizeLimitErrorData } from "@zcode/shared";
export interface SkillSyncSizeLimitError extends Error {
    code: typeof SKILL_SYNC_SIZE_LIMIT_ERROR_CODE;
    data: SkillSyncSizeLimitErrorData;
}
export declare function createSkillSyncSizeLimitError(data: SkillSyncSizeLimitErrorData): SkillSyncSizeLimitError;
//# sourceMappingURL=skillSyncErrors.d.ts.map