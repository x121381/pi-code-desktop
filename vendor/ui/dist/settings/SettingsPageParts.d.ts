import type { ReactNode } from "react";
import type { BundledTheme } from "shiki";
/**
 * Settings 与同级管理页在窗口框架内共享同一内容列。
 * Automations 曾在 shell 与页面内各自居中、加 padding，导致它与 Skills 等
 * Settings 功能的标题起点、顶部基线和内容宽度不一致。
 */
export declare const SETTINGS_FRAME_CONTENT_CLASSNAME = "mx-auto w-full max-w-4xl px-4 pb-8 pt-0 lg:px-8 lg:pb-10";
export declare function ThemeSelect({ value, onValueChange, }: {
    value: BundledTheme;
    onValueChange: (value: BundledTheme) => void;
}): import("react/jsx-runtime").JSX.Element;
export declare function ThemePreviewCard({ mode, title, themeName, theme, isActive, showLineNumbers, wrapLongLines, fontSizePx, }: {
    mode: "light" | "dark";
    title: string;
    themeName: string;
    theme: BundledTheme;
    isActive: boolean;
    showLineNumbers: boolean;
    wrapLongLines: boolean;
    fontSizePx: number;
}): import("react/jsx-runtime").JSX.Element;
export declare function SettingsRow({ label, description, control, detail, controlLayout, }: {
    label: ReactNode;
    description?: ReactNode;
    control: ReactNode;
    detail?: ReactNode;
    controlLayout?: "default" | "wide";
}): import("react/jsx-runtime").JSX.Element;
export declare function SettingsGroupCard({ children }: {
    children: ReactNode;
}): import("react/jsx-runtime").JSX.Element;
export declare function SettingsBadge({ children }: {
    children: ReactNode;
}): import("react/jsx-runtime").JSX.Element;
export declare function SettingsRangeControl({ value, min, max, step, onChange, valueLabel, valueLabelClassName, }: {
    value: number;
    min: number;
    max: number;
    step: number;
    onChange: (value: number) => void;
    valueLabel: ReactNode;
    valueLabelClassName?: string;
}): import("react/jsx-runtime").JSX.Element;
export declare function getThemeOptionLabel(value: BundledTheme): string;
//# sourceMappingURL=SettingsPageParts.d.ts.map