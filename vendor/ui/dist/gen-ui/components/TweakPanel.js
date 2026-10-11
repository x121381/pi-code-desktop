import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Button } from "@/components/ui/button.js";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
export function TweakPanel({ snapshot, page }) {
    const { groups, tweakValues: values, previewOriginal: preview } = snapshot;
    const { intl } = useZCodeIntl();
    const original = Object.fromEntries(groups.flatMap((group) => group.controls).map((control) => [control.id, control.value]));
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");
    const change = (id, value) => {
        const next = { ...values, [id]: value };
        page.setTweaks(next);
    };
    return (_jsxs("div", { className: "max-h-[40vh] space-y-3 overflow-y-auto p-3 text-ui-sm", "data-testid": "gen-ui-tweaks", children: [groups.map((tweak, groupIndex) => (_jsxs("fieldset", { className: "space-y-3", children: [_jsx("legend", { className: "font-medium", children: tweak.title }), _jsx("div", { className: "grid gap-3 sm:grid-cols-2", children: tweak.controls.map((control) => (_jsxs("label", { className: "flex items-center gap-3", children: [_jsx("span", { className: "min-w-20", children: control.label }), control.type === "select" ? (_jsx("select", { "aria-label": control.label, className: "min-w-0 flex-1 rounded border bg-panel p-1", value: String(values[control.id]), onChange: (event) => change(control.id, event.target.value), children: control.options.map((option) => (_jsx("option", { value: typeof option === "string" ? option : option.value, children: typeof option === "string" ? option : option.label }, typeof option === "string" ? option : option.value))) })) : control.type === "toggle" ? (_jsx("input", { "aria-label": control.label, type: "checkbox", checked: Boolean(values[control.id]), onChange: (event) => change(control.id, event.target.checked) })) : (_jsx("input", { "aria-label": control.label, type: control.type === "color" ? "color" : "range", className: "min-w-0 flex-1", value: String(values[control.id]), ...(control.type === "slider"
                                        ? { min: control.min, max: control.max, step: control.step ?? 1 }
                                        : {}), onChange: (event) => change(control.id, control.type === "slider" ? Number(event.target.value) : event.target.value) })), control.type === "slider" && (_jsxs("output", { children: [values[control.id], control.unit] }))] }, control.id))) })] }, groupIndex))), _jsxs("div", { className: "flex flex-wrap gap-2", children: [_jsx(Button, { variant: "ghost", size: "sm", onClick: () => {
                            page.setTweaks(original);
                        }, children: intl.formatMessage({ id: "genUi.reset" }) }), _jsx(Button, { variant: "ghost", size: "sm", "aria-pressed": preview, onClick: () => {
                            page.previewTweaks(!preview);
                        }, children: intl.formatMessage({ id: "genUi.original" }) }), _jsx(Button, { size: "sm", disabled: busy, onClick: async () => {
                            setBusy(true);
                            setError("");
                            try {
                                await page.submitTweaks(values);
                            }
                            catch (reason) {
                                setError(String(reason));
                            }
                            finally {
                                setBusy(false);
                            }
                        }, children: intl.formatMessage({ id: "genUi.submit" }) })] }), error && (_jsx("p", { role: "alert", className: "text-destructive", children: error }))] }));
}
//# sourceMappingURL=TweakPanel.js.map