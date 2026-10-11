import type { BroadcastClaimLease, BroadcastMessage, IBroadcastService } from "@zcode/services";
import type { CodingPlanResetType } from "@zcode/shared";
import type { CodingPlanQuotaResetUiEntries, CodingPlanQuotaResetUiEntry } from "@/lib/codingPlanQuotaResetUi.js";
export interface CodingPlanQuotaResetAutomaticObservation {
    completedAt: number;
    /** 同一 renderer 生命周期内，用户由未登录进入登录态时递增的鉴权会话序号。 */
    authSessionSeq: number;
}
export interface CodingPlanQuotaResetAutomaticObservations {
    fiveHour: CodingPlanQuotaResetAutomaticObservation | null;
    week: CodingPlanQuotaResetAutomaticObservation | null;
}
/** 跨窗口已播记录：source + 类型 -> 已在任一窗口播放过自动完成提示的 used_at。 */
export interface CodingPlanQuotaResetAutoPlayedSlot {
    fiveHour: number | null;
    week: number | null;
}
export interface CodingPlanQuotaResetStoreState {
    authSessionSeq: number;
    codingPlanQuotaResetUiBySource: Record<string, CodingPlanQuotaResetUiEntries>;
    codingPlanQuotaResetAutomaticObservationsBySource: Record<string, CodingPlanQuotaResetAutomaticObservations>;
    codingPlanQuotaResetAutoPlayedBySource: Record<string, CodingPlanQuotaResetAutoPlayedSlot>;
}
/** 自动完成"多窗口只播一次"的跨窗口广播频道（state: 前缀符合跨窗口状态同步约定）。 */
export declare const CODING_PLAN_QUOTA_RESET_AUTO_PLAYED_CHANNEL = "state:codereset-autoplayed";
export interface CodingPlanQuotaResetAutoPlayedBroadcastPayload {
    sourceKey: string;
    resetType: CodingPlanResetType;
    completedAt: number;
}
export declare function buildCodingPlanQuotaResetAutoPlayClaimKey(sourceKey: string, resetType: CodingPlanResetType, completedAt: number): string;
export declare function parseCodingPlanQuotaResetAutoPlayedPayload(payload: unknown): CodingPlanQuotaResetAutoPlayedBroadcastPayload | null;
/**
 * 解析"自动完成已播"跨窗口广播；非本频道消息、本地回声与非法 payload 均返回 null。
 *
 * host 的 send 会先把消息本地回声给本窗口 Renderer（无 sourceWindowId）；
 * 只有 BroadcastHub 中转的跨窗口消息才带 sourceWindowId，本地回声必须忽略，
 * 否则自己刚广播的"已播放"会把自己的动画当场抑制掉。
 */
export declare function parseCodingPlanQuotaResetAutoPlayedBroadcastMessage(message: Pick<BroadcastMessage, "channel" | "payload" | "sourceWindowId">): CodingPlanQuotaResetAutoPlayedBroadcastPayload | null;
/**
 * 广播本窗口首次播放的自动完成 used_at，其他窗口收到后抑制同 used_at 的提示。
 */
export declare function broadcastCodingPlanQuotaResetAutoPlayed(broadcastService: Pick<IBroadcastService, "send">, sourceKey: string, resetType: CodingPlanResetType, completedAt: number): void;
export interface CodingPlanQuotaResetStoreUpdate {
    patch: Pick<CodingPlanQuotaResetStoreState, "codingPlanQuotaResetUiBySource" | "codingPlanQuotaResetAutomaticObservationsBySource" | "codingPlanQuotaResetAutoPlayedBySource">;
}
/**
 * 原子写入重置 UI 状态和自动完成的鉴权会话轨迹，避免 entry 与观察记录跨 render 不一致。
 *
 * status 观察和 Composer 播放资格必须分离。设置页 / Usage 页也会调用本函数，
 * 如果在这里直接写 played，就会在没有展示 Tooltip/撒花时提前消耗跨窗口播放资格。
 */
export declare function updateCodingPlanQuotaResetStoreState(state: CodingPlanQuotaResetStoreState, sourceKey: string, resetType: CodingPlanResetType, entry: CodingPlanQuotaResetUiEntry | null, authSessionSeq: number): CodingPlanQuotaResetStoreUpdate;
/**
 * 应用来自其他窗口的"已播放"广播：合并 played 记录，并把本窗口正在播放的
 * 同 used_at 自动完成 observedAt 置空（收起 Tooltip、阻止后续撒花补播）。
 */
export declare function applyCodingPlanQuotaResetAutoPlayedBroadcast(state: Pick<CodingPlanQuotaResetStoreState, "codingPlanQuotaResetUiBySource" | "codingPlanQuotaResetAutoPlayedBySource">, payload: CodingPlanQuotaResetAutoPlayedBroadcastPayload): Pick<CodingPlanQuotaResetStoreState, "codingPlanQuotaResetUiBySource" | "codingPlanQuotaResetAutoPlayedBySource">;
type CodingPlanQuotaResetAutoPlayState = Pick<CodingPlanQuotaResetStoreState, "codingPlanQuotaResetUiBySource" | "codingPlanQuotaResetAutoPlayedBySource">;
export interface CodingPlanQuotaResetAutoPlayReservation {
    sourceKey: string;
    resetType: CodingPlanResetType;
    completedAt: number;
    lease: BroadcastClaimLease;
}
export type CodingPlanQuotaResetAutoPlayReservationAttempt = {
    status: "reserved";
    reservation: CodingPlanQuotaResetAutoPlayReservation;
} | {
    status: "retry";
    retryAfterMs: number;
} | {
    status: "blocked";
};
/**
 * Composer 在播放自动完成提示前申请临时 reservation。
 *
 * reservation 与 played 提交必须分离。等待 Main 期间组件可能卸载或切换 source；
 * 此阶段只占用带 token 的临时 lease，不写 played、不广播，也不把 busy 误判为已播放。
 */
export declare function reserveCodingPlanQuotaResetAutoPlay(params: {
    broadcastService: Pick<IBroadcastService, "acquireClaim" | "releaseClaim">;
    readState: () => CodingPlanQuotaResetAutoPlayState;
    writeState: (updater: (state: CodingPlanQuotaResetAutoPlayState) => CodingPlanQuotaResetAutoPlayState) => void;
    sourceKey: string;
    resetType: CodingPlanResetType;
    completedAt: number;
}): Promise<CodingPlanQuotaResetAutoPlayReservationAttempt>;
/**
 * 组件确认仍 mounted、source/candidate 匹配并即将展示时提交 reservation。
 * 本函数同步写本地 played，再发送 Main commit 与 played 广播；同一 JS task 内不会穿插卸载。
 */
export declare function commitCodingPlanQuotaResetAutoPlay(params: {
    broadcastService: Pick<IBroadcastService, "commitClaim" | "send">;
    writeState: (updater: (state: CodingPlanQuotaResetAutoPlayState) => CodingPlanQuotaResetAutoPlayState) => void;
    reservation: CodingPlanQuotaResetAutoPlayReservation;
}): boolean;
export declare function releaseCodingPlanQuotaResetAutoPlay(params: {
    broadcastService: Pick<IBroadcastService, "releaseClaim">;
    reservation: CodingPlanQuotaResetAutoPlayReservation;
}): Promise<void>;
export interface CodingPlanQuotaResetStoreActions {
    setCodingPlanQuotaResetUiEntry: (sourceKey: string, resetType: CodingPlanResetType, entry: CodingPlanQuotaResetUiEntry | null, authSessionSeq: number) => void;
    reserveCodingPlanQuotaResetAutoPlay: (sourceKey: string, resetType: CodingPlanResetType, completedAt: number) => Promise<CodingPlanQuotaResetAutoPlayReservationAttempt>;
    commitCodingPlanQuotaResetAutoPlay: (reservation: CodingPlanQuotaResetAutoPlayReservation) => boolean;
    releaseCodingPlanQuotaResetAutoPlay: (reservation: CodingPlanQuotaResetAutoPlayReservation) => Promise<void>;
}
type CodingPlanQuotaResetStoreWriter = (updater: (state: CodingPlanQuotaResetStoreState) => Partial<CodingPlanQuotaResetStoreState>) => void;
/** 把重置状态 action 集中在本领域文件，避免全局 Store 再次膨胀。 */
export declare function createCodingPlanQuotaResetStoreActions(params: {
    broadcastService: Pick<IBroadcastService, "acquireClaim" | "commitClaim" | "releaseClaim" | "send">;
    readState: () => CodingPlanQuotaResetStoreState;
    writeState: CodingPlanQuotaResetStoreWriter;
}): CodingPlanQuotaResetStoreActions;
export {};
//# sourceMappingURL=codingPlanQuotaResetState.d.ts.map