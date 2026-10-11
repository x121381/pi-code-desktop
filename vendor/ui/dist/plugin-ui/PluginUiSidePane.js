import { jsx as _jsx } from "react/jsx-runtime";
import { memo, useMemo } from "react";
import { readPluginUiScopeRef } from "../plugin-ui/contract.js";
import { PluginUiConversationScope, usePluginUiSidePaneModel, } from "../plugin-ui/adapters/usePluginUiSidePaneModel.js";
import { PluginUiSidePaneView } from "../plugin-ui/components/PluginUiSidePane.js";
function Content(props) {
    return _jsx(PluginUiSidePaneView, { ...usePluginUiSidePaneModel(props) });
}
/** 模块组装入口：将只读会话适配器与纯视图连接。 */
export const PluginUiSidePane = memo(function PluginUiSidePane(props) {
    const scopeRef = useMemo(() => readPluginUiScopeRef(props.tab), [props.tab.surfaceId, props.tab.toolCallId]);
    if (!scopeRef)
        return null;
    return (_jsx(PluginUiConversationScope, { tab: props.tab, children: _jsx(Content, { ...props, scopeRef: scopeRef }) }));
});
//# sourceMappingURL=PluginUiSidePane.js.map