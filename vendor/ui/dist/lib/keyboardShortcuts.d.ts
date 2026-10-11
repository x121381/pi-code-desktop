export interface KeyboardShortcutPlatformInfo {
    platform?: string;
    userAgent?: string;
}
interface PrimaryShortcutKeyboardEvent {
    key: string;
    code?: string;
    metaKey: boolean;
    ctrlKey: boolean;
    shiftKey: boolean;
    altKey: boolean;
}
export declare function isAppleKeyboardPlatform(platformInfo?: KeyboardShortcutPlatformInfo): boolean;
export declare function formatCommandShortcutLabel(key: string, platformInfo?: KeyboardShortcutPlatformInfo): string;
export declare function formatAltCommandShortcutLabel(key: string, platformInfo?: KeyboardShortcutPlatformInfo): string;
export declare function formatShiftCommandShortcutLabel(key: string, platformInfo?: KeyboardShortcutPlatformInfo): string;
export declare function matchesPrimaryShortcut(event: PrimaryShortcutKeyboardEvent, key: string, platformInfo?: KeyboardShortcutPlatformInfo): boolean;
export declare function matchesPrimaryShiftShortcut(event: PrimaryShortcutKeyboardEvent, key: string, platformInfo?: KeyboardShortcutPlatformInfo): boolean;
export declare function matchesPrimaryAltShortcut(event: PrimaryShortcutKeyboardEvent, key: string, platformInfo?: KeyboardShortcutPlatformInfo): boolean;
export declare function matchesCtrlShortcut(event: PrimaryShortcutKeyboardEvent, key: string): boolean;
export declare function matchesCtrlShiftShortcut(event: PrimaryShortcutKeyboardEvent, key: string): boolean;
/**
 * 纯 Shift+Tab（不含 Ctrl/Cmd/Alt）匹配工具。
 * 历史上聊天工具栏 mode 曾使用该组合键；保留给仍需要区分反向 Tab 导航的调用方。
 */
export declare function matchesShiftTab(event: PrimaryShortcutKeyboardEvent): boolean;
export declare function formatShiftTabShortcutLabel(platformInfo?: KeyboardShortcutPlatformInfo): string;
export {};
//# sourceMappingURL=keyboardShortcuts.d.ts.map