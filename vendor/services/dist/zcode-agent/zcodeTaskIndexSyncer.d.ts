import { type ZCodeTaskMeta, type ZCodeSessionStateSnapshot, type ZCodeWorkspaceEvent, type ZCodeWorkspaceTaskListChanged } from "@zcode/shared";
import { Emitter, type Event } from "@zcode/rpc";
import { TaskIndexRepo } from "#src/session/taskIndexRepo.js";
import type { ZCodeWorkspaceEventSubscriptionParams } from "#src/session/zcodeTaskListTypes.js";
import type { IZCodeAgentService, ZCodeAgentSessionTarget, ZCodeAgentWorkspaceTarget } from "./zcodeAgent.js";
type WorkspaceEventInput = string | ZCodeWorkspaceEventSubscriptionParams;
interface WorkspaceBroadcastTarget {
    workspacePath: string;
    workspaceIdentity?: string;
    taskId?: string;
}
export interface ZCodeTaskIndexTerminalEvent {
    target: ZCodeAgentSessionTarget;
    /** v4 phase 终态映射：completedSuccess/completedInterrupted → turn.completed；error → turn.failed。 */
    kind: "turn.completed" | "turn.failed";
}
export interface ZCodeTaskIndexReadyEvent {
    target: ZCodeAgentSessionTarget;
    /** v4 phase 终态映射：agent 收口后可接受下一条输入的 ready 边界。 */
    reason: "prompt_completed" | "prompt_failed";
}
export interface ZCodeTaskIndexSyncer {
    /**
     * 幂等地为指定 workspace 建立 v4 后台摄入订阅（sessions-index + workspace-config），
     * 把 CLI 权威投影的会话终态/标题/配置目录落到 task index sqlite 与 workspace 广播。
     * 同一 workspace 多次调用只会建立一次。
     */
    ensureWorkspaceSubscription(target: ZCodeAgentWorkspaceTarget): void;
    /**
     * 兼容入口（旧 shadow 订阅 API 形状）：session 维度的激活信号统一收敛为
     * workspace 级 v4 订阅。options.includeSnapshot 在 v4 摄入下无对应语义（初始
     * sessions-index snapshot 只静默补缺失行，不回放终态/广播），保留参数只为不动调用面。
     */
    ensureSessionSubscription(target: ZCodeAgentSessionTarget, options?: {
        includeSnapshot?: boolean;
    }): void;
    /**
     * 把一份 session snapshot 同步到 sqlite，并广播 workspace_task_list_changed。
     * desktop-continuous 路径上，zcodeSessionService 在 createSession/resumeSession/setModel
     * 之后调用本方法（send/steer/fork/compact/rewind 旧写路径已删，写路径统一走
     * v4 命令 + sessions-index/workspace 事件），让 sqlite 拿到最新 title/updatedAt 并触发 UI 列表刷新。
     */
    syncSnapshotAndBroadcast(snapshot: ZCodeSessionStateSnapshot, options: {
        modelOverride?: string;
        thoughtLevelOverride?: string;
        moveGroupedTaskToTop?: boolean;
        unreadSignal?: ZCodeWorkspaceTaskListChanged["unreadSignal"];
        /**
         * 设计修正：必填。切模型（task_model_changed）/快照收敛（task_status_changed）
         * 这类变更不得落到 task_meta_changed——后者会被 UI 当成归属相关变更
         * 触发全局 membership 重拉和列表整刷。
         */
        broadcastReason: ZCodeWorkspaceTaskListChanged["reason"];
    }): Promise<ZCodeTaskMeta>;
    /**
     * 只更新 task index 中的模型记录，不广播历史 snapshot。
     * 发送前 resume 会关闭 snapshot 广播，避免旧终态覆盖本地 streaming UI，
     * 但仍需要把 sqlite 的 model 从已删除历史模型更新到本次实际使用的可用模型。
     */
    syncTaskModel(target: ZCodeAgentSessionTarget, model: string): Promise<ZCodeTaskMeta | null>;
    /**
     * 主动触发一次 workspace_task_list_changed 广播。
     * 给 adapter 用：archive / rename / pin / delete 等 task 元数据变更后仍要广播。
     * 设计修正：reason 必填。曾经的缺省值（task_meta_changed）让所有不表态的发射点
     * 静默落入 UI 最重的刷新语义（全局 membership 重拉），是"输入框操作/任务收口
     * 引发左侧列表整刷"的根因；发射点必须显式声明变更类别。
     */
    emitWorkspaceTaskListChanged(target: WorkspaceBroadcastTarget, meta: ZCodeTaskMeta | undefined, reason: ZCodeWorkspaceTaskListChanged["reason"], options?: Pick<ZCodeWorkspaceTaskListChanged, "unreadSignal">): void;
    /**
     * 获取共享的 workspace emitter，给 adapter 用来 fire 非 task_list_changed 类事件
     * （如 workspace_config_options_update）。这样 adapter 和 syncer 共用同一 emitter，
     * 订阅者只需要订阅一次即可收到全部事件。
     */
    getWorkspaceEmitter(workspace: WorkspaceEventInput): Emitter<ZCodeWorkspaceEvent>;
    /** 订阅 workspace 维度事件流。adapter.onDynamicWorkspaceEvent 直接转发到这里。 */
    onDynamicWorkspaceEvent(workspace: WorkspaceEventInput): Event<ZCodeWorkspaceEvent>;
    /**
     * 订阅 v4 sessions-index 观察到的会话 phase 终态迁移。
     * 这不是 UI stream，只给 host runtime command queue 等 services 内部状态收口使用。
     */
    onSessionTerminalEvent: Event<ZCodeTaskIndexTerminalEvent>;
    /**
     * 订阅会话收口后的 prompt ready 状态（phase 进入 completedSuccess/completedInterrupted/error）。
     * 手机 host command queue 只能以这个事件作为继续发送下一条的边界。
     */
    onSessionReadyEvent: Event<ZCodeTaskIndexReadyEvent>;
    /** 释放所有 v4 订阅和 workspace emitter；不关闭注入的 taskIndexRepo。 */
    disposeAll(): void;
}
interface CreateZCodeTaskIndexSyncerOptions {
    agentService: IZCodeAgentService;
    taskIndexRepo: TaskIndexRepo;
}
export declare function createZCodeTaskIndexSyncer(options: CreateZCodeTaskIndexSyncerOptions): ZCodeTaskIndexSyncer;
export {};
//# sourceMappingURL=zcodeTaskIndexSyncer.d.ts.map