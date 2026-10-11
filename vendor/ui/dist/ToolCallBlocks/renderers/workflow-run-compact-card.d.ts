import type { ReactNode } from "react";
import type { WorkflowRunCardSummary } from "@/ToolCallBlocks/shared.js";
/**
 * workflow run 的紧凑可点卡——CreateWorkflow 与 ResumeWorkflowRun 工具卡共享的「run 态第三态」。
 *
 * 整卡就是入口（DESIGN.md 的语义色 + 现有的 run 状态词汇表）：实测的可发现性失败正是
 * 因为入口曾经埋在展开后的卡体里。两个调用方只换 labelText 与 primaryText（create 用
 * 工作流名、resume 用 runId），状态点词与步数都由联接摘要实时驱动。
 *
 * `onOpen` 缺席即纯展示态：不加 role/tabIndex/hover——宿主只在确实有可打开的 run 时注入
 * 回调（`ToolCallBlockRenderContext.onOpenWorkflowRun` 的门控语义）。
 */
export declare function WorkflowRunCompactCard({ ariaLabel, icon, labelText, primaryText, primaryTitle, workflowRun, statusLabel, stepsLabel, onOpen, showIcon, children, }: {
    ariaLabel: string;
    icon: ReactNode;
    labelText: string;
    primaryText: string;
    primaryTitle?: string;
    workflowRun: WorkflowRunCardSummary;
    statusLabel: string;
    stepsLabel: string;
    onOpen: (() => void) | undefined;
    showIcon: boolean;
    /** 卡片下方的附加内容（如 ToolSnapshotFieldNotice），随卡渲染。 */
    children?: ReactNode;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=workflow-run-compact-card.d.ts.map