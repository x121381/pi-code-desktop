import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CheckIcon, Loader2 } from "lucide-react";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
/**
 * 自动重置提示内容（纯展示），供 composer 额度入口的受控 tooltip 使用：
 * - processing：转圈 +「正在重置 5 小时/周额度…」
 * - completed： 绿色勾选 +「5 小时/周额度已重置」
 * 带 role="status" 让读屏在状态切换时朗读。
 */
export function CodingPlanQuotaResetStatusContent({ status, resetType = "FIVE_HOUR", }) {
    const { intl } = useZCodeIntl();
    if (status === "processing") {
        return (_jsxs("span", { role: "status", className: "inline-flex items-center gap-1.5 text-ui-base", children: [_jsx(Loader2, { className: "size-3.5 shrink-0 animate-spin motion-reduce:animate-none", "aria-hidden": "true" }), _jsx("span", { children: intl.formatMessage({
                        id: resetType === "WEEK"
                            ? "codingPlan.quotaReset.processingWeek"
                            : "codingPlan.quotaReset.processing",
                    }) })] }));
    }
    return (_jsxs("span", { role: "status", className: "inline-flex items-center gap-1.5 text-ui-base text-success", children: [_jsx(CheckIcon, { className: "size-3.5 shrink-0 animate-in zoom-in-75 motion-reduce:animate-none", "aria-hidden": "true" }), _jsx("span", { children: intl.formatMessage({
                    id: resetType === "WEEK" ? "codingPlan.quotaReset.doneWeek" : "codingPlan.quotaReset.done",
                }) })] }));
}
//# sourceMappingURL=CodingPlanQuotaResetStatus.js.map