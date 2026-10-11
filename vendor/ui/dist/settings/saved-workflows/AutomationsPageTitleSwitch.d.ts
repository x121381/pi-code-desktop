/** 自动化页的两个顶级标签。 */
export type AutomationsPageTab = "automation" | "workflow";
export declare const AUTOMATIONS_PAGE_TABS: readonly AutomationsPageTab[];
/**
 * 自动化页的标题。动态工作流灰度未命中时
 * 页面只有「自动化」一件事，标题就退回引入「工作流」标签之前的那个平铺 h1——不留一个只有
 * 一项的 tablist，也不把方向键切换留在原地。
 */
export declare function AutomationsPageTitle({ workflowTabEnabled, value, onValueChange, }: {
    workflowTabEnabled: boolean;
    value: AutomationsPageTab;
    onValueChange: (tab: AutomationsPageTab) => void;
}): import("react/jsx-runtime").JSX.Element;
/**
 * 页标题本身就是切换：「自动化 / 工作流」两个 30px 标题词并排，未选中的用次级色。
 * 不在标题下再长一排标签——定时任务 / 闲时任务的胶囊行留在「自动化」内部，两级各用一种视觉。
 * 字号沿用 AutomationsSection 原 h1 的标题层级。
 */
export declare function AutomationsPageTitleSwitch({ value, onValueChange, }: {
    value: AutomationsPageTab;
    onValueChange: (tab: AutomationsPageTab) => void;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=AutomationsPageTitleSwitch.d.ts.map