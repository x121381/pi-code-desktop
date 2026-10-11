import { type ZCodeAutomation, type ZCodeAutomationBotDeliveryTarget, type ZCodeAutomationCreateParams, type ZCodeAutomationLifecycleStatus, type ModelSelection, type ZCodeAutomationRun, type ZCodeAutomationRunDispatchStatus, type ZCodeAutomationRunOutcome, type ZCodeAutomationTrigger, type ZCodeAutomationUpdateParams } from "@zcode/shared";
/** 派发失败退避常量。 */
export declare const DISPATCH_RETRY_BASE_MS = 30000;
export declare const DISPATCH_RETRY_CAP_MS: number;
export declare const DISPATCH_MAX_ATTEMPTS = 5;
/** 认领超时回收：running=1 超过该时长仍未结算，视为持有者已崩溃，允许重新认领。 */
export declare const CLAIM_STALE_MS: number;
/** 创建总数超过产品上限；错误码会跨 RPC 保留在 message 中供 UI 识别。 */
export declare class AutomationCreateLimitError extends Error {
    readonly code = "AUTOMATION_CREATE_LIMIT_REACHED";
    constructor();
}
export interface ClaimedManualAutomationRun {
    automation: ZCodeAutomation;
    run: ZCodeAutomationRun;
}
/** 退避重试时间：now + min(BASE * 2^(attempts-1), CAP)。 */
export declare function computeRetryAt(now: number, attempts: number): number;
/**
 * automation 存储仓库：automations（定义 + 调度状态）与 automation_runs（运行历史 + runId 幂等台账），
 * 与 task index 同库 tasks-index.sqlite（WAL、多进程安全）。
 *
 * 仓库只做存储与原子状态迁移；cron 表达式解析 / next_run_at 计算由调用方（scheduler / 管理层）
 * 用 cron 库算好后传入，仓库不感知 cron 语义。
 */
export declare class AutomationRepo {
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
    private getRow;
    create(params: ZCodeAutomationCreateParams, options: {
        nextRunAt: number | null;
        lifecycleStatus?: ZCodeAutomationLifecycleStatus;
    }): Promise<ZCodeAutomation>;
    list(scope?: {
        workspacePath?: string;
        workspaceIdentity?: string;
    }): Promise<ZCodeAutomation[]>;
    /** 首次派发专用读取：列表可以展示未绑定任务，但派发不能把损坏值当成跟随默认。 */
    getModelSelectionForDispatch(automationId: string, workspaceKey: string): Promise<ModelSelection | undefined>;
    /**
     * 仅供后台派发读取 Bot 回推目标；该内部来源信息不进入 automation 展示模型。
     */
    getBotDeliveryTarget(automationId: string, workspaceKey?: string): Promise<ZCodeAutomationBotDeliveryTarget | undefined>;
    hasTaskBinding(scope: {
        workspacePath: string;
        workspaceIdentity?: string;
        targetTaskId: string;
    }): Promise<boolean>;
    get(automationId: string, workspaceKey?: string): Promise<ZCodeAutomation | null>;
    /** maxRuns 的生命周期口径只统计定时派发；manual run 仅属于 Card 累计展示。 */
    getScheduledRunCount(automationId: string, workspaceKey?: string): Promise<number | null>;
    /**
     * 编辑定义字段。调用方按需传入重算后的 nextRunAt（改 cron_expr 时）与新的 lifecycleStatus
     * （改 recurring/max_runs 时），仓库不感知 cron 语义。改 cron_expr 时清空 retry 态。
     */
    update(automationId: string, params: ZCodeAutomationUpdateParams, options?: {
        nextRunAt?: number | null;
        lifecycleStatus?: ZCodeAutomationLifecycleStatus;
        resetRetry?: boolean;
    }, workspaceKey?: string): Promise<ZCodeAutomation | null>;
    delete(automationId: string, workspaceKey?: string): Promise<boolean>;
    /** 暂停 / 恢复。paused ↔ active，保留 next_run_at / run_count。 */
    setEnabled(automationId: string, enabled: boolean, workspaceKey?: string): Promise<void>;
    /** 终态任务手动重跑：回 active、清计数与重试态，nextRunAt 由调用方重算传入。 */
    restart(automationId: string, options: {
        nextRunAt: number | null;
    }, workspaceKey?: string): Promise<void>;
    /**
     * 立即运行：写入由当前 host 直接持有的 manual run，不修改 automation 的 cron 计划/生命周期。
     * 直派路径过去没有占用 automation running 锁，连续点击会并发投递到同一个 target task，
     * 进而让模型配置 revision 互相踩踏。这里复用 scheduler 的 single-flight 锁；host 派发结算后释放。
     * attempts=1 表示已经交给直接派发方；scheduler 只会在认领超时后做崩溃恢复。
     */
    runNow(automationId: string, options: {
        now: number;
    }, workspaceKey?: string): Promise<ClaimedManualAutomationRun | null>;
    /**
     * single-flight 认领到期项：原子 running=0→1。同时回收认领超时（claimed_at 过期）的僵尸项。
     * due 判定同时看 next_run_at 与 retry_at，任一到期即 due。
     */
    claimDue(now: number): Promise<ZCodeAutomation[]>;
    /**
     * 认领 UI「立即运行」产生的 manual run。
     * 立即运行不能改 next_run_at，否则会污染原 cron 节奏；manual run 使用 automation_runs
     * 作队列，短暂占用 automation running 锁来避免和定时触发并发投递同一个 task。
     */
    claimManualRuns(now: number): Promise<ClaimedManualAutomationRun[]>;
    /**
     * 派发成功结算：展示总数与定时派发数各 +1、写 last_run_at、清重试态、复位 running；
     * 循环任务回 active（nextRunAt 由调用方按实际派发时间重算传入）；
     * 有限次任务达 max_runs 转 completed（enabled=0、next_run_at=NULL）。
     */
    markDispatched(automationId: string, options: {
        dispatchedAt: number;
        nextRunAt: number | null;
    }): Promise<void>;
    /**
     * 派发失败：transient 累加 attempts 并按退避写 retry_at；达上限后循环任务放弃本轮跳下一个
     * next_run_at（调用方传入），有限次任务转 failed。permanent 直接 failed 终态停用。
     */
    markDispatchFailed(automationId: string, options: {
        failedAt: number;
        error: string;
        kind: "transient" | "permanent";
        /** transient 达上限后，循环任务的下一个正常 next_run_at（调用方重算）。 */
        nextRunAt?: number | null;
    }): Promise<void>;
    /** 关机/退出时释放认领：清 running、保留 next_run_at，不记失败不推进。 */
    releaseClaim(automationId: string): Promise<void>;
    /** manual run 结束后只释放 single-flight 锁，不修改 automation 的调度状态。 */
    releaseManualClaim(automationId: string, workspaceKey: string): Promise<void>;
    /** host 仍持有 queued/running manual run 时续租，避免长任务被 scheduler 当作僵尸认领回收。 */
    touchManualClaim(automationId: string, workspaceKey: string): Promise<void>;
    /**
     * 错过触发窗口：原子地记一条 skipped run + 把 next_run_at 前推到下一个未来触发点 + 复位认领。
     * 不计 run_count。用于 scheduler 启动/恢复后发现 next_run_at 已远早于 now 的补偿跳过。
     * finalize=true 用于纯一次性任务：目标时刻已错过即终态（completed + 停用 + 清空调度），
     * 不得再从兼容性 scheduleRule 推导出后续周期继续执行。
     */
    skipAndReschedule(params: {
        automationId: string;
        runId: string;
        workspaceKey: string;
        scheduledAt: number | null;
        reason: string;
        nextRunAt: number | null;
        finalize?: boolean;
    }): Promise<void>;
    /** 确保 run 历史存在。用于 host outcome 回写兜底，不增加 attempts，避免和 scheduler retry 计数互相污染。 */
    ensureRunClaimed(params: {
        runId: string;
        automationId: string;
        workspaceKey: string;
        scheduledAt: number | null;
        trigger: ZCodeAutomationTrigger;
    }): Promise<void>;
    /** 认领时 upsert 一行 run（run_id 冲突即命中本轮 retry，不新建）。 */
    upsertRunClaimed(params: {
        runId: string;
        automationId: string;
        workspaceKey: string;
        scheduledAt: number | null;
        trigger: ZCodeAutomationTrigger;
        modelSelection?: ModelSelection;
    }): Promise<void>;
    /**
     * Select 首次形成 Submission 时原子固定 run Selection；之后调用只能读回原值。
     * 旧派发在每次 transient retry 都重新读取 Host preferred，导致同一 run 换模型。
     */
    fixRunModelSelection(runId: string, selection: ModelSelection): Promise<ModelSelection>;
    /** 派发结果回写 run（dispatched 回填 session_id / failed_to_dispatch 记 error）。 */
    markRunDispatch(params: {
        runId: string;
        dispatchStatus: ZCodeAutomationRunDispatchStatus;
        sessionId?: string | null;
        error?: string | null;
    }): Promise<void>;
    /**
     * manual run 首次派发成功结算：原子更新 run 台账与累计运行次数。
     * 手动运行过去只更新 automation_runs，Card 的 runCount 因而只统计定时触发；
     * 同一个 runId 还可能由 direct host、scheduler 崩溃恢复或迟到回报重复结算，所以必须以
     * dispatch_status 首次进入 dispatched 作为幂等边界。manual 不推进 cron/maxRuns/lifecycle，
     * 也不释放 single-flight claim，claim 仍由真实 turn 终态收口。
     */
    markManualRunDispatched(params: {
        runId: string;
        sessionId?: string | null;
        dispatchedAt: number;
    }): Promise<boolean>;
    /** session runtime 回写运行结果（running / succeeded / failed / stopped）。 */
    markRunOutcome(runId: string, outcome: ZCodeAutomationRunOutcome, error?: string): Promise<void>;
    /** 错过触发窗口：落一条 skipped run（session_id=null），不计 run_count。 */
    recordSkippedRun(params: {
        runId: string;
        automationId: string;
        workspaceKey: string;
        scheduledAt: number | null;
        trigger: ZCodeAutomationTrigger;
        reason: string;
    }): Promise<void>;
    listRuns(automationId: string, workspaceKey?: string): Promise<ZCodeAutomationRun[]>;
    getRun(runId: string): Promise<ZCodeAutomationRun | null>;
    deleteRun(runId: string, workspaceKey?: string): Promise<void>;
    /** 保留策略：删除超过 maxAgeMs 的历史 run（防无限增长）。 */
    pruneRuns(maxAgeMs: number): Promise<number>;
    private writeRow;
}
//# sourceMappingURL=automationRepo.d.ts.map