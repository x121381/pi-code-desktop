import type { ZCodeImportSessionsResult, ZCodeTaskMeta } from "@zcode/shared";
import type { ClaudeNativeImportedSessionSource } from "#src/session/claude-native/claudeNativeImportedSessionTypes.js";
import type { TaskIndexRepo } from "#src/session/taskIndexRepo.js";
export declare function importClaudeNativeSessions(params: {
    taskIndexRepo: TaskIndexRepo;
    workspacePath?: string;
    workspaceIdentity?: string;
    sessionIds: string[];
    createImportedSession?: (source: ClaudeNativeImportedSessionSource) => Promise<ZCodeTaskMeta>;
    onTaskImported: (meta: ZCodeTaskMeta) => void;
}): Promise<ZCodeImportSessionsResult>;
//# sourceMappingURL=claudeNativeSessionImportService.d.ts.map