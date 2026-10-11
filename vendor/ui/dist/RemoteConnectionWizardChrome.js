import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { CheckIcon, MinusIcon, XIcon } from "lucide-react";
import { cn } from "./components/lib/utils.js";
import { DialogDescription, DialogTitle } from "./components/ui/dialog.js";
import { Button } from "./components/ui/button.js";
import { useZCodeIntl } from "./i18n/IntlProvider.js";
const REMOTE_WIZARD_STEPS = [
    {
        key: "kind",
        titleId: "remote.step.kind",
    },
    {
        key: "settings",
        titleId: "remote.step.settings",
    },
    {
        key: "connecting",
        titleId: "remote.step.connecting",
    },
    {
        key: "directory",
        titleId: "remote.step.directory",
    },
];
function getStepIndex(step) {
    return REMOTE_WIZARD_STEPS.findIndex((item) => item.key === step);
}
export function RemoteConnectionWizardSidebar({ currentStep }) {
    const { intl } = useZCodeIntl();
    const currentIndex = getStepIndex(currentStep);
    return (_jsxs(_Fragment, { children: [_jsx("nav", { className: "md:hidden", children: _jsx("div", { className: "flex min-w-0 gap-2 overflow-x-auto rounded-xl border border-border bg-surface p-2", children: REMOTE_WIZARD_STEPS.map((step, index) => {
                        const isCurrent = currentStep === step.key;
                        const isCompleted = index < currentIndex;
                        return (_jsxs("div", { "aria-current": isCurrent ? "step" : undefined, className: cn("flex min-w-28 shrink-0 items-center gap-2 rounded-lg px-2 py-2", isCurrent
                                ? "bg-card text-foreground"
                                : isCompleted
                                    ? "bg-background-alt text-foreground"
                                    : "text-foreground-subtle"), children: [_jsx("div", { className: cn("flex size-5 shrink-0 items-center justify-center rounded-full border text-ui-base font-mono font-semibold", isCurrent
                                        ? "bg-primary text-primary-foreground"
                                        : isCompleted
                                            ? "border-success bg-success text-success-foreground"
                                            : "border-border bg-background text-foreground-subtle"), children: isCompleted ? _jsx(CheckIcon, { className: "size-3.5" }) : index + 1 }), _jsx("span", { className: "truncate text-ui-base font-medium", children: intl.formatMessage({ id: step.titleId }) })] }, step.key));
                    }) }) }), _jsx("aside", { className: "hidden w-56 shrink-0 flex-col gap-2 p-1 md:flex", children: _jsxs("div", { className: "rounded-xl border border-border bg-surface flex flex-col gap-4 p-4 h-full", children: [_jsx("h3", { className: "text-ui-base font-medium tracking-wide text-foreground-subtle uppercase", children: intl.formatMessage({ id: "remote.wizard" }) }), _jsx("div", { className: "space-y-2", children: REMOTE_WIZARD_STEPS.map((step, index) => {
                                const isCurrent = currentStep === step.key;
                                const isCompleted = index < currentIndex;
                                return (_jsxs("div", { className: cn("flex items-center gap-3 rounded-xl border-0 px-3 py-3 transition-colors", isCurrent
                                        ? "border-border-hover bg-card"
                                        : isCompleted
                                            ? "border-transparent bg-background-alt"
                                            : "border-transparent bg-transparent"), children: [_jsx("div", { className: cn("flex size-6 shrink-0 items-center justify-center rounded-full border text-ui-base font-mono font-semibold", isCurrent
                                                ? "bg-primary text-primary-foreground"
                                                : isCompleted
                                                    ? "border-success bg-success text-success-foreground"
                                                    : "border-border bg-background text-foreground-subtle"), children: isCompleted ? _jsx(CheckIcon, { className: "size-4" }) : index + 1 }), _jsx("div", { className: "min-w-0", children: _jsx("p", { className: cn("text-ui-base font-medium", isCurrent || isCompleted ? "text-foreground" : "text-foreground-subtle"), children: intl.formatMessage({ id: step.titleId }) }) })] }, step.key));
                            }) })] }) })] }));
}
export function RemoteConnectionWizardHeader({ title, description, onMinimize, onClose, }) {
    const { intl } = useZCodeIntl();
    return (_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex items-start justify-between gap-4", children: [_jsx(DialogTitle, { className: "text-lg font-medium", children: title }), _jsxs("div", { className: "flex shrink-0 items-center gap-1", children: [onMinimize ? (_jsxs(Button, { type: "button", variant: "ghost", size: "icon-sm", className: "shrink-0", onClick: onMinimize, children: [_jsx(MinusIcon, { className: "size-4" }), _jsx("span", { className: "sr-only", children: intl.formatMessage({ id: "remote.minimize" }) })] })) : null, onClose ? (_jsxs(Button, { type: "button", variant: "ghost", size: "icon-sm", className: "shrink-0", onClick: onClose, children: [_jsx(XIcon, { className: "size-4" }), _jsx("span", { className: "sr-only", children: intl.formatMessage({ id: "common.close" }) })] })) : null] })] }), _jsx(DialogDescription, { children: description })] }));
}
//# sourceMappingURL=RemoteConnectionWizardChrome.js.map