function normalizeToolName(value) {
    return value?.trim().toLowerCase().replace(/_/g, "-") ?? "";
}
export function isZCodeCuaToolName(value) {
    const normalized = normalizeToolName(value);
    // server key 段为 computer-use。feat: mcp__computer-use__*；
    // main v3.5.3 的 plugin MCP 命名约定给 plugin server 加 namespace：
    // mcp__plugin_zcode-cua_computer-use__*（归一化后 server 段前是单连字符 cua-computer-use，
    // 不是双连字符）。两种形态都包含 "computer-use" 串——用 includes 兼容，否则 main 的 namespace
    // 前缀会让 cua 工具识别失败、ToolCallBlock 退化成 fallback 渲染。"computer-use" 足够特异
    // （仅 cua server 用此 key，不会误判 android-emulator/browser-use 等）。
    return normalized === "computer-use" || normalized.includes("computer-use");
}
export function didReturnFromCuaPermissionSettings(result) {
    // main 只有在整组 staged pane 都完成并观察到 ZCode 应用级返回后才置 true。renderer focus
    // 可能来自 TCC 原生 prompt、另一窗口或普通切换，不能再作为授权完成信号。
    return (result?.success === true &&
        result.returnedFromSettings === true &&
        typeof result.sessionId === "string" &&
        result.sessionId.length > 0);
}
export function shouldRestartHelperAfterCuaPermissionReturn(result) {
    // restartHelperAfterReturn 是 additive main ABI。旧版 main 不返回该字段，仍按过去的单窗口 owner
    // 处理；新版 main 只对同一 renderer/host 的重复 join 返回 false，不同窗口的独立 Helper 各自恢复。
    return didReturnFromCuaPermissionSettings(result) && result?.restartHelperAfterReturn !== false;
}
let nextCuaPermissionRecoveryGeneration = 0;
export function createCuaPermissionReturnRecoveryState(contextKey = "") {
    nextCuaPermissionRecoveryGeneration += 1;
    return {
        generation: nextCuaPermissionRecoveryGeneration,
        contextKey,
        epoch: 0,
        pending: false,
        automaticAttempted: false,
    };
}
function recoveryClaim(state) {
    return {
        state,
        generation: state.generation,
        contextKey: state.contextKey,
        epoch: state.epoch,
    };
}
export function markCuaPermissionOnboardingOpened(state) {
    state.epoch += 1;
    state.pending = true;
    state.automaticAttempted = false;
    return recoveryClaim(state);
}
export function claimCuaPermissionReturnRecovery(state) {
    // 普通 focus、原生 prompt 的中间 focus、同一授权动作的重复 focus 均无副作用。
    if (!state.pending || state.automaticAttempted)
        return null;
    state.automaticAttempted = true;
    return recoveryClaim(state);
}
export function captureCuaPermissionReturnRecovery(state) {
    return state.pending ? recoveryClaim(state) : null;
}
export function isCuaPermissionReturnRecoveryCurrent(current, claim) {
    return (current === claim.state &&
        current.generation === claim.generation &&
        current.contextKey === claim.contextKey &&
        current.epoch === claim.epoch &&
        current.pending);
}
export function completeCuaPermissionReturnRecovery(claim, restartSucceeded) {
    // ref 在 workspace/open 切换时会指向新 state，局部 epoch 又从 0 重启。旧 restart 若拿
    // `ref.current + epoch` 完成，会误清新 workspace 的同号事件。claim 永久绑定发起时 state/context；
    // completion 只可能修改该旧对象，失败仍保留 pending 供同一上下文手动重试。
    const state = claim.state;
    if (restartSucceeded &&
        state.pending &&
        state.generation === claim.generation &&
        state.contextKey === claim.contextKey &&
        state.epoch === claim.epoch) {
        state.pending = false;
    }
}
//# sourceMappingURL=cuaPermissionAction.js.map