import { type ReactNode } from "react";
export interface SettingsBreadcrumbItem {
    label: string;
    onSelect?: () => void;
}
export declare function SettingsBreadcrumbProvider({ children, onItemsChange, sectionLabel, }: {
    children: ReactNode;
    onItemsChange: (items: readonly SettingsBreadcrumbItem[]) => void;
    sectionLabel: string;
}): import("react/jsx-runtime").JSX.Element;
/**
 * 将 section 内既有页面状态和返回动作投影到 Settings 顶栏，但不拥有或持久化导航状态。
 */
export declare function SettingsBreadcrumbReporter({ items, onSectionSelect, }: {
    items: readonly SettingsBreadcrumbItem[];
    onSectionSelect?: () => void;
}): null;
export declare function SettingsHeaderBreadcrumb({ ariaLabel, className, items, }: {
    ariaLabel: string;
    className?: string;
    items: readonly SettingsBreadcrumbItem[];
}): import("react/jsx-runtime").JSX.Element | null;
//# sourceMappingURL=SettingsHeaderBreadcrumb.d.ts.map