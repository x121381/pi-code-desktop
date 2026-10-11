/** 只比较用户实际操作过的字段，避免把表单初始化后的系统归一化误判为修改。 */
export function resolveChangedAutomationEditFields(params) {
    return [...params.touchedFields].filter((field) => params.baseline[field] !== undefined && params.current[field] !== params.baseline[field]);
}
//# sourceMappingURL=automationEditDirtyState.js.map