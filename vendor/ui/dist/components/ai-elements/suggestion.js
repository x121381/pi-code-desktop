/*
 * Derived from vercel/ai-elements (packages/elements/src/suggestion.tsx).
 * Copyright 2023 Vercel, Inc. Licensed under Apache-2.0.
 * Modified by ZCode: local integration, formatting and adaptations.
 * See THIRD-PARTY-NOTICES.md in the repository root for license and provenance.
 */
"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from "../ui/button.js";
import { ScrollArea, ScrollBar } from "../ui/scroll-area.js";
import { cn } from "../lib/utils.js";
import { useCallback } from "react";
export const Suggestions = ({ className, children, ...props }) => (_jsxs(ScrollArea, { className: "w-full overflow-x-auto whitespace-nowrap", ...props, children: [_jsx("div", { className: cn("flex w-max flex-nowrap items-center gap-2", className), children: children }), _jsx(ScrollBar, { className: "hidden", orientation: "horizontal" })] }));
export const Suggestion = ({ suggestion, onClick, className, variant = "outline", size = "sm", children, ...props }) => {
    const handleClick = useCallback(() => {
        onClick?.(suggestion);
    }, [onClick, suggestion]);
    return (_jsx(Button, { className: cn("cursor-pointer rounded-full px-4", className), onClick: handleClick, size: size, type: "button", variant: variant, ...props, children: children || suggestion }));
};
//# sourceMappingURL=suggestion.js.map