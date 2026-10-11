/**
 * 复用 browser-use tab 鼠标图标的 5 秒 operation deadline。
 * 图标和浏览器内提示必须共用这一个判断，避免出现一边认为工具仍在执行、另一边已经结束。
 */
export declare function useBrowserUseOperationActive(operationUntil?: number): boolean;
//# sourceMappingURL=useBrowserUseOperationActive.d.ts.map