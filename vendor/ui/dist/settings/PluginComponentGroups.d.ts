import type { ZCodePluginComponentKind } from "@zcode/shared";
/** 详情中单个组件项：名称（mono）+ 可选描述（次行）。 */
export interface PluginComponentDisplayItem {
    name: string;
    description?: string;
}
/** 一组同类组件：类型 + 权威数量 + 可展示的名称/描述列表。 */
export interface PluginComponentDisplayGroup {
    kind: ZCodePluginComponentKind;
    /** 权威数量：优先取协议计数，缺失时取 items.length。 */
    count: number;
    items: PluginComponentDisplayItem[];
}
/**
 * 共享的「组件分组 + 名称—描述两行体」渲染，供 marketplace 详情视图与已安装详情弹窗共用，
 * 保证两处呈现一致。每个组件项：首行 mono 名称，次行截断描述（无描述时只显示名称）。
 */
export declare function PluginComponentGroups({ groups, className, }: {
    groups: PluginComponentDisplayGroup[];
    className?: string;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=PluginComponentGroups.d.ts.map