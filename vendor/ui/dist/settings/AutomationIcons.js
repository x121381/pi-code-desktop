import { jsx as _jsx } from "react/jsx-runtime";
import { ChevronDown, CirclePlay, CircleStop, Clock, Ellipsis, ExternalLink, Info, Moon, Pencil, Play, Plus, RefreshCw, Square, Trash2, } from "lucide-react";
import { cn } from "../components/lib/utils.js";
/**
 * Automations 统一使用 Lucide 原生 24×24 viewBox 与 2px 描边。
 * 旧设计稿 glyph 先裁切到 14.6667px 再放大，会连同描边一起放粗。
 */
const AUTOMATION_ICON_PROPS = {
    size: 16,
    strokeWidth: 2,
};
export function AutomationChevronDownIcon({ size = 12, containerSize = 20, }) {
    return (_jsx("span", { className: cn("flex shrink-0 items-center justify-center", containerSize === 18 ? "size-4.5" : "size-5"), "aria-hidden": "true", children: _jsx(ChevronDown, { size: size, strokeWidth: 2, className: size === 14 ? "size-3.5" : "size-3" }) }));
}
export function AutomationAddScheduleIcon(props) {
    return _jsx(Plus, { ...AUTOMATION_ICON_PROPS, ...props });
}
export function AutomationInfoIcon(props) {
    return _jsx(Info, { ...AUTOMATION_ICON_PROPS, ...props });
}
export function AutomationIdleTimeIcon(props) {
    return _jsx(Moon, { ...AUTOMATION_ICON_PROPS, ...props });
}
export function AutomationPausedIcon(props) {
    return _jsx(CircleStop, { ...AUTOMATION_ICON_PROPS, ...props });
}
export function AutomationPauseActionIcon(props) {
    return _jsx(CircleStop, { ...AUTOMATION_ICON_PROPS, ...props });
}
export function AutomationEditActionIcon(props) {
    return _jsx(Pencil, { ...AUTOMATION_ICON_PROPS, ...props });
}
export function AutomationRunNowIcon(props) {
    return _jsx(Play, { ...AUTOMATION_ICON_PROPS, ...props });
}
export function AutomationContinueIcon(props) {
    return _jsx(CirclePlay, { ...AUTOMATION_ICON_PROPS, ...props });
}
export function AutomationCancelActionIcon(props) {
    return _jsx(Square, { ...AUTOMATION_ICON_PROPS, fill: "currentColor", ...props });
}
export function AutomationClockIcon(props) {
    return _jsx(Clock, { ...AUTOMATION_ICON_PROPS, ...props });
}
export function AutomationMoreHorizontalIcon(props) {
    return _jsx(Ellipsis, { ...AUTOMATION_ICON_PROPS, ...props });
}
export function AutomationExternalLinkIcon(props) {
    return _jsx(ExternalLink, { ...AUTOMATION_ICON_PROPS, ...props });
}
export function AutomationRefreshIcon(props) {
    return _jsx(RefreshCw, { ...AUTOMATION_ICON_PROPS, ...props });
}
export function AutomationTrashIcon() {
    return (_jsx("span", { className: "flex size-5 shrink-0 items-center justify-center", "aria-hidden": "true", children: _jsx(Trash2, { className: "size-4", ...AUTOMATION_ICON_PROPS }) }));
}
//# sourceMappingURL=AutomationIcons.js.map