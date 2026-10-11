import { type IntlInstance } from "@/i18n/IntlProvider.js";
import type { ToolCallBlockRenderContext } from "@/ToolCallBlocks/shared.js";
export interface OffPeakCreateTaskSummary {
    offPeakTaskId?: string;
    title?: string;
    status?: string;
    queuePosition?: number;
}
export declare function isOffPeakCreateToolCall(toolCall: ToolCallBlockRenderContext["toolCallNode"]["toolCall"]): boolean;
export declare function readOffPeakCreateTaskOutputSummary(value: unknown): OffPeakCreateTaskSummary | null;
export declare function readOffPeakCreateTaskSummary(toolCall: ToolCallBlockRenderContext["toolCallNode"]["toolCall"]): OffPeakCreateTaskSummary | null;
/** 卡片第二行：创建时位次快照优先，缺位次回退「已加入闲时队列」文案。 */
export declare function describeOffPeakCardStatus(task: OffPeakCreateTaskSummary, intl: IntlInstance): string;
export declare function OffPeakCreateTaskCard({ task, onOpenAutomationsMain, }: {
    task: OffPeakCreateTaskSummary;
    onOpenAutomationsMain?: (automationId?: string, automationTab?: "scheduled" | "idle") => void;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=offpeak-create.d.ts.map