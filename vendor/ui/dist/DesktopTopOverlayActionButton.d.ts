import type { ComponentProps, ReactNode } from "react";
import { ControlHintTooltip } from "@/ControlHintTooltip.js";
interface DesktopTopOverlayActionButtonProps {
    title: string;
    ariaLabel: string;
    children: ReactNode;
    shortcut?: string;
    disabled?: boolean;
    onClick: () => void;
    onMouseEnter?: () => void;
    side?: ComponentProps<typeof ControlHintTooltip>["side"];
    buttonClassName?: string;
    testId?: string;
}
export declare function DesktopTopOverlayActionButton({ title, ariaLabel, children, shortcut, disabled, onClick, onMouseEnter, side, buttonClassName, testId, }: DesktopTopOverlayActionButtonProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=DesktopTopOverlayActionButton.d.ts.map