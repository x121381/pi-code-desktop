import { jsx as _jsx } from "react/jsx-runtime";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs.js";
/** 设置详情页共用的紧凑分段切换，避免相同层级出现多套 Tabs 视觉。 */
export function SettingsSegmentedTabs({ items, value, onValueChange, }) {
    return (_jsx(Tabs, { value: value, onValueChange: (nextValue) => onValueChange(nextValue), className: "gap-0", children: _jsx(TabsList, { className: "flex h-8 rounded-full bg-surface p-0.5 group-data-horizontal/tabs:h-8", children: items.map((item) => (_jsx(TabsTrigger, { value: item.value, className: "h-7 flex-none rounded-full border-transparent bg-transparent px-2.5 text-ui-base font-medium text-foreground-subtle data-active:border-transparent data-active:bg-background data-active:text-foreground data-active:shadow-none dark:data-active:border-transparent dark:data-active:bg-background", children: item.label }, item.value))) }) }));
}
//# sourceMappingURL=SettingsSegmentedTabs.js.map