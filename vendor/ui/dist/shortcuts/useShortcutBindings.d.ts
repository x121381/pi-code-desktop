import { type ShortcutCommandId } from "@zcode/shared";
import { type EffectiveShortcutBindings } from "./bindings.js";
/** 当前生效的快捷键表（默认 + 用户覆盖合并后的只读视图）。 */
export declare function useEffectiveShortcutBindings(): EffectiveShortcutBindings;
/**
 * 命令展示 label：生效表首个绑定格式化。
 * 未分配（覆盖为显式空数组）返回空串、不回退默认展示——tooltip 提示的键位必须与实际
 * 生效一致，否则清除后的命令仍提示默认键、按键却不响应（空数组语义的展示侧延伸）。
 * 生效表按命令表全集构建，只有非法 commandId 才会缺键，同样按无键处理。
 */
export declare function useShortcutCommandLabel(commandId: ShortcutCommandId): string;
//# sourceMappingURL=useShortcutBindings.d.ts.map