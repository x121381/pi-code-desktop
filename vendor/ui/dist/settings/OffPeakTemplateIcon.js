import { jsx as _jsx } from "react/jsx-runtime";
import { Activity, List, ListChecks, SlidersHorizontal } from "lucide-react";
import { ClientSceneLucideIcon } from "@/components/ClientSceneLucideIcon.js";
const OFF_PEAK_TEMPLATE_ICONS = {
    standupGitSummary: List,
    ciFlakyReport: Activity,
    // 合并 release/current 后新增文档同步模板；沿用检查清单语义，避免目录与图标联合类型漂移。
    documentationSyncCheck: ListChecks,
    customize: SlidersHorizontal,
    standupGitSummarySecondary: List,
    followUpMonitor: ListChecks,
};
/** Automations case 的语义图标映射；首页 case 统一使用 Moon。 */
export function OffPeakTemplateIcon({ className, iconName, name, }) {
    const Icon = OFF_PEAK_TEMPLATE_ICONS[name];
    return (_jsx(ClientSceneLucideIcon, { className: className, name: iconName, "aria-hidden": "true", size: 16, strokeWidth: 2, fallback: _jsx(Icon, { "aria-hidden": "true", className: className, "data-off-peak-template-icon": name, size: 16, strokeWidth: 2 }) }));
}
//# sourceMappingURL=OffPeakTemplateIcon.js.map