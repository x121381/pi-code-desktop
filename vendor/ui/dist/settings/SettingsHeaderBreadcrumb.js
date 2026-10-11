import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createContext, useCallback, useContext, useEffect, useRef } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "../components/lib/utils.js";
import { Button } from "../components/ui/button.js";
const SettingsBreadcrumbContext = createContext(null);
export function SettingsBreadcrumbProvider({ children, onItemsChange, sectionLabel, }) {
    const reportVersionRef = useRef(0);
    const report = useCallback(({ items, onSectionSelect }) => {
        const reportVersion = ++reportVersionRef.current;
        onItemsChange([{ label: sectionLabel, onSelect: onSectionSelect }, ...items]);
        return () => {
            // 多个页面 reporter 切换时，旧 effect 可能晚于新 effect cleanup。
            // 旧版本只能清理自己的投影，不能把较新的面包屑覆盖为空。
            if (reportVersionRef.current === reportVersion) {
                onItemsChange([]);
            }
        };
    }, [onItemsChange, sectionLabel]);
    return (_jsx(SettingsBreadcrumbContext.Provider, { value: report, children: children }));
}
/**
 * 将 section 内既有页面状态和返回动作投影到 Settings 顶栏，但不拥有或持久化导航状态。
 */
export function SettingsBreadcrumbReporter({ items, onSectionSelect, }) {
    const report = useContext(SettingsBreadcrumbContext);
    const actionsRef = useRef(items.map((item) => item.onSelect));
    const sectionActionRef = useRef(onSectionSelect);
    actionsRef.current = items.map((item) => item.onSelect);
    sectionActionRef.current = onSectionSelect;
    const signature = JSON.stringify(items.map((item) => item.label));
    useEffect(() => {
        const labels = JSON.parse(signature);
        const dispose = report?.({
            items: labels.map((label, index) => ({
                label,
                onSelect: actionsRef.current[index] ? () => actionsRef.current[index]?.() : undefined,
            })),
            onSectionSelect: sectionActionRef.current ? () => sectionActionRef.current?.() : undefined,
        });
        return dispose;
    }, [report, signature]);
    return null;
}
export function SettingsHeaderBreadcrumb({ ariaLabel, className, items, }) {
    if (items.length < 2)
        return null;
    return (_jsx("nav", { "aria-label": ariaLabel, className: cn("pointer-events-none flex h-full min-w-0 items-center overflow-hidden px-2.5", className), children: _jsx("ol", { className: "flex min-w-0 items-center gap-0 overflow-hidden text-ui-base/relaxed", children: items.map((item, index) => {
                const current = index === items.length - 1;
                return (_jsxs("li", { className: "flex min-w-0 items-center gap-0", children: [index > 0 ? (_jsx(ChevronRight, { "aria-hidden": "true", className: "size-3.5 shrink-0 text-foreground-subtlest", "data-testid": "settings-breadcrumb-separator" })) : null, current || !item.onSelect ? (_jsx("span", { "aria-current": current ? "page" : undefined, className: cn("truncate", current ? "px-2 text-foreground" : "text-foreground-subtle"), children: item.label })) : (_jsx(Button, { type: "button", variant: "ghost", size: "default", "data-testid": index === 0 ? "settings-breadcrumb-section" : "settings-breadcrumb-item", className: "pointer-events-auto min-w-0 shrink text-foreground-subtle hover:text-foreground [app-region:no-drag]", onClick: item.onSelect, children: _jsx("span", { className: "truncate", children: item.label }) }))] }, `${index}:${item.label}`));
            }) }) }));
}
//# sourceMappingURL=SettingsHeaderBreadcrumb.js.map