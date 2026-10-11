import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import { Dialog as DialogPrimitive } from "radix-ui";
import { cn } from "../lib/utils.js";
import { Button } from "./button.js";
import { XIcon } from "lucide-react";
function Dialog({ ...props }) {
    return _jsx(DialogPrimitive.Root, { "data-slot": "dialog", ...props });
}
function DialogTrigger({ ...props }) {
    return _jsx(DialogPrimitive.Trigger, { "data-slot": "dialog-trigger", ...props });
}
function DialogPortal({ ...props }) {
    return _jsx(DialogPrimitive.Portal, { "data-slot": "dialog-portal", ...props });
}
function DialogClose({ ...props }) {
    return _jsx(DialogPrimitive.Close, { "data-slot": "dialog-close", ...props });
}
function DialogOverlay({ className, ...props }) {
    return (_jsx(DialogPrimitive.Overlay, { "data-slot": "dialog-overlay", className: cn(
        // Linux 旧标题栏避让让模态遮罩从 48px 以下开始，窗口顶部仍保持高亮且 tooltip 可见。
        // renderer 自绘窗控位于同一窗口，模态态应与其它平台一致覆盖完整视口。
        "fixed inset-0 isolate z-50 bg-black/60 duration-100 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0", className), ...props }));
}
// 圆角规范迁移：默认外壳统一 2xl，三个截图/附件预览入口显式保留 xl，内容层级独立计算。
function DialogContent({ className, children, showCloseButton = true, showOverlay = true, overlayClassName, ...props }) {
    return (_jsxs(DialogPortal, { children: [showOverlay ? _jsx(DialogOverlay, { className: overlayClassName }) : null, _jsxs(DialogPrimitive.Content, { "data-slot": "dialog-content", className: cn(
                // Electron 自绘标题栏下，弹窗可能会落进窗口顶部的 drag 区域。
                // 如果不把弹窗内容整体标成 no-drag，右上角关闭按钮这类交互会被窗口拖拽命中吞掉。
                "fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-4 rounded-2xl border border-popover-border bg-popover p-4 text-ui-base/relaxed text-foreground shadow-md duration-100 outline-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 [app-region:no-drag]", className), ...props, children: [children, showCloseButton && (_jsx(DialogPrimitive.Close, { "data-slot": "dialog-close", asChild: true, children: _jsxs(Button, { type: "button", variant: "ghost", className: "absolute top-4 right-4 z-20 hover:bg-surface-hover [app-region:no-drag]", size: "icon-sm", children: [_jsx(XIcon, {}), _jsx("span", { className: "sr-only", children: "Close" })] }) }))] })] }));
}
function DialogHeader({ className, ...props }) {
    return (_jsx("div", { "data-slot": "dialog-header", className: cn("flex flex-col gap-1", className), ...props }));
}
function DialogFooter({ className, showCloseButton = false, children, ...props }) {
    return (_jsxs("div", { "data-slot": "dialog-footer", className: cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className), ...props, children: [children, showCloseButton && (_jsx(DialogPrimitive.Close, { asChild: true, children: _jsx(Button, { variant: "outline", children: "Close" }) }))] }));
}
function DialogTitle({ className, ...props }) {
    return (_jsx(DialogPrimitive.Title, { "data-slot": "dialog-title", className: cn("text-ui-base font-medium text-foreground", className), ...props }));
}
function DialogDescription({ className, ...props }) {
    return (_jsx(DialogPrimitive.Description, { "data-slot": "dialog-description", className: cn("text-ui-base/relaxed text-foreground-subtle *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground", className), ...props }));
}
export { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogOverlay, DialogPortal, DialogTitle, DialogTrigger, };
//# sourceMappingURL=dialog.js.map