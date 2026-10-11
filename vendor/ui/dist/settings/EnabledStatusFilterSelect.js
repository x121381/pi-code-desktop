import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "../components/ui/select.js";
import { useZCodeIntl } from "../i18n/IntlProvider.js";
export function matchesEnabledStatusFilter(enabled, filter) {
    if (filter === "all") {
        return true;
    }
    return filter === "enabled" ? enabled : !enabled;
}
// 与子智能体面板保持一致的启用状态筛选下拉：搜索框右侧同行摆放，全部/已启用/已停用三档。
export function EnabledStatusFilterSelect({ value, onValueChange, ariaLabel, }) {
    const { intl } = useZCodeIntl();
    return (_jsxs(Select, { value: value, onValueChange: (next) => onValueChange(next), children: [_jsx(SelectTrigger, { size: "lg", className: "h-9 w-full justify-between rounded-xl md:w-36", "aria-label": ariaLabel ?? intl.formatMessage({ id: "settings.resourceFilter.label" }), children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { align: "start", children: [_jsx(SelectItem, { value: "all", children: intl.formatMessage({ id: "settings.resourceFilter.all" }) }), _jsx(SelectItem, { value: "enabled", children: intl.formatMessage({ id: "settings.resourceFilter.enabled" }) }), _jsx(SelectItem, { value: "disabled", children: intl.formatMessage({ id: "settings.resourceFilter.disabled" }) })] })] }));
}
//# sourceMappingURL=EnabledStatusFilterSelect.js.map