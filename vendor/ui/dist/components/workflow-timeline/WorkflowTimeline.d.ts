import type { TimelinePill, TimelineStation, WorkflowTimelineModel } from "./timeline-model.js";
import type { TimelineFill } from "./timeline-holes.js";
export { STATION_GAP, STATION_PITCH, STATION_WIDTH, timelineWidth } from "./timeline-geometry.js";
/**
 * 时间线的整体高度（弧道 + 轨道行 + 站台行 + 最高的一列药丸）。轮尾摘要展开 /
 * 收起时把外框的高度在两个值之间过渡，所以它必须能在渲染之外算出来——行的排布因此是
 * `timeline-geometry.ts` 里的纯函数。末尾 8px 留白是滚动条的家（药丸下 6px、2px 一根，
 * 悬停 4px）——它贴着底缘叠在留白上，不改高度。
 */
export declare function timelineHeight(model: WorkflowTimelineModel): number;
/** 药丸依次落地的间隔（与设计画布同值）。 */
export declare const PILL_STAGGER_MS = 30;
export interface WorkflowTimelineProps {
    model: WorkflowTimelineModel;
    className?: string;
    /** 点一个站；缺席即站头不是控件——点击冒泡给宿主（轮尾摘要的整块开关）。 */
    onSelectStation?: (station: TimelineStation) => void;
    /**
     * 点名册站的「还有 n 个」那一行：开 run 详情、落到这一站。与站头的
     * `onSelectStation` 分开门控：轮尾摘要里站头仍是整块开关的一部分，那一行
     * 却是一扇门。缺席即那一行是静态的。
     */
    onOpenMore?: (station: TimelineStation) => void;
    /** 点一枚药丸（有会话开 transcript，没有开占位）；缺席即不可点。 */
    onOpenPill?: (pill: TimelinePill) => void;
    /**
     * 点脚本药丸：开整个 run 的脚本 transcript，
     * 落到这一站；缺席即脚本药丸不可点。与 `onOpenPill` 各自门控各自的车道。
     */
    onOpenWorkspace?: (pill: TimelinePill) => void;
    /**
     * 点一次补全的头（docs/dynamic-workflow/presentation.md「Holes on the timeline」）：开侧板、落到补全的
     * 标题（它写下的第一站）。缺席即头不是控件。
     */
    onOpenFill?: (fill: TimelineFill) => void;
}
export declare const WorkflowTimeline: import("react").MemoExoticComponent<({ className, model, onOpenFill, onOpenMore, onOpenPill, onOpenWorkspace, onSelectStation, }: WorkflowTimelineProps) => import("react/jsx-runtime").JSX.Element | null>;
//# sourceMappingURL=WorkflowTimeline.d.ts.map