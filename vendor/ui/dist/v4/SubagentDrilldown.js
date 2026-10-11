import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// M5④ subagent 输出预览：内嵌 childSessionId 的只读轻量输出区。
// 轻量实现（P9：不内嵌 child rows，靠订阅 conversation/<childSessionId> 自取）：
// - 数据：复用 SessionDataLayer 租约（引用计数天然支持同会话多订阅视图），
//   展开挂 lease、折叠卸载即释放（keep-warm 由数据层统一处理）；
// - 展示：不虚拟化，只取窗口最近 N 条 assistant 文本输出；工具调用由 Agent 摘要/子工具列表表达；
// - 只读：不下发 onFork/onRetry/onEdit，行内动作面不出现。
import { memo, useEffect, useMemo, useState } from "react";
import { TID_V4_SUBAGENT_DRILLDOWN, testId, } from "@zcode/shared";
import { ConversationRowView } from "../v4/ConversationRowView.js";
import { useZCodeIntl } from "../i18n/IntlProvider.js";
import { useConversationProjection } from "../v4/useConversationProjection.js";
import { useV4Conversation } from "../v4/V4ConversationContext.js";
/** 输出预览只展示最近 N 条文本输出（更早历史请在右侧 tab 里看全量）。 */
export const SUBAGENT_DRILLDOWN_MAX_ROWS = 20;
function isSubagentOutputRow(row) {
    return row.kind === "assistantText";
}
/**
 * 挂载即订阅、卸载即释放。memo：props 为字符串 + 稳定 context，
 * 父行重渲染不牵动已展开的输出预览。
 */
export const SubagentDrilldown = memo(function SubagentDrilldown({ childSessionId, context, }) {
    const { intl } = useZCodeIntl();
    const { layer } = useV4Conversation();
    const [lease, setLease] = useState(null);
    useEffect(() => {
        const nextLease = layer.acquire(childSessionId);
        setLease(nextLease);
        return () => nextLease.release();
    }, [layer, childSessionId]);
    const state = useConversationProjection(lease);
    // 嵌套抑制：迷你 timeline 里的 subagent 行不再提供下钻入口。
    const drilldownContext = useMemo(() => ({ ...context, inSubagentDrilldown: true }), [context]);
    const sourceRows = state.snapshot?.rows.window ?? [];
    const rows = sourceRows.filter(isSubagentOutputRow);
    const visibleRows = rows.length > SUBAGENT_DRILLDOWN_MAX_ROWS
        ? rows.slice(-SUBAGENT_DRILLDOWN_MAX_ROWS)
        : rows;
    const hiddenCount = rows.length - visibleRows.length;
    const statusText = state.status === "connecting"
        ? intl.formatMessage({ id: "chat.toolCall.agent.output.syncing" })
        : state.status === "error"
            ? intl.formatMessage({ id: "chat.toolCall.agent.output.error" }, { error: state.lastError ?? "" })
            : hiddenCount > 0
                ? intl.formatMessage({ id: "chat.toolCall.agent.output.recentRows" }, {
                    visible: String(visibleRows.length),
                    total: String(rows.length),
                })
                : null;
    return (_jsxs("section", { "data-testid": testId(TID_V4_SUBAGENT_DRILLDOWN, childSessionId), "data-child-session-id": childSessionId, "data-row-count": rows.length, "data-source-row-count": sourceRows.length, className: "space-y-2", children: [_jsxs("div", { className: "flex min-w-0 items-center gap-2", children: [_jsx("h4", { className: "shrink-0 text-ui-base font-medium tracking-wide text-foreground-subtlest uppercase", children: intl.formatMessage({ id: "chat.toolCall.agent.output" }) }), statusText ? (_jsx("span", { className: "min-w-0 truncate text-ui-sm text-foreground-subtle", children: statusText })) : null] }), visibleRows.length === 0 ? (_jsx("div", { className: "rounded-md bg-background-alt/40 px-3 py-2 text-ui-sm text-foreground-subtle", children: state.status === "live"
                    ? intl.formatMessage({ id: "chat.toolCall.agent.output.empty" })
                    : null })) : (_jsxs("div", { className: "max-h-80 overflow-y-auto rounded-md bg-background-alt/40 py-1", children: [hiddenCount > 0 ? (_jsx("div", { className: "px-3 py-1 text-center text-ui-sm text-foreground-subtle", children: intl.formatMessage({ id: "chat.toolCall.agent.output.hiddenRows" }, { count: String(hiddenCount) }) })) : null, visibleRows.map((row) => (_jsx(ConversationRowView, { row: row, context: drilldownContext }, row.rowId)))] }))] }));
});
//# sourceMappingURL=SubagentDrilldown.js.map