import { type ReactNode, type RefObject } from "react";
import type { WorkflowTimelineModel } from "@/components/workflow-timeline/timeline-model.js";
import { useFillHeadTarget } from "@/components/workflow-timeline/WorkflowTimelineFills.js";
export declare function useSpineFillFrames(rootRef: RefObject<HTMLDivElement | null>, model: WorkflowTimelineModel): {
    /** 挂在列表根上的委托（没有补全时为空对象）。 */
    handlers: ReturnType<typeof useFillHeadTarget>["handlers"];
    /** 此刻画出的框（指针或焦点所在的头）。 */
    active: string | undefined;
    fresh: ReadonlySet<string>;
    frames: ReactNode;
};
//# sourceMappingURL=WorkflowRunFillFrames.d.ts.map