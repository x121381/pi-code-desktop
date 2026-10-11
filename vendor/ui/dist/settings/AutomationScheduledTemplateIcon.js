import { jsx as _jsx } from "react/jsx-runtime";
import { Activity, FileText, List, Target } from "lucide-react";
import { ClientSceneLucideIcon } from "@/components/ClientSceneLucideIcon.js";
const TEMPLATE_ICONS = {
    target: Target,
    activity: Activity,
    file: FileText,
    list: List,
};
export function AutomationScheduledTemplateIcon({ className, iconName, name, }) {
    const Icon = TEMPLATE_ICONS[name];
    return (_jsx(ClientSceneLucideIcon, { className: className, name: iconName, "aria-hidden": "true", size: 16, strokeWidth: 2, fallback: _jsx(Icon, { "aria-hidden": "true", className: className, "data-automation-template-icon": name, size: 16, strokeWidth: 2 }) }));
}
//# sourceMappingURL=AutomationScheduledTemplateIcon.js.map