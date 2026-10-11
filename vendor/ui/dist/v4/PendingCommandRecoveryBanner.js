import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { memo } from "react";
import { useZCodeIntl } from "../i18n/IntlProvider.js";
/** 明确被 restart 丢弃的 startNow 输入只提供显式用户决策，组件本身不自动重放。 */
export const PendingCommandRecoveryBanner = memo(function PendingCommandRecoveryBanner({ entry, onResend, onDismiss, }) {
    const { intl } = useZCodeIntl();
    const hasReplayPayload = entry.replay.kind === "input";
    // 根因：恢复提示过去用了整块 warning 黄色，和同一 bottom dock 的普通 error
    // 形成了错误的视觉层级。这里复用 ChatErrorBanner 的默认 surface/border/foreground。
    return (_jsxs("div", { role: "status", className: "mb-3 flex w-full shrink-0 flex-wrap items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2 text-ui-base text-foreground backdrop-blur-md", children: [_jsx("p", { className: "min-w-0 flex-1", children: intl.formatMessage({ id: "chat.pendingCommand.discarded" }) }), hasReplayPayload && onResend ? (_jsx("button", { type: "button", className: "shrink-0 rounded-md bg-primary px-2.5 py-1 text-primary-foreground hover:bg-primary/80", onClick: onResend, children: intl.formatMessage({ id: "chat.pendingCommand.resend" }) })) : null, _jsx("button", { type: "button", className: "shrink-0 rounded-md px-2 py-1 text-foreground-subtle hover:bg-hover", onClick: onDismiss, children: intl.formatMessage({ id: "chat.pendingCommand.dismiss" }) })] }));
});
//# sourceMappingURL=PendingCommandRecoveryBanner.js.map