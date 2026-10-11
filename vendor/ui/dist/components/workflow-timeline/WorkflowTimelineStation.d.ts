import type { ReactNode } from "react";
import type { TimelineRail, TimelineStation } from "./timeline-model.js";
import { type TimelineLayout } from "./timeline-geometry.js";
import type { TypewriterState } from "./use-typewriter.js";
import { type FillSlide } from "./use-fill-growth.js";
/**
 * 站头：名字 + 元数据，一枚没有背景的
 * 药丸。没有带时它排在轨道行上、灯的右边；有带时它搬到站台行，
 * 灯留在自己那条轨道上——两处的标记完全一样，所以从 `WorkflowTimeline.tsx` 拆出来共用一份。
 *
 * 不可点的站头是 `span` 而不是禁用的 `button`：浏览器对禁用控件不派发
 * click，整块开关就收不到；span 没有语义，点击照常冒泡。
 */
export declare function StationHead({ caret, foldClass, name, onSelect, station, title, }: {
    station: TimelineStation;
    name: string;
    /** 草稿里跟着笔走的光标；其余时候 null。 */
    caret: ReactNode;
    foldClass: string;
    title: string;
    /** 缺席即站头不是控件——点击冒泡给宿主（轮尾摘要的整块开关）。 */
    onSelect?: () => void;
}): import("react/jsx-runtime").JSX.Element;
interface RowProps {
    stations: readonly TimelineStation[];
    /** 补全的生长（`use-fill-growth.ts`）：下标大于 `after` 的站带 `wf-slide`，从 −shift 滑到位。 */
    slide?: FillSlide;
    /** 站的全名，按下标；草稿里笔只写出前几个字。 */
    fullNames: readonly string[];
    folded: ReadonlySet<number>;
    titleOf: (station: TimelineStation) => string;
    onSelectStation?: (station: TimelineStation) => void;
}
/**
 * 轨道行（没有带时）：站头（灯 + 名字 + 元数据）与到下一站的轨道段，一站一格。折到檐上的站只留
 * 轨道段；药丸列不折（用户修订：两侧对称）——它们只随滚动走，在视口真正的边界处渐隐。
 */
export declare function WorkflowStationRow({ draft, folded, fresh, fullNames, onSelectStation, pen, rails, slide, stations, tailStub, titleOf, top, width, }: RowProps & {
    /** 相邻两站之间的轨道段，按 `railKey` 查。 */
    rails: ReadonlyMap<string, TimelineRail>;
    draft: boolean;
    pen: TypewriterState;
    top: number;
    width: number;
    /** 末站是尾巴留白：`open` 在它之后画 40px 淡出的虚线残段，`filled` 只留余地。 */
    tailStub?: "open" | "filled";
    /** 刚接进 run 的补全所写的站：灯落地、轨道段长出（`wf-land` / `wf-rail-grow`）。 */
    fresh?: ReadonlySet<string>;
}): import("react/jsx-runtime").JSX.Element;
/**
 * 站台行：有带时站头一律搬到轨道下面
 * 这一行，灯留在自己的轨道上，分支轨道的站由一条点状引线接回名字——主线的站不需要，它的灯就在
 * 名字正上方。草稿永远没有带，所以这里不必管笔。
 */
export declare function WorkflowStationPlatform({ folded, fullNames, layout, onSelectStation, slide, stations, titleOf, }: RowProps & {
    layout: TimelineLayout;
}): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=WorkflowTimelineStation.d.ts.map