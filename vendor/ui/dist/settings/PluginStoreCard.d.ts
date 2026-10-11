import { type StorePluginItem } from "@/settings/pluginStoreListing.js";
/** 商店条目的通用动作集：列表卡片、详情页共用同一套回调与进行中态判定。 */
export interface PluginStoreActions {
    onOpenDetail: (pluginId: string) => void;
    /** 安装或恢复（restorable 内置插件走 restoreBuiltin，其余走 install）。 */
    onInstall: (item: StorePluginItem) => void;
    onUninstall: (pluginId: string) => void;
    onSetEnabled?: (pluginId: string, enabled: boolean) => void;
    /** 删除当前 Workspace scope 的显式配置，使其回退到 User。 */
    onResetConfig?: (pluginId: string) => void;
    onUpdate: (pluginId: string) => void;
    operationId: string | null;
    togglingPluginId: string | null;
}
export declare function isItemBusy(item: StorePluginItem, actions: PluginStoreActions): boolean;
/**
 * 付费套餐提示：目录条目声明 `listing.requiresPaidPlan` 时，在标题右侧展示渐变徽标。
 * 表达的是「需要付费套餐才好用」这个使用条件，不是「插件是收费商品」——不做安装门禁。
 * 商店卡片与详情页标题共用同一渐变徽标。
 * 徽标使用短文案，完整条件由 Tooltip 和 aria-label 表达；缺字段时整个标记不渲染。
 * hover 提示走 ControlHintTooltip（Root Provider 的 delayDuration=0，即时弹出），
 * 不用原生 title——后者有约 1s 系统延迟。
 */
export declare function PluginStorePaidPlanBadge({ item, }: {
    item: Pick<StorePluginItem, "id" | "listing">;
}): import("react/jsx-runtime").JSX.Element | null;
/** 详情页与管理视图的插件级启停开关；紧凑商店卡片只保留「…」菜单。 */
export declare function PluginStoreEnabledSwitch({ item, actions, }: {
    item: StorePluginItem;
    actions: PluginStoreActions;
}): import("react/jsx-runtime").JSX.Element | null;
/** 已安装条目的「…」菜单：启用/禁用、更新（有更新时）、卸载。卡片与详情页共用。 */
export declare function PluginStoreItemMenu({ item, actions, triggerClassName, triggerVariant, triggerSize, }: {
    item: StorePluginItem;
    actions: PluginStoreActions;
    triggerClassName?: string;
    triggerVariant?: "ghost" | "outline";
    triggerSize?: "icon-md" | "icon-lg";
}): import("react/jsx-runtime").JSX.Element;
/** 安装/恢复胶囊按钮（未安装条目的卡片与详情页主按钮共用）。 */
export declare function PluginStoreInstallButton({ item, actions, size, }: {
    item: StorePluginItem;
    actions: PluginStoreActions;
    size?: "sm" | "default" | "lg";
}): import("react/jsx-runtime").JSX.Element;
/** 已安装条目的「可更新」角标：列表/卡片标题行直接标出哪个插件有更新，与详情页入口共用判定。 */
export declare function PluginStoreUpdateBadge({ item, }: {
    item: Pick<StorePluginItem, "id" | "installedMeta" | "orphaned"> | null | undefined;
}): import("react/jsx-runtime").JSX.Element | null;
/** 行内「更新」胶囊：已安装且可更新的条目原地触发更新，不必进详情页。 */
export declare function PluginStoreUpdateButton({ item, actions, size, }: {
    item: StorePluginItem | null | undefined;
    actions: PluginStoreActions;
    size?: "sm" | "default" | "lg";
}): import("react/jsx-runtime").JSX.Element | null;
/**
 * 商店卡片（双列网格单元）：40px 头像 + 显示名 + 单行截断描述；
 * 尾部动作：已安装 → 「…」菜单，未安装 → 「安装」胶囊。点击主体进入详情页。
 */
export declare function PluginStoreCard({ item, actions, locale, }: {
    item: StorePluginItem;
    actions: PluginStoreActions;
    locale: string;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=PluginStoreCard.d.ts.map