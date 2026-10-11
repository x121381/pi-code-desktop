import type { ShortcutCommandEntry, ShortcutCommandId } from "@zcode/shared";
export interface RecordingState {
    commandId: ShortcutCommandId;
    /** 录制模式：replace = 替换某条绑定（bindingIndex 指向现有条，null = 未分配录第一条）；add = 给命令追加一条。 */
    mode: "replace" | "add";
    /** replace 模式的目标下标；add 模式为 null。 */
    bindingIndex: number | null;
    /** 录制中的实时预览 label；null 表示尚无完整组合。 */
    preview: string | null;
    /** 冲突 / 无效提示（i18n 后文案），标红展示。 */
    error: string | null;
    /** 被其他 app 命令占用时的待确认绑定；「仍要绑定」二次确认后抢绑（系统保留键不给确认入口）。 */
    conflictBinding: string | null;
}
interface ShortcutBindingRowProps {
    entry: ShortcutCommandEntry;
    /** i18n 后的命令名（主组件统一格式化后传入）。 */
    commandLabel: string;
    bindings: readonly string[];
    /** 该命令是否存在用户覆盖条目（true 时键帽用品牌色标出自定义）。 */
    isOverridden: boolean;
    isRecording: boolean;
    recording: RecordingState | null;
    /** Web 端 menu 通道命令：录制入口置灰（默认键被根级回退监听固定消费）。 */
    menuChannelUnavailable: boolean;
    /** 替换某条绑定（index = 生效列表下标；null = 未分配录第一条）。 */
    onRecord: (bindingIndex: number | null) => void;
    onSteal: (binding: string) => void;
    /** 清空全部绑定 = 未分配（显式空数组，不回退默认）。 */
    onClearAll: () => void;
}
/**
 * 快捷键设置页的命令行：左列命令名跨全部绑定垂直居中，右列是该命令的
 * 绑定列表——每条一行：逐键键帽 + 铅笔（点击即替换该条录制）；录制态内嵌在对应
 * 条目位置。暂不支持新增/删除绑定（仅替换），操作列为「清空全部」垃圾桶。
 */
export declare function ShortcutBindingRow({ entry, commandLabel, bindings, isOverridden, isRecording, recording, menuChannelUnavailable, onRecord, onSteal, onClearAll, }: ShortcutBindingRowProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=ShortcutBindingRow.d.ts.map