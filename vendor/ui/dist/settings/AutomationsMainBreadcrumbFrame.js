import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { SettingsBreadcrumbProvider, SettingsHeaderBreadcrumb, } from "../settings/SettingsHeaderBreadcrumb.js";
/**
 * 工作区 Automations 不经过 SettingsPage，编辑页的面包屑上报需要 Provider 接收，
 * 所以桌面顶栏只剩空拖拽区；这里让工作区入口复用设置页的同一套面包屑合同。
 */
export function AutomationsMainBreadcrumbFrame({ ariaLabel, children, isDesktop, sectionLabel, }) {
    const [items, setItems] = useState([]);
    return (_jsx(SettingsBreadcrumbProvider, { onItemsChange: setItems, sectionLabel: sectionLabel, children: _jsxs("div", { className: "flex min-h-0 flex-1 flex-col", children: [isDesktop ? (_jsx("div", { className: "h-12 shrink-0 [app-region:drag]", "data-testid": "automations-main-drag-region", children: _jsx(SettingsHeaderBreadcrumb, { ariaLabel: ariaLabel, items: items }) })) : null, children] }) }));
}
//# sourceMappingURL=AutomationsMainBreadcrumbFrame.js.map