import { type OffPeakCodingPlanSupport, type OffPeakTaskCreateFailureStage, type OffPeakTaskCreateResult, type ZCodeOffPeakTask, type ZCodeOffPeakTaskCreateParams } from "@zcode/shared";
import type { ServiceLogger } from "../logger/serviceLogger.js";
import { type OffPeakTaskRepo } from "./offPeakTaskRepo.js";
import type { IOffPeakTaskService, OffPeakUpdateTaskParams } from "./offPeakTask.js";
import { type OffPeakServerClient } from "./offPeakServerClient.js";
import type { ModelSelection, ModelSelectionValidation } from "@zcode/provider";
/** 轮询下限/上限与失败退避（服务端 next_poll_after 优先，钳制防打爆/防饿死）。 */
export declare const OFF_PEAK_SYNC_MIN_INTERVAL_MS = 5000;
export declare const OFF_PEAK_SYNC_MAX_INTERVAL_MS: number;
export interface OffPeakTaskServiceDeps {
    repo: OffPeakTaskRepo;
    client: OffPeakServerClient;
    /** 与 ticket/runtime 共用 resolver 后的脱敏结果，供 renderer 创建门控。 */
    resolveCodingPlanSupport: () => Promise<OffPeakCodingPlanSupport>;
    /** 只返回安全 hostname；解析失败返回空串，不能影响创建业务结果。 */
    resolveTelemetryProviderName: () => Promise<string>;
    /** 用当前完整 Registry 解析并校验固定 Off-Peak Provider 的选择。 */
    resolveModelSelection: (input: {
        readonly modelId?: string;
        readonly reasoningLevel?: string;
    }) => Promise<{
        readonly ok: true;
        readonly selection: ModelSelection;
    } | {
        readonly ok: false;
        readonly validation: ModelSelectionValidation;
    }>;
    logger: ServiceLogger;
    /** schedulable 翻 1 后立即唤醒 scheduler tick（缺省等 20s 轮询）。 */
    requestSchedulerWake?: () => void;
    /** 取消 running 任务时中止其 agent loop（host 注入；best-effort）。 */
    stopRunningTask?: (params: {
        conversationId: string;
        workspacePath: string;
        workspaceIdentity?: string;
    }) => Promise<void>;
    /** 列表变化广播钩子（UI 刷新）。 */
    onTasksChanged?: () => void;
    /** 测试注入时钟。 */
    now?: () => number;
    /** disposeAll 附加清理（如关闭 mock 网关）。 */
    onDispose?: () => void;
}
export declare function classifyOffPeakCreateFailure(error: unknown, failureStage: OffPeakTaskCreateFailureStage): Pick<Extract<OffPeakTaskCreateResult, {
    ok: false;
}>, "failureStage" | "errorCategory" | "errorCode">;
export declare class OffPeakTaskService implements IOffPeakTaskService {
    private readonly deps;
    private syncTimer;
    private syncRunning;
    private syncStopped;
    private consecutiveSyncFailures;
    constructor(deps: OffPeakTaskServiceDeps);
    private now;
    private emitChanged;
    getCodingPlanSupport(): Promise<OffPeakCodingPlanSupport>;
    /** Host 派发前的窄检查；最终执行仍由目标 Agent ModelFactory 重新校验。 */
    validateDispatchModelSelection(selection: ModelSelection): Promise<boolean>;
    getTakeNumberAvailability(): Promise<import("@zcode/shared").OffPeakTakeNumberAvailability>;
    /** 创建即取号（取号成功才落库）；失败只返回稳定分类，绝不跨 RPC 返回 raw error。 */
    createTask(params: ZCodeOffPeakTaskCreateParams): Promise<OffPeakTaskCreateResult>;
    /**
     * 取消（任意非终态）：先落终态再停 loop——顺序保证 loop 的 stopped 迟到回写
     * 被终态守卫丢弃，不会覆盖 cancelled（幂等）。
     */
    cancelTask(offPeakTaskId: string): Promise<ZCodeOffPeakTask | null>;
    /** Pause：停止本地派发，票留服务端队列继续排。 */
    pauseTask(offPeakTaskId: string): Promise<ZCodeOffPeakTask | null>;
    /**
     * Continue：票活着 = 恢复派发（零成本）；票已废（expired/not_found/无票）= 此刻手动
     * 重取号回队尾（额度消耗必须由用户显式动作触发）。
     */
    continueTask(offPeakTaskId: string): Promise<ZCodeOffPeakTask | null>;
    /** 删除：非终态先按取消处理（停 loop + settle），再删行；终态直接删。 */
    deleteTask(offPeakTaskId: string): Promise<void>;
    /** Delete history：仅写本地可见性标记，任务与会话继续保留。 */
    deleteHistory(offPeakTaskId: string): Promise<ZCodeOffPeakTask | null>;
    /** 编辑（queued/paused 全字段可编辑；票只锁队列身份，prompt 派发时才读）。 */
    updateTask(offPeakTaskId: string, params: OffPeakUpdateTaskParams): Promise<ZCodeOffPeakTask | null>;
    list(): Promise<ZCodeOffPeakTask[]>;
    get(offPeakTaskId: string): Promise<ZCodeOffPeakTask | null>;
    /**
     * 只派生当前配置诊断，不写数据库；旧字段仅由 migration 处理。
     */
    private projectModelSelectionIssues;
    /** 票据过期（active 3h 到期/ready 废票）：回队保 session → 同 task_id 重取号。 */
    handleTicketExpiredDuringRun(offPeakTaskId: string): Promise<void>;
    /** 同 task_id 重新取号（已确认允许多次），失败留给轮询周期重试。 */
    private retakeTicket;
    startSync(): void;
    stopSync(): void;
    /** disposeServiceResources 钩子：host 退出统一回收（停轮询 + 附加清理）。 */
    disposeAll(): void;
    private ensureSyncScheduled;
    /** 单次同步周期；显式调用（测试/启动扫描）不受 stopSync 影响，仅自动重排循环受控。 */
    runSyncCycle(): Promise<void>;
    /** 单票状态映射（两轴）：返回是否翻为可派发。 */
    private applyTicketStatus;
    /** 终态未核销任务补报（幂等，永远失败也无害——服务端静默超时回收兜底）。 */
    private flushSettleOutbox;
    private settleOne;
}
//# sourceMappingURL=offPeakTaskService.d.ts.map