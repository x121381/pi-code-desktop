import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import { AlertDialog as AlertDialogPrimitive } from "radix-ui";
import { cn } from "../lib/utils.js";
import { buttonVariants } from "./button.js";
function AlertDialog({ ...props }) {
    return _jsx(AlertDialogPrimitive.Root, { "data-slot": "alert-dialog", ...props });
}
function AlertDialogTrigger({ ...props }) {
    return _jsx(AlertDialogPrimitive.Trigger, { "data-slot": "alert-dialog-trigger", ...props });
}
function AlertDialogPortal({ ...props }) {
    return _jsx(AlertDialogPrimitive.Portal, { "data-slot": "alert-dialog-portal", ...props });
}
function AlertDialogOverlay({ className, ...props }) {
    return (_jsx(AlertDialogPrimitive.Overlay, { "data-slot": "alert-dialog-overlay", className: cn(
        // Linux 旧标题栏避让会留下未遮罩的顶部亮条；确认弹窗也应覆盖完整窗口。
        "fixed inset-0 isolate z-50 bg-black/60 duration-100 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0", className), ...props }));
}
function AlertDialogContent({ className, ...props }) {
    return (_jsxs(AlertDialogPortal, { children: [_jsx(AlertDialogOverlay, {}), _jsx(AlertDialogPrimitive.Content, { "data-slot": "alert-dialog-content", className: cn("fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-5 rounded-2xl border-none bg-popover/98 p-5 text-ui-base/relaxed text-foreground ring-border shadow-2xl duration-100 outline-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 sm:max-w-md", className), ...props })] }));
}
function AlertDialogHeader({ className, ...props }) {
    return (_jsx("div", { "data-slot": "alert-dialog-header", className: cn("flex flex-col gap-2 text-left", className), ...props }));
}
function AlertDialogFooter({ className, ...props }) {
    return (_jsx("div", { "data-slot": "alert-dialog-footer", className: cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className), ...props }));
}
function AlertDialogTitle({ className, ...props }) {
    return (_jsx(AlertDialogPrimitive.Title, { "data-slot": "alert-dialog-title", className: cn("text-ui-lg font-semibold text-foreground", className), ...props }));
}
function AlertDialogDescription({ className, ...props }) {
    return (_jsx(AlertDialogPrimitive.Description, { "data-slot": "alert-dialog-description", className: cn("whitespace-pre-line pt-0.5 text-ui-base leading-6 text-foreground-subtle", className), ...props }));
}
function AlertDialogAction({ className, variant, size, ...props }) {
    return (_jsx(AlertDialogPrimitive.Action, { "data-slot": "alert-dialog-action", className: cn(buttonVariants({ variant, size }), className), ...props }));
}
function AlertDialogCancel({ className, variant, size, ...props }) {
    return (_jsx(AlertDialogPrimitive.Cancel, { "data-slot": "alert-dialog-cancel", className: cn(buttonVariants({ variant: variant ?? "outline", size }), className), ...props }));
}
export { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, AlertDialogPortal, AlertDialogTitle, AlertDialogTrigger, };
//# sourceMappingURL=alert-dialog.js.map