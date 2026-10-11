import { jsx as _jsx } from "react/jsx-runtime";
import { McpToolCallBlock } from "../ToolCallBlocks/renderers/mcp.js";
import { usePluginUiToolCallModel } from "../plugin-ui/adapters/usePluginUiToolCallModel.js";
import { PluginUiToolCallView } from "../plugin-ui/components/PluginUiToolCallBlock.js";
import { readPluginUiPresentation } from "../plugin-ui/domain/readPluginUiPresentation.js";
/** 宿主工具行渲染插槽，普通 MCP 卡片作为模块外的展示依赖注入。 */
export function PluginUiToolCallBlock(context) {
    const model = usePluginUiToolCallModel(context);
    return _jsx(PluginUiToolCallView, { ...model, fallback: _jsx(McpToolCallBlock, { ...context }) });
}
export function shouldRenderPluginUi(context) {
    return Boolean(context.pluginUi?.scope.sessionId &&
        readPluginUiPresentation(context.toolCallNode.toolCall.raw));
}
//# sourceMappingURL=PluginUiToolCallBlock.js.map