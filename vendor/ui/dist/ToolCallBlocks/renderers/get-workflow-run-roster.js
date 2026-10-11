import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useZCodeIntl } from "../../i18n/IntlProvider.js";
import { formatWorkflowAge, formatWorkflowDuration, formatWorkflowTokenCount, } from "../../lib/workflowObservationFormat.js";
import { SITUATION_BLOCK_CLASS, SITUATION_ROW_CLASS, } from "../../ToolCallBlocks/renderers/get-workflow-run-situation.js";
const I18N_PREFIX = "chat.toolCall.workflow.getRun.";
/**
 * 相位词的语义色。词永远在场，颜色只是第二通道（DESIGN：状态不能只靠颜色）：
 * 在动的用活动色 warning，等待与终态未完结居中，完成 success、失败 destructive。
 * `parked` 也用活动色——它在等一个人回答，是需要注意的状态，不是安静的空闲。
 */
const SUBAGENT_STATE_TEXT = {
    idle: "text-foreground-subtlest",
    executing: "text-warning",
    waiting: "text-foreground-subtle",
    parked: "text-warning",
    done: "text-success",
    failed: "text-destructive",
    unfinished: "text-foreground-subtle",
};
export function WorkflowRunSubagentRoster({ subagents, generatedAt, }) {
    const { intl } = useZCodeIntl();
    // 空花名册什么也不画：还没造出子代理是一件不需要一整块区域来说的事。
    if (subagents.length === 0)
        return null;
    return (_jsx("div", { className: SITUATION_BLOCK_CLASS, "data-testid": "workflow-run-subagents", children: subagents.map((subagent) => {
            const activity = subagentActivity(subagent, generatedAt, intl.formatMessage);
            return (_jsxs("div", { className: "min-w-0 space-y-0.5", children: [_jsxs("div", { className: `${SITUATION_ROW_CLASS} text-ui-sm`, children: [subagent.name === undefined ? null : (_jsx("span", { className: "min-w-0 break-words text-foreground", children: subagent.name })), _jsxs("span", { className: "break-all font-mono text-ui-xs text-foreground-subtlest", children: [subagent.siteId, "@", subagent.ordinal] }), _jsx("span", { className: `shrink-0 ${SUBAGENT_STATE_TEXT[subagent.state]}`, children: intl.formatMessage({ id: `${I18N_PREFIX}subagent.state.${subagent.state}` }) }), subagent.phaseName === undefined ? null : (_jsx("span", { className: "min-w-0 break-words text-foreground-subtle", children: intl.formatMessage({ id: `${I18N_PREFIX}subagent.phase` }, { name: subagent.phaseName }) })), activity.map((cell) => (_jsx("span", { className: "min-w-0 break-words text-foreground-subtle", children: cell }, cell))), subagent.tokens > 0 ? (_jsx("span", { className: "shrink-0 tabular-nums text-foreground-subtlest", children: intl.formatMessage({ id: "chat.toolCall.workflow.run.usage.tokens" }, { tokens: formatWorkflowTokenCount(subagent.tokens) }) })) : null] }), subagent.instructionsHead === undefined ||
                        subagent.instructionsHead.length === 0 ? null : (_jsx("p", { className: "min-w-0 break-words pl-3 text-ui-sm text-foreground-subtle", children: intl.formatMessage({ id: `${I18N_PREFIX}subagent.task` }, { task: subagent.instructionsHead }) }))] }, `${subagent.siteId}@${subagent.ordinal}`));
        }) }));
}
/** 那几个进度读数任意一个在场，就说明这一行背后有一次 ask（扁平载荷没有 `currentAsk` 标记）。 */
function hasCurrentAsk(subagent) {
    return (subagent.startedAt !== undefined ||
        subagent.turn !== undefined ||
        subagent.toolCalls !== undefined ||
        subagent.lastTool !== undefined ||
        subagent.instructionsHead !== undefined);
}
function subagentActivity(subagent, generatedAt, formatMessage) {
    if (subagent.state === "parked" && subagent.parkedOn !== undefined) {
        // 只有 qid，没有提问时刻：卡面载荷不带 pendingQuestions，所以这一行说不出「等了多久」。
        return [formatMessage({ id: `${I18N_PREFIX}subagent.parkedOn` }, { qid: subagent.parkedOn })];
    }
    if (subagent.state === "waiting")
        return waitCells(subagent, generatedAt, formatMessage);
    if (subagent.state === "unfinished" && hasCurrentAsk(subagent)) {
        return [formatMessage({ id: `${I18N_PREFIX}subagent.inFlightAtStop` })];
    }
    if (hasCurrentAsk(subagent)) {
        const cells = executingCells(subagent, generatedAt, formatMessage);
        // 一次 ask 在飞但一个读数也没有（老 journal）：退回已结算步数，别留下一行只有相位词。
        return cells.length > 0 ? cells : settledCells(subagent, formatMessage);
    }
    return settledCells(subagent, formatMessage);
}
function executingCells(subagent, generatedAt, formatMessage) {
    const cells = [];
    const onStep = formatWorkflowAge(generatedAt, subagent.startedAt);
    if (onStep !== undefined) {
        cells.push(formatMessage({ id: `${I18N_PREFIX}subagent.onStep` }, { age: onStep }));
    }
    if (subagent.turn !== undefined) {
        cells.push(formatMessage({ id: `${I18N_PREFIX}subagent.turn` }, { count: subagent.turn }));
    }
    if (subagent.toolCalls !== undefined) {
        cells.push(formatMessage({
            id: `${I18N_PREFIX}subagent.${subagent.toolCalls === 1 ? "toolCallsOne" : "toolCalls"}`,
        }, { count: subagent.toolCalls }));
    }
    if (subagent.lastTool !== undefined) {
        const { name, target, at } = subagent.lastTool;
        const age = formatWorkflowAge(generatedAt, at);
        cells.push([
            formatMessage({ id: `${I18N_PREFIX}subagent.lastTool` }, { name }),
            target,
            age === undefined ? undefined : formatMessage({ id: `${I18N_PREFIX}age` }, { age }),
        ]
            .filter((part) => part !== undefined && part.length > 0)
            .join(" "));
    }
    return cells;
}
function waitCells(subagent, generatedAt, formatMessage) {
    if (subagent.waitCause === undefined)
        return [];
    const cells = [
        formatMessage({
            id: `${I18N_PREFIX}subagent.${subagent.waitCause === "slot" ? "waitingSlot" : "waitingBackoff"}`,
        }),
    ];
    // 「等了多久」贴着原因，「还要等多久」收尾：两个时长挨在一起时读者分不清哪个是哪个。
    const waited = formatWorkflowAge(generatedAt, subagent.waitSince);
    if (waited !== undefined) {
        cells.push(formatMessage({ id: `${I18N_PREFIX}subagent.waitedFor` }, { age: waited }));
    }
    if (subagent.retryAfterMs !== undefined) {
        cells.push(formatMessage({ id: `${I18N_PREFIX}subagent.retryIn` }, { duration: formatWorkflowDuration(subagent.retryAfterMs) }));
    }
    return cells;
}
function settledCells(subagent, formatMessage) {
    if (subagent.stepsSettled === 0 && subagent.stepsFailed === 0)
        return [];
    const cells = [
        formatMessage({ id: `${I18N_PREFIX}subagent.${subagent.stepsSettled === 1 ? "stepsOne" : "steps"}` }, { count: subagent.stepsSettled }),
    ];
    if (subagent.stepsFailed > 0) {
        cells.push(formatMessage({ id: `${I18N_PREFIX}subagent.stepsFailed` }, { count: subagent.stepsFailed }));
    }
    return cells;
}
//# sourceMappingURL=get-workflow-run-roster.js.map