import type { ZCodeProvider } from "@zcode/shared";
import type { MentionItem } from "./mentionTypes.js";
interface MentionPluginProps {
    container?: HTMLElement | null;
    workspacePath: string;
    workspaceIdentity?: string;
    /** 已有 Session 的 id；null/undefined = 新建草稿。决定 Plugins 分组的 catalog authority。 */
    sessionId?: string | null;
    disabled?: boolean;
    onWhiteboardMentionSelected?: (boardId: string) => void | Promise<void>;
}
export declare function getWrappedMentionIndex(currentIndex: number, delta: number, itemCount: number): number;
/**
 * 在循环导航的基础上跳过禁选项（V1 同名 Plugin 冲突项）。
 * 全部禁选时保持原地不动，Enter/Tab 的选择守卫会拒绝插入。
 */
export declare function getNextEnabledMentionIndex(currentIndex: number, delta: number, items: ReadonlyArray<Pick<MentionItem, "disabled">>): number;
/**
 * 候选首次出现或异步分组更新时，把选中项收敛到可选条目。
 * 根因：冲突 Plugin 保持可见后可能占据 flatItems[0]；若仍默认选中 0，
 * 第一次 Enter/Tab 会命中禁选项并回落编辑器默认行为，而不是继续键盘导航。
 */
export declare function coerceEnabledMentionIndex(currentIndex: number, items: ReadonlyArray<Pick<MentionItem, "disabled">>): number;
/**
 * IME 组合期间（拼音未上屏）是否冻结 @ 面板重算：中间态字母会被当作 query 逐字过滤一轮，
 * 面板闪烁且中间态结果错误；composition 提交后 Lexical 会再派发一次 update 完成重算。
 * Android 例外：Chrome + Gboard 对拉丁词也走 composition（整词到空格才 compositionend），
 * 冻结会让手机 Web 的 @ 面板失去逐字过滤，因此 Android 保持实时重算。
 */
export declare function shouldFreezeMentionRecalcWhileComposing(isComposing: boolean, userAgent: string): boolean;
export declare function MentionPlugin({ workspacePath, workspaceIdentity, sessionId, provider, container, disabled, onWhiteboardMentionSelected, }: MentionPluginProps & {
    provider: ZCodeProvider;
}): import("react").ReactPortal | null;
export {};
//# sourceMappingURL=MentionPlugin.d.ts.map