/*
 * Derived from vercel/ai-elements (packages/elements/src/tool.tsx).
 * Copyright 2023 Vercel, Inc. Licensed under Apache-2.0.
 * Modified by ZCode: local integration, formatting and adaptations.
 * See THIRD-PARTY-NOTICES.md in the repository root for license and provenance.
 */
"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Badge } from "../ui/badge.js";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible.js";
import { cn } from "../lib/utils.js";
import { CheckCircleIcon, ChevronDownIcon, CircleIcon, ClockIcon, WrenchIcon, XCircleIcon, } from "lucide-react";
import { isValidElement } from "react";
import { CodeBlock } from "./code-block.js";
export const Tool = ({ className, ...props }) => (_jsx(Collapsible, { className: cn("group not-prose mb-4 w-full rounded-md border", className), ...props }));
const statusLabels = {
    "approval-requested": "Awaiting Approval",
    "approval-responded": "Responded",
    "input-available": "Running",
    "input-streaming": "Pending",
    "output-available": "Completed",
    "output-denied": "Denied",
    "output-error": "Error",
};
const statusIcons = {
    "approval-requested": _jsx(ClockIcon, { className: "size-4 text-yellow-600" }),
    "approval-responded": _jsx(CheckCircleIcon, { className: "size-4 text-blue-600" }),
    "input-available": _jsx(ClockIcon, { className: "size-4 animate-pulse" }),
    "input-streaming": _jsx(CircleIcon, { className: "size-4" }),
    "output-available": _jsx(CheckCircleIcon, { className: "size-4 text-green-600" }),
    "output-denied": _jsx(XCircleIcon, { className: "size-4 text-orange-600" }),
    "output-error": _jsx(XCircleIcon, { className: "size-4 text-red-600" }),
};
export const getStatusBadge = (status) => (_jsxs(Badge, { className: "gap-1.5 rounded-full text-ui-base", variant: "secondary", children: [statusIcons[status], statusLabels[status]] }));
export const ToolHeader = ({ className, title, type, state, toolName, ...props }) => {
    const derivedName = type === "dynamic-tool" ? toolName : type.split("-").slice(1).join("-");
    return (_jsxs(CollapsibleTrigger, { className: cn("flex w-full items-center justify-between gap-4 p-3", className), ...props, children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(WrenchIcon, { className: "size-4 text-muted-foreground" }), _jsx("span", { className: "font-medium text-ui-base", children: title ?? derivedName }), getStatusBadge(state)] }), _jsx(ChevronDownIcon, { className: "size-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" })] }));
};
export const ToolContent = ({ className, ...props }) => (_jsx(CollapsibleContent, { className: cn("data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-2 data-[state=open]:slide-in-from-top-2 space-y-4 p-4 text-popover-foreground outline-none data-[state=closed]:animate-out data-[state=open]:animate-in", className), ...props }));
export const ToolInput = ({ className, input, ...props }) => (_jsxs("div", { className: cn("space-y-2 overflow-hidden", className), ...props, children: [_jsx("h4", { className: "font-medium text-muted-foreground text-ui-base uppercase tracking-wide", children: "Parameters" }), _jsx("div", { className: "max-h-60 overflow-auto rounded-md bg-muted/50", children: _jsx(CodeBlock, { code: JSON.stringify(input, null, 2), language: "json" }) })] }));
export const ToolOutput = ({ className, output, errorText, ...props }) => {
    if (!(output || errorText)) {
        return null;
    }
    let Output = null;
    if (!errorText) {
        Output = _jsx("div", { children: output });
        if (typeof output === "object" && !isValidElement(output)) {
            Output = _jsx(CodeBlock, { code: JSON.stringify(output, null, 2), language: "json" });
        }
        else if (typeof output === "string") {
            Output = _jsx(CodeBlock, { code: output, language: "json" });
        }
    }
    return (_jsxs("div", { className: cn("space-y-2", className), ...props, children: [_jsx("h4", { className: "font-medium text-muted-foreground text-ui-base uppercase tracking-wide", children: errorText ? "Error" : "Result" }), _jsxs("div", { className: cn("max-h-60 overflow-auto rounded-md text-ui-base [&_table]:w-full", errorText ? "bg-destructive/10 text-destructive" : "bg-muted/50 text-foreground"), children: [errorText ? (_jsx("div", { className: "whitespace-pre-wrap p-3", children: errorText })) : null, Output] })] }));
};
//# sourceMappingURL=tool.js.map