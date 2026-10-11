import type { ToolCallBlockRenderContext } from "@/ToolCallBlocks/fileSummaryTypes.js";
import type { PluginUiToolCallViewProps } from "@/plugin-ui/contract.js";
/** 工具行到插件 UI 的适配；React 生命周期与宿主动作集中于此，视图只接收展示模型。 */
export declare function usePluginUiToolCallModel(context: ToolCallBlockRenderContext): Omit<PluginUiToolCallViewProps, "fallback">;
//# sourceMappingURL=usePluginUiToolCallModel.d.ts.map