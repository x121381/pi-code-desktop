import type { IBroadcastService } from "@zcode/services";
import type { OAuthProviderId, UserInfo } from "@zcode/shared";
import type { CodingPlanResetType } from "@zcode/shared";
import type { CodePreviewSettings } from "@/lib/codePreviewSettings.js";
import type { CodingPlanQuotaResetUiEntries, CodingPlanQuotaResetUiEntry } from "@/lib/codingPlanQuotaResetUi.js";
import { type CodingPlanQuotaResetAutomaticObservations, type CodingPlanQuotaResetAutoPlayReservation, type CodingPlanQuotaResetAutoPlayReservationAttempt, type CodingPlanQuotaResetAutoPlayedSlot } from "@/store/codingPlanQuotaResetState.js";
import type { Theme } from "../useTheme.js";
import { type InterfaceMode } from "@/lib/interfaceMode.js";
export type LoginEntryPurpose = "app-login";
export type { CodePreviewSettings } from "@/lib/codePreviewSettings.js";
export { DEFAULT_CODE_PREVIEW_SETTINGS } from "@/lib/codePreviewSettings.js";
export type LoginEntryAttemptStatus = "requested" | "waiting" | "succeeded" | "cancelled" | "failed";
export interface LoginEntryAttempt {
    id: number;
    providerId?: OAuthProviderId;
    purpose?: LoginEntryPurpose;
    status: LoginEntryAttemptStatus;
}
export interface ZCodeState {
    /** 展示详情偏好，不改变 Agent 权限或执行能力。 */
    interfaceMode: InterfaceMode;
    setInterfaceMode: (mode: InterfaceMode) => void;
    /** 当前主题 */
    theme: Theme;
    setTheme: (theme: Theme) => void;
    /** 当前语言 */
    locale: string;
    setLocale: (locale: string) => void;
    /** 代码预览设置 */
    codePreviewSettings: CodePreviewSettings;
    setCodePreviewSettings: (patch: Partial<CodePreviewSettings>) => void;
    /** UI 根 rem 字号（px） */
    uiFontSizePx: number;
    setUiFontSizePx: (fontSizePx: number) => void;
    /** 是否启用性能模式 */
    performanceMode: boolean;
    setPerformanceMode: (enabled: boolean) => void;
    /** 是否启用任务通知（桌面通知；提示音由子开关控制） */
    notificationEnabled: boolean;
    setNotificationEnabled: (enabled: boolean) => void;
    /** 是否启用任务通知声音（依附于任务通知总开关） */
    notificationSoundEnabled: boolean;
    setNotificationSoundEnabled: (enabled: boolean) => void;
    /** 当前用户信息 */
    user: UserInfo | null;
    /** 用户由未登录进入登录态时递增；连接额外 provider 不会误判为重新登录。 */
    authSessionSeq: number;
    setUser: (user: UserInfo | null) => void;
    /** 启动阶段是否仍在恢复 OAuth 登录态 */
    isRestoringOAuthSession: boolean;
    setIsRestoringOAuthSession: (restoring: boolean) => void;
    /** OAuth 回调错误（Root 层写入，统一登录入口读取） */
    oauthError: string | null;
    setOAuthError: (error: string | null) => void;
    oauthPollingActive: boolean;
    setOAuthPollingActive: (active: boolean) => void;
    oauthSuccessSeq: number;
    lastOAuthSuccessProvider: OAuthProviderId | null;
    markOAuthSuccess: (provider?: OAuthProviderId) => void;
    apiKeyLoginSuccessSeq: number;
    lastApiKeyLoginModel: string | null;
    markApiKeyLoginSuccess: (preferredModel?: string | null) => void;
    /** 请求打开统一登录入口，可携带需要自动发起登录/连接的 provider */
    loginEntryRequest: {
        id: number;
        providerId?: OAuthProviderId;
        purpose?: LoginEntryPurpose;
    } | null;
    /** 当前统一登录尝试；购买等后续动作通过 id 只续接自己发起的 OAuth。 */
    loginEntryAttempt: LoginEntryAttempt | null;
    requestLoginEntry: (providerId?: OAuthProviderId, purpose?: LoginEntryPurpose) => number;
    clearLoginEntryRequest: (requestId?: number) => void;
    markLoginEntryAttemptStatus: (requestId: number, status: Exclude<LoginEntryAttemptStatus, "requested">) => void;
    /** Coding Plan 额度重置 UI 状态；entry/观察记录只在当前窗口内共享，不持久化。 */
    codingPlanQuotaResetUiBySource: Record<string, CodingPlanQuotaResetUiEntries>;
    /** 自动/运营完成首次被观察时所属的鉴权会话，用于区分同会话后挂载和重新登录。 */
    codingPlanQuotaResetAutomaticObservationsBySource: Record<string, CodingPlanQuotaResetAutomaticObservations>;
    /** 自动完成提示"多窗口只播一次"的已播 used_at 记录；窗口内存态，可被广播合并。 */
    codingPlanQuotaResetAutoPlayedBySource: Record<string, CodingPlanQuotaResetAutoPlayedSlot>;
    /** 写入服务端 status / 手动 use 对账后的状态；entry 为 null 表示清空该类型。 */
    setCodingPlanQuotaResetUiEntry: (sourceKey: string, resetType: CodingPlanResetType, entry: CodingPlanQuotaResetUiEntry | null, authSessionSeq: number) => void;
    /** Composer 展示前申请临时 reservation；此阶段不写 played。 */
    reserveCodingPlanQuotaResetAutoPlay: (sourceKey: string, resetType: CodingPlanResetType, completedAt: number) => Promise<CodingPlanQuotaResetAutoPlayReservationAttempt>;
    /** 组件仍有效且即将展示时提交 reservation、played 与广播。 */
    commitCodingPlanQuotaResetAutoPlay: (reservation: CodingPlanQuotaResetAutoPlayReservation) => boolean;
    /** 组件失效时释放尚未 commit 的 reservation。 */
    releaseCodingPlanQuotaResetAutoPlay: (reservation: CodingPlanQuotaResetAutoPlayReservation) => Promise<void>;
    /** 手动请求打开 onboarding 弹窗 */
    newUserOnboardingOpen: boolean;
    setNewUserOnboardingOpen: (open: boolean) => void;
    onboardingDialogRequested: boolean | "migration";
    requestOnboardingDialog: (entry?: "migration") => void;
    clearOnboardingDialogRequest: () => void;
}
/**
 * 创建 Zustand store，连接广播服务实现跨窗口状态同步
 *
 * @param broadcastService - 广播服务。Desktop 走 RPC，Web 可传 no-op 实现
 */
export declare function createZCodeStore(broadcastService: IBroadcastService, options?: {
    initialIsRestoringOAuthSession?: boolean;
}): import("zustand").UseBoundStore<import("zustand").StoreApi<ZCodeState>>;
export type ZCodeStore = ReturnType<typeof createZCodeStore>;
//# sourceMappingURL=index.d.ts.map