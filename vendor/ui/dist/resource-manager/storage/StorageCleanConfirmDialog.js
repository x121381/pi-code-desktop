import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Loader2 } from "lucide-react";
import { TID_RESOURCE_MANAGER_STORAGE_CONFIRM_ACCEPT, TID_RESOURCE_MANAGER_STORAGE_CONFIRM_CANCEL, TID_RESOURCE_MANAGER_STORAGE_CONFIRM_DIALOG, } from "@zcode/shared";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, } from "../../components/ui/alert-dialog.js";
import { useZCodeIntl } from "../../i18n/IntlProvider.js";
import { formatBytes } from "../../resource-manager/resourceUsageView.js";
import { storageCategoryTitleId } from "./storageCategoryPresentation.js";
export function StorageCleanConfirmDialog({ target, pending, onCancel, onConfirm, }) {
    const { intl } = useZCodeIntl();
    return (_jsx(AlertDialog, { open: target !== null, onOpenChange: (open) => (!open && !pending ? onCancel() : undefined), children: _jsxs(AlertDialogContent, { "data-testid": TID_RESOURCE_MANAGER_STORAGE_CONFIRM_DIALOG, children: [_jsxs(AlertDialogHeader, { children: [_jsx(AlertDialogTitle, { children: target
                                ? intl.formatMessage({ id: "resourceManager.storage.confirmTitle" }, {
                                    category: intl.formatMessage({ id: storageCategoryTitleId(target.categoryId) }),
                                })
                                : null }), _jsx(AlertDialogDescription, { children: target
                                ? `${intl.formatMessage({ id: `resourceManager.storage.confirmDescription.${target.categoryId}` })} ${intl.formatMessage({ id: "resourceManager.storage.confirmSize" }, { size: formatBytes(target.bytes) })}`
                                : null })] }), _jsxs(AlertDialogFooter, { children: [_jsx(AlertDialogCancel, { "data-testid": TID_RESOURCE_MANAGER_STORAGE_CONFIRM_CANCEL, disabled: pending, children: intl.formatMessage({ id: "common.cancel" }) }), _jsxs(AlertDialogAction, { variant: "destructive", "data-testid": TID_RESOURCE_MANAGER_STORAGE_CONFIRM_ACCEPT, disabled: pending, onClick: (event) => {
                                event.preventDefault();
                                onConfirm();
                            }, children: [pending ? _jsx(Loader2, { className: "size-4 animate-spin", "aria-hidden": "true" }) : null, intl.formatMessage({ id: "resourceManager.storage.clean" })] })] })] }) }));
}
//# sourceMappingURL=StorageCleanConfirmDialog.js.map