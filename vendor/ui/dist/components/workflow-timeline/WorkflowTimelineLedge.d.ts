import { type RefObject } from "react";
import type { StepRunStatus } from "@/components/workflow-graph/types.js";
import type { TimelineHole } from "./timeline-holes.js";
import type { TimelineRail, TimelineStation } from "./timeline-model.js";
import type { TimelineViewport } from "./use-timeline-viewport.js";
/**
 * 边檐与滚动条。
 *
 * 边檐：折叠到视口一侧的站，画成一排同一枚 10px 灯（16px 一枚），之间是那条边的墨色小轨道段，
 * 靠内容的一端一段短轨道接到第一个开着的站，远端是超出五枚时的 `+n`。每枚灯是按钮：点一下，
 * 镜头把那一站带回来。折叠的站在内容里不画——檐上那枚灯**就是**它。
 *
 * 滚动条：时间线底部 2px 一根，轨道 border 色、拇指 foreground-subtlest；静止时 opacity 0，指针在
 * 卡上或正在滚时露出，悬停轨道加粗到 4px；拇指可拖，点轨道翻页。原生滚动条隐藏。
 */
/** 站灯：`STATUS_DOT` 词汇表，running 外加 3px 光晕（呼吸）——它是画面上唯一发光的东西。 */
export declare function stationLampClass(status: StepRunStatus | undefined, 
/**
 * 留白灯（docs/dynamic-workflow/presentation.md「Holes on the timeline」）：开着 / 等着的留白是一枚
 * 1.5px 虚线、无填充的灯；等待时描边换警示色、外加 3px 常亮的光晕——**不搏动**，那里没有东西在跑。
 * 补全后就是普通的灯。三处画灯的地方（轨道行、带的灯层、边檐）都经这里，留白在哪都长一样。
 */
hole?: TimelineHole): string;
export declare function prefersReducedMotion(): boolean;
export declare function WorkflowLedge({ indexes, nameOf, onSelect, rails, side, stations, stubWidth, top, }: {
    side: "left" | "right";
    /** 折叠到这一侧的站（升序）。 */
    indexes: readonly number[];
    stations: readonly TimelineStation[];
    /** 相邻站之间的轨道段，按**一对站**索引（`railKey`）：带里一站会长出好几条段。 */
    rails: ReadonlyMap<string, TimelineRail>;
    /** 檐到第一个开着的站之间那段短轨道的宽；0 = 不画。 */
    stubWidth: number;
    /** 轨道行的顶（檐与灯同高）。 */
    top: number;
    nameOf: (index: number) => string;
    onSelect: (index: number) => void;
}): import("react/jsx-runtime").JSX.Element | null;
export declare function WorkflowTimelineScrollbar({ scrollRef, viewport, }: {
    scrollRef: RefObject<HTMLDivElement | null>;
    viewport: TimelineViewport;
}): import("react/jsx-runtime").JSX.Element | null;
//# sourceMappingURL=WorkflowTimelineLedge.d.ts.map