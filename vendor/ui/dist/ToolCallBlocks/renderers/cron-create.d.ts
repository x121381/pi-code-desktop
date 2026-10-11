import type { ZCodeAutomationScheduleRule } from "@zcode/shared";
import type { ToolCallBlockRenderContext } from "@/ToolCallBlocks/shared.js";
export interface CronCreateAutomationSummary {
    automationId?: string;
    title?: string;
    cronExpr?: string;
    /** 权威重复规则；卡片优先用它展示 cron 无法表达的真实间隔（如每50小时、每40天）。 */
    scheduleRule?: ZCodeAutomationScheduleRule;
    recurring?: boolean;
    maxRuns?: number;
}
export declare function isCronCreateToolCall(toolCall: ToolCallBlockRenderContext["toolCallNode"]["toolCall"]): boolean;
export declare function isCronAutomationCardToolCall(toolCall: ToolCallBlockRenderContext["toolCallNode"]["toolCall"]): boolean;
export declare function readCronCreateAutomationOutputSummary(value: unknown): CronCreateAutomationSummary | null;
export declare function readCronCreateAutomationSummary(toolCall: ToolCallBlockRenderContext["toolCallNode"]["toolCall"]): CronCreateAutomationSummary | null;
export declare function CronCreateAutomationCard({ automation, onOpenAutomationsMain, }: {
    automation: CronCreateAutomationSummary;
    onOpenAutomationsMain?: (automationId?: string) => void;
}): import("react/jsx-runtime").JSX.Element;
export declare function CronCreateToolCallBlock(context: ToolCallBlockRenderContext): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=cron-create.d.ts.map