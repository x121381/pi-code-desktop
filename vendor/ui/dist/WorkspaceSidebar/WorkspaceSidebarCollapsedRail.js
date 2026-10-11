import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { PanelLeftOpen } from "lucide-react";
import appLogoUrl from "../assets/provider-icons/logo-zai.svg";
import { Button } from "../components/ui/button.js";
import { ControlHintTooltip } from "../ControlHintTooltip.js";
import { useZCodeIntl } from "../i18n/IntlProvider.js";
export function WorkspaceSidebarCollapsedRail({ onToggleSidebar, toggleSidebarShortcutLabel, }) {
    const { intl } = useZCodeIntl();
    return (_jsx("aside", { className: "flex h-full flex-col overflow-hidden border-r border-border bg-background-alt", children: _jsx("div", { className: "flex h-9 shrink-0 items-center justify-center border-b border-border bg-background-alt px-1.5 [app-region:drag]", children: _jsx("div", { className: "[app-region:no-drag]", children: _jsx(ControlHintTooltip, { title: intl.formatMessage({ id: "workspaceSidebar.toggleSidebar" }), shortcut: toggleSidebarShortcutLabel, side: "bottom", children: _jsxs(Button, { type: "button", variant: "ghost", size: "icon-md", className: "group relative overflow-hidden rounded-lg", onClick: onToggleSidebar, "aria-label": intl.formatMessage({
                            id: "workspaceSidebar.toggleSidebar",
                        }), children: [_jsx("img", { src: appLogoUrl, alt: "ZCode", className: "size-5 transition-opacity group-hover:opacity-0", draggable: false }), _jsx(PanelLeftOpen, { className: "absolute size-4 opacity-0 transition-opacity group-hover:opacity-100" })] }) }) }) }) }));
}
//# sourceMappingURL=WorkspaceSidebarCollapsedRail.js.map