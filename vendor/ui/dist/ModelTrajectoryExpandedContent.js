import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Maximize2Icon, Minimize2Icon } from "lucide-react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Badge } from "./components/ui/badge.js";
import { Button } from "./components/ui/button.js";
import { cn } from "./components/lib/utils.js";
import { ContentPartView } from "./ModelTrajectoryPaneDetails.js";
import { trajectoryToolCallInputs, trajectoryToolHasError, trajectoryToolMetadata, trajectoryToolOutputs, } from "./ModelTrajectoryToolPayload.js";
export function TrajectoryExpandedContent({ message, role, open, searchRevealed, intl, }) {
    const contentRef = useRef(null);
    const [isOverflowing, setIsOverflowing] = useState(false);
    const [showAll, setShowAll] = useState(false);
    const metadata = trajectoryToolMetadata(message);
    const toolPayloadHasError = trajectoryToolHasError(message);
    const toolPayloads = message.parts.some((part) => part.kind === "tool-result")
        ? trajectoryToolOutputs(message)
        : trajectoryToolCallInputs(message);
    const measureOverflow = useCallback(() => {
        const element = contentRef.current;
        if (!element || showAll)
            return;
        setIsOverflowing(element.scrollHeight > element.clientHeight + 2);
    }, [showAll]);
    useLayoutEffect(() => {
        measureOverflow();
    }, [measureOverflow]);
    useEffect(() => {
        const element = contentRef.current;
        if (!element)
            return;
        const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(measureOverflow);
        observer?.observe(element);
        window.addEventListener("resize", measureOverflow);
        return () => {
            observer?.disconnect();
            window.removeEventListener("resize", measureOverflow);
        };
    }, [measureOverflow]);
    useEffect(() => {
        if (!open)
            setShowAll(false);
    }, [open]);
    const contentExpanded = showAll || searchRevealed;
    const clipped = isOverflowing && !contentExpanded;
    const maskImage = clipped
        ? "linear-gradient(to bottom, black 0%, black calc(100% - 72px), transparent 100%)"
        : undefined;
    return (_jsxs("div", { "data-trajectory-expanded-content-shell": "", className: "relative min-w-0", children: [_jsxs("div", { ref: contentRef, "data-trajectory-message-content": "", "data-trajectory-user-content-card": role === "user" ? "" : undefined, "data-overflow-clipped": clipped || undefined, className: cn("flex w-full min-w-0 flex-col gap-1.5 overflow-hidden px-3 pt-0", isOverflowing ? "pb-14" : "pb-2", !contentExpanded && "max-h-64"), style: { maskImage, WebkitMaskImage: maskImage }, children: [metadata.names || metadata.ids ? (_jsxs("div", { className: "flex min-w-0 items-center gap-1", children: [metadata.names ? (_jsx(Badge, { "data-trajectory-expanded-tool-name": "", "data-trajectory-search-field": "tool-name", variant: "outline", className: "h-5 rounded-full border-border bg-tag px-2 font-mono text-ui-xs text-foreground-subtle", title: metadata.names, children: metadata.names })) : null, metadata.ids ? (_jsx(Badge, { "data-trajectory-expanded-tool-id": "", "data-trajectory-search-field": "tool-id", variant: "outline", className: "h-5 min-w-0 truncate rounded-full border-border bg-tag px-2 font-mono text-ui-xs text-foreground-subtle", title: metadata.ids, children: metadata.ids })) : null] })) : null, toolPayloads.length > 0
                        ? toolPayloads.map((output, outputIndex) => (_jsx("pre", { "data-trajectory-search-field": "content", "data-trajectory-tool-error-content": toolPayloadHasError ? "" : undefined, className: cn("min-w-0 whitespace-pre-wrap break-words font-mono text-ui-sm leading-relaxed", toolPayloadHasError
                                ? "rounded-lg bg-destructive/10 px-2 py-1.5 text-destructive"
                                : "text-foreground"), children: output.trim() }, outputIndex)))
                        : message.parts.map((part, partIndex) => (_jsx("div", { "data-trajectory-search-field": "content", children: _jsx(ContentPartView, { part: "text" in part && typeof part.text === "string"
                                    ? { ...part, text: part.text.trim() }
                                    : part, intl: intl, showToolHeader: false }) }, partIndex)))] }), isOverflowing && !searchRevealed ? (_jsx("div", { className: "absolute bottom-3 left-1/2 -translate-x-1/2", children: _jsxs(Button, { "data-trajectory-overflow-toggle": "", type: "button", variant: "outline", size: "sm", className: "rounded-full bg-surface/90 px-2 text-ui-sm shadow-sm supports-[backdrop-filter]:bg-surface/70 supports-[backdrop-filter]:backdrop-blur-md", onClick: () => setShowAll((current) => !current), children: [showAll ? (_jsx(Minimize2Icon, { className: "size-3.5" })) : (_jsx(Maximize2Icon, { className: "size-3.5" })), intl.formatMessage({
                            id: showAll ? "modelTrajectory.collapseContent" : "modelTrajectory.showAll",
                        })] }) })) : null] }));
}
//# sourceMappingURL=ModelTrajectoryExpandedContent.js.map