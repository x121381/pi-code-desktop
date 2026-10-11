import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { ControlHintTooltip } from "../ControlHintTooltip.js";
import { TooltipProvider } from "../components/ui/tooltip.js";
const SIDE_PANE_TAB_TOOLTIP_DELAY_MS = 1_500;
export function SidePaneTabTitleTooltip({ children, isDragging, title, }) {
    const [isOpen, setIsOpen] = useState(false);
    useEffect(() => {
        if (isDragging) {
            // 拖拽开始后清掉已打开状态，避免拖拽结束时在旧 tab 上恢复 tooltip。
            setIsOpen(false);
        }
    }, [isDragging]);
    return (_jsx(TooltipProvider, { delayDuration: SIDE_PANE_TAB_TOOLTIP_DELAY_MS, skipDelayDuration: 0, children: _jsx(ControlHintTooltip, { title: title, side: "bottom", 
            // ControlHintTooltip 默认给普通按钮加 shrink-0；side tab 必须保留等宽收缩能力。
            triggerClassName: "shrink", open: isOpen && !isDragging, onOpenChange: (open) => setIsOpen(isDragging ? false : open), children: children }) }));
}
//# sourceMappingURL=SidePaneTabTitleTooltip.js.map