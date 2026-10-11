import type { Dispatch, SetStateAction } from "react";
import type { ShortcutCommandId } from "@zcode/shared";
import { type EffectiveShortcutBindings } from "@/shortcuts/bindings.js";
import type { RecordingState } from "./ShortcutBindingRow.js";
interface UseShortcutRecordingOptions {
    recording: RecordingState | null;
    setRecording: Dispatch<SetStateAction<RecordingState | null>>;
    /** 生效绑定表（Section 已按 overrides resolve）。 */
    effective: EffectiveShortcutBindings;
    overrides: Record<string, readonly string[]> | undefined;
    isDesktop: boolean;
    /** 录制态 Backspace：恢复默认（Section 的预检逻辑）。 */
    clearBinding: (commandId: ShortcutCommandId) => void;
    appendBinding: (commandId: ShortcutCommandId, binding: string) => void;
    replaceBindingAt: (commandId: ShortcutCommandId, bindingIndex: number, binding: string) => void;
}
/**
 * 录制态键盘捕获：window keydown capture。Escape 取消；Backspace 恢复默认；
 * 其余交给内核录制器。落盘按 RecordingState.mode 分派：add → 追加一条；replace → 替换
 * bindingIndex 指向的条（null = 未分配占位行录第一条，等价追加）。
 * 同命令物理等价重复在录制入口标红拒绝（add 比全部条目，replace 跳过目标条）。
 */
export declare function useShortcutRecording({ recording, setRecording, effective, overrides, isDesktop, clearBinding, appendBinding, replaceBindingAt, }: UseShortcutRecordingOptions): void;
export {};
//# sourceMappingURL=useShortcutRecording.d.ts.map