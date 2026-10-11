import { createServiceLogger } from "../logger/serviceLogger.js";
import { repairImportedClaudeSessionSnapshot } from "../session/claude-native/importedClaudeHistoryRepair.js";
const logger = createServiceLogger("zcode-session-service");
export async function repairEmptyImportedClaudeSessionSnapshot(params) {
    const repaired = await repairImportedClaudeSessionSnapshot({
        snapshot: params.snapshot,
        target: {
            workspacePath: params.target.workspacePath,
            workspaceIdentity: params.target.workspaceIdentity,
            taskId: params.target.sessionId,
            ...("mcpServers" in params.target && params.target.mcpServers
                ? { mcpServers: params.target.mcpServers }
                : {}),
        },
        createSession: (input) => params.agentService.createSession(input),
        onRepair: (history) => {
            logger.warn(undefined, `[zcode-session-service] Claude 导入 session 历史异常，按 ${history.source} 回填 taskId=${params.target.sessionId}`);
        },
    });
    return repaired ?? params.snapshot;
}
//# sourceMappingURL=importedClaudeSessionRepair.js.map