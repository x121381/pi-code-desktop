import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, } from "../components/ui/alert-dialog.js";
import { useZCodeIntl } from "../i18n/IntlProvider.js";
// 卸载是破坏性的彻底清除（缓存 + data 目录 + config 残留），UI 各入口共用同一个确认弹窗，
// 文案与行为保持一致，避免「已安装」与「市场」两个面板各写一份。
export function PluginUninstallConfirmDialog({ open, pluginName, pending, onCancel, onConfirm, }) {
    const { intl } = useZCodeIntl();
    return (_jsx(AlertDialog, { open: open, onOpenChange: (next) => {
            if (!next)
                onCancel();
        }, children: _jsxs(AlertDialogContent, { "data-testid": "plugin-store-uninstall-dialog", children: [_jsxs(AlertDialogHeader, { children: [_jsx(AlertDialogTitle, { children: intl.formatMessage({ id: "settings.plugins.uninstall.confirmTitle" }, { name: pluginName }) }), _jsx(AlertDialogDescription, { children: intl.formatMessage({ id: "settings.plugins.uninstall.confirmDescription" }) })] }), _jsxs(AlertDialogFooter, { children: [_jsx(AlertDialogCancel, { type: "button", size: "sm", "data-testid": "plugin-store-uninstall-cancel", disabled: pending, children: intl.formatMessage({ id: "common.cancel" }) }), _jsx(AlertDialogAction, { type: "button", "data-testid": "plugin-store-uninstall-confirm", variant: "destructive", size: "sm", disabled: pending, onClick: (event) => {
                                // 阻止 Radix 默认在点击 action 后关闭弹窗；卸载是异步操作，等结果再由父组件收起。
                                event.preventDefault();
                                onConfirm();
                            }, children: intl.formatMessage({ id: "settings.plugins.uninstall.confirm" }) })] })] }) }));
}
//# sourceMappingURL=PluginUninstallConfirmDialog.js.map