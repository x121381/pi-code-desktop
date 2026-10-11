import type { TaskIndexRepo } from "#src/session/taskIndexRepo.js";
import type { IZCodeAgentService, ZCodeAgentWorkspaceTarget } from "#src/zcode-agent/zcodeAgent.js";
/** 旧版本曾把冷恢复 child 写入主列表；只清理权威身份确认的派生索引，不删除 Agent 转录。 */
export declare function repairSubagentTaskIndex(params: {
    target: ZCodeAgentWorkspaceTarget;
    visibleSessionIds: ReadonlySet<string>;
    agentService: Pick<IZCodeAgentService, "listSessions">;
    taskIndexRepo: Pick<TaskIndexRepo, "listTaskMetas" | "updateTaskState">;
    isCurrent: () => boolean;
    onRemoved: () => void;
}): Promise<void>;
//# sourceMappingURL=repairSubagentTaskIndex.d.ts.map