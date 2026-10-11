import type { CSSProperties } from "react";
export declare const WINDOWS_CAPTION_CONTROLS_DEFAULT_RIGHT_INSET_PX = 136;
export declare const WINDOWS_CAPTION_CONTROLS_RIGHT_INSET_VAR = "var(--windows-caption-controls-right-inset)";
export declare const WINDOWS_CAPTION_CONTROL_WIDTH_VAR = "var(--windows-caption-control-width)";
type WindowsCaptionControlsStyle = CSSProperties & {
    "--windows-caption-controls-right-inset": string;
    "--windows-caption-control-width": string;
};
export declare function createWindowsCaptionControlsStyle(_fallbackRightInsetPx?: number): WindowsCaptionControlsStyle;
export declare const WINDOWS_CAPTION_CONTROL_CLASS = "h-full w-[var(--windows-caption-control-width,46px)] rounded-none";
export {};
//# sourceMappingURL=windowCaptionControls.d.ts.map