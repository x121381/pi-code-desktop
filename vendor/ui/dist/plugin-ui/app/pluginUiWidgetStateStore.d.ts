/** 未写入过返回 undefined；页面写入的 null 原样保留（区分"未加载"与"已清空"）。 */
export declare function getPluginUiWidgetState(key: string): unknown;
export declare function setPluginUiWidgetState(key: string, widgetState: unknown): void;
export declare function clearPluginUiWidgetState(key: string): void;
/** 测试用：清空全部记录。 */
export declare function resetPluginUiWidgetStateForTest(): void;
//# sourceMappingURL=pluginUiWidgetStateStore.d.ts.map