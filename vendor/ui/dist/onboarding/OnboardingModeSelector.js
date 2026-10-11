import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Check } from "lucide-react";
import { modeOptionIcons } from "../onboarding/occupationOptions.js";
import { cn } from "../components/lib/utils.js";
/** 引导第二步的 UI 模式选择；从 OccupationOnboarding 抽出以控制文件行数。 */
export function OnboardingModeSelector({ mode, saving, onSelect, label, formatLabel, }) {
    return (_jsx("div", { className: "mt-8 space-y-3", role: "group", "aria-label": label, children: ["coding", "office"].map((value) => {
            const Icon = modeOptionIcons[value];
            return (_jsxs("button", { type: "button", "aria-pressed": mode === value, disabled: saving, onClick: () => onSelect(value), className: cn("flex w-full items-start gap-4 rounded-xl border p-5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-input-border-focused", mode === value
                    ? "border-foreground/60 bg-card-selected dark:border-foreground/50"
                    : "border-card-border bg-card hover:border-border-hover hover:bg-surface-hover dark:border-border/60 dark:bg-transparent dark:hover:bg-surface/60"), children: [_jsx(Icon, { className: "mt-0.5 size-5 shrink-0 text-foreground-subtle", strokeWidth: 1.5 }), _jsxs("span", { className: "min-w-0 flex-1", children: [_jsx("span", { className: "block text-ui-base font-medium", children: formatLabel(value === "office" ? "officeMode" : value) }), _jsx("span", { className: "mt-2 block text-ui-sm leading-relaxed text-foreground-subtle", children: formatLabel(value === "office" ? "officeModeDescription" : `${value}Description`) })] }), _jsx("span", { "aria-hidden": "true", className: cn("mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border", mode === value
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border"), children: mode === value ? _jsx(Check, { className: "size-3" }) : null })] }, value));
        }) }));
}
//# sourceMappingURL=OnboardingModeSelector.js.map