import { type CSSProperties } from "react";
import type { WorkflowTimelineModel } from "./timeline-model.js";
/**
 * 补全的生长（docs/dynamic-workflow/presentation.md「Holes on the timeline」的「Growth」）：补全接进 run 时
 * 插入列右侧的站按插入宽度滑开——一段 320ms 的 transform，播完即落在新位置（新位置就是布局位置，
 * 动画只从 −宽度 起步）。新站自己以 `wf-land` / `wf-rail-grow` 落地、区域两秒新鲜，都在别处。
 *
 * 模型没有时间也没有历史，所以「插入了几站」由组件对比前后两帧得出：新出现的补全头 + 站数增量。
 * 首帧没有前一帧，冷开一条已补全的时间线不滑。镜头不动：补全的第一站与留白同下标、同 x，
 * `scrollLeft` 不变就是「镜头停在等待站的 x 上」。reduced-motion 下 `.wf-slide` 的动画为 none，新行直接出现。
 */
export declare const SLIDE_MS = 320;
export interface FillSlide {
    /** 下标大于它的站滑动。 */
    after: number;
    /** 插入的宽度（px）：站从 −shift 滑到 0。 */
    shift: number;
    /** 每次生长换一个 key，让连着两次生长各播一遍。 */
    key: number;
}
interface SeenShape {
    key: string;
    stations: number;
    fills: readonly string[];
}
/** 前一帧到这一帧长出了什么：新的补全头且站数增加才算生长。 */
export declare function fillGrowth(previous: Pick<SeenShape, "stations" | "fills">, model: WorkflowTimelineModel): Pick<FillSlide, "after" | "shift"> | undefined;
export declare function useFillGrowth(model: WorkflowTimelineModel): FillSlide | undefined;
export declare function slideClass(index: number, slide: FillSlide | undefined): string | undefined;
export declare function slideStyle(index: number, slide: FillSlide | undefined): CSSProperties;
export {};
//# sourceMappingURL=use-fill-growth.d.ts.map