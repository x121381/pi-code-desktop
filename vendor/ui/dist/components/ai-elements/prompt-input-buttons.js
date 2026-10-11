/*
 * Derived from vercel/ai-elements (packages/elements/src/prompt-input.tsx).
 * Copyright 2023 Vercel, Inc. Licensed under Apache-2.0.
 * Modified by ZCode: split components and adapt local imports and behavior.
 * See THIRD-PARTY-NOTICES.md in the repository root for license and provenance.
 */
"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { InputGroupButton } from "../ui/input-group.js";
import { Spinner } from "../ui/spinner.js";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip.js";
import { cn } from "../lib/utils.js";
import { CornerDownLeftIcon, SquareIcon, XIcon } from "lucide-react";
import { Children, useCallback } from "react";
export const PromptInputButton = ({ variant = "ghost", className, size, tooltip, ...props }) => {
    const newSize = size ?? (Children.count(props.children) > 1 ? "sm" : "icon-sm");
    const button = (_jsx(InputGroupButton, { className: cn(className), size: newSize, type: "button", variant: variant, ...props }));
    if (!tooltip) {
        return button;
    }
    const tooltipContent = typeof tooltip === "string" ? tooltip : tooltip.content;
    const shortcut = typeof tooltip === "string" ? undefined : tooltip.shortcut;
    const side = typeof tooltip === "string" ? "top" : (tooltip.side ?? "top");
    return (_jsxs(Tooltip, { children: [_jsx(TooltipTrigger, { asChild: true, children: button }), _jsxs(TooltipContent, { side: side, children: [tooltipContent, shortcut && _jsx("span", { className: "ml-2 text-muted-foreground", children: shortcut })] })] }));
};
export const PromptInputSubmit = ({ className, variant = "default", size = "icon-sm", status, onStop, onClick, children, ...props }) => {
    const isGenerating = status === "submitted" || status === "streaming";
    let Icon = _jsx(CornerDownLeftIcon, { className: "size-4" });
    if (status === "submitted") {
        Icon = _jsx(Spinner, {});
    }
    else if (status === "streaming") {
        Icon = _jsx(SquareIcon, { className: "size-4" });
    }
    else if (status === "error") {
        Icon = _jsx(XIcon, { className: "size-4" });
    }
    const handleClick = useCallback((e) => {
        if (isGenerating && onStop) {
            e.preventDefault();
            onStop();
            return;
        }
        onClick?.(e);
    }, [isGenerating, onStop, onClick]);
    return (_jsx(InputGroupButton, { "aria-label": isGenerating ? "Stop" : "Submit", className: cn(className), onClick: handleClick, size: size, type: isGenerating && onStop ? "button" : "submit", variant: variant, ...props, children: children ?? Icon }));
};
//# sourceMappingURL=prompt-input-buttons.js.map