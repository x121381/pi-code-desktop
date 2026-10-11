import type { CSSProperties } from "react";
export interface ScrollMetrics {
    clientHeight: number;
    scrollHeight: number;
    scrollTop: number;
}
export interface ScrollMaskState {
    showBottom: boolean;
    showTop: boolean;
}
export declare const EMPTY_SCROLL_MASK_STATE: ScrollMaskState;
export declare function resolveVerticalScrollMaskState({ clientHeight, scrollHeight, scrollTop, }: ScrollMetrics): ScrollMaskState;
export declare function getVerticalScrollMaskStyle({ showBottom, showTop, }: ScrollMaskState): CSSProperties | undefined;
//# sourceMappingURL=scrollMask.d.ts.map