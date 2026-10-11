import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { CircleHelp } from "lucide-react";
import { Button } from "@/components/ui/button.js";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover.js";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
export function ModelConfigInputLabel({ field, htmlFor, }) {
    const { intl } = useZCodeIntl();
    return (_jsxs(_Fragment, { children: [_jsx("label", { htmlFor: htmlFor, children: intl.formatMessage({ id: `settings.modelProvider.${field}` }) }), _jsx(ModelConfigHelp, { field: field })] }));
}
export function ModelConfigHelp({ field }) {
    const [open, setOpen] = useState(false);
    const { intl } = useZCodeIntl();
    const label = intl.formatMessage({ id: `settings.modelProvider.${field}` });
    const copy = intl.formatMessage({ id: `settings.modelProvider.help.${field}` });
    return (_jsxs(Popover, { open: open, onOpenChange: setOpen, children: [_jsx(PopoverTrigger, { asChild: true, children: _jsx(Button, { type: "button", size: "icon-sm", variant: "ghost", className: "ml-1 size-6 align-middle text-foreground-subtle", "data-model-help": field, "aria-label": intl.formatMessage({ id: "settings.modelProvider.fieldHelp" }, { field: label }), onPointerEnter: (event) => {
                        if (event.pointerType === "mouse")
                            setOpen(true);
                    }, onPointerLeave: (event) => {
                        if (event.pointerType === "mouse")
                            setOpen(false);
                    }, onFocus: () => setOpen(true), onClick: (event) => {
                        // 点击/触摸只打开说明；阻止 Radix 在已由 focus/hover 打开时反向关闭，不触发相邻表单控件。
                        event.preventDefault();
                        event.stopPropagation();
                        setOpen(true);
                    }, children: _jsx(CircleHelp, { className: "size-3.5", "aria-hidden": "true" }) }) }), _jsx(PopoverContent, { role: "tooltip", "data-model-help-content": field, align: "start", collisionPadding: 12, onOpenAutoFocus: (event) => event.preventDefault(), onCloseAutoFocus: (event) => event.preventDefault(), className: "w-80 max-w-[calc(100vw-1.5rem)] max-h-[min(28rem,calc(100vh-2rem))] overflow-y-auto p-3 text-ui-sm leading-relaxed", children: _jsx("div", { className: "space-y-2", children: copy.split("\n\n").map((paragraph, index) => paragraph.startsWith("- ") ? (_jsx("ul", { className: "list-disc space-y-1 pl-4", children: paragraph.split("\n").map((line, lineIndex) => (_jsx("li", { children: emphasis(line.slice(2)) }, lineIndex))) }, index)) : (_jsx("p", { className: "whitespace-pre-line", children: emphasis(paragraph) }, index))) }) })] }));
}
// 只呈现定稿语言包的加粗/行内代码，不解释 HTML、链接或用户输入。
function emphasis(text) {
    return text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((part, index) => part.startsWith("**") ? (_jsx("strong", { children: part.slice(2, -2) }, index)) : part.startsWith("`") ? (_jsx("code", { className: "font-mono", children: part.slice(1, -1) }, index)) : (part));
}
//# sourceMappingURL=ModelConfigHelp.js.map