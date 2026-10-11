import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, } from "./components/ui/alert-dialog.js";
import { cn } from "./components/lib/utils.js";
import { useZCodeIntl } from "./i18n/IntlProvider.js";
import { useAlertDialogStore } from "./store/alertDialogStore.js";
export function AlertDialogHost() {
    const { intl } = useZCodeIntl();
    const pendingRequest = useAlertDialogStore((state) => state.pendingRequest);
    const settleAlert = useAlertDialogStore((state) => state.settleAlert);
    const handleOpenChange = useCallback((nextOpen) => {
        if (!nextOpen) {
            settleAlert(false);
        }
    }, [settleAlert]);
    return (_jsx(AlertDialog, { open: Boolean(pendingRequest), onOpenChange: handleOpenChange, children: _jsxs(AlertDialogContent, { className: "gap-5", children: [_jsxs(AlertDialogHeader, { className: "gap-2", children: [_jsx(AlertDialogTitle, { children: pendingRequest?.title }), pendingRequest?.description ? (_jsx(AlertDialogDescription, { children: pendingRequest.description })) : null] }), _jsx(AlertDialogFooter, { className: "gap-2 sm:justify-end", children: _jsxs(AlertDialogAction, { onClick: () => settleAlert(true), size: "lg", className: cn("h-9 justify-between gap-3 sm:min-w-32"), children: [_jsx("span", { children: pendingRequest?.actionLabel ?? intl.formatMessage({ id: "common.confirm" }) }), _jsx("span", { className: "text-ui-base text-primary-foreground/60", children: "\u23CE" })] }) })] }) }));
}
//# sourceMappingURL=AlertDialogHost.js.map