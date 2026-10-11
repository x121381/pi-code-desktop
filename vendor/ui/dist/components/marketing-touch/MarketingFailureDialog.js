import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { InfoIcon } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert.js";
import { Button } from "@/components/ui/button.js";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog.js";
export function MarketingFailureDialog({ message, title, acknowledge, onClose, }) {
    return (_jsx(Dialog, { open: true, onOpenChange: (open) => {
            if (!open)
                onClose();
        }, children: _jsxs(DialogContent, { "data-testid": "marketing-failure-dialog", className: "sm:max-w-sm", showCloseButton: false, children: [_jsx(DialogTitle, { className: "sr-only", children: title }), _jsxs(Alert, { className: "min-w-0 border-0 bg-transparent p-0", children: [_jsx(InfoIcon, { "aria-hidden": "true", className: "size-4" }), _jsx(DialogDescription, { asChild: true, children: _jsx(AlertDescription, { "data-slot": "alert-description", className: "min-w-0 max-h-64 overflow-y-auto whitespace-pre-wrap break-words text-foreground", children: message }) })] }), _jsx("div", { className: "flex justify-end", children: _jsx(Button, { onClick: onClose, children: acknowledge }) })] }) }));
}
//# sourceMappingURL=MarketingFailureDialog.js.map