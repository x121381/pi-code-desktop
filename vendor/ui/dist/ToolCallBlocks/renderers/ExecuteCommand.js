import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useId, useLayoutEffect, useRef, useState } from "react";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "../../components/ui/button.js";
import { useZCodeIntl } from "../../i18n/IntlProvider.js";
import { logger } from "../../logger.js";
export function ExecuteCommand({ command }) {
    const { intl } = useZCodeIntl();
    const id = useId();
    const content = useRef(null);
    const [expanded, setExpanded] = useState(false);
    const [overflowing, setOverflowing] = useState(false);
    useLayoutEffect(() => {
        const element = content.current;
        if (!element || expanded)
            return;
        // 原命令区域只有限高和截断，没有阅读完整内容的入口；按实际换行测量，兼容窄屏与字号变化。
        const measure = () => setOverflowing(element.scrollHeight > element.clientHeight + 1);
        measure();
        const observer = new ResizeObserver(measure);
        observer.observe(element);
        return () => observer.disconnect();
    }, [command, expanded]);
    return (_jsxs("div", { className: "min-w-0 flex-1 grid grid-cols-[1ch_minmax(0,1fr)] gap-x-2 gap-y-1 font-mono", children: [_jsx("div", { id: id, ref: content, "data-testid": "execute-command", tabIndex: expanded ? 0 : undefined, 
                // 原滚动条受卡片右侧 16px padding 限制；向右扩展 12px 并补回正文留白，使滚动条距内边缘 4px。
                className: `col-span-2 -mr-3 pr-3 min-w-0 leading-5 ${expanded ? "max-h-[10lh] overflow-y-auto" : "max-h-[3lh] overflow-hidden"}`, children: _jsxs("div", { className: "flex items-start gap-2", children: [_jsx("span", { "data-testid": "execute-command-prompt", className: "shrink-0 text-foreground-subtle", children: "$" }), _jsx("pre", { className: "min-w-0 flex-1 whitespace-pre-wrap break-words", children: command })] }) }), overflowing || expanded ? (_jsxs(Button, { "data-command-preview-toggle": true, type: "button", variant: "link", size: "default", 
                // 去掉基础按钮的水平 padding 和边框占位，让文字直接对齐命令正文。
                className: "col-start-2 justify-self-start border-0 px-0 font-sans text-ui-sm font-normal text-foreground-subtle focus-visible:underline", "aria-expanded": expanded, "aria-controls": id, onClick: () => {
                    if (content.current)
                        content.current.scrollTop = 0;
                    setExpanded(!expanded);
                    logger.debug("Execute command preview toggled", { expanded: !expanded });
                }, children: [intl.formatMessage({
                        id: expanded
                            ? "chat.toolCall.execute.collapseCommand"
                            : "chat.toolCall.execute.expandCommand",
                    }), _jsx(ChevronDownIcon, { "aria-hidden": "true", className: `size-3 ${expanded ? "rotate-180" : ""}` })] })) : null] }));
}
//# sourceMappingURL=ExecuteCommand.js.map