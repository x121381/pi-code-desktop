import type { ReactNode } from "react";
import type { LaneClass, StepRunStatus } from "@/components/workflow-graph/types.js";
export { agentColor, avatarColor } from "@/components/workflow-timeline/WorkflowAgentFace.js";
/**
 * 子代理药丸：带色头像 +
 * 名字 + 右侧状态标记。卡片的站下与侧栏的行都是它——同一个特性只有一枚药丸。
 *
 * 头像是瓦片脸（`WorkflowAgentFace`）：机身色按代理编号取九色环，表情读 status。
 * 工作区没有身份，所以没有颜色，只有终端字形。`pending` 与无状态逐像素相同（不变式 3）：
 * 没有标记、名字用次淡色、脸睡着。
 *
 * 可打开（`open` 在场）时整枚药丸就是按钮：悬停四件事同时落地（底色抬一级、头像色相的
 * 内描边、头像放大加深、尾槽里 ↗ 顶替状态标记），点一下直接开那个子代理的 transcript。不可
 * 打开的药丸没有悬停态；`inertTitle` 说明为什么。
 *
 * 尾槽（`wf-pill-tail`）是状态标记与 ↗ 共用的一格 14px：两者叠在同一格里，悬停时标记缩出、
 * 箭头缩入。所以子代理药丸与脚本药丸的状态标记落在同一条右缘上——↗ 从不占自己的位置
 * （↗ 隐身时不能仍占位：否则子代理的标记会比工作区的偏左一格）。
 */
/** 车道字形：agent 车道是瓦片脸（编号定色、status 定表情），工作区 / 未解析车道是图标。 */
export declare function LaneGlyph({ laneClass, className, avatarIndex, name, status, }: {
    laneClass: LaneClass;
    className?: string;
    name: string;
    avatarIndex?: number | undefined;
    status?: StepRunStatus | undefined;
}): import("react/jsx-runtime").JSX.Element;
/** 状态标记：转圈 / 对勾 / 叉；`pending` 与 undefined 没有标记。状态变化时新标记弹入；可打开的药丸悬停时它让位给 ↗。 */
export declare function PillStatusMark({ status }: {
    status: StepRunStatus | undefined;
}): import("react/jsx-runtime").JSX.Element | null;
/** 药丸可打开时的接线：点击回调、无障碍标签、↗ 的 testid 与数据属性（侧栏行用它们钉住实例）。 */
export interface WorkflowAgentPillOpen {
    onOpen: () => void;
    label: string;
    testId?: string;
    data?: Record<`data-${string}`, string>;
}
export declare function WorkflowAgentPill({ children, avatarIndex, className, enterDelayMs, inertTitle, laneClass, name, open, size, status, title, trailing, }: {
    avatarIndex?: number | undefined;
    /** 入场延迟（一列药丸依次落地，每枚错 30 ms）；缺席即立刻。 */
    enterDelayMs?: number;
    /** 已本地化的显示名（运行时名 > 车道显示名）。 */
    name: string;
    laneClass: LaneClass;
    status: StepRunStatus | undefined;
    title?: string;
    className?: string;
    /** 在场即整枚药丸是按钮（回调的存在即门控）。 */
    open?: WorkflowAgentPillOpen;
    /** 不可打开时的提示（「子代理启动后才有会话记录」）；缺席时退回 title / name。 */
    inertTitle?: string;
    /** 名字之后、状态标记之前的附属信息（侧栏行的活动与计数）。 */
    children?: ReactNode;
    /** 状态标记之后的控件。 */
    trailing?: ReactNode;
    /** `row`（24 px、静止时没有底色、悬停才成药丸）给侧板名单的两列；缺省 32 px。 */
    size?: "md" | "row";
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=WorkflowAgentPill.d.ts.map