import { type ReactNode } from "react";
import type { ToolCallCreateWorkflowDisplay } from "@zcode/shared/zcode-protocol-v4";
import type { WorkflowDraftPosition } from "@/ToolCallBlocks/shared.js";
/**
 * 编译反馈行在 ToolLayout 各槽位里说的话。
 * 从 `create-workflow.tsx` 拆出（oxlint max-lines 400 门，同 `createWorkflowInput.ts` 先例）。
 *
 * 只用行已有的槽位——种类词、名字、细节、状态——不往对话里加新元素：上一轮通知重设计在真机里被判
 * 「花」，正是因为引入了新的视觉语法。
 */
interface WorkflowDraftRowSlots {
    /** 细节槽：「第 n 稿」。 */
    secondaryText: ReactNode | undefined;
    /** 状态词「n 处待修正 · 未运行」，编不过时才有。 */
    statusLabel: ReactNode | undefined;
    /** 状态词前的空环灯，编不过时才有。 */
    statusIndicator: ReactNode | undefined;
    /** 悬停提示：那句话 + 逐条诊断；编不过时才有。 */
    statusTooltip: string | undefined;
    /** 在途行（校验中的卡片表头）从第 2 稿起写在细节位的稿号文字。 */
    inFlightOrdinalText: string | undefined;
}
interface WorkflowDraftRowInput {
    draft: WorkflowDraftPosition | undefined;
    compileErrors: boolean;
    /** 在途行（编写、待确认）：第 2 稿起才编号，第 1 稿不预告还会有第 2 稿。 */
    inFlight: boolean;
    errorCount: number;
    diagnostics: readonly {
        line: number;
        column: number;
        message: string;
    }[];
    saved: boolean;
}
export declare function useWorkflowDraftRowSlots({ draft, compileErrors, inFlight, errorCount, diagnostics, saved, }: WorkflowDraftRowInput): WorkflowDraftRowSlots;
/**
 * 反馈行展开后的内容：脚本（带行号，被诊断点名的行号着警示色）、编译反馈卡；没有 display 时退回
 * 纯文本输出。待确认行复用同一块（那时没有诊断，只有脚本）。
 */
export declare function WorkflowFeedbackContent({ display, fallbackOutputText, saved, scriptText, }: {
    display: ToolCallCreateWorkflowDisplay | null;
    fallbackOutputText: string | null;
    saved: boolean;
    scriptText: string | undefined;
}): import("react/jsx-runtime").JSX.Element;
/**
 * 细节槽里要不要写稿号：编不过的行总是写（宿主给了位置时）；在途行从第 2 稿起写。
 * 运行卡、启动摘要与确认窗不走这里，永远不带稿号。
 */
export declare function workflowDraftOrdinalShown(draft: WorkflowDraftPosition | undefined, phase: {
    compileErrors: boolean;
    inFlight: boolean;
}): number | undefined;
export declare function WorkflowDraftOrdinal({ ordinal }: {
    ordinal: number;
}): import("react/jsx-runtime").JSX.Element;
/**
 * 空环灯：形状说「什么都没跑」，颜色说注意力是否还悬着（最新一稿警示色，有更新的一稿后褪成中性）。
 * `wf-lamp` 让颜色的变化走过渡，而不是一跳。
 */
export declare function WorkflowDraftLamp({ superseded }: {
    superseded: boolean;
}): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=workflow-draft-row.d.ts.map