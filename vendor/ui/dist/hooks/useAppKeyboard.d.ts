import { type ShortcutCommandId } from "@zcode/shared";
/** window 通道快捷键的处理器表：命令 ID → 回调；null/缺失表示该命令当前不可用。 */
export type AppKeyboardHandlers = Partial<Record<ShortcutCommandId, (() => void) | null>>;
/**
 * 全局键盘分发薄壳：window keydown capture → 内核通用匹配 → 命令 handler。
 *
 * - 键位知识全部在 shortcuts 内核（生效表 + 匹配器），本 hook 不认识任何具体按键；
 * - handler 为 null/缺失时不 preventDefault（功能不可用时放行浏览器默认行为，如历史导航）；
 * - 交互说明：capture 阶段拦截，保证焦点落在普通页面区域时不会被浏览器或桌面壳默认行为抢走；
 * - 监听只挂一次，handlers/生效表经 ref 透传 —— 设置页改键后下一次按键即按新键位分发。
 */
export declare function useAppKeyboard(handlers: AppKeyboardHandlers): void;
//# sourceMappingURL=useAppKeyboard.d.ts.map