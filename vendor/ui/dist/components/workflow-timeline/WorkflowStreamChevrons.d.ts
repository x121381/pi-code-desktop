import type { CSSProperties } from "react";
import type { TimelineInk } from "./timeline-model.js";
/**
 * 流轨的 chevron（docs/dynamic-workflow/presentation.md「Stream rails」）：轨道在它可见跨度的正中断开
 * 一截 `STREAM_GAP`，缺口里站着一组 `›››`——三枚相距 5px、每枚 2.6 × 6.4、描边 1.35、圆头圆角，朝流的
 * 方向。墨在 chevron 上：`faint`（还什么都没过去）是 workflow-trace，`strong`（过去过、此刻没在过）是
 * workflow-trace-strong，`march`（两端都在跑，东西正在过）是警示色，三枚沿流向依次亮起
 * （`wf-stream-flow`，1.2s 一轮、相隔 0.15s）。轨道本身不动；动的只有 chevron。
 *
 * 画在 SVG 坐标里（卡的弧层、带的轨道层都是 SVG）；站头行的 DOM 轨道用 {@link StreamChevronsBox}
 * 包一层小 SVG。脊线竖着用，两枚、朝下。
 */
export declare const STREAM_GAP = 22;
export type StreamDirection = "right" | "left" | "down";
/** 一组 chevron 的路径（纯函数）：中心在 (x, y)，`count` 枚沿 `direction` 排开并朝它指。 */
export declare function streamChevronPaths(x: number, y: number, direction: StreamDirection, count?: number): string[];
export declare function StreamChevrons({ count, direction, ink, x, y, }: {
    x: number;
    y: number;
    ink: TimelineInk;
    direction?: StreamDirection;
    count?: number;
}): import("react/jsx-runtime").JSX.Element;
/** DOM 里用的一小块 SVG：中心贴在宿主的 (left, top)，宿主负责把自己的线在这里断开。 */
export declare function StreamChevronsBox({ count, direction, ink, style, }: {
    ink: TimelineInk;
    direction?: StreamDirection;
    count?: number;
    style?: CSSProperties;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=WorkflowStreamChevrons.d.ts.map