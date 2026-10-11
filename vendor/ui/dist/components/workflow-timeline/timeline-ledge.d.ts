import type { CSSProperties } from "react";
/**
 * 边檐的纯几何：一根轨道两端压缩。
 *
 * 时间线自由滚动；灯滚到视口边缘之外的站**折叠**到那一侧的边檐上——同一枚 10px 灯、16px 一枚、
 * 之间是同一种墨的小轨道段，落在视口边缘干净的底上。轨道行在檐旁渐隐 40px；药丸只在视口边界渐隐。
 * 折叠是不动点：边檐越宽（灯越多），压在它下面的站就越多，所以反复算到集合不再变化。
 *
 * 全部以视口坐标计（x = 站的灯心 − scrollLeft）。无 React、无 DOM。
 */
export declare const LEDGE_LAMP = 10;
export declare const LEDGE_PITCH = 16;
export declare const LEDGE_PAD = 8;
export declare const LEDGE_FADE = 40;
export declare const LEDGE_MAX_LAMPS = 3;
export interface TimelineFold {
    /** 折叠到左檐的站（升序）。 */
    left: number[];
    /** 折叠到右檐的站（升序）。 */
    right: number[];
}
export declare const NO_FOLD: TimelineFold;
/** 一侧边檐占的宽（含两侧内边距；0 枚灯 = 没有边檐）。 */
export declare function ledgeWidth(count: number): number;
/**
 * 折叠集：灯在「边檐 + 渐隐」之下的站；迭代到不动点。视口没量到（宽 0）时什么都不折。
 * `keep` 是镜头正飞向的站：视口在 `scrollTo` 之前量过，平滑滚动在飞的
 * 那几百毫秒里它按陈旧的 scrollLeft 算在视野外——可它正要进来，檐上闪一枚灯是误报，所以两侧都不收它。
 * `inset` 是有带时整根轨道的右移：灯跟着走，折叠的判据也跟着走。
 */
export declare function foldStations(count: number, scrollLeft: number, clientWidth: number, keep?: number, inset?: number): TimelineFold;
/** 边檐上露出的灯（最多三枚，靠内容的一端优先）与计数。 */
export declare function ledgeLamps(indexes: readonly number[], side: "left" | "right"): {
    shown: number[];
    more: number;
};
/**
 * 边檐到第一个开着的站之间的短轨道段的宽：左檐从檐的内缘到那站的灯前 6px；右檐从最后一个开着的
 * 站的**槽尾**（不是灯——否则会横穿它的站头文字）到檐的内缘。短于 6 不画。
 */
export declare function ledgeStubWidth(fold: TimelineFold, side: "left" | "right", scrollLeft: number, clientWidth: number, inset?: number): number;
/** 视口两侧各自是否还有内容在外面（左：滚过了；右：没滚到底）。 */
export interface EdgeOverflow {
    left: boolean;
    right: boolean;
}
/**
 * 滚动层的遮罩，分**两条横带**（用户修订：药丸只在真正的边界处渐隐，与自己那站的灯同进退）：
 *   - 轨道带（弧的空气 + 轨道行，高 `railBand`）：有檐的一侧檐下全透、再 40px 渐到不透——檐要落在
 *     干净的底上；没檐但溢出的一侧从视口边缘起 40px 渐隐（站头文字不硬切）。
 *   - 药丸带（其余高度）：只在视口边缘 40px 渐隐，而且只在那一侧真有内容在外面时。药丸不随灯折叠
 *     （两侧对称），檐下照亮，一直亮到边界。
 * 两层 mask 各占一条带（no-repeat，按位置 / 尺寸切开），默认 add 合成 = 并集。两侧都不溢出时没有遮罩。
 */
export declare function timelineMaskStyle(fold: TimelineFold, railBand: number, edges: EdgeOverflow): CSSProperties | undefined;
/** 滚动条拇指：长 = 视口² / 内容（不短于 24），位置按滚动比例；不溢出时没有。 */
export declare function scrollbarThumb(scrollLeft: number, clientWidth: number, scrollWidth: number): {
    left: number;
    width: number;
} | undefined;
/**
 * 镜头的一班飞行：`scrollTo(target)` 已发出、还没落地。飞行中 `index` 不折。
 * `from` 是上一次采到的 scrollLeft——平滑滚动只会单调靠近目标，所以「比上一次更远」就是用户接手了。
 */
export interface CameraFlight {
    index: number;
    /** 已按 `scrollWidth − clientWidth` 夹紧的落点。 */
    target: number;
    from: number;
}
/**
 * 一次 scroll 采样之后飞行还在不在：落地（±1px）或偏离（用户接手）即结束，否则记下这次位置继续飞。
 * 只由滚动位置决定，不用计时器——被用户中断的平滑滚动永远到不了目标，计时器兜底会让目标站错过折叠。
 */
export declare function flightAfterScroll(flight: CameraFlight | undefined, scrollLeft: number): CameraFlight | undefined;
/** 镜头：把一站滚到视口正中的 scrollLeft（左端不越 0）。边檐上的灯点了就走这条。 */
export declare function stationCameraLeft(index: number, clientWidth: number, inset?: number): number;
/**
 * 轨道段的查表键：**一对站**，不是起点。带里一站可以同时长出好几条段——
 * 主线的一条、分叉的一条、双线段的一条——按起点查会拿到先排到的那一条。
 */
export declare function railKey(from: number, to: number): string;
//# sourceMappingURL=timeline-ledge.d.ts.map