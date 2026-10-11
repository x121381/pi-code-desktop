import type { ZCodeAutomation, ZCodeAutomationCreateParams, ZCodeAutomationRun, ZCodeAutomationUpdateParams } from "@zcode/shared";
import { AutomationRepo } from "#src/session/automationRepo.js";
export { InvalidAutomationIntervalCarrierError } from "#src/session/automationIntervalCarrier.js";
/** 写/单查操作的 workspace 归属；用于跨 workspace 隔离校验。 */
export interface AutomationWorkspaceScope {
    workspacePath: string;
    workspaceIdentity?: string;
}
/** 无效 cron 表达式错误（供管理层向 UI 返回可展示信息）。 */
export declare class InvalidCronExprError extends Error {
    constructor(cronExpr: string);
}
/** 非法的有限次数更新错误；用于阻止矛盾状态写入并误结束仍在运行的任务。 */
export declare class InvalidAutomationMaxRunsUpdateError extends Error {
    constructor(message?: string);
}
/** 非法自定义调度规则；规则必须先通过领域校验才能写入内部任务库。 */
export declare class InvalidAutomationScheduleRuleError extends Error {
    constructor(message: string);
}
/** 相对延迟只用于一次性任务，并由服务端真实时钟生成调度规则。 */
export declare class InvalidAutomationRelativeDelayError extends Error {
    constructor(message: string);
}
/**
 * automation 管理服务：包 AutomationRepo，负责 cron 语义（校验 / 下次时间计算）+ 生命周期重算。
 * 仓库只做存储；这里承载「create 时算 next_run_at」「改 cron_expr 重算」「改 recurring/max_runs 重算生命周期」
 * 「restart 重算」等 cron 相关业务，供 UI 管理面 / RPC 调用。
 */
export declare class AutomationService {
    private readonly repo;
    constructor(repo?: AutomationRepo);
    create(params: ZCodeAutomationCreateParams): Promise<ZCodeAutomation>;
    list(scope?: {
        workspacePath?: string;
        workspaceIdentity?: string;
    }): Promise<ZCodeAutomation[]>;
    hasTaskBinding(scope: {
        workspacePath: string;
        workspaceIdentity?: string;
        targetTaskId: string;
    }): Promise<boolean>;
    get(automationId: string, scope?: AutomationWorkspaceScope): Promise<ZCodeAutomation | null>;
    update(automationId: string, params: ZCodeAutomationUpdateParams, scope?: AutomationWorkspaceScope): Promise<ZCodeAutomation | null>;
    delete(automationId: string, scope?: AutomationWorkspaceScope): Promise<boolean>;
    /** 暂停 / 恢复。 */
    setEnabled(automationId: string, enabled: boolean, scope?: AutomationWorkspaceScope): Promise<void>;
    /** 失败任务手动重跑：回 active、清计数，按 cron 重算下次时间。 */
    restart(automationId: string, scope?: AutomationWorkspaceScope): Promise<void>;
    /** 立即运行：创建供当前 host 直接派发的 manual run，不修改原 cron 计划。 */
    runNow(automationId: string, scope?: AutomationWorkspaceScope): Promise<{
        automation: ZCodeAutomation;
        run: ZCodeAutomationRun;
    } | null>;
    listRuns(automationId: string, scope?: AutomationWorkspaceScope): Promise<ZCodeAutomationRun[]>;
    deleteRun(runId: string, scope?: AutomationWorkspaceScope): Promise<void>;
}
//# sourceMappingURL=automationService.d.ts.map