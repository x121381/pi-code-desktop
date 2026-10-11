import type { TimelineInk, WorkflowTimelineModel } from "@/components/workflow-timeline/timeline-model.js";
/**
 * 脊线的排布（docs/dynamic-workflow/presentation.md「The spine」）：把时间线模型翻译成**每一节**
 * 要画的竖轨，以及节与节之间的**接头行**。纯函数、只有下标与像素，没有 React、没有 DOM——渲染件
 * 照着画就行。
 *
 * 像提交图一样排：左边是轨道，右边是文字，两者不共用一列。轨道 t 的竖轨在 `x = 21 + pitch·t`，
 * 整根脊线的文字从同一列起（`39 + gutter`，`gutter = pitch·(T − 1)`，T 是最宽的带的轨道数）——站在
 * 哪条轨道只挪它的灯，不挪它的字。此前节头只给**自己**的轨道让路（`39 + 12·track`），别的轨道穿过
 * 这一节时就从站名上压过去；轨道多了，主线上的站名一个个被穿。
 *
 * 分叉与汇合发生在两站**之间**，所以各占一行接头（`SPINE_JOINT_PX`），而不是挤进相邻那一节的节头：
 * 每条带都有一行分叉挂在带首节之前、一行汇合挂在带末节之后。此前曲线画在带首节的顶上 13px、
 * 汇合站的顶上或带末节的**底**上——带从第一站起时分叉从清单之外落下来，带到最后一站时汇合画在
 * 末节药丸的下面，接回一条早已结束的主轨。
 *
 * 没有前驱的带，分叉行是**开口**的（`open`）：主轨不从上一站来，而是在行上方 4px 起一个圆头——一个根；
 * 没有汇合站的带，汇合行同样开口，主轨在行下方 4px 收住——一个汇点（卡上的 TAIL / STUB）。
 * Bug 原因（2026-09-24 实机）：第一版只在前驱 / 汇合站存在时才画接头行，strand 改为在自己的灯上
 * 起止；整个工作流就是一条带、每条 strand 只有一站时（四阶段两两并行），每条 strand 长度为零，
 * 脊线上只剩四枚悬空的灯。开口的接头行住在自己的行里，不会压到节头或药丸上，所以一律画出来。
 *
 * 一条 strand 的竖轨从分叉行的底到汇合行的顶。竖轨仍按节拆成上下两截与整节穿过的 `full`，随节的
 * 展开收起自己伸缩，不用量。
 */
/** 接头行的高度。 */
export declare const SPINE_JOINT_PX = 16;
/** 主线竖轨的 x（中心）。 */
export declare const SPINE_TRACK_X = 21;
/**
 * 一段竖轨：`above` = 节顶到灯，`below` = 灯到节底，`full` = 整节穿过。`stream` = 它是一条流轨的一半：
 * 在节边界让出 chevron 的缺口，`below` 那一半负责把 chevron 画在缺口里（presentation.md「The spine」）。
 */
export interface SpineRailPiece {
    track: number;
    ink: TimelineInk;
    position: "above" | "below" | "full";
    stream?: true;
}
/** 一行接头：主轨直穿（墨是跨过它的那条主线段的墨），每条分支一条曲线。 */
export interface SpineJoint {
    main: TimelineInk;
    branches: {
        track: number;
        ink: TimelineInk;
    }[];
    /** 开口：分叉行没有前驱（根）、汇合行没有汇合站（汇点）——主轨只在行外伸出一截短头。 */
    open?: true;
}
export interface SpineSection {
    rails: SpineRailPiece[];
    /** 挂在这一节**之前**的分叉行（这一节是某条带的首节）。 */
    fork?: SpineJoint;
    /** 挂在这一节**之后**的汇合行（这一节是某条带的末节）。 */
    merge?: SpineJoint;
}
export interface SpineLayout {
    /** 相邻两条轨道的间距。 */
    pitch: number;
    /** 文字列比没有带时多让出的宽度：`pitch·(T − 1)`；没有带时 0。 */
    gutter: number;
    sections: SpineSection[];
}
export declare function spineLayout(model: WorkflowTimelineModel): SpineLayout;
//# sourceMappingURL=workflowRunSpine.d.ts.map