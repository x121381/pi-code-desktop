import { type AppSettings, type OffPeakCodingPlanSupport, type OffPeakTaskCreateResult, type OffPeakTakeNumberAvailability, type ZCodeOffPeakTask, type ModelSelection } from "@zcode/shared";
import type { ICodingPlanSubscriptionService, IOffPeakTaskService, OffPeakClientConfig } from "@zcode/services";
export interface CreateOffPeakTaskInput {
    title: string;
    prompt: string;
    /** 权限四档（build/edit/plan/yolo）；类型收窄在服务端入参处完成。 */
    permissionMode: string;
    modelSelection: ModelSelection;
    workspacePath: string;
    workspaceIdentity?: string;
}
export interface UpdateOffPeakTaskInput {
    title?: string;
    prompt?: string;
    permissionMode?: string;
    modelSelection?: ModelSelection | null;
}
/** New task 页模板卡点击后携带到 Automations 创建表单的预填草稿（模板=预填）。 */
export interface OffPeakCreateDraft {
    title?: string;
    prompt?: string;
    telemetrySource?: {
        eventRegion: "app.session" | "app.automations";
        templateId: string;
    };
}
/** availability 的请求状态与服务端额度快照分离；只有 ready + canTakeNumber=true 才能放行。 */
export type OffPeakTakeNumberAvailabilityStatus = "idle" | "loading" | "ready" | "error";
interface OffPeakTaskState {
    tasks: ZCodeOffPeakTask[];
    loading: boolean;
    error: string | null;
    operationId: string | null;
    /** 灰度配置：null=未加载。未命中/关闭时入口整体不渲染。 */
    grayConfig: OffPeakClientConfig | null;
    /** 当前 selected provider/connection 的脱敏凭证支持快照；不含 JWT/API Key。 */
    codingPlanSupport: OffPeakCodingPlanSupport | null;
    /** 服务端取号额度即时快照；null=尚无成功响应。 */
    takeNumberAvailability: OffPeakTakeNumberAvailability | null;
    /** loading/idle/error 均禁入，避免把依赖异常误当成可创建。 */
    takeNumberAvailabilityStatus: OffPeakTakeNumberAvailabilityStatus;
    /** New task 页横幅本次会话是否已被用户关闭（关闭后下次登录/重启再开）。 */
    newTaskBannerDismissed: boolean;
    /** 模板卡→创建表单的预填草稿（跨视图导航一次性携带）。 */
    pendingCreateDraft: OffPeakCreateDraft | null;
    initialize(deps: {
        offPeakTaskService: IOffPeakTaskService;
        codingPlanSubscriptionService: ICodingPlanSubscriptionService;
    }): Promise<void>;
    refresh(service: IOffPeakTaskService): Promise<void>;
    refreshCodingPlanSupport(service: IOffPeakTaskService, freshnessKey?: string): Promise<void>;
    refreshTakeNumberAvailability(service: IOffPeakTaskService): Promise<void>;
    createTask(input: CreateOffPeakTaskInput, service: IOffPeakTaskService): Promise<OffPeakTaskCreateResult>;
    updateTask(offPeakTaskId: string, input: UpdateOffPeakTaskInput, service: IOffPeakTaskService): Promise<boolean>;
    pauseTask(offPeakTaskId: string, service: IOffPeakTaskService): Promise<void>;
    continueTask(offPeakTaskId: string, service: IOffPeakTaskService): Promise<void>;
    cancelTask(offPeakTaskId: string, service: IOffPeakTaskService): Promise<void>;
    deleteTask(offPeakTaskId: string, service: IOffPeakTaskService): Promise<void>;
    deleteHistory(offPeakTaskId: string, service: IOffPeakTaskService): Promise<void>;
    dismissNewTaskBanner(): void;
    /** 模板卡点击：暂存预填草稿供 Automations 创建表单消费（consume 后清空）。 */
    setPendingCreateDraft(draft: OffPeakCreateDraft): void;
    consumePendingCreateDraft(): OffPeakCreateDraft | null;
}
/** support 必须仍对应 renderer 当前选择；切换连接后的旧 true 快照不能短暂放开创建。 */
export declare function isCurrentOffPeakCodingPlanSupported(support: OffPeakCodingPlanSupport | null, settings: Pick<AppSettings, "providerFamilyConnectionSelections" | "providerFamilyDomain"> | null | undefined): boolean;
/** 服务端 3103（取号超限）只按结构化分类识别，不再解析跨 RPC 的错误文本。 */
export declare function isOffPeakQuotaError(result: OffPeakTaskCreateResult | null | undefined): boolean;
export type OffPeakCreateErrorMessageId = "offPeak.error.quota" | "offPeak.error.unavailable" | "offPeak.error.generic";
/** 创建失败只按服务端明确业务码映射；原始 RPC 文本仅留日志，不直接展示给用户。 */
export declare function resolveOffPeakCreateErrorMessageId(result: OffPeakTaskCreateResult | null | undefined): OffPeakCreateErrorMessageId;
export declare const useOffPeakTaskStore: import("zustand").UseBoundStore<import("zustand").StoreApi<OffPeakTaskState>>;
export {};
//# sourceMappingURL=offPeakTaskStore.d.ts.map