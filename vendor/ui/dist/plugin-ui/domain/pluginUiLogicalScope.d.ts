import type { PluginUiScopeRef } from "@zcode/shared/mcp-apps";
import type { PluginUiPresentation } from "../contract.js";
/** 只有显式共享身份可合并；权限声明不同的普通 widget 不共用页面。 */
export declare function resolvePluginUiLogicalScope(presentation: Pick<PluginUiPresentation, "surface" | "widgetMeta" | "csp">, fallback: PluginUiScopeRef): PluginUiScopeRef;
//# sourceMappingURL=pluginUiLogicalScope.d.ts.map