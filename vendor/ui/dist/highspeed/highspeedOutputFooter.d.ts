import type { HighspeedMessageMeta } from "@zcode/shared";
import type { HighspeedShareMetrics } from "@/highspeed/highspeedTurnStore.js";
export interface HighspeedOutputFooterTarget {
    cardId: string;
    metrics: HighspeedShareMetrics;
}
/** 由 footer 收口逻辑写回渲染单元的标记字段，宿主类型只需声明这两个可选字段。 */
export interface HighspeedOutputFooterMark {
    /** 同一 Highspeed cardId 对应的当前最后一个 turn；仅该组尾可展示来源 footer。 */
    showHighspeedOutputFooter?: true;
    /** 冷恢复时由同卡全部持久化 turn metadata 聚合出的可信分享参数。 */
    highspeedOutputFooterTarget?: HighspeedOutputFooterTarget;
}
interface HighspeedFooterUnit {
    visibleUserInputs: readonly {
        highspeed?: HighspeedMessageMeta;
    }[];
    assistantWorkRows: readonly {
        kind: string;
    }[];
}
/**
 * 给同一张卡覆盖的最后一个渲染单元打上 footer 标记。
 *
 * Bug 根因：footer 过去在单个 turn 内按 accelerated 判定，一张卡覆盖多轮时会重复显示。
 * 必须在虚拟化前按持久化 cardId 和过期时间统一收口，组尾才能随新 turn 与倒计时稳定后移。
 */
export declare function markHighspeedOutputFooterUnits<T extends HighspeedFooterUnit>(units: readonly T[], nowMs: number): (T & HighspeedOutputFooterMark)[];
export {};
//# sourceMappingURL=highspeedOutputFooter.d.ts.map