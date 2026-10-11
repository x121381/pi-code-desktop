import { type KeyboardShortcutPlatformInfo } from "../lib/keyboardShortcuts.js";
/**
 * 绑定串 → 逐键 token（设置页键帽渲染用）：macOS ["⇧","⌘","P"]、
 * Windows/Linux ["Ctrl","Shift","P"]。label 展示与键帽渲染共用同一 token 序列，
 * 顺序约定只有这一份；每个 token 独立渲染 Kbd 键帽，尺寸才不随内容漂移。
 */
export declare function formatShortcutBindingLabelParts(binding: string, platformInfo?: KeyboardShortcutPlatformInfo): string[];
/**
 * 绑定串 → 平台展示 label。macOS 用符号风格（⌘ K、⌃ ⌥ ⇧ ⌘ P），Windows/Linux 用
 * Ctrl+Shift+P 风格；"=" 显示为 "+"（zoom 语义），命名键原样。
 */
export declare function formatShortcutBindingLabel(binding: string, platformInfo?: KeyboardShortcutPlatformInfo): string;
//# sourceMappingURL=label.d.ts.map