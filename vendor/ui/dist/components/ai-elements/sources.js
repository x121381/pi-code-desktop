/*
 * Derived from vercel/ai-elements (packages/elements/src/sources.tsx).
 * Copyright 2023 Vercel, Inc. Licensed under Apache-2.0.
 * Modified by ZCode: local integration, formatting and adaptations.
 * See THIRD-PARTY-NOTICES.md in the repository root for license and provenance.
 */
"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible.js";
import { cn } from "../lib/utils.js";
import { BookIcon, ChevronDownIcon } from "lucide-react";
export const Sources = ({ className, ...props }) => (_jsx(Collapsible, { className: cn("not-prose mb-4 text-primary text-ui-base", className), ...props }));
export const SourcesTrigger = ({ className, count, children, ...props }) => (_jsx(CollapsibleTrigger, { className: cn("flex items-center gap-2", className), ...props, children: children ?? (_jsxs(_Fragment, { children: [_jsxs("p", { className: "font-medium", children: ["Used ", count, " sources"] }), _jsx(ChevronDownIcon, { className: "h-4 w-4" })] })) }));
export const SourcesContent = ({ className, ...props }) => (_jsx(CollapsibleContent, { className: cn("mt-3 flex w-fit flex-col gap-2", "data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-2 data-[state=open]:slide-in-from-top-2 outline-none data-[state=closed]:animate-out data-[state=open]:animate-in", className), ...props }));
export const Source = ({ href, title, children, ...props }) => (_jsx("a", { className: "flex items-center gap-2", href: href, rel: "noreferrer", target: "_blank", ...props, children: children ?? (_jsxs(_Fragment, { children: [_jsx(BookIcon, { className: "h-4 w-4" }), _jsx("span", { className: "block font-medium", children: title })] })) }));
//# sourceMappingURL=sources.js.map