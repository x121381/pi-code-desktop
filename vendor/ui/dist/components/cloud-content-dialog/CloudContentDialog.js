import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog.js";
import { Button } from "@/components/ui/button.js";
import { cn } from "@/components/lib/utils.js";
import { parseCloudDescriptionStyle } from "@/components/cloud-content-dialog/cloudDescriptionStyle.js";
import { CloudDialogDescription, CloudFormattedTextContent, } from "@/components/cloud-content-dialog/CloudDialogDescription.js";
import { CloudDialogHero } from "@/components/cloud-content-dialog/CloudDialogHero.js";
function dispatch(action, handlers, actionId) {
    switch (action.type) {
        case "close":
            return;
        case "copy_text":
            return handlers.copy_text?.(action);
        case "navigate":
            return handlers.navigate?.(action, actionId);
        case "open_external":
            return handlers.open_external?.(action);
        case "claim_plan":
            return handlers.claim_plan?.(action);
        case "dismiss_content":
            return handlers.dismiss_content?.(action);
    }
}
export function CloudContentDialog(props) {
    return props.open ? (_jsx(CloudContentDialogInstance, { ...props }, `${props.payload.id}:${props.payload.revision}`)) : null;
}
function CloudContentDialogInstance({ payload, open, onClose, handlers, labels, actionPending = false, returnFocusRef, }) {
    const [pending, setPending] = useState(false);
    const [failed, setFailed] = useState(false);
    const [copiedActionId, setCopiedActionId] = useState();
    useEffect(() => {
        if (!copiedActionId)
            return;
        const timer = setTimeout(() => setCopiedActionId(undefined), 2_000);
        return () => clearTimeout(timer);
    }, [copiedActionId]);
    const inFlight = useRef(false);
    const opener = useRef(null);
    const content = useRef(null);
    const mounted = useRef(false);
    useEffect(() => {
        mounted.current = true;
        return () => {
            mounted.current = false;
        };
    }, []);
    const run = async (action, actionId) => {
        if (action.type === "close") {
            onClose();
            return;
        }
        if (actionPending || inFlight.current || !handlers[action.type])
            return;
        inFlight.current = true;
        setPending(true);
        setFailed(false);
        try {
            await dispatch(action, handlers, actionId);
            if (mounted.current && action.type === "copy_text")
                setCopiedActionId(actionId);
            if (mounted.current && action.type === "dismiss_content")
                onClose();
        }
        catch {
            if (mounted.current)
                setFailed(true);
        }
        finally {
            inFlight.current = false;
            if (mounted.current)
                setPending(false);
        }
    };
    return (_jsx(Dialog, { open: open, onOpenChange: (next) => {
            if (!next)
                onClose();
        }, children: _jsxs(DialogContent, { ref: content, "data-testid": "cloud-content-dialog", 
            // macOS 窗口合成中，backdrop-filter 与隔离 iframe 叠加会在圆角外留下方形暗块；父层裁切无效。
            overlayClassName: payload.dialog.hero?.type === "interactive_bundle" ? "backdrop-filter-none!" : undefined, onOpenAutoFocus: (event) => {
                opener.current =
                    document.activeElement instanceof HTMLElement ? document.activeElement : null;
                // Radix 默认先聚焦 Hero iframe，跨文档的 Escape 不会冒泡到父弹窗。
                // 初始焦点留在关闭按钮；用户仍可用 Tab 或指针主动进入 Hero。
                if (payload.dialog.hero?.type === "interactive_bundle") {
                    const close = content.current?.querySelector('[data-slot="dialog-close"]');
                    if (close) {
                        event.preventDefault();
                        close.focus();
                    }
                }
            }, onCloseAutoFocus: (event) => {
                // 受控弹窗没有 Radix Trigger，默认关闭会丢失焦点；仅恢复仍在页面中的打开来源。
                event.preventDefault();
                const target = returnFocusRef?.current ?? opener.current;
                if (target?.isConnected)
                    target.focus();
            }, 
            // Hero 背景独立于 App 主题，关闭按钮用固定媒体覆盖层配色保证可见。
            className: "cloud-content-dialog max-h-[calc(100dvh-2rem)] w-[min(480px,calc(100vw-2rem))] max-w-none gap-0 overflow-y-auto border-0 p-0 [&_[data-slot=dialog-close]]:rounded-full", children: [payload.dialog.hero ? (_jsx("div", { 
                    // Hero 与外壳共用顶部圆角，不依赖资源内容自行适配。
                    className: "aspect-[4/3] w-full overflow-hidden rounded-t-2xl bg-surface", "data-testid": "cloud-dialog-hero-slot", children: _jsx(CloudDialogHero, { hero: payload.dialog.hero, locale: payload.locale, title: payload.dialog.title }) })) : null, _jsxs("section", { className: "flex min-w-0 flex-col items-center gap-6 bg-popover px-6 py-7 text-center text-foreground", children: [_jsxs("div", { "data-testid": "cloud-dialog-status", className: "flex w-full min-w-0 flex-col items-center gap-3", children: [_jsx(DialogTitle, { className: "text-ui-xl font-semibold", children: _jsx(CloudFormattedTextContent, { inline: true, text: payload.dialog.formattedTitle ?? {
                                            format: "plain_text",
                                            text: payload.dialog.title,
                                        } }) }), _jsx(DialogDescription, { asChild: true, children: _jsx(CloudDialogDescription, { "data-testid": "cloud-dialog-description", className: "text-center text-ui-base/relaxed text-foreground-subtle", description: payload.dialog.description, onOpenExternal: handlers.open_external
                                            ? (url) => {
                                                void run({ type: "open_external", url });
                                            }
                                            : undefined }) })] }), failed ? (_jsx("div", { role: "alert", className: "text-ui-sm text-destructive", children: labels.actionFailed })) : null, _jsx("div", { className: "flex w-full flex-wrap items-center justify-center gap-2", children: payload.dialog.buttons.map((button) => {
                                const action = Object.hasOwn(payload.actions, button.actionId)
                                    ? payload.actions[button.actionId]
                                    : undefined;
                                const available = action && (action.type === "close" || Boolean(handlers[action.type]));
                                return (_jsx(Button, { "data-testid": "cloud-dialog-action", "data-action-id": button.actionId, size: "lg", className: cn("h-10 min-w-32 max-w-full whitespace-normal rounded-full px-6 text-ui-base", button.theme?.class), style: parseCloudDescriptionStyle(button.theme?.style ?? null), variant: button.theme?.variant ??
                                        (button.variant === "primary" ? "default" : button.variant), disabled: !available || ((pending || actionPending) && action?.type !== "close"), onClick: () => {
                                        if (action)
                                            void run(action, button.actionId);
                                    }, children: copiedActionId === button.actionId && labels.copySucceeded ? (labels.copySucceeded) : (_jsx("span", { className: "min-w-0 break-words", children: _jsx(CloudFormattedTextContent, { inline: true, text: button.formattedLabel ?? { format: "plain_text", text: button.label } }) })) }, button.id));
                            }) })] })] }) }));
}
//# sourceMappingURL=CloudContentDialog.js.map