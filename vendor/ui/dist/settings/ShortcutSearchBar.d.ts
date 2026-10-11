import type { ReactNode } from "react";
import type { ShortcutKeySearch } from "./useShortcutKeySearch.js";
interface ShortcutSearchBarProps {
    query: string;
    onQueryChange: (value: string) => void;
    keySearch: ShortcutKeySearch;
    /** 武装态与行内录制互斥：激活按键搜索前先取消进行中的行内录制。 */
    onArmKeySearch: () => void;
    /** 搜索条右侧操作区（「全部恢复默认」按钮）。 */
    actions?: ReactNode;
}
/** 快捷键设置页搜索条：文本搜索框 + VSCode 式「按组合键搜索」按钮。 */
export declare function ShortcutSearchBar({ query, onQueryChange, keySearch, onArmKeySearch, actions, }: ShortcutSearchBarProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=ShortcutSearchBar.d.ts.map