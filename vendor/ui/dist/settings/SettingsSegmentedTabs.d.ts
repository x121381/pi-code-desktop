export interface SettingsSegmentedTabItem<TValue extends string> {
    label: string;
    value: TValue;
}
/** 设置详情页共用的紧凑分段切换，避免相同层级出现多套 Tabs 视觉。 */
export declare function SettingsSegmentedTabs<TValue extends string>({ items, value, onValueChange, }: {
    items: readonly SettingsSegmentedTabItem<TValue>[];
    value: TValue;
    onValueChange: (value: TValue) => void;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=SettingsSegmentedTabs.d.ts.map