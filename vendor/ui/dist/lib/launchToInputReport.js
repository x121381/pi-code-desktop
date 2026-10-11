export function shouldReportLaunchToInput(state) {
    // 门禁清除 = RootStartupLoading 退场、输入框挂载;welcome 时虽门禁清除但显示登录页、无输入框,不算"能输入"。
    return !state.alreadyReported && !state.isStartupRenderBlocked && !state.welcomeScreenOpen;
}
export function readRendererLaunchTimings() {
    const w = window;
    const rendererStart = w.__ZCODE_RENDERER_START__;
    const reactCommit = w.__ZCODE_REACT_COMMIT_AT__;
    if (typeof rendererStart !== "number" || typeof reactCommit !== "number") {
        return null;
    }
    return { marks: w.__ZCODE_LAUNCH_MARKS__ ?? null, rendererStart, reactCommit };
}
//# sourceMappingURL=launchToInputReport.js.map