/**
 * 快捷键命令表与绑定序列化格式 —— 全仓库快捷键的唯一数据源。
 *
 * 设计约束：
 * - 本文件只含纯数据 + 纯函数，不依赖 DOM / Electron，供 renderer / main / services 共用；
 * - 绑定字符串同一形式同时用于 setting.json 持久化、renderer 匹配与 Electron 菜单 accelerator 透传；
 * - 键位知识只允许收敛在这里，消费方（useAppKeyboard、设置页、菜单）不得自行解析键位。
 */
/** 快捷键命令的分发通道：window = renderer 键盘分发（三端一致）；menu = 桌面应用菜单 accelerator。 */
export type ShortcutChannel = "window" | "menu";
/** 可配置快捷键的命令 ID，与 SHORTCUT_COMMANDS 一一对应。 */
export type ShortcutCommandId = "toggleInterfaceMode" | "openOnboarding" | "openCommandCenter" | "openSettings" | "findInTask" | "toggleSidebar" | "switchTheme" | "toggleTerminal" | "toggleSidePane" | "previousConversation" | "nextConversation" | "navigateBack" | "navigateForward" | "openModelMenu" | "cycleSessionMode" | "cycleThoughtLevel" | "newTask" | "openWorkspace" | "closeActiveContext" | "zoomIn" | "zoomOut" | "resetZoom" | "composerSend" | "composerInsertNewline";
/**
 * 命令作用域：global = 全局分发（useAppKeyboard / 菜单 accelerator）；
 * composer = 聊天输入框聚焦时由 Lexical 键盘行为插件消费，其余分发方零感知。
 * Enter 族键因此可以安全入表——杀伤半径被限制在输入框内。
 */
export type ShortcutScope = "global" | "composer";
export interface ShortcutCommandEntry {
    readonly id: ShortcutCommandId;
    readonly channel: ShortcutChannel;
    /** 作用域；缺省 global。 */
    readonly scope?: ShortcutScope;
    /** 默认绑定，规范形式序列化串；多条表示双默认（覆盖时整组替换）。 */
    readonly defaultBindings: readonly string[];
}
/**
 * 命令表：快捷键命令的唯一事实来源。
 * 注意：navigateBack/navigateForward 是历史前进/后退；previousConversation/nextConversation
 * 才是"上一个/下一个任务"（早期原型曾把两者标混，以本表为准）。
 */
export declare const SHORTCUT_COMMANDS: readonly ShortcutCommandEntry[];
/** 按命令 ID 取默认绑定；未知命令返回空数组（生效表 resolve 对未知命令整体忽略）。 */
export declare function getDefaultShortcutBindings(id: string): readonly string[];
/** 解析后的绑定：四个修饰键开关 + 规范化键名。 */
export interface ParsedShortcutBinding {
    cmdOrCtrl: boolean;
    ctrl: boolean;
    alt: boolean;
    shift: boolean;
    altGr: boolean;
    /** 规范化键名：小写字母 / 数字 / 符号字符（= - [ ] , . / ; ' ` \）/ 命名键（F1..F12、ArrowUp…）。 */
    key: string;
}
/** 键名规范化：合法返回规范化键名，非法返回 null。 */
export declare function normalizeShortcutKey(rawKey: string): string | null;
/**
 * 解析绑定串。宽容点：修饰键顺序不敏感（"Shift+CmdOrCtrl+p" 可解析）；
 * 严格点：键名必须规范形式（大写字母、裸 "+"、未知命名键均非法），重复修饰键非法。
 */
export declare function parseShortcutBinding(binding: string): ParsedShortcutBinding | null;
/** 序列化为规范形式（修饰键按固定顺序 + 规范键名）；任一部分非法返回 null。 */
export declare function serializeShortcutBinding(parsed: ParsedShortcutBinding): string | null;
/** 绑定串是否为合法规范形式（parse 后重新 serialize 与原串一致）。 */
export declare function isValidShortcutBinding(binding: string): boolean;
//# sourceMappingURL=shortcutCommands.d.ts.map