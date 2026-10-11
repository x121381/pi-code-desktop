/**
 * 快捷键执行内核 —— 匹配、录制、生效表与冲突检测的唯一实现。
 *
 * - 键位知识（格式解析、平台修饰键语义、保留键）只允许存在于此模块与 shared/shortcutCommands.ts；
 * - 全部为纯函数，DOM 事件以结构化参数传入，便于单测覆盖组合键边界；
 * - IME 组合中（isComposing / Process / Dead / keyCode 229）与长按 repeat 一律不匹配、不录制。
 */
import { type ShortcutCommandId } from "@zcode/shared";
import { type KeyboardShortcutPlatformInfo } from "@/lib/keyboardShortcuts.js";
/** 匹配/录制所需的键盘事件结构（KeyboardEvent 的子集，测试可构造）。 */
export interface ShortcutBindingEvent {
    key: string;
    code?: string;
    metaKey: boolean;
    ctrlKey: boolean;
    shiftKey: boolean;
    altKey: boolean;
    repeat?: boolean;
    isComposing?: boolean;
    /** 兼容旧事件模型；中文等 IME 组合中 Chromium 报 keyCode 229。 */
    keyCode?: number;
}
/** 判断事件是否为不应触发快捷键的噪声：长按 repeat、IME 组合中、死键。 */
export declare function isShortcutEventNoise(event: ShortcutBindingEvent): boolean;
/**
 * 通用匹配：binding（规范序列化串）与键盘事件是否命中。
 *
 * 修饰键为精确匹配：事件实际按下的修饰键必须与 binding 声明完全一致，
 * 多余修饰键（如 Cmd+Ctrl+K 命中 CmdOrCtrl+K）不算命中。
 * - CmdOrCtrl：macOS = meta 且无 ctrl；Windows/Linux = ctrl 且无 meta（平台隔离沿用 keyboardShortcuts.ts）；
 * - Ctrl：显式 Ctrl；在 Windows/Linux 上与 CmdOrCtrl 同义（录制在这些平台只会产出 CmdOrCtrl）；
 * - AltGr：Windows/Linux 上物理 AltGr 被 Chromium 报为 ctrl+alt 同按。
 */
export declare function matchesShortcutBinding(event: ShortcutBindingEvent, binding: string, platformInfo?: KeyboardShortcutPlatformInfo): boolean;
/**
 * 纯 Shift+可打印单字符绑定（如 Shift+f）判定。
 * 这类绑定与「输入大写字母」是同一物理事件；事件目标是可编辑元素时
 * 命中它必须放行，否则用户在输入框打不出该大写字母（按键被 preventDefault 吞掉并触发命令）。
 */
export declare function isShiftOnlyPrintableBinding(binding: string): boolean;
/**
 * 快捷键事件的目标是否为可编辑元素（input/textarea/select 或 contenteditable）。
 * 与 isShiftOnlyPrintableBinding 配套：可编辑目标内跳过纯 Shift 可打印键绑定。
 * 无 DOM 环境（node 单测）下恒为 false。
 */
export declare function isEditableShortcutEventTarget(target: EventTarget | null): boolean;
export type ShortcutRecordResult = {
    kind: "pending";
} | {
    kind: "binding";
    binding: string;
} | {
    kind: "invalid";
    reason: "no-modifier" | "unsupported-key";
};
/**
 * 录制键盘事件为规范绑定串。
 *
 * - pending：纯修饰键按下 / 无可反查 code 的 IME 噪声 —— 继续等待用户按出完整组合；
 * - binding：合法组合（主修饰键平台归一：mac 的 Cmd、win/linux 的 Ctrl → CmdOrCtrl；mac 显式 Ctrl 保留为 Ctrl）；
 * - invalid：无修饰键的普通键（F 键与方向键除外）或不支持的键。
 *
 * 键名提取优先 event.code 反查物理基键（Shift+7 在任何布局都录出 "7" 而非 "&"），
 * event.key 仅作 fallback。IME 组合事件（isComposing/Process/229）的 key 不可信，但
 * event.code 仍是物理键 —— 录制是点击录制按钮后的显式意图，中文输入法开启时焦点若在
 * 可编辑元素里，Shift+字母 会被 IME 吞成组合输入，此时仍按 code 录制（匹配侧照旧过滤，
 * 见 isShortcutEventNoise）。Escape / Backspace 的录制态语义（取消/清除）由设置页 UI 处理。
 */
export declare function recordShortcutBinding(event: ShortcutBindingEvent, platformInfo?: KeyboardShortcutPlatformInfo): ShortcutRecordResult;
/**
 * 设置页进入快捷键录制态时置 true。
 * 录制监听与 useAppKeyboard 同为 window capture 监听，但注册更晚（点击录制按钮才挂），
 * 同阶段先注册先执行——录制按下的组合会先触发原命令再进入录制处理，改键永远不成功。
 * useAppKeyboard 分发前检查此标记短路；menu 通道由 platform.setShortcutRecordingActive
 * 通知 main 暂时摘除菜单 accelerator（macOS 系统菜单会先于 renderer 吃掉按键）。
 */
export declare function setShortcutRecordingActive(active: boolean): void;
export declare function isShortcutRecordingActive(): boolean;
export type EffectiveShortcutBindings = Readonly<Record<ShortcutCommandId, readonly string[]>>;
/**
 * 计算生效表：命令表默认绑定 + 用户覆盖（整组替换）。
 * 显式空数组 = 用户清除为「未设置」（生效表为空，不回退默认——抢绑会把被抢命令清到这个状态）；
 * 全部条目非法时回退默认（手改 setting.json 写入非法条目不得让快捷键整体失效）。
 */
export declare function resolveEffectiveShortcutBindings(overrides?: Record<string, readonly string[]>): EffectiveShortcutBindings;
//# sourceMappingURL=bindings.d.ts.map