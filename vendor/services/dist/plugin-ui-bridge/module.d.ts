/**
 * plugin-ui-bridge 模块清单（architecture-governance managed 模块）。
 * host 侧服务：读取并校验插件 `ui://` 资源、向 main 登记沙箱、代理 UI 发起的工具调用，
 * 以及 App-Provided Tools 的登记 / 认领 / 回传通道（appToolsContract.ts）。
 */
export declare const pluginUiBridgeModule: {
    readonly id: "plugin-ui-bridge";
    readonly requires: readonly ["services", "shared", "mcp-apps-protocol"];
    readonly provides: readonly ["plugin-ui-bridge-service"];
    readonly publicEntrypoints: readonly ["index.ts", "contract.ts", "appToolsContract.ts", "samplingContract.ts"];
};
//# sourceMappingURL=module.d.ts.map