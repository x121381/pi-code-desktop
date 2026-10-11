import { type ReactNode } from "react";
/**
 * 工作区 Automations 不经过 SettingsPage，编辑页的面包屑上报需要 Provider 接收，
 * 所以桌面顶栏只剩空拖拽区；这里让工作区入口复用设置页的同一套面包屑合同。
 */
export declare function AutomationsMainBreadcrumbFrame({ ariaLabel, children, isDesktop, sectionLabel, }: {
    ariaLabel: string;
    children: ReactNode;
    isDesktop: boolean;
    sectionLabel: string;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=AutomationsMainBreadcrumbFrame.d.ts.map