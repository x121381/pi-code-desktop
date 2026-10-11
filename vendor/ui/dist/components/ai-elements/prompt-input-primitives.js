/*
 * Derived from vercel/ai-elements (packages/elements/src/prompt-input.tsx).
 * Copyright 2023 Vercel, Inc. Licensed under Apache-2.0.
 * Modified by ZCode: split components and adapt local imports and behavior.
 * See THIRD-PARTY-NOTICES.md in the repository root for license and provenance.
 */
"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, } from "../ui/command.js";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card.js";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select.js";
import { cn } from "../lib/utils.js";
export const PromptInputSelect = (props) => _jsx(Select, { ...props });
export const PromptInputSelectTrigger = ({ className, ...props }) => (_jsx(SelectTrigger, { className: cn("border-none bg-transparent font-medium text-muted-foreground shadow-none transition-colors", "hover:bg-accent hover:text-foreground aria-expanded:bg-accent aria-expanded:text-foreground", className), ...props }));
export const PromptInputSelectContent = ({ className, ...props }) => _jsx(SelectContent, { className: cn(className), ...props });
export const PromptInputSelectItem = ({ className, ...props }) => (_jsx(SelectItem, { className: cn(className), ...props }));
export const PromptInputSelectValue = ({ className, ...props }) => (_jsx(SelectValue, { className: cn(className), ...props }));
export const PromptInputHoverCard = ({ openDelay = 0, closeDelay = 0, ...props }) => (_jsx(HoverCard, { closeDelay: closeDelay, openDelay: openDelay, ...props }));
export const PromptInputHoverCardTrigger = (props) => (_jsx(HoverCardTrigger, { ...props }));
export const PromptInputHoverCardContent = ({ align = "start", ...props }) => _jsx(HoverCardContent, { align: align, ...props });
export const PromptInputTabsList = ({ className, ...props }) => (_jsx("div", { className: cn(className), ...props }));
export const PromptInputTab = ({ className, ...props }) => (_jsx("div", { className: cn(className), ...props }));
export const PromptInputTabLabel = ({ className, ...props }) => (_jsx("h3", { className: cn("mb-2 px-3 font-medium text-muted-foreground text-ui-base", className), ...props }));
export const PromptInputTabBody = ({ className, ...props }) => (_jsx("div", { className: cn("space-y-1", className), ...props }));
export const PromptInputTabItem = ({ className, ...props }) => (_jsx("div", { className: cn("flex items-center gap-2 px-3 py-2 text-ui-base hover:bg-accent", className), ...props }));
export const PromptInputCommand = ({ className, ...props }) => (_jsx(Command, { className: cn(className), ...props }));
export const PromptInputCommandInput = ({ className, ...props }) => (_jsx(CommandInput, { className: cn(className), ...props }));
export const PromptInputCommandList = ({ className, ...props }) => (_jsx(CommandList, { className: cn(className), ...props }));
export const PromptInputCommandEmpty = ({ className, ...props }) => (_jsx(CommandEmpty, { className: cn(className), ...props }));
export const PromptInputCommandGroup = ({ className, ...props }) => (_jsx(CommandGroup, { className: cn(className), ...props }));
export const PromptInputCommandItem = ({ className, ...props }) => (_jsx(CommandItem, { className: cn(className), ...props }));
export const PromptInputCommandSeparator = ({ className, ...props }) => _jsx(CommandSeparator, { className: cn(className), ...props });
//# sourceMappingURL=prompt-input-primitives.js.map