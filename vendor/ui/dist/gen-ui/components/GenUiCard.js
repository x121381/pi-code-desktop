import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore, } from "react";
import { Copy, Maximize2, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button.js";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogPortal, } from "@/components/ui/dialog.js";
import { Textarea } from "@/components/ui/textarea.js";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
import { useGenUi } from "@/hooks/useGenUi.js";
import { EMPTY_GEN_UI_SNAPSHOT } from "../contract.js";
import { TweakPanel } from "./TweakPanel.js";
const subscribeEmpty = () => () => { };
function PageAnchor({ page, height }) {
    const ref = useRef(null);
    useLayoutEffect(() => (ref.current ? page.bind(ref.current) : undefined), [page]);
    return (_jsx("div", { ref: ref, style: { height, width: "calc(100% + 10px)", margin: -5 }, "data-testid": "gen-ui-anchor" }));
}
function PreviewAnchor({ page, suspended }) {
    const ref = useRef(null);
    useLayoutEffect(() => {
        if (suspended || !ref.current)
            return;
        page.preview(ref.current);
        return () => page.preview(null);
    }, [page, suspended]);
    return _jsx("div", { ref: ref, className: "min-h-0 flex-1", "data-testid": "gen-ui-preview-anchor" });
}
export function GenUiCard({ target, reference, }) {
    const { intl } = useZCodeIntl();
    const label = (id) => intl.formatMessage({ id: `genUi.${id}` });
    const [expanded, setExpanded] = useState(false), [tweaks, setTweaks] = useState(false), [retry, setRetry] = useState(0);
    const [draft, setDraft] = useState(null);
    const [copying, setCopying] = useState(false), [error, setError] = useState("");
    const expandButton = useRef(null);
    const resolve = useRef(null);
    const confirm = useCallback((prompt) => new Promise((done) => {
        resolve.current?.(null);
        resolve.current = done;
        setDraft(prompt);
    }), []);
    const finish = (value) => {
        resolve.current?.(value);
        resolve.current = null;
        setDraft(null);
    };
    useEffect(() => () => {
        resolve.current?.(null);
    }, []);
    const { page, supported, online, error: acquisitionError } = useGenUi(target, confirm, retry);
    const snapshot = useSyncExternalStore(page?.subscribe ?? subscribeEmpty, page?.getSnapshot ?? (() => EMPTY_GEN_UI_SNAPSHOT), () => EMPTY_GEN_UI_SNAPSHOT);
    useEffect(() => {
        if (snapshot.escapeSequence)
            setExpanded(false);
    }, [snapshot.escapeSequence]);
    const title = reference.title || label("title");
    const status = !supported
        ? label("desktopOnly")
        : !online
            ? label("offline")
            : snapshot.phase === "error" || acquisitionError
                ? label("failed")
                : label("loading");
    const controls = (preview = false) => (_jsxs("div", { role: "toolbar", "aria-label": title, className: preview
            ? "flex shrink-0 items-center justify-end gap-1 p-2"
            : "absolute right-0 bottom-0 z-20 flex gap-1 rounded-lg bg-popover p-1 shadow-sm opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 data-[visible=true]:opacity-100 [@media(hover:none)]:opacity-100", "data-visible": snapshot.hovered || tweaks, "data-testid": "gen-ui-actions", children: [_jsx(Button, { variant: "ghost", size: "icon-sm", title: label("copyImage"), "aria-label": label("copyImage"), disabled: copying || snapshot.phase !== "ready", onClick: async () => {
                    if (!page)
                        return;
                    setCopying(true);
                    setError("");
                    try {
                        // 复制成功不保留视觉状态；原 copied 未复位，会让图标永久停在对勾。
                        await page.copyImage();
                    }
                    catch (reason) {
                        setError(String(reason));
                    }
                    finally {
                        setCopying(false);
                    }
                }, children: _jsx(Copy, {}) }), snapshot.groups.length > 0 && (_jsx(Button, { variant: "ghost", size: "icon-sm", title: label("tweak"), "aria-label": label("tweak"), "aria-pressed": tweaks, onClick: () => setTweaks(!tweaks), children: _jsx(SlidersHorizontal, {}) })), _jsx(Button, { ref: preview ? undefined : expandButton, variant: "ghost", size: "icon-sm", title: label(preview ? "collapse" : "expand"), "aria-label": label(preview ? "collapse" : "expand"), onClick: () => setExpanded(!preview), children: preview ? _jsx(X, {}) : _jsx(Maximize2, {}) })] }));
    const panel = tweaks && snapshot.groups.length > 0 && page ? (_jsx(TweakPanel, { snapshot: snapshot, page: page })) : null;
    // 会话父容器已经负责宽度；卡片再次限宽会让 inline UI 无法填满正文。
    return (_jsxs("section", { className: "my-3 w-full", "data-testid": "gen-ui-card", "data-gen-ui-phase": snapshot.phase, children: [_jsxs("div", { className: "group relative flow-root", children: [(snapshot.phase !== "ready" || !page) && (_jsxs("div", { className: "space-y-2 py-3 text-ui-sm text-foreground-subtle", role: "status", children: [_jsx("p", { children: status }), (snapshot.error || acquisitionError) && (_jsx("p", { className: "break-words text-ui-xs", children: snapshot.error || acquisitionError })), supported && (snapshot.phase === "error" || !online || acquisitionError) && (_jsx(Button, { variant: "outline", size: "sm", onClick: () => setRetry((value) => value + 1), children: label("retry") }))] })), page && _jsx(PageAnchor, { page: page, height: snapshot.height }), snapshot.phase === "ready" && controls()] }), !expanded && panel, error && (_jsx("p", { role: "alert", className: "text-ui-sm text-destructive", children: error })), _jsxs(Dialog, { open: expanded, onOpenChange: setExpanded, modal: false, children: [expanded && (_jsx(DialogPortal, { children: _jsx("div", { className: "fixed inset-0 z-40 bg-black/60", "data-testid": "gen-ui-backdrop", onPointerDown: () => setExpanded(false) }) })), _jsxs(DialogContent, { showOverlay: false, showCloseButton: false, "aria-describedby": undefined, className: "z-40 flex h-[85vh] w-[min(1100px,94vw)] max-w-none flex-col gap-0 overflow-hidden p-0 data-open:animate-none data-closed:animate-none", onInteractOutside: (event) => event.preventDefault(), onCloseAutoFocus: (event) => {
                            event.preventDefault();
                            expandButton.current?.focus();
                        }, children: [_jsx(DialogTitle, { className: "sr-only", children: title }), controls(true), page && _jsx(PreviewAnchor, { page: page, suspended: draft !== null }), panel] })] }), _jsx(Dialog, { open: draft !== null, onOpenChange: (open) => {
                    if (!open)
                        finish(null);
                }, children: _jsxs(DialogContent, { children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: label("confirm") }), _jsx(DialogDescription, { children: title })] }), _jsx(Textarea, { value: draft ?? "", onChange: (event) => setDraft(event.target.value), rows: 6 }), _jsxs(DialogFooter, { children: [_jsx(Button, { variant: "ghost", onClick: () => finish(null), children: label("cancel") }), _jsx(Button, { disabled: !draft?.trim(), onClick: () => finish(draft), children: label("send") })] })] }) })] }));
}
//# sourceMappingURL=GenUiCard.js.map