import { type ComponentProps, type ReactNode, type Ref } from "react";
import { TooltipContent } from "@/components/ui/tooltip.js";
interface ControlHintTooltipProps {
    children: ReactNode;
    title: ReactNode;
    description?: string;
    shortcut?: string;
    standalone?: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    side?: ComponentProps<typeof TooltipContent>["side"];
    align?: ComponentProps<typeof TooltipContent>["align"];
    sideOffset?: ComponentProps<typeof TooltipContent>["sideOffset"];
    className?: string;
    triggerClassName?: string;
    triggerRef?: Ref<HTMLElement>;
}
export declare function ControlHintTooltip({ children, title, description, shortcut, standalone, open, onOpenChange, side, align, sideOffset, className, triggerClassName, triggerRef, }: ControlHintTooltipProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=ControlHintTooltip.d.ts.map