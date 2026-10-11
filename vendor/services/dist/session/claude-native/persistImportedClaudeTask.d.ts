import type { ZCodeSessionFile, ZCodeTaskMeta } from "@zcode/shared";
import { type LegacyTaskSessionFile } from "#src/session/legacyTaskSessionFile.js";
import type { TaskIndexRepo } from "#src/session/taskIndexRepo.js";
export declare function buildSearchableTextFromMessages(messages: ZCodeSessionFile["messages"]): string;
export declare function persistImportedClaudeTask(params: {
    taskIndexRepo: TaskIndexRepo;
    sessionFile: LegacyTaskSessionFile;
    /** 仅当导入目标 workspace 与筛选 workspace 一致时才写入，避免把当前 tab 的 identity 套到其它路径。 */
    workspaceIdentity?: string;
}): Promise<ZCodeTaskMeta>;
export declare function writeImportedClaudeTaskSnapshot(params: {
    sessionFile: LegacyTaskSessionFile;
}): Promise<void>;
//# sourceMappingURL=persistImportedClaudeTask.d.ts.map