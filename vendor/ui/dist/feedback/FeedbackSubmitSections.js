import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { TID_FEEDBACK_LOGS_OPT_IN } from "@zcode/shared";
import { Button } from "../components/ui/button.js";
import { Input } from "../components/ui/input.js";
import { Switch } from "../components/ui/switch.js";
import { Textarea } from "../components/ui/textarea.js";
import { cn } from "../components/lib/utils.js";
import { SubmitProgressView } from "../feedback/FeedbackSubmitProgressView.js";
import { rememberFeedbackContactInput } from "../feedback/feedbackContactPreference.js";
import { InboxIcon } from "lucide-react";
export function DescriptionSection({ value, max, onChange, formatMessage, }) {
    return (_jsx(Section, { title: formatMessage("feedback.submit.simple.descriptionTitle"), right: _jsx(Counter, { value: value.length, max: max }), children: _jsx(Field, { children: _jsx(Textarea, { autoFocus: true, value: value, onChange: (event) => onChange(event.target.value), rows: 5, maxLength: max, placeholder: formatMessage("feedback.submit.simple.descriptionPlaceholder"), 
                // Textarea 默认的 field-sizing-content 会让无换行长文本撑大输入框宽度。
                // 反馈弹窗宽度固定，这里切到固定尺寸并允许长词换行，避免整窗横向溢出。
                className: "field-sizing-fixed h-[136px] max-h-[136px] min-w-0 max-w-full resize-none overflow-y-auto rounded-xl border-input-border bg-input text-ui-base leading-6 whitespace-pre-wrap break-words text-foreground placeholder:text-foreground-subtlest hover:border-input-border-hover focus-visible:border-input-border-focused focus-visible:bg-input-focused" }) }) }));
}
export function ContactSection({ value, max, onChange, formatMessage, }) {
    return (_jsx(Section, { title: formatMessage("feedback.submit.simple.contactTitle"), children: _jsx(Field, { children: _jsx(Input, { type: "text", inputMode: "email", autoComplete: "email", value: value, onChange: (event) => {
                    // 联系方式是可选项，但用户一旦填过就希望下次自动带出。
                    // 这里随输入实时持久化，不再依赖提交成功，避免网络失败或用户关闭弹窗导致记忆丢失。
                    onChange(rememberFeedbackContactInput(event.target.value));
                }, maxLength: max, placeholder: formatMessage("feedback.submit.contact.placeholder"), className: "h-10 rounded-xl border-input-border bg-input px-3 text-ui-base text-foreground placeholder:text-foreground-subtlest hover:border-input-border-hover focus-visible:border-input-border-focused focus-visible:bg-input-focused" }) }) }));
}
export function LogUploadToggle({ checked, onCheckedChange, label, hint, }) {
    return (_jsxs("div", { className: "space-y-0.5", children: [_jsxs("div", { className: "flex items-center justify-between gap-3", children: [_jsx("span", { className: "min-w-0 text-ui-base font-medium text-foreground", children: label }), _jsx(Switch, { "data-testid": TID_FEEDBACK_LOGS_OPT_IN, "aria-label": label, size: "sm", checked: checked, onCheckedChange: onCheckedChange, className: "shrink-0" })] }), _jsx("span", { className: "block text-ui-sm leading-5 text-foreground-subtle", children: hint })] }));
}
export function SubmitFooter({ submitting, submitProgress, submitDisabled, onCancel, onViewTickets, onSubmit, formatMessage, }) {
    return (_jsxs("div", { className: "shrink-0 px-6 pb-6 pt-2", children: [submitting && submitProgress ? (_jsx(SubmitProgressView, { progress: submitProgress, processingLabel: formatMessage("feedback.submit.processing") })) : null, _jsxs("div", { className: cn("flex items-center justify-between gap-3", submitting && submitProgress ? "mt-2.5" : ""), children: [_jsxs(Button, { type: "button", variant: "outline", size: "lg", onClick: onViewTickets, disabled: submitting, className: "min-w-0 justify-start rounded-lg text-foreground-subtle hover:text-foreground", children: [_jsx(InboxIcon, { className: "size-4 shrink-0" }), _jsx("span", { className: "truncate", children: formatMessage("feedback.center.ticketsTitle") })] }), _jsxs("div", { className: "flex shrink-0 justify-end gap-2", children: [_jsx(Button, { variant: "ghost", size: "lg", onClick: onCancel, children: formatMessage("common.cancel") }), _jsx(Button, { size: "lg", onClick: () => void onSubmit(), disabled: submitDisabled, className: "rounded-lg", children: submitting ? (_jsxs(_Fragment, { children: [_jsx("span", { className: "size-3.5 animate-spin rounded-full border border-current border-t-transparent" }), formatMessage("feedback.submit.submitting")] })) : (formatMessage("feedback.submit.submit")) })] })] })] }));
}
export function Section({ title, right, children, }) {
    return (_jsxs("section", { className: "space-y-2", children: [_jsxs("div", { className: "flex items-center justify-between gap-2", children: [_jsx("h3", { className: "text-ui-base font-semibold text-foreground", children: title }), right] }), children] }));
}
function Field({ right, children }) {
    return (_jsxs("div", { className: "space-y-1.5", children: [right ? _jsx("div", { className: "flex items-center justify-end gap-2", children: right }) : null, children] }));
}
function Counter({ value, max }) {
    return (_jsxs("span", { className: cn("text-ui-xs tabular-nums", value > max ? "text-destructive" : "text-foreground-subtle"), children: [value, "/", max] }));
}
//# sourceMappingURL=FeedbackSubmitSections.js.map