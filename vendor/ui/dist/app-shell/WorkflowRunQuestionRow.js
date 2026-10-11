import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { MessageCircleQuestionIcon } from "lucide-react";
import { cn } from "@/components/lib/utils.js";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
import { workflowRunQuestionWaitedLabel } from "@/app-shell/workflowRunQuestions.js";
/**
 * 一条升级问题：挂在提问者那一行下面。
 *
 * **只读，v1 没有应答框**：应答者是主代理，不是用户——它拿不准时本就可经 AskUserQuestion
 * 转询用户。qid 是主代理作答时要用的那个 token；用户自己答不了，但把它显示出来，就能指着
 * 某一个问题让主代理去答——这是只读面里唯一可被转达的抓手。
 */
export function WorkflowRunQuestionRow({ className, now, question, showAsker = false, }) {
    const { intl } = useZCodeIntl();
    const waited = workflowRunQuestionWaitedLabel(question.askedAt, now, (descriptor, values) => intl.formatMessage(descriptor, values));
    return (_jsxs("div", { className: cn("mt-1 flex min-w-0 items-start gap-2 rounded-lg bg-[var(--color-interaction-confirmation-surface)] px-2 py-1.5 text-ui-sm text-[var(--color-interaction-confirmation-foreground)]", className), "data-qid": question.qid, "data-testid": "workflow-run-question", children: [_jsx(MessageCircleQuestionIcon, { "aria-hidden": true, className: "mt-0.5 size-3.5 shrink-0" }), _jsxs("div", { className: "min-w-0 flex-1", children: [showAsker ? (_jsx("span", { className: "mr-2 font-mono text-ui-xs font-medium", children: question.actorName ??
                            (question.actorSiteId === undefined
                                ? intl.formatMessage({ id: "chat.toolCall.workflow.graph.lane.anonymous" })
                                : `${question.actorSiteId}@${question.actorOrdinal}`) })) : null, _jsx("span", { className: "whitespace-pre-wrap break-words", children: question.question }), question.context === undefined ? null : (_jsx("p", { className: "mt-0.5 whitespace-pre-wrap break-words text-ui-xs opacity-80", "data-testid": "workflow-run-question-context", children: question.context }))] }), _jsxs("span", { className: "flex shrink-0 items-baseline gap-2 font-mono text-ui-xs", children: [waited === undefined ? null : (_jsx("span", { "data-testid": "workflow-run-question-waited", children: waited })), _jsx("span", { className: "opacity-70", children: question.qid })] })] }));
}
//# sourceMappingURL=WorkflowRunQuestionRow.js.map