import { InputGroupButton } from "../ui/input-group.js";
import { TooltipContent } from "../ui/tooltip.js";
import type { ChatStatus } from "ai";
import type { ComponentProps, ReactNode } from "react";
export type PromptInputButtonTooltip = string | {
    content: ReactNode;
    shortcut?: string;
    side?: ComponentProps<typeof TooltipContent>["side"];
};
export type PromptInputButtonProps = ComponentProps<typeof InputGroupButton> & {
    tooltip?: PromptInputButtonTooltip;
};
export declare const PromptInputButton: ({ variant, className, size, tooltip, ...props }: PromptInputButtonProps) => import("react/jsx-runtime").JSX.Element;
export type PromptInputSubmitProps = ComponentProps<typeof InputGroupButton> & {
    status?: ChatStatus;
    onStop?: () => void;
};
export declare const PromptInputSubmit: ({ className, variant, size, status, onStop, onClick, children, ...props }: PromptInputSubmitProps) => import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=prompt-input-buttons.d.ts.map