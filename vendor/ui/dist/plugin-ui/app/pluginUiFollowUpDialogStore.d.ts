/**
 * 无用户手势的 sendFollowUpMessage 需要用户确认（可编辑 prompt）。
 * 与 confirmDialogStore 同构：请求排队、宿主组件订阅并渲染当前一条，resolve 返回最终文本或 null（取消）。
 */
export interface PluginUiFollowUpRequest {
    requestId: number;
    pluginId: string;
    prompt: string;
}
type Listener = () => void;
export declare function requestPluginUiFollowUpConfirmation(input: {
    pluginId: string;
    prompt: string;
}): Promise<string | null>;
export declare function getCurrentPluginUiFollowUpRequest(): PluginUiFollowUpRequest | null;
export declare function resolvePluginUiFollowUpRequest(requestId: number, value: string | null): void;
export declare function subscribePluginUiFollowUpRequests(listener: Listener): () => void;
export {};
//# sourceMappingURL=pluginUiFollowUpDialogStore.d.ts.map