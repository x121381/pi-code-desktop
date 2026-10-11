import { DropdownMenu, DropdownMenuContent, DropdownMenuItem } from "../ui/dropdown-menu.js";
import type { ComponentProps } from "react";
import type { PromptInputButtonProps } from "./prompt-input-buttons.js";
export type PromptInputActionAddAttachmentsProps = ComponentProps<typeof DropdownMenuItem> & {
    label?: string;
};
export declare const PromptInputActionAddAttachments: ({ label, ...props }: PromptInputActionAddAttachmentsProps) => import("react/jsx-runtime").JSX.Element;
export type PromptInputActionAddScreenshotProps = ComponentProps<typeof DropdownMenuItem> & {
    label?: string;
};
export declare const PromptInputActionAddScreenshot: ({ label, onSelect, ...props }: PromptInputActionAddScreenshotProps) => import("react/jsx-runtime").JSX.Element;
export type PromptInputActionMenuProps = ComponentProps<typeof DropdownMenu>;
export declare const PromptInputActionMenu: (props: PromptInputActionMenuProps) => import("react/jsx-runtime").JSX.Element;
export type PromptInputActionMenuTriggerProps = PromptInputButtonProps;
export declare const PromptInputActionMenuTrigger: ({ className, children, ...props }: PromptInputActionMenuTriggerProps) => import("react/jsx-runtime").JSX.Element;
export type PromptInputActionMenuContentProps = ComponentProps<typeof DropdownMenuContent>;
export declare const PromptInputActionMenuContent: ({ className, ...props }: PromptInputActionMenuContentProps) => import("react/jsx-runtime").JSX.Element;
export type PromptInputActionMenuItemProps = ComponentProps<typeof DropdownMenuItem>;
export declare const PromptInputActionMenuItem: ({ className, ...props }: PromptInputActionMenuItemProps) => import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=prompt-input-actions.d.ts.map