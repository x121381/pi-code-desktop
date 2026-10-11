import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useState } from "react";
import { TID_V4_USER_INPUT_DIALOG, TID_V4_USER_INPUT_OPTION, TID_V4_USER_INPUT_TEXT, testId, } from "@zcode/shared";
import { Button } from "@/components/ui/button.js";
import { Input } from "@/components/ui/input.js";
import { runUserAction } from "@/lib/userActionTelemetry.js";
/** v4 userInput 交互最小弹窗（竖切）。 */
export function V4UserInputDialog({ model, onSubmit }) {
    const [freeText, setFreeText] = useState("");
    const handleOption = useCallback((optionId) => {
        runUserAction({
            input: { featureId: "conversation.blocking.user_input", action: "select_option", trigger: "button" },
            operation: () => onSubmit({ optionId }),
            completed: { resultSource: "optimistic_projection" },
            failureStage: "user_input_submit",
        });
    }, [onSubmit]);
    const handleFreeTextSubmit = useCallback(() => {
        const trimmed = freeText.trim();
        if (!trimmed && model.freeText)
            return;
        onSubmit(model.freeText ? { freeText: trimmed } : { optionId: model.options[0]?.optionId });
    }, [freeText, model.freeText, model.options, onSubmit]);
    return (_jsx("div", { className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4", "data-testid": TID_V4_USER_INPUT_DIALOG, children: _jsxs("div", { className: "w-full max-w-lg rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-lg", children: [_jsx("p", { className: "mb-3 text-ui-base text-[var(--color-foreground)]", children: model.prompt }), model.options.length > 0 ? (_jsx("div", { className: "mb-3 flex flex-col gap-2", children: model.options.map((option) => (_jsx(Button, { type: "button", variant: "outline", "data-testid": testId(TID_V4_USER_INPUT_OPTION, option.optionId), onClick: () => handleOption(option.optionId), children: option.label }, option.optionId))) })) : null, model.freeText ? (_jsxs("div", { className: "flex flex-col gap-2", children: [_jsx(Input, { type: model.sensitive ? "password" : "text", value: freeText, onChange: (event) => setFreeText(event.target.value), "data-testid": TID_V4_USER_INPUT_TEXT }), _jsx(Button, { type: "button", onClick: handleFreeTextSubmit, children: "\u63D0\u4EA4" })] })) : null] }) }));
}
//# sourceMappingURL=V4UserInputDialog.js.map