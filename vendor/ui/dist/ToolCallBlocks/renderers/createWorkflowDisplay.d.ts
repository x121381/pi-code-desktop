import { type ToolCallCreateWorkflowDisplay } from "@zcode/shared/zcode-protocol-v4";
/**
 * CreateWorkflow 工具输出侧的读取规则（display 载荷与纯文本兜底）。从 `create-workflow.tsx`
 * 拆出（oxlint max-lines 400 门，与 `createWorkflowInput.ts` 同一先例）：纯函数、无 JSX。
 */
export declare function readWorkflowDisplay(raw: unknown): ToolCallCreateWorkflowDisplay | null;
export declare function readFallbackOutputText(output: unknown): string | null;
interface WorkflowDiagnosticPosition {
    line: number;
    column: number;
    message: string;
}
/**
 * 编译反馈行的悬停提示：先是那一句话
 * （什么没发生、谁接着动），再逐条 `L{line}:C{col} message`——与模型收到的行同形，复制出来可以直接对照。
 */
export declare function formatWorkflowFeedbackTooltip(lede: string, diagnostics: readonly WorkflowDiagnosticPosition[]): string;
/** 被诊断点名的脚本行（首次出现序、去重、只要正行号）：展开后的脚本把这些行号染成警示色。 */
export declare function workflowDiagnosticLines(diagnostics: readonly WorkflowDiagnosticPosition[]): number[];
export {};
//# sourceMappingURL=createWorkflowDisplay.d.ts.map