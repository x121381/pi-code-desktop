import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
/**
 * 分析器自有规则的码段（9001 起）。
 * 不能写成「≥ 9000」：TypeScript 自己的 18xxx（如 TS18048）仍是 TypeScript 码；TypeScript 在 9xxx 只有
 * 声明产出类诊断，而工作流编译器不产出声明，所以这一段在卡上只属于分析器。
 */
const ANALYZER_RULE_CODE_MIN = 9001;
const ANALYZER_RULE_CODE_MAX = 9099;
export function isWorkflowAnalyzerRuleCode(code) {
    return code >= ANALYZER_RULE_CODE_MIN && code <= ANALYZER_RULE_CODE_MAX;
}
/**
 * 反馈卡那一句话的词条：说清楚什么没发生、谁接着动。保存的来源编不过是**文件**的问题，句子点名文件，
 * 与工具结果里给模型的那句同一立场。
 * 卡片与行的悬停提示读同一个 id，两处不会各说各话。
 */
export function workflowFeedbackLedeMessageId(saved) {
    return saved
        ? "chat.toolCall.workflow.feedback.lede.saved"
        : "chat.toolCall.workflow.feedback.lede";
}
/**
 * 编译反馈卡：CreateWorkflow 卡与
 * EvalWorkflowSnippet 卡共用（同一编译管线、同一诊断形状、同一道限长——分别实现两份是漂移温床）。
 *
 * 编不过不是失败：什么都没跑，反馈交回了模型。所以这张卡是中性边框、正文前景色，不用 destructive——
 * 在这个特性里红色只属于出错的 run；整段红字会把最不致命的事件画成页面上最响的东西。
 * 诊断为空时整段不渲染。
 */
export function WorkflowDiagnosticsSection({ diagnostics, truncated, count, saved = false, }) {
    const { intl } = useZCodeIntl();
    if (diagnostics.length === 0) {
        return null;
    }
    const total = count ?? diagnostics.length;
    const countLabel = intl.formatMessage({
        id: total === 1
            ? "chat.toolCall.workflow.feedback.countOne"
            : "chat.toolCall.workflow.feedback.count",
    }, { count: total });
    // 码按字符串交给 ICU：数字参数会被本地化分组（「9,003」）。
    const codeLabel = (code) => isWorkflowAnalyzerRuleCode(code)
        ? intl.formatMessage({ id: "chat.toolCall.workflow.feedback.rule" }, { code: String(code) })
        : `TS${code}`;
    return (_jsxs("div", { className: "flex flex-col gap-1.5 rounded-xl border border-border bg-panel px-3 py-2", "data-testid": "workflow-compiler-feedback", children: [_jsxs("div", { className: "flex min-w-0 items-baseline justify-between gap-2 text-ui-xs font-medium text-foreground-subtle", children: [_jsx("span", { className: "min-w-0 truncate", "data-testid": "workflow-compiler-feedback-title", children: intl.formatMessage({ id: "chat.toolCall.workflow.feedback" }) }), _jsx("span", { className: "shrink-0 font-normal tabular-nums", "data-testid": "workflow-compiler-feedback-count", children: countLabel })] }), _jsx("p", { className: "text-ui-sm text-foreground-subtle", "data-testid": "workflow-compiler-feedback-lede", children: intl.formatMessage({ id: workflowFeedbackLedeMessageId(saved) }) }), diagnostics.map((diagnostic, index) => (_jsxs("div", { className: "flex items-start gap-2 text-ui-base", "data-testid": "workflow-compiler-feedback-line", children: [_jsxs("code", { className: "shrink-0 rounded-sm bg-surface px-1.5 py-0.5 font-mono text-ui-xs text-foreground-subtle", children: ["L", diagnostic.line, ":C", diagnostic.column] }), _jsx("span", { className: "min-w-0 flex-1 whitespace-pre-wrap break-words text-foreground", children: diagnostic.message }), _jsx("code", { className: "shrink-0 font-mono text-ui-xs text-foreground-subtlest", children: codeLabel(diagnostic.code) })] }, `${diagnostic.line}:${diagnostic.column}:${index}`))), truncated ? (_jsx("p", { className: "text-ui-xs text-foreground-subtle", children: intl.formatMessage({ id: "chat.toolCall.workflow.truncated" }) })) : null] }));
}
//# sourceMappingURL=workflow-diagnostics.js.map