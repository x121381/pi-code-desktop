export function shouldBlockTaskSelectionDuringModelRestart(modelSwitchPending, modelSwitchStage) {
    return modelSwitchPending && modelSwitchStage === "restartingRuntime";
}
//# sourceMappingURL=taskSwitchGuard.js.map