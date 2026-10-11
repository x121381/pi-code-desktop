import { type ZCodeOffPeakTask, type ZCodeOffPeakTaskCreateParams } from "@zcode/shared";
/** 认领超时回收：claim_running=1 超过该时长仍未结算，视为持有者已崩溃，允许重新认领。
    独立于 automation 的 CLAIM_STALE_MS（语义相同、常量独立一份，勿互相引用）。 */
export declare const OFF_PEAK_CLAIM_STALE_MS: number;
/**
 * 闲时任务存储仓库（tasks-index.sqlite，WAL、多进程安全）。
 *
 * 仓库只做存储与原子状态迁移，守卫两条不变量：
 * 终态不可逆出；单任务认领 single-flight（任务间并发不设本地上限）。
 * 排队/晋级语义在服务端，仓库不感知——schedulable 只是 host 轮询写回的快照。
 */
/** INSERT 撞上 idx_off_peak_bound_active（并发双创建的失败方）。 */
export declare function isOffPeakBoundSessionConflict(error: unknown): boolean;
export declare class OffPeakTaskRepo {
    private readonly startupBusyTimeoutMs;
    private db;
    private dbPath;
    private initializePromise;
    private readonly resolvedDbPath;
    constructor(dbPath?: string, startupBusyTimeoutMs?: number);
    private resolveDbPath;
    ensureReady(): Promise<void>;
    close(options?: {
        throwOnError?: boolean;
    }): void;
    private initialize;
    private getDatabase;
    private hasTasksIndexTable;
    private getRow;
    /**
     * 创建即入队（status=queued）。取号在 service 层先行（POST /ticket 成功才落库），
     * 取号结果经 options 一并写入；mock 先行阶段允许不带服务端字段。
     */
    create(params: ZCodeOffPeakTaskCreateParams, options?: {
        /** 测试注入用；缺省 Date.now()。 */
        now?: number;
        /** service 层先取号后落库时外部指定主键（取号需先有 task_id）；缺省内部生成。 */
        offPeakTaskId?: string;
        serverTicketId?: string;
        queuePosition?: number;
        registeredAt?: number;
        /** 取号即 ready（低峰空闲时服务端可直接晋级）时随建随派。 */
        schedulable?: boolean;
    }): Promise<ZCodeOffPeakTask>;
    list(scope?: {
        workspacePath?: string;
        workspaceIdentity?: string;
    }): Promise<ZCodeOffPeakTask[]>;
    get(offPeakTaskId: string): Promise<ZCodeOffPeakTask | null>;
    /**
     * Registry 变化使已保存 Selection 失效时，保留原模型与档位供用户修复或后续可靠恢复，
     * 同时清空正式 Selection 并撤销可调度状态，避免旧配置继续被 scheduler 认领。
     */
    invalidateModelSelection(offPeakTaskId: string, modelSelection: NonNullable<ZCodeOffPeakTask["modelSelection"]>, options?: {
        now?: number;
    }): Promise<ZCodeOffPeakTask | null>;
    /** 卡片 Delete：任何状态均可删（非终态删除的服务端核销由 service 层先行取消处理）。 */
    delete(offPeakTaskId: string): Promise<void>;
    /**
     * 仅隐藏 History 行：任务必须已经实际启动；重复调用幂等。
     * 不修改状态、session、started/ended/filesChanged 或服务端核销字段。
     */
    markHistoryDeleted(offPeakTaskId: string, options?: {
        now?: number;
    }): Promise<ZCodeOffPeakTask | null>;
    /** 创建上限的本地预判用（权威是服务端取号 429/3103）。 */
    countNonTerminal(): Promise<number>;
    /** 本会话是否已有未终态绑定任务（创建前预检；索引 idx_off_peak_bound_active 同条件）。 */
    hasActiveBoundTask(workspaceKey: string, sessionId: string): Promise<boolean>;
    /** 执行中计数：keep-awake powerSaveBlocker 判据。 */
    countActive(): Promise<number>;
    /**
     * 编辑窗口期字段：仅 queued/paused 可编辑；票只锁队列身份，prompt 派发时才读。
     * modelSelection 只能替换为另一份明确 Selection；undefined = 不改。
     */
    updateEditableFields(offPeakTaskId: string, params: {
        title?: string;
        prompt?: string;
        permissionMode?: string;
        modelSelection?: ZCodeOffPeakTask["modelSelection"] | null;
    }, options?: {
        now?: number;
    }): Promise<ZCodeOffPeakTask | null>;
    /** 轮询/重新取号写回：仅覆盖显式传入的字段。 */
    updateSchedulingSnapshot(offPeakTaskId: string, patch: {
        schedulable?: boolean;
        queuePosition?: number | null;
        nextPollAt?: number | null;
        serverTicketId?: string;
        registeredAt?: number;
        now?: number;
    }): Promise<void>;
    /**
     * single-flight 认领可派发任务：status=queued 且 schedulable=1 且无在途认领，
     * 原子 claim_running 0→1。FIFO 序按 queued_at（权威序由服务端取号顺序保证）。
     * 同时回收认领超时（claimed_at 过期）的僵尸认领。
     */
    claimDue(now: number): Promise<ZCodeOffPeakTask[]>;
    /**
     * 派发成功（网关 admitted）：queued→running，回填首跑产生的 conversation/session 与
     * 本段 ticket，释放认领。守卫：仅 queued 可入 running（终态不可逆出；paused 竞态下
     * 派发结果作废，返回 null 由调用方处理）。续跑段保留首段 started_at（用户视角单任务）。
     */
    markRunning(offPeakTaskId: string, options: {
        startedAt: number;
        conversationId?: string;
        sessionId?: string;
        serverTicketId?: string;
    }): Promise<ZCodeOffPeakTask | null>;
    /**
     * 终态落库（completed/failed/cancelled）。守卫：终态不可逆出——已终态的行拒绝二次迁移，
     * 返回 null（OffPeakRunResult 迟到兜底时调用方据此丢弃）。settled_at 由核销单独回填。
     */
    markTerminal(offPeakTaskId: string, options: {
        status: "completed" | "failed" | "cancelled";
        endedAt: number;
        failureReason?: string;
        filesChanged?: number;
        /** scheduler 派发阶段的确定性错误；存在时原子累计一次派发尝试并留 last_error。 */
        dispatchError?: string;
    }): Promise<ZCodeOffPeakTask | null>;
    /**
     * 用户 Pause / Continue：queued ⇄ paused。
     * Pause 只停本地派发（票留服务端队列）；Continue 的票有效性判断与重取号在 service 层。
     * 已被认领派发在途（claim_running=1）的任务不可 Pause，返回 null。
     */
    setPaused(offPeakTaskId: string, paused: boolean, options?: {
        now?: number;
    }): Promise<ZCodeOffPeakTask | null>;
    /**
     * 释放认领（派发失败/关机退出）：复位 single-flight 锁；带 error 时累计 attempt_count
     * 并记 last_error（供派发退避与诊断）。不改 status——任务留在 queued 等下轮认领（无 skip）。
     */
    releaseClaim(offPeakTaskId: string, options?: {
        error?: string;
        now?: number;
    }): Promise<void>;
    /**
     * 启动回收（app 级启动时调用一次，先于任何派发）：进程死亡时残留的
     * running 置回 queued（保留 queued_at，天然仍在队首附近；保留 session_id 供 resume
     * 续跑），并清理超时认领。返回回收的任务数。
     * ⚠ 调用方必须保证调用时无在跑 off-peak loop（属主应为 app 单例进程，非每个 host）。
     */
    recoverInterrupted(now: number): Promise<number>;
    /**
     * 3h 时间盒到期 / ready 废票的续跑回队：running → queued，保留
     * session/conversation/started_at 供 resume 接续；清 schedulable 与位次等待重新取号后由轮询刷新。
     * 终态/paused 不可回队，返回 null（如用户已抢先取消）。
     */
    requeueForContinuation(offPeakTaskId: string, options?: {
        now?: number;
    }): Promise<ZCodeOffPeakTask | null>;
    /** 全部非终态任务（offPeakTaskSync 轮询输入：有非终态才轮）。 */
    listNonTerminal(): Promise<ZCodeOffPeakTask[]>;
    /** settle 服务端 ack 后回填；仅终态行可核销（幂等，重复回填覆盖为最新 ack 时间）。 */
    markSettled(offPeakTaskId: string, settledAt: number): Promise<void>;
    /** 未核销的终态任务：poll 周期捎带补报 + host 启动扫描（不新增计时器）。 */
    listUnsettledTerminal(): Promise<ZCodeOffPeakTask[]>;
}
//# sourceMappingURL=offPeakTaskRepo.d.ts.map