import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from "@/components/lib/utils.js";
import { TID_PLUGIN_UI_CARD } from "@zcode/shared";
import { useLayoutEffect, useRef } from "react";
import { bindPluginUiPage } from "../adapters/pluginUiPageRegistry.js";
/** 卡片只注册布局锚点；活 webview 由窗口页面管理器持有。 */
export function PluginUiCard(props) {
    const containerRef = useRef(null);
    useLayoutEffect(() => {
        const node = containerRef.current;
        if (node)
            return bindPluginUiPage(props.pageKey, node, props.fill === true);
    }, [props.pageKey, props.fill]);
    useLayoutEffect(() => {
        const node = containerRef.current;
        if (!node || !props.onWidthChange || typeof ResizeObserver === "undefined")
            return;
        const observer = new ResizeObserver((entries) => {
            const width = entries[0]?.contentRect.width;
            if (typeof width === "number")
                props.onWidthChange?.(width);
        });
        observer.observe(node);
        props.onWidthChange(node.clientWidth);
        return () => observer.disconnect();
    }, [props.onWidthChange]);
    const showError = props.phase === "error";
    return (_jsxs("div", { ref: containerRef, "data-testid": TID_PLUGIN_UI_CARD, "data-plugin-ui-phase": props.phase, className: cn("relative w-full overflow-hidden", props.prefersBorder && "rounded-lg border border-border bg-surface", props.fill ? "h-full min-h-0" : ""), style: props.fill ? undefined : { height: `${props.height}px` }, children: [showError ? (_jsxs("div", { className: "flex h-full flex-col items-center justify-center gap-2 px-3 py-2 text-ui-sm text-foreground-subtle", children: [_jsx("span", { children: props.error ?? props.errorLabel }), props.onRetry && props.retryLabel ? (_jsx("button", { type: "button", className: "rounded-md border border-border px-2 py-0.5 text-ui-sm text-foreground hover:bg-menu-hover", "data-testid": "plugin-ui-retry", onClick: props.onRetry, children: props.retryLabel })) : null] })) : null, !showError && !props.handle ? (_jsx("div", { className: "flex h-full items-center justify-center px-3 py-2 text-ui-sm text-foreground-subtle", children: props.loadingLabel })) : null] }));
}
//# sourceMappingURL=PluginUiCard.js.map