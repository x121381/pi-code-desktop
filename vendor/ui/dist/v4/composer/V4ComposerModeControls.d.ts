import type { V4ComposerToolbarProps } from "@/v4/composer/V4ComposerToolbar.js";
/** Plan 是独立勾选项，三种权限仍为单选；只编辑草稿，不向 Runtime 发切换命令。 */
declare function V4ComposerModeSwitchImpl({ provider, draftConfig, disabled, activeConfigPicker, onConfigPickerOpenChange, onSwitchMode, }: Pick<V4ComposerToolbarProps, "workspacePath" | "workspaceIdentity" | "provider" | "draftConfig" | "disabled" | "activeConfigPicker" | "onConfigPickerOpenChange" | "onSwitchMode">): import("react/jsx-runtime").JSX.Element | null;
export declare const V4ComposerModeSwitch: import("react").MemoExoticComponent<typeof V4ComposerModeSwitchImpl>;
export {};
//# sourceMappingURL=V4ComposerModeControls.d.ts.map