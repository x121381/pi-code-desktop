export interface ShareHeaderMeasurements {
    /** 分享 Header shell 的宽度。 */
    shellWidth: number;
    /** 内容 rail 左右边缘到 shell 边缘的距离。 */
    railContentLeft: number;
    railContentRight: number;
    brandWidth: number;
    titleContentWidth: number;
    /** 主题按钮与完整继续 CTA 的总宽度。 */
    continueWidth: number;
    /** 主题按钮与紧凑继续 CTA 的总宽度。 */
    compactContinueWidth?: number;
    /** 右侧区域是否包含继续 CTA；只读分享仍会保留主题按钮。 */
    hasContinueAction?: boolean;
    gap?: number;
    /** 宽屏锚点距视口边缘的内边距。 */
    edgePadding?: number;
    /** 两侧元素进入连续位移动画前必须保留的安全间距。 */
    minClearance?: number;
    /** 完整 CTA 至少要为可见标题保留的宽度。 */
    minTitleWidth?: number;
}
export interface ShareHeaderView {
    /** 0 是内容栏内联位置，1 是视口两侧锚定位置。 */
    progress: number;
    brandLeft: number;
    titleLeft: number;
    titleWidth: number;
    continueRight: number;
    titleTruncated: boolean;
    continueVisible: boolean;
    continueCompact: boolean;
}
/**
 * 计算分享 Header 的连续几何位置。
 *
 * 之前这里返回 inline/rail-aligned 两个离散布局，品牌和 CTA 会在临界宽度
 * 一次性从 flex 流切到绝对定位。现在用内容栏与视口边缘之间的可用 gutter
 * 推导 progress，让三个元素沿同一条轨道连续移动；当 gutter 仍足够容纳
 * 对应元素时保持宽屏外侧锚点，只有 gutter 不足后才开始向内容栏回收。
 */
export declare function resolveShareHeaderView({ shellWidth, railContentLeft, railContentRight, brandWidth, titleContentWidth, continueWidth, compactContinueWidth, hasContinueAction, gap, edgePadding, minClearance, minTitleWidth, }: ShareHeaderMeasurements): ShareHeaderView;
