import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button.js";
import { cn } from "@/components/lib/utils.js";
import { Textarea } from "@/components/ui/textarea.js";
import { TECHNICAL_INPUT_ATTRIBUTES } from "@/lib/technicalInputAttributes.js";
import { modelEditorControlStyle } from "@/settings/model-provider-section/modelEditorControlStyle.js";
export function BooleanModelOption({ label, selected, onToggle, overridden = false, }) {
    return (_jsxs(Button, { type: "button", role: "checkbox", variant: "outline", size: "lg", "aria-checked": selected, "data-selected": selected, "data-model-boolean-option": "true", "data-model-capability-option": "true", "data-personal-override": overridden, className: cn("gap-2 disabled:opacity-100", "px-3", modelEditorControlStyle(overridden, selected)), onClick: onToggle, children: [_jsx(ModelOptionCheckbox, { selected: selected }), _jsx("span", { children: label })] }));
}
/** 外层按钮负责完整点击与键盘语义；指示框不可再嵌一个可聚焦控件。 */
export function ModelOptionCheckbox({ selected }) {
    return (_jsx("span", { "aria-hidden": "true", "data-model-option-checkbox": "true", className: cn("flex size-4 shrink-0 items-center justify-center rounded-sm border", 
        // 边框不能跟随勾号的反色，否则选中后框体出现反色描边；与系统 Checkbox 使用相同颜色。
        selected
            ? "border-primary bg-primary text-primary-foreground"
            : "border-input-border bg-input"), children: selected ? _jsx(CheckIcon, { className: "size-3" }) : null }));
}
export function JsonSlotEditor({ label, labelHelp, value, effectiveValue, overridden = false, onChange, }) {
    return (_jsxs("div", { className: "space-y-1", "data-model-json-slot": "true", children: [_jsxs("div", { className: "mb-1 block text-ui-base text-foreground-subtle", children: [label, labelHelp] }), _jsx(Textarea, { ...TECHNICAL_INPUT_ATTRIBUTES, "data-language": "json", 
                // 共享 Textarea 默认按内容自适应高度，长 Effective JSON placeholder 会撑高整个弹窗。
                // JSON 槽位保持固定高度，超出内容只在输入框内部滚动。
                className: cn("field-sizing-fixed h-32 min-h-32 max-h-32 resize-none overflow-y-auto rounded-lg px-3 py-2 font-mono text-foreground placeholder:text-foreground-subtlest", modelEditorControlStyle(overridden)), "data-personal-override": overridden, value: value, placeholder: effectiveValue, onChange: (event) => onChange(event.target.value) })] }));
}
//# sourceMappingURL=ProviderModelMetadataFields.js.map