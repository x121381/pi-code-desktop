import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AlertCircle } from "lucide-react";
import { formatFeedbackStatusLabel, STATUS_META } from "../feedback/feedbackMeta.js";
import { cn } from "../components/lib/utils.js";
import { useZCodeIntl } from "../i18n/IntlProvider.js";
export function StatusIndicator({ status, withDot = true, children, className, }) {
    const meta = STATUS_META[status];
    const { intl } = useZCodeIntl();
    return (_jsxs("span", { className: cn("inline-flex items-center gap-1 text-ui-base font-medium", meta.className, className), children: [withDot ? _jsx("span", { className: cn("size-1.5 rounded-full", meta.dot) }) : null, children ?? formatFeedbackStatusLabel(status, intl.formatMessage)] }));
}
export function FeedbackErrorTip({ message }) {
    return (_jsxs("div", { className: "flex items-start gap-2 rounded-xl border border-red-500/25 bg-red-500/10 px-3 py-2 text-ui-base text-red-300", role: "alert", children: [_jsx(AlertCircle, { className: "mt-0.5 size-3.5 shrink-0 text-red-400" }), _jsx("span", { className: "break-words leading-relaxed", children: message })] }));
}
//# sourceMappingURL=feedbackBadges.js.map