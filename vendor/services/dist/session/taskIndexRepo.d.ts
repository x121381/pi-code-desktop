import { type ZCodeProvider, type ZCodeTaskMeta } from "@zcode/shared";
import type { ZCodeTaskListQuery, ZCodeTaskListResult } from "#src/session/zcodeTaskListTypes.js";
import type { ZCodeGroupedTaskRef, ZCodeGroupedTaskView, ZCodeGroupedTaskViewOrderInput, ZCodeGroupedTaskViewQuery, ZCodeGroupedTaskViewStructure, ZCodeTaskGroup, ZCodeTaskGroupColor } from "#src/session/zcodeTaskListTypes.js";
interface TaskIndexStatePatch {
    pinned?: boolean;
    archived?: boolean;
    deleted?: boolean;
    title?: string;
    titleOverridden?: boolean;
    unreadAt?: number;
    model?: string;
    status?: ZCodeTaskMeta["status"];
    lastError?: ZCodeTaskMeta["lastError"];
    target?: ZCodeTaskMeta["target"];
    updatedAt?: number;
}
export declare class TaskIndexRepo {
    private readonly startupDbPath?;
    private readonly startupBusyTimeoutMs;
    constructor(startupDbPath?: string | undefined, startupBusyTimeoutMs?: number);
    private db;
    private dbPath;
    private initializePromise;
    private readonly writeChains;
    ensureReady(): Promise<void>;
    close(options?: {
        throwOnError?: boolean;
    }): void;
    private initialize;
    private hasColumn;
    /**
     * 存量回填（幂等，每次 bootstrap 自愈）：打点上线前产生的 off-peak 会话行没有
     * offPeakTaskId。off_peak_tasks 与 tasks 同库（tasks-index.sqlite），按 session 绑定
     * join 只补投影列——rowToMeta 以列兜底即可生效，下次 syncTaskMeta 会自动回填 meta_json。
     * 全新安装时 off_peak_tasks 可能尚未由 OffPeakTaskRepo 建表，需 guard。
     */
    private backfillOffPeakTaskMarkers;
    /**
     * 成员关系回填（幂等，每次 bootstrap 自愈）：历史回填只补了 off_peak_task_id
     * 投影列，syncTaskMeta 的"首次获得标记"钩子对这些存量永远不会再触发（existing 已带
     * 标记），必须在 bootstrap 里补一次系统分组归属。OR IGNORE 保证用户手动整理不被覆盖，
     * 也保证重复执行零副作用；无标记行时不创建空组（从未用过闲时的用户不会看到组）。
     */
    private backfillOffPeakGroupMemberships;
    private migrateLegacyAcpTaskIds;
    private migrateLegacyAcpTaskGroupingReferences;
    private deleteTaskGroupingReferencesReady;
    private cleanupDeletedTaskGroupingReferences;
    private buildLegacyAcpMigratedRow;
    private getDatabase;
    private writeKey;
    private enqueueWrite;
    private getTaskRow;
    private getNextGroupedTopSortOrder;
    private upsertGroupedTopOrder;
    private normalizeGroupedTopNodeOrders;
    private normalizeGroupMemberOrders;
    hasGroupedWorkspaceBootstrapRun(): Promise<boolean>;
    archiveStaleTasks(params: {
        workspacePath: string;
        workspaceIdentity?: string;
        olderThanDays: number;
        provider?: ZCodeProvider;
    }): Promise<ZCodeTaskMeta[]>;
    private hasGroupedWorkspaceBootstrapRunSync;
    private bootstrapWorkspaceGroupsForActiveTasks;
    private writeRecord;
    syncTaskMeta(params: {
        meta: ZCodeTaskMeta;
        pinned?: boolean;
        archived?: boolean;
        deleted?: boolean;
        titleOverridden?: boolean;
        searchableText?: string;
    }): Promise<ZCodeTaskMeta>;
    /** 首次公开 root task 时，原子提交 task row 与 grouped 顶层顺序。 */
    syncTaskMetaAtGroupedTop(params: {
        meta: ZCodeTaskMeta;
        pinned?: boolean;
        archived?: boolean;
        deleted?: boolean;
        titleOverridden?: boolean;
        searchableText?: string;
    }): Promise<{
        meta: ZCodeTaskMeta;
        initializedGroupedOrder: boolean;
    }>;
    private syncTaskMetaWithGroupedAdmission;
    /**
     * 把一条 cron session 归入固定的 cron 系统分组（见 CRON_DEFAULT_GROUP_ID）。
     * 幂等：分组行、视图排序、成员关系都用 INSERT OR IGNORE，绝不覆盖用户手动整理的结果。
     * 仅在 session 首次获得 cronAutomationId 时由 syncTaskMeta 调用一次。
     */
    private ensureCronGroupMembership;
    /**
     * 把一条闲时会话归入固定的闲时系统分组（见 OFF_PEAK_DEFAULT_GROUP_ID）。
     * 机制与 cron 完全同构；仅在首次获得 offPeakTaskId 时由 syncTaskMeta 调用，
     * 或由 bootstrap 为存量回填补齐。
     */
    private ensureOffPeakGroupMembership;
    private ensureSystemGroupMembership;
    /**
     * 只在索引行不存在时写入基线元数据；已存在（含已删除）的产品壳状态原样保留。
     *
     * 远端 workspace 的 V4 会话路径可能晚于会话创建才建立 sessions-index
     * 订阅。首次 snapshot 必须能补齐全新的 tasks-index.sqlite，但不能用摘要默认值
     * 覆盖已有的 pin/archive/unread/手动标题，也不能与随后到达的完整 snapshot 竞态回写。
     */
    seedTaskMetaIfMissing(meta: ZCodeTaskMeta): Promise<ZCodeTaskMeta>;
    clearTaskUnreadIfMatches(params: {
        workspacePath: string;
        workspaceIdentity?: string;
        taskId: string;
        expectedUnreadAt: number;
    }): Promise<{
        meta: ZCodeTaskMeta;
        cleared: boolean;
    }>;
    deleteArchivedTask(params: {
        workspacePath: string;
        workspaceIdentity?: string;
        taskId: string;
    }): Promise<ZCodeTaskMeta | null>;
    updateTaskState(params: {
        workspacePath: string;
        workspaceIdentity?: string;
        taskId: string;
        patch: TaskIndexStatePatch;
    }): Promise<ZCodeTaskMeta>;
    applyAgentPatch(params: {
        workspacePath: string;
        workspaceIdentity?: string;
        taskId: string;
        patch: Pick<TaskIndexStatePatch, "title" | "status" | "lastError" | "target" | "updatedAt">;
    }): Promise<ZCodeTaskMeta | null>;
    listTaskMetas(params: {
        workspacePath?: string;
        workspaceIdentity?: string;
        provider?: ZCodeProvider;
        pinned?: boolean;
        archived?: boolean;
        includeDeleted?: boolean;
    }): Promise<ZCodeTaskMeta[]>;
    /**
     * 读取 workspace 下的删除 tombstone。
     *
     * CLI session store 会继续保留会话内容；如果列表 join 只读取 active/pinned/archived，
     * deleted task 会因“不在 archived 集合”被误判成普通 task，并在冷启动后重新出现。
     */
    listDeletedTaskIds(params: {
        workspacePath: string;
        workspaceIdentity?: string;
        provider?: ZCodeProvider;
    }): Promise<string[]>;
    /**
     * 列出某条 automation 产生的所有 cron session（用于 automation 详情展开、关联查询）。
     * 走 cron_automation_id 索引列，只返回未删除的 session，按创建时间倒序。
     */
    listSessionsByAutomation(automationId: string): Promise<ZCodeTaskMeta[]>;
    queryTaskList(params: ZCodeTaskListQuery & {
        provider?: ZCodeProvider;
    }): Promise<ZCodeTaskListResult>;
    createTaskGroup(params?: {
        title?: string;
        color?: ZCodeTaskGroupColor;
    }): Promise<ZCodeTaskGroup>;
    renameTaskGroup(params: {
        groupId: string;
        title: string;
    }): Promise<ZCodeTaskGroup>;
    updateTaskGroupColor(params: {
        groupId: string;
        color: ZCodeTaskGroupColor;
    }): Promise<ZCodeTaskGroup>;
    deleteTaskGroup(params: {
        groupId: string;
    }): Promise<void>;
    initializeGroupedTaskAtTop(params: ZCodeGroupedTaskRef): Promise<boolean>;
    private initializeGroupedTaskAtTopReady;
    queryGroupedTaskView(params: ZCodeGroupedTaskViewQuery & {
        provider?: ZCodeProvider;
    }): Promise<ZCodeGroupedTaskView>;
    /**
     * grouped 原始结构读取（不 join tasks 表、无 bootstrap / normalize 写回）。
     * 任务内容改由 sessions-index 提供，客户端 join；这里只回 group / member / 顶层排序三张表。
     * 组可见性沿用 queryGroupedTaskView 口径：bootstrap workspace group 只在其 workspace 可见。
     */
    queryGroupedTaskViewStructure(params: {
        workspaceScopes: Array<{
            workspacePath: string;
            workspaceIdentity?: string;
        }>;
    }): Promise<ZCodeGroupedTaskViewStructure>;
    applyGroupedTaskViewOrder(params: ZCodeGroupedTaskViewOrderInput & {
        provider?: ZCodeProvider;
    }): Promise<ZCodeGroupedTaskView>;
    getTaskMeta(params: {
        workspacePath: string;
        workspaceIdentity?: string;
        taskId: string;
    }): Promise<ZCodeTaskMeta | null>;
}
export {};
//# sourceMappingURL=taskIndexRepo.d.ts.map