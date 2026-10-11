import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Palette } from "lucide-react";
import { Button } from "@/components/ui/button.js";
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu.js";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
import { useZCodeStore } from "@/store/StoreProvider.js";
const MOBILE_THEME_OPTIONS = [
    "system",
    "zai-dark",
    "zai-light",
];
export function WebRemoteControlThemeMenu() {
    const { intl } = useZCodeIntl();
    const theme = useZCodeStore((state) => state.theme);
    const setTheme = useZCodeStore((state) => state.setTheme);
    return (_jsxs(DropdownMenu, { children: [_jsx(DropdownMenuTrigger, { asChild: true, children: _jsx(Button, { type: "button", variant: "ghost", size: "icon-sm", "aria-label": intl.formatMessage({ id: "webRemoteControl.themeMenu.trigger" }), children: _jsx(Palette, { className: "size-4" }) }) }), _jsx(DropdownMenuContent, { align: "end", className: "w-48", children: _jsx(DropdownMenuRadioGroup, { value: theme, onValueChange: (value) => {
                        if (MOBILE_THEME_OPTIONS.includes(value)) {
                            setTheme(value);
                        }
                    }, children: MOBILE_THEME_OPTIONS.map((option) => (_jsx(DropdownMenuRadioItem, { value: option, children: option === "system"
                            ? intl.formatMessage({ id: "sidebar.settings.systemDefault" })
                            : intl.formatMessage({ id: `sidebar.settings.theme.${option}` }) }, option))) }) })] }));
}
//# sourceMappingURL=WebRemoteControlThemeMenu.js.map