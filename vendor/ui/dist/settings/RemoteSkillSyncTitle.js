import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { AlertCircleIcon } from "lucide-react";
import { ControlHintTooltip } from "../ControlHintTooltip.js";
import { DialogTitle } from "../components/ui/dialog.js";
import { useZCodeIntl } from "../i18n/IntlProvider.js";
export function RemoteSkillSyncTitle() {
    const { intl } = useZCodeIntl();
    const [warningTooltipOpen, setWarningTooltipOpen] = useState(false);
    const warningTitle = intl.formatMessage({
        id: "settings.skills.remoteSync.warningTitle",
    });
    return (_jsxs(DialogTitle, { className: "flex min-w-0 items-center gap-2 pr-8", children: [_jsx("span", { className: "min-w-0 truncate", children: intl.formatMessage({ id: "settings.skills.remoteSync.title" }) }), _jsx(ControlHintTooltip, { open: warningTooltipOpen, title: warningTitle, description: intl.formatMessage({
                    id: "settings.skills.remoteSync.warningDescription",
                }), side: "right", align: "center", children: _jsx("span", { "aria-label": warningTitle, className: "inline-flex size-5 items-center justify-center rounded-full text-warning transition-colors hover:bg-hover hover:text-warning focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-input-border-focused", onMouseEnter: () => setWarningTooltipOpen(true), onMouseLeave: () => setWarningTooltipOpen(false), role: "img", children: _jsx(AlertCircleIcon, { className: "size-3.5", "aria-hidden": "true" }) }) })] }));
}
//# sourceMappingURL=RemoteSkillSyncTitle.js.map