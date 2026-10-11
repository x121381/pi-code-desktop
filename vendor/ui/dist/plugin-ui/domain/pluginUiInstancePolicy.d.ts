import type { ConversationRow } from "@zcode/shared/zcode-protocol-v4";
/** ：最近几个回合的插件卡片默认展开，更早的按默认收进折叠区。 */
export declare const PLUGIN_UI_AUTO_EXPAND_TURNS = 3;
/** 一个逻辑 UI：仅显式 surface 或权限范围一致的 widgetSessionId 共用，其余调用独立。 */
export interface PluginUiLogicalInstance {
    key: string;
    /** 当前显示的调用：最新一次成功（非 isError）的；没有成功的就是最新一条。 */
    activeToolCallId: string;
    /** 被较新成功结果替代的成功调用；它们不建沙箱，只保留普通工具记录。 */
    supersededToolCallIds: string[];
}
/** 单条插件工具行的展示裁决；渲染层据此决定进不进折叠区、要不要建沙箱。 */
export interface PluginUiRowDisposition {
    key: string;
    superseded: boolean;
    /** 所在回合在最近 PLUGIN_UI_AUTO_EXPAND_TURNS 个回合内。 */
    autoExpand: boolean;
    /** 工具级 `openai/widgetShowCodexWidgetInline`（display.ui.showInline）。 */
    forcedInline: boolean;
}
export interface PluginUiInstanceDerivation {
    instances: PluginUiLogicalInstance[];
    byToolCallId: Readonly<Record<string, PluginUiRowDisposition>>;
}
export declare const EMPTY_PLUGIN_UI_INSTANCE_DERIVATION: PluginUiInstanceDerivation;
/**
 * 纯函数：从投影行推导逻辑 UI 实例与每行的展示裁决（V-a）。
 * key 同时绑定来源、server、资源、权限与逻辑视图；同 key 内最新一次成功结果替代更早的成功结果，
 * running / failed / isError 的行既不替代别人也不被替代（各自显示自己的状态）。
 * autoExpand 按全部行的回合顺序取最近 N 个回合（回合里没有插件卡片也算一个回合）。
 */
export declare function deriveLogicalUiInstances(rows: readonly ConversationRow[], options?: {
    autoExpandTurns?: number;
}): PluginUiInstanceDerivation;
//# sourceMappingURL=pluginUiInstancePolicy.d.ts.map