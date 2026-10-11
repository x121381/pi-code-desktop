import type { McpToolUiDescriptor, PluginSandboxHandle } from "./contract.js";
/** 一个带 UI 资源的工具 `_meta` 归一化后应得到的描述。 */
export declare const exampleToolUiDescriptor: McpToolUiDescriptor;
/** main 登记成功后返回给 renderer 的句柄；partition 按 server 身份派生，同一 server 的页面共享。 */
export declare const exampleSandboxHandle: PluginSandboxHandle;
/** agent 对 MCP server `initialize` 时宣告的 ui 扩展能力。 */
export declare const exampleClientCapabilities: {
    extensions: {
        [extensionId: string]: import("./contract.js").McpAppsClientCapability;
    };
};
/** 宿主在 hostCapabilities.experimental 里宣告的 CSP 放宽键。 */
export declare const exampleCspExperimental: {
    "zcode/csp": {
        flags: import("./contract.js").McpAppCspRelaxationFlag[];
    };
};
/** 资源级 `_meta` 里声明放宽的写法。 */
export declare const exampleResourceMetaWithRelaxations: {
    ui: {
        csp: {
            connectDomains: string[];
        };
    };
    "zcode/csp": {
        unsafeEval: boolean;
    };
};
export declare const exampleSetWidgetStateMethod = "ui/set-widget-state";
export declare const examplePortName = "plugin-sandbox-rpc";
//# sourceMappingURL=contract.example.d.ts.map