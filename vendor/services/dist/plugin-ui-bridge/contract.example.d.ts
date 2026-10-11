import type { IPluginUiBridgeService } from "./contract.js";
/** UI 侧典型用法：先准备沙箱拿句柄，再把句柄交给 webview 挂载；面板作用域用 `surface:<id>`。 */
export declare function examplePrepareAndMount(bridge: IPluginUiBridgeService): Promise<{
    src: string;
    partition: string;
    initId: number;
}>;
/** 页面 `resources/read` 经桥读取同插件服务器的二进制资源；结果与 MCP 同形。 */
export declare function exampleReadBlob(bridge: IPluginUiBridgeService): Promise<string | null>;
/** sampling 绑定已有页面身份，历史由 App 提交，结果只返回 App。 */
export declare function exampleSample(service: import("./samplingContract.js").IPluginUiSamplingService, scope: import("./contract.js").PluginUiPluginScope): Promise<{
    role: "assistant";
    model: string;
    content: {
        type: "text";
        text: string;
    };
    stopReason: string;
}>;
//# sourceMappingURL=contract.example.d.ts.map