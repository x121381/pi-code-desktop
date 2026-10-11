import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// ============================================================
// 设置轮的那一行
// ============================================================
// 「配置」的一次修改在转写里留下一个控制轮：没有用户气泡，它的呈现是新 run 的卡，卡上方这一行说
// 改了什么——工具行的单行样式：滑杆图标、「已调整设置」、每项改动一段、时刻，以 `·` 相隔。
// 它是记录，不是控件。
import { Fragment } from "react";
import { SlidersHorizontalIcon } from "lucide-react";
import { useZCodeIntl } from "../../i18n/IntlProvider.js";
import { workflowSettingsChangeSegments } from "./workflowSettingsChange.js";
export function WorkflowSettingsChangeRow({ amend, at, providerName, }) {
    const { intl } = useZCodeIntl();
    const segments = workflowSettingsChangeSegments(amend, {
        formatMessage: intl.formatMessage.bind(intl),
        ...(providerName === undefined ? {} : { providerName }),
    });
    const time = at === undefined
        ? undefined
        : new Intl.DateTimeFormat(undefined, {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        }).format(at);
    const parts = [
        intl.formatMessage({ id: "chat.toolCall.workflow.settingsChange.kind" }),
        ...segments,
        ...(time === undefined ? [] : [time]),
    ];
    return (_jsxs("div", { className: "flex min-w-0 items-center gap-2 py-0.5 text-ui-base text-foreground-subtle", "data-testid": "workflow-settings-change-row", children: [_jsx(SlidersHorizontalIcon, { "aria-hidden": true, className: "size-4 shrink-0" }), _jsx("span", { className: "flex min-w-0 flex-wrap items-center gap-x-2", children: parts.map((part, index) => (_jsxs(Fragment, { children: [index > 0 ? (_jsx("span", { "aria-hidden": true, className: "text-foreground-subtlest", children: "\u00B7" })) : null, _jsx("span", { className: index === 0
                                ? "font-medium"
                                : index === parts.length - 1 && time !== undefined
                                    ? "text-foreground-subtlest tabular-nums"
                                    : undefined, children: part })] }, index))) })] }));
}
//# sourceMappingURL=WorkflowSettingsChangeRow.js.map