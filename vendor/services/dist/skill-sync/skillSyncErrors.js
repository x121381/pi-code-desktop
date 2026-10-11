import { SKILL_SYNC_SIZE_LIMIT_ERROR_CODE, } from "@zcode/shared";
export function createSkillSyncSizeLimitError(data) {
    const error = new Error(`skill sync size limit exceeded: ${data.actualBytes}/${data.maxBytes} (${data.phase})`);
    error.name = "SkillSyncSizeLimitError";
    error.code = SKILL_SYNC_SIZE_LIMIT_ERROR_CODE;
    error.data = data;
    return error;
}
//# sourceMappingURL=skillSyncErrors.js.map