/** 一条 TS 诊断（CreateWorkflow 与 EvalWorkflowSnippet 的 display 共用同一形状）。 */
interface WorkflowDiagnosticEntry {
    line: number;
    column: number;
    code: number;
    message: string;
}
export declare function isWorkflowAnalyzerRuleCode(code: number): boolean;
/**
 * 反馈卡那一句话的词条：说清楚什么没发生、谁接着动。保存的来源编不过是**文件**的问题，句子点名文件，
 * 与工具结果里给模型的那句同一立场。
 * 卡片与行的悬停提示读同一个 id，两处不会各说各话。
 */
export declare function workflowFeedbackLedeMessageId(saved: boolean): string;
/**
 * 编译反馈卡：CreateWorkflow 卡与
 * EvalWorkflowSnippet 卡共用（同一编译管线、同一诊断形状、同一道限长——分别实现两份是漂移温床）。
 *
 * 编不过不是失败：什么都没跑，反馈交回了模型。所以这张卡是中性边框、正文前景色，不用 destructive——
 * 在这个特性里红色只属于出错的 run；整段红字会把最不致命的事件画成页面上最响的东西。
 * 诊断为空时整段不渲染。
 */
export declare function WorkflowDiagnosticsSection({ diagnostics, truncated, count, saved, }: {
    diagnostics: readonly WorkflowDiagnosticEntry[];
    truncated?: boolean;
    /** 条数；display 带 `errorCount`（截断前的总数）时传它，缺席按行数算。 */
    count?: number;
    /** 脚本来自保存的工作流文件：那句话点名文件而不是这次调用。 */
    saved?: boolean;
}): import("react/jsx-runtime").JSX.Element | null;
export {};
//# sourceMappingURL=workflow-diagnostics.d.ts.map