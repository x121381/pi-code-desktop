import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { LoaderCircle } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, } from "../components/ui/alert-dialog.js";
import { Checkbox } from "../components/ui/checkbox.js";
import { useZCodeIntl } from "../i18n/IntlProvider.js";
export function WindowsChromeImportConsentDialog({ checked, importing, open, onCheckedChange, onConfirm, onOpenChange, }) {
    const { intl } = useZCodeIntl();
    return (_jsx(AlertDialog, { open: open, onOpenChange: onOpenChange, children: _jsxs(AlertDialogContent, { children: [_jsxs(AlertDialogHeader, { children: [_jsx(AlertDialogTitle, { children: intl.formatMessage({ id: "settings.browser.import.adminConfirmTitle" }) }), _jsx(AlertDialogDescription, { children: intl.formatMessage({ id: "settings.browser.import.adminConfirmDescription" }) })] }), _jsxs("label", { className: "flex items-start gap-3 rounded-lg border border-border bg-surface px-3 py-3 text-ui-base text-foreground", children: [_jsx(Checkbox, { checked: checked, disabled: importing, onCheckedChange: (value) => onCheckedChange(value === true), "aria-label": intl.formatMessage({ id: "settings.browser.import.adminConsent" }) }), _jsx("span", { children: intl.formatMessage({ id: "settings.browser.import.adminConsent" }) })] }), _jsxs(AlertDialogFooter, { children: [_jsx(AlertDialogCancel, { disabled: importing, children: intl.formatMessage({ id: "common.cancel" }) }), _jsxs(AlertDialogAction, { disabled: !checked || importing, onClick: (event) => {
                                event.preventDefault();
                                onConfirm();
                            }, children: [importing ? _jsx(LoaderCircle, { className: "size-4 animate-spin", "aria-hidden": "true" }) : null, intl.formatMessage({ id: "settings.browser.import.adminConfirmAction" })] })] })] }) }));
}
//# sourceMappingURL=WindowsChromeImportConsentDialog.js.map