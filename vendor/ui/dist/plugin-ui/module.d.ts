/**
 * plugin-ui 模块清单（architecture-governance managed 模块）。
 * ui 层：插件 UI 内联卡片、侧栏 tab、MCP Apps host 状态机接线、MessagePort 传输。
 * 层序 domain → app → adapters → components：domain 纯函数，app 管理生命周期，adapters 绑定外部能力，components 渲染。
 * 行为边界见本模块 CONTRACT.md。
 */
export declare const pluginUiModule: {
    readonly id: "plugin-ui";
    readonly requires: readonly ["ui", "shared", "mcp-apps-protocol", "plugin-ui-bridge", "plugin-sandbox"];
    readonly provides: readonly ["plugin-ui-components"];
    readonly publicEntrypoints: readonly ["index.ts", "contract.ts", "hostPrimitives.ts"];
};
//# sourceMappingURL=module.d.ts.map