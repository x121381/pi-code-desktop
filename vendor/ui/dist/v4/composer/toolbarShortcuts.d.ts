import type { ZCodeConfigOption } from "@zcode/shared";
import { type EffectiveShortcutBindings } from "@/shortcuts/bindings.js";
type ChatToolbarShortcutKey = "m" | "ctrlShiftM" | "t" | null;
/** 旧 chatInputControlShortcuts.getChatToolbarShortcutKey 原样恢复。 */
export declare function getChatToolbarShortcutKey(category: ZCodeConfigOption["category"]): ChatToolbarShortcutKey;
/** 计算 select 选项的下一次循环取值（模式循环用）。 */
export declare function getNextConfigSelectValue(option: Pick<ZCodeConfigOption, "type" | "currentValue" | "options">): string | null;
interface ToolbarShortcutKeyboardEvent {
    key: string;
    code?: string;
    ctrlKey: boolean;
    metaKey: boolean;
    shiftKey: boolean;
    altKey: boolean;
    defaultPrevented: boolean;
    repeat: boolean;
    isComposing: boolean;
}
interface ToolbarShortcutState {
    hasAnyOption: boolean;
    toolbarDisabled: boolean;
    modelMenuDisabled: boolean;
    modelOption?: ZCodeConfigOption;
    modeOption?: ZCodeConfigOption;
    thoughtOption?: ZCodeConfigOption;
}
type ToolbarShortcutAction = "openModelMenu" | "cycleSessionMode" | "cycleThoughtLevel";
/**
 * 按生效表解析工具条动作（工具条热键转正为可配置命令）。
 * 键位匹配走内核（命令表 + matcher，修饰精确匹配，与旧 matchesCtrlShortcut 系列
 * 对 "Ctrl+m" / "Ctrl+Shift+m" / "Ctrl+t" 的语义一致）；原 option 归属与 disabled
 * 门控保持不变。事件与生效表由调用方传入，纯函数可独立单测。
 */
export declare function resolveToolbarShortcutAction(event: ToolbarShortcutKeyboardEvent, effective: EffectiveShortcutBindings, { hasAnyOption, toolbarDisabled, modelMenuDisabled, modelOption, modeOption, thoughtOption, }: ToolbarShortcutState): ToolbarShortcutAction | null;
export declare function useToolbarShortcutBindings(params: {
    hasAnyOption: boolean;
    toolbarDisabled: boolean;
    modelMenuDisabled: boolean;
    modelOption?: ZCodeConfigOption;
    modeOption?: ZCodeConfigOption;
    thoughtOption?: ZCodeConfigOption;
    onOpenModelMenu: () => void;
    /** Ctrl+Shift+M：参考 thought level，按选项顺序快速切换会话模式，不打开菜单。 */
    onCycleSessionMode: () => void;
    /** Ctrl+T：保留 thought level 快速切换，不受默认 select 菜单交互影响。 */
    onCycleThoughtLevel: () => void;
}): void;
export {};
//# sourceMappingURL=toolbarShortcuts.d.ts.map