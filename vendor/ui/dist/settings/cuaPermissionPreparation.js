function isActionablePermissionState(state) {
    return state === "denied" || state === "stale";
}
/**
 * Modal 或点击入口重新查询后，只把新鲜可用 TCC 快照里的确定缺口交给一键授权。
 * 功能探针失败与 unknown 都只进入验证/重试，不能反向推导为系统权限缺失。
 */
export function requiredCuaPermissionsForFreshStatus(status) {
    if (!status)
        return [];
    const required = [];
    if (isActionablePermissionState(status.accessibility)) {
        required.push("accessibility");
    }
    if (isActionablePermissionState(status.screenRecording)) {
        required.push("screen_recording");
    }
    return required;
}
//# sourceMappingURL=cuaPermissionPreparation.js.map