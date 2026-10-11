export declare function getPluginUiManualPin(sessionKey: string, toolCallId: string): boolean | undefined;
export declare function setPluginUiManualPin(sessionKey: string, toolCallId: string, pinned: boolean | undefined): void;
/** 订阅快照：任一记录变化即递增，时间线据此重建折叠边界。 */
export declare function getPluginUiDisclosureVersion(): number;
export declare function subscribePluginUiDisclosure(listener: () => void): () => void;
/** 测试用：清空全部记录。 */
export declare function resetPluginUiDisclosureForTest(): void;
//# sourceMappingURL=pluginUiDisclosureStore.d.ts.map