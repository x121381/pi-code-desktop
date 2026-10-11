import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AlertDialogHost } from "@/AlertDialogHost.js";
import { ConfirmDialogHost } from "@/ConfirmDialog.js";
import { CuaPermissionObservationAttachment } from "@/cua-permission/CuaPermissionObservationAttachment.js";
import { PluginUiFollowUpDialogHost } from "@/plugin-ui/index.js";
export function RootShell({ children }) {
    // Web 远控在手机浏览器里不能用固定 100vh，
    // 地址栏收放会让底部输入区被裁到视口外；根节点改用动态视口高度。
    return (_jsxs("div", { className: "relative h-dvh", children: [children, _jsx(CuaPermissionObservationAttachment, {}), _jsx(AlertDialogHost, {}), _jsx(ConfirmDialogHost, {}), _jsx(PluginUiFollowUpDialogHost, {})] }));
}
//# sourceMappingURL=RootShell.js.map