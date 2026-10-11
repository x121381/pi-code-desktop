import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { memo } from "react";
import { TID_V4_PANE_WORKSPACE_BADGE, TID_V4_SESSION_TITLE, TID_V4_SPLIT_CLOSE, } from "@zcode/shared";
import { XIcon } from "lucide-react";
import { Button } from "../components/ui/button.js";
import { useZCodeIntl } from "../i18n/IntlProvider.js";
import { runUserAction } from "../lib/userActionTelemetry.js";
/**
 * pane chrome：不占布局高度，只在右上角悬浮拆分/关闭入口。
 * 保留 title data 节点，供 E2E 读取投影但不恢复旧横条。
 */
function ConversationHeaderImpl({ title, onClosePane, workspaceBadge, }) {
    const { intl } = useZCodeIntl();
    const hasFloatingActions = Boolean(workspaceBadge) || Boolean(onClosePane);
    return (_jsxs(_Fragment, { children: [_jsx("span", { "data-testid": TID_V4_SESSION_TITLE, "data-title": title, className: "sr-only" }), hasFloatingActions ? (_jsxs("div", { "data-v4-pane-actions": "floating", className: "pointer-events-none absolute left-2 top-2 z-20 flex max-w-[calc(100%-1rem)] items-center gap-1", children: [workspaceBadge ? (_jsxs("span", { "data-testid": TID_V4_PANE_WORKSPACE_BADGE, "data-remote": workspaceBadge.remote ? "true" : "false", title: workspaceBadge.workspacePath, className: "pointer-events-auto flex h-7 max-w-[10rem] shrink items-center gap-1 rounded-md border border-[var(--color-border)] bg-[var(--color-popover)] px-2 font-mono text-ui-base text-[var(--color-foreground-subtle)] shadow-md", children: [_jsx("span", { className: "truncate", children: workspaceBadge.label }), workspaceBadge.remote ? (_jsx("span", { className: "shrink-0", children: intl.formatMessage({ id: "v4Pane.remote" }) })) : null] })) : null, onClosePane ? (_jsx(Button, { type: "button", variant: "outline", size: "icon-md", "data-testid": TID_V4_SPLIT_CLOSE, onClick: () => runUserAction({
                            input: { featureId: "task.layout", action: "close_pane", trigger: "button" },
                            operation: onClosePane,
                            completed: { resultSource: "local_commit" },
                            failureStage: "pane_close",
                        }), title: intl.formatMessage({ id: "v4Pane.closePaneTitle" }), "aria-label": intl.formatMessage({ id: "v4Pane.closePane" }), className: "pointer-events-auto bg-[var(--color-popover)] shadow-md", children: _jsx(XIcon, { className: "size-4" }) })) : null] })) : null] }));
}
export const ConversationHeader = memo(ConversationHeaderImpl);
//# sourceMappingURL=ConversationHeader.js.map