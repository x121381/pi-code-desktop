import type { ZCodePersistedFileChange, ZCodeTaskChangeSummary, ZCodeTaskChangedFileSummary, ZCodeTaskMeta } from "@zcode/shared";
import type { TaskChatMessage } from "@/lib/taskChatMessageTypes.js";
interface TaskChangeSummaryIntl {
    formatMessage: (desc: {
        id: string;
    }, values?: Record<string, string>) => string;
}
export declare function getTaskChangeSummary(task: Pick<ZCodeTaskMeta, "changeSummary"> | null | undefined): ZCodeTaskChangeSummary | null;
export declare function formatTaskTitleWithChanges(title: string, summary: ZCodeTaskChangeSummary | null, intl: TaskChangeSummaryIntl): string;
export declare function toWorkspaceRelativePath(workspacePath: string, filePath: string): string;
export declare function formatTaskChangedFileLabel(workspacePath: string, file: ZCodeTaskChangedFileSummary): string;
export declare function buildPerTurnFileChangeMap(fileChanges: readonly ZCodePersistedFileChange[] | undefined): Map<number, ZCodePersistedFileChange>;
export declare function buildTaskChangeSummary(fileChanges: readonly ZCodePersistedFileChange[] | undefined): ZCodeTaskChangeSummary | null;
export declare function buildToolCallChangeSummary(message: TaskChatMessage, turnIndex: number): {
    patchesByPath?: ReadonlyMap<string, string>;
    summary: ZCodeTaskChangeSummary | null;
};
export declare function buildTaskChangeSummaryFromToolCalls(messages: readonly TaskChatMessage[] | undefined): ZCodeTaskChangeSummary | null;
export declare function buildTurnChangeSummary(turn: ZCodePersistedFileChange | null | undefined): ZCodeTaskChangeSummary | null;
/**
 * 从 fileChanges 中按轮次构建 per-turn 文件变更摘要。
 * 用于在每条 assistant 消息下方显示该轮的文件改动。
 */
export declare function buildPerTurnChangeSummaries(fileChanges: readonly ZCodePersistedFileChange[] | undefined): Map<number, ZCodeTaskChangeSummary>;
export {};
//# sourceMappingURL=taskChangeSummary.d.ts.map