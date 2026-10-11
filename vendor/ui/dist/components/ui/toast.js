import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * 轻量 toast 提示
 *
 * 不引入第三方库，用 React portal 渲染到 body，3 秒自动消失。
 * 调用方式：`import { toast } from "@/components/ui/toast.js"; toast("message");`
 */
import { createRoot } from "react-dom/client";
import { useEffect, useState } from "react";
import { Info, TriangleAlert, X } from "lucide-react";
import { cn } from "@/components/lib/utils.js";
export function upsertToastItem(items, item) {
    if (!item.dedupeKey)
        return [...items, item];
    return [...items.filter((current) => current.dedupeKey !== item.dedupeKey), item];
}
export function resolveToastStackClassName(position) {
    const bottomInset = "bottom-[calc(1rem+env(safe-area-inset-bottom))]";
    switch (position) {
        case "top-center":
            return "fixed top-16 left-1/2 z-[9999] flex -translate-x-1/2 flex-col items-center gap-2";
        case "top-right":
            return "fixed right-4 top-16 z-[9999] flex max-w-[calc(100vw-2rem)] flex-col items-end gap-2";
        case "bottom-center":
            return `fixed ${bottomInset} left-1/2 z-[9999] flex -translate-x-1/2 flex-col items-center gap-2`;
        case "bottom-left":
            return `fixed ${bottomInset} left-4 z-[9999] flex flex-col items-start gap-2`;
    }
}
let nextId = 0;
let addToast = null;
let removeToast = null;
let updateToastItem = null;
const pendingToastIds = new Set();
const pendingToastUpdates = new Map();
const dismissedBeforeMountToastIds = new Set();
const DEFAULT_TOAST_DURATION_MS = 3000;
const TOAST_TRANSITION_DURATION_MS = 200;
function ensureHost() {
    if (addToast) {
        return;
    }
    const host = document.createElement("div");
    host.id = "zcode-toast-host";
    document.body.appendChild(host);
    const root = createRoot(host);
    root.render(_jsx(ToastContainer, {}));
}
function ToastContainer() {
    const [items, setItems] = useState([]);
    useEffect(() => {
        addToast = (item) => {
            pendingToastIds.delete(item.id);
            const pendingUpdate = pendingToastUpdates.get(item.id);
            pendingToastUpdates.delete(item.id);
            if (dismissedBeforeMountToastIds.has(item.id)) {
                dismissedBeforeMountToastIds.delete(item.id);
                return;
            }
            // 挂载前的进度更新和既有去重必须同时生效，不能合入分享提示后又堆叠同一操作。
            setItems((prev) => upsertToastItem(prev, pendingUpdate ? { ...item, ...pendingUpdate } : item));
        };
        removeToast = (id) => {
            setItems((prev) => prev.filter((item) => item.id !== id));
        };
        updateToastItem = (id, patch) => {
            setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));
        };
        return () => {
            addToast = null;
            removeToast = null;
            updateToastItem = null;
        };
    }, []);
    const handleRemove = (id) => {
        setItems((prev) => prev.filter((item) => item.id !== id));
    };
    const topCenterItems = items.filter((item) => item.position === "top-center" && !item.anchorId);
    const topRightItems = items.filter((item) => item.position === "top-right");
    const bottomLeftItems = items.filter((item) => item.position === "bottom-left");
    const bottomCenterItems = items.filter((item) => item.position === "bottom-center");
    const anchoredTopCenterItems = new Map();
    for (const item of items) {
        if (item.position !== "top-center" || !item.anchorId)
            continue;
        const anchorItems = anchoredTopCenterItems.get(item.anchorId) ?? [];
        anchorItems.push(item);
        anchoredTopCenterItems.set(item.anchorId, anchorItems);
    }
    return (_jsxs(_Fragment, { children: [_jsx("div", { className: resolveToastStackClassName("top-center"), children: topCenterItems.map((item) => (_jsx(ToastMessage, { item: item, onDone: handleRemove }, item.id))) }), _jsx("div", { className: resolveToastStackClassName("top-right"), children: topRightItems.map((item) => (_jsx(ToastMessage, { item: item, onDone: handleRemove }, item.id))) }), _jsx("div", { className: resolveToastStackClassName("bottom-left"), children: bottomLeftItems.map((item) => (_jsx(ToastMessage, { item: item, onDone: handleRemove, isBottom: true }, item.id))) }), _jsx("div", { className: resolveToastStackClassName("bottom-center"), children: bottomCenterItems.map((item) => (_jsx(ToastMessage, { item: item, onDone: handleRemove, isBottom: true }, item.id))) }), [...anchoredTopCenterItems].map(([anchorId, anchorItems]) => (_jsx(AnchoredToastStack, { anchorId: anchorId, items: anchorItems, onDone: handleRemove }, anchorId)))] }));
}
export function resolveToastAnchorLeft(rect) {
    return rect.left + rect.width / 2;
}
export function AnchoredToastStack({ anchorId, items, onDone, }) {
    const [left, setLeft] = useState(null);
    useEffect(() => {
        let observedAnchor = null;
        const resizeObserver = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(() => syncPosition());
        const syncPosition = () => {
            const anchor = document.getElementById(anchorId);
            if (anchor !== observedAnchor) {
                if (observedAnchor)
                    resizeObserver?.unobserve(observedAnchor);
                observedAnchor = anchor;
                if (observedAnchor)
                    resizeObserver?.observe(observedAnchor);
            }
            setLeft(observedAnchor ? resolveToastAnchorLeft(observedAnchor.getBoundingClientRect()) : null);
        };
        syncPosition();
        const mutationObserver = typeof MutationObserver === "undefined" ? null : new MutationObserver(syncPosition);
        mutationObserver?.observe(document.body, { childList: true, subtree: true });
        window.addEventListener("resize", syncPosition);
        document.addEventListener("scroll", syncPosition, {
            capture: true,
            passive: true,
        });
        return () => {
            resizeObserver?.disconnect();
            mutationObserver?.disconnect();
            window.removeEventListener("resize", syncPosition);
            document.removeEventListener("scroll", syncPosition, true);
        };
    }, [anchorId]);
    return (_jsx("div", { className: cn(resolveToastStackClassName("top-center")), style: left === null ? undefined : { left }, children: items.map((item) => (_jsx(ToastMessage, { item: item, onDone: onDone }, item.id))) }));
}
function ToastMessage({ item, onDone, isBottom, }) {
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        // 触发进入动画
        requestAnimationFrame(() => setVisible(true));
        if (!Number.isFinite(item.durationMs) || item.durationMs <= 0) {
            return undefined;
        }
        const timer = setTimeout(() => {
            setVisible(false);
            // 等退出动画结束后移除
            setTimeout(() => onDone(item.id), TOAST_TRANSITION_DURATION_MS);
        }, item.durationMs);
        return () => clearTimeout(timer);
        // 持续中的 Toast 使用 duration=0；切换到终态时更新 duration，重新启动自动消失计时器。
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [item.durationMs]);
    const isUpdate = item.variant === "update";
    const [title, ...bodyLines] = item.message.split("\n");
    const body = bodyLines.join("\n").trim();
    const dismissWithTransition = () => {
        setVisible(false);
        window.setTimeout(() => onDone(item.id), TOAST_TRANSITION_DURATION_MS);
    };
    const handleAction = () => {
        item.onAction?.();
        dismissWithTransition();
    };
    return (_jsx(ToastMessageView, { item: item, visible: visible, isBottom: isBottom, title: title, body: body, onAction: handleAction, onDismiss: dismissWithTransition }));
}
export function ToastMessageView({ item, visible, isBottom, title, body, onAction, onDismiss, }) {
    const isUpdate = item.variant === "update";
    const isNotice = item.variant === "info" || item.variant === "warning";
    const isTopRight = item.position === "top-right";
    const [fallbackTitle, ...fallbackBodyLines] = item.message.split("\n");
    const displayTitle = title ?? fallbackTitle;
    const displayBody = body ?? fallbackBodyLines.join("\n").trim();
    return (_jsx("div", { className: cn("rounded-2xl border bg-toast/60 text-ui-base shadow-lg backdrop-blur-xl transition-[transform,opacity] duration-200 ease-[cubic-bezier(0.77,0,0.175,1)] motion-reduce:transform-none motion-reduce:transition-opacity", isUpdate
            ? "origin-bottom-left w-[min(300px,calc(100vw-1rem))] max-w-[min(300px,calc(100vw-1rem))] border-popover-border text-foreground shadow-lg"
            : isNotice
                ? "w-[min(536px,calc(100vw-2rem))] border-border text-foreground"
                : "border-border px-4 py-3 text-foreground whitespace-pre-line", 
        // 右上角 Toast 曾复用顶部居中的纵向缩放动画，无法表达其从右侧进入的空间关系。
        isTopRight
            ? visible
                ? "translate-x-0 opacity-100"
                : "translate-x-[calc(100%+1rem)] opacity-0"
            : isBottom
                ? visible
                    ? "translate-y-0 scale-100 opacity-100"
                    : "translate-y-1 scale-[0.98] opacity-0"
                : visible
                    ? "translate-y-0 scale-100 opacity-100"
                    : "-translate-y-1 scale-[0.98] opacity-0"), children: isUpdate ? (_jsxs("div", { className: "grid min-w-0 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 px-2.5 py-2", children: [_jsx("span", { className: "size-2 shrink-0 rounded-full bg-primary/80 ring-4 ring-accent", "aria-hidden": "true" }), _jsxs("div", { className: "min-w-0 flex-1", children: [_jsx("div", { className: "truncate text-ui-base font-medium text-foreground", children: displayTitle }), displayBody ? (_jsx("div", { className: "mt-0.5 truncate text-ui-base leading-4 text-foreground-subtle", children: displayBody })) : null] }), item.actionLabel ? (_jsx("button", { type: "button", onClick: onAction ?? item.onAction, className: "h-7 max-w-14 shrink-0 truncate rounded-md bg-secondary px-2 text-ui-base font-medium text-foreground transition-colors hover:bg-hover", children: item.actionLabel })) : null] })) : isNotice ? (_jsxs("div", { className: "flex min-w-0 items-center gap-4 px-4", children: [item.variant === "warning" ? (_jsx(TriangleAlert, { className: "size-4 shrink-0 text-warning", "aria-hidden": "true" })) : (_jsx(Info, { className: "size-4 shrink-0 text-foreground-subtle", "aria-hidden": "true" })), _jsxs("div", { className: "flex min-w-0 flex-[1_0_0] items-start gap-4 py-3 text-sm", children: [_jsxs("div", { className: "min-w-0 flex-1 leading-5", children: [_jsx("div", { className: "text-foreground", children: displayTitle }), displayBody ? (_jsx("div", { className: "mt-0.5 whitespace-pre-line text-foreground-subtle", children: displayBody })) : null] }), item.actionLabel ? (_jsx("button", { type: "button", onClick: onAction ?? item.onAction, 
                            // 长团队名等具体目标不能把窄屏 Toast 撑出视口；保留完整名称并允许换行。
                            className: "max-w-1/2 self-center shrink-0 whitespace-normal break-words text-left font-medium leading-snug text-foreground underline underline-offset-2 hover:text-foreground-subtle", children: item.actionLabel })) : null] }), item.dismissible ? (_jsx("button", { type: "button", onClick: onDismiss, "aria-label": item.dismissLabel ?? "Close", className: "flex size-6 shrink-0 items-center justify-center rounded-md text-foreground-subtle hover:bg-hover hover:text-foreground", children: _jsx(X, { className: "size-3.5", "aria-hidden": "true" }) })) : null] })) : (item.message) }));
}
export function toast(message, options) {
    ensureHost();
    // ensureHost 是同步的，但 addToast 在下一帧 React 渲染后才可用
    // 用 requestAnimationFrame 保证 container 已挂载
    const id = nextId++;
    pendingToastIds.add(id);
    const durationMs = options?.durationMs ?? DEFAULT_TOAST_DURATION_MS;
    const position = options?.position ?? "top-center";
    const variant = options?.variant ?? "default";
    const actionLabel = options?.actionLabel;
    const onAction = options?.onAction;
    const dismissible = options?.dismissible;
    const dismissLabel = options?.dismissLabel;
    const anchorId = options?.anchorId;
    const dedupeKey = options?.dedupeKey;
    const tryAdd = () => {
        if (addToast) {
            const item = {
                id,
                message,
                durationMs,
                position,
                variant,
                actionLabel,
                onAction,
                dismissible,
                dismissLabel,
                anchorId,
                dedupeKey,
            };
            const pendingUpdate = pendingToastUpdates.get(id);
            pendingToastUpdates.delete(id);
            addToast(pendingUpdate ? { ...item, ...pendingUpdate } : item);
        }
        else {
            requestAnimationFrame(tryAdd);
        }
    };
    tryAdd();
    return id;
}
/** 更新已有 Toast，适合把同一长耗时操作的阶段变化收敛到一个提示中。 */
export function updateToast(id, patch) {
    if (pendingToastIds.has(id)) {
        pendingToastUpdates.set(id, {
            ...(pendingToastUpdates.get(id) ?? {}),
            ...patch,
        });
        return;
    }
    updateToastItem?.(id, patch);
}
export function dismissToast(id) {
    if (pendingToastIds.has(id)) {
        pendingToastUpdates.delete(id);
        dismissedBeforeMountToastIds.add(id);
        return;
    }
    removeToast?.(id);
}
//# sourceMappingURL=toast.js.map