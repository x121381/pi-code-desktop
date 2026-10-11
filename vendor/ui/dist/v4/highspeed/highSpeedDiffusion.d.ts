export declare const HIGHSPEED_DIFFUSION_DURATION_MS = 1400;
export declare const HIGHSPEED_MODEL_SWITCH_START_PROGRESS = 0.8;
interface HighSpeedDiffusionDistanceInput {
    height: number;
    width: number;
    x: number;
    y: number;
}
/**
 * 解析 sRGB 颜色的 hex（3/4/6/8 位）或 `rgb()`/`rgba()` 序列化，忽略透明度；
 * 其他颜色函数返回 null，避免把 `oklch()` 等的分量误读为 RGB 通道。
 */
export declare function parseHighSpeedCanvasColor(value: string): readonly [number, number, number] | null;
/**
 * 把 CSS 颜色 token 交给 Canvas 规范化后解析为 RGB；token 缺失或 Canvas 无法解析时返回兜底色。
 *
 * Bug 根因：生产构建由 Lightning CSS 压缩颜色（如 `#ffffff` → `#fff`，也可能改写为颜色名），
 * 旧的手写解析只认 6 位 hex，失败后落回深色兜底，浅色主题的扩散马赛克因此显示为深色。
 * 回归约束：Canvas 对无法解析的值（如 `var()`，CSS.supports 却会接受）静默忽略并保留旧
 * fillStyle，不能用单次赋值后的读数判定；这里先后以两种不同哨兵色打底各赋值一次，两次读数
 * 一致才说明赋值被接受，否则会把默认黑色或上一个 token 的颜色当成本次结果。
 */
export declare function resolveHighSpeedCanvasColor(context: Pick<CanvasRenderingContext2D, "fillStyle">, value: string, fallback: readonly [number, number, number]): readonly [number, number, number];
export declare function resolveHighSpeedDiffusionProgress(elapsedMs: number): number;
export declare function shouldCompleteHighSpeedDiffusion(progress: number): boolean;
export declare function shouldStartHighSpeedModelSwitch(progress: number): boolean;
export declare function resolveHighSpeedDiffusionDistance({ height, width, x, y, }: HighSpeedDiffusionDistanceInput): number;
export {};
//# sourceMappingURL=highSpeedDiffusion.d.ts.map