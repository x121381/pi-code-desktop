import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Loader2Icon, XIcon } from "lucide-react";
import { Button } from "../../components/ui/button.js";
import { useEffect, useState } from "react";
import { CloudInteractiveBundleHero } from "../../components/cloud-content-dialog/CloudDialogHero.js";
import { CloudVideo } from "../../components/cloud-content-dialog/CloudDialogMediaHero.js";
export function MarketingBannerView(props) {
    return (_jsx(MarketingBannerContent, { ...props }, props.bundle?.resolvedUrl ?? props.video?.src ?? props.src));
}
function MarketingBannerContent(props) {
    const [bundleReady, setBundleReady] = useState(false);
    const [hovered, setHovered] = useState(false);
    const ready = !props.bundle || bundleReady;
    useEffect(() => {
        const clearHover = () => setHovered(false);
        const onVisibility = () => {
            if (document.visibilityState === "hidden")
                clearHover();
        };
        window.addEventListener("blur", clearHover);
        document.addEventListener("visibilitychange", onVisibility);
        return () => {
            window.removeEventListener("blur", clearHover);
            document.removeEventListener("visibilitychange", onVisibility);
        };
    }, []);
    return (_jsxs("div", { className: "relative w-full", "data-testid": "marketing-banner", "aria-busy": props.pending, onPointerEnter: (event) => setHovered(event.pointerType === "mouse"), onPointerLeave: () => setHovered(false), onPointerCancel: () => setHovered(false), style: ready ? undefined : { height: 0, overflow: "hidden", visibility: "hidden" }, children: [_jsx("button", { type: "button", disabled: !ready || props.pending || !props.hasAction, "aria-label": props.hasAction ? props.actionLabel : undefined, onClick: props.onClick, className: "block h-24 w-full overflow-hidden rounded-xl border border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50 disabled:cursor-default", children: props.bundle ? (_jsx("span", { className: "pointer-events-none block size-full overflow-hidden", "aria-hidden": "true", inert: true, children: _jsx(CloudInteractiveBundleHero, { hero: props.bundle, locale: props.locale ?? "en-US", title: props.actionLabel, presentation: true, hovered: ready && !props.pending && hovered, onReadyChange: setBundleReady }) })) : props.video ? (_jsx("span", { className: "pointer-events-none block size-full overflow-hidden", "aria-hidden": "true", inert: true, children: _jsx(CloudVideo, { hero: props.video, title: props.actionLabel, presentation: true }) })) : (_jsx("img", { src: props.src, alt: props.hasAction ? props.actionLabel : "", className: "block size-full object-cover", draggable: false })) }), props.pending ? (_jsxs("span", { role: "status", className: "absolute right-2.5 top-2.5 flex size-5 items-center justify-center rounded-full text-foreground", children: [_jsx(Loader2Icon, { className: "size-3.5 animate-spin motion-reduce:animate-none", "aria-hidden": "true" }), _jsx("span", { className: "sr-only", children: props.pendingLabel })] })) : props.hasClose ? (_jsx(Button, { type: "button", variant: "ghost", size: "icon-xs", "aria-label": props.closeLabel, onClick: (event) => {
                    event.stopPropagation();
                    props.onClose();
                }, className: "absolute right-2.5 top-2.5 rounded-full text-foreground-subtle hover:bg-hover hover:text-foreground focus-visible:ring-foreground/50", children: _jsx(XIcon, { "aria-hidden": "true" }) })) : null] }));
}
//# sourceMappingURL=MarketingBanner.js.map