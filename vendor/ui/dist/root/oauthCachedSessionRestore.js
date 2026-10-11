export async function applyCachedOAuthSessionRestoreResult(params) {
    if (params.result.status === "authenticated") {
        params.setUser(params.result.userInfo);
        return true;
    }
    if (params.result.status === "reauthentication-required") {
        // 认证事实已经失效，不能等用户确认弹窗后才清 UI 登录态。
        params.setUser(null);
        await params.requestAlert(params.copy);
        params.onReauthenticationRequired();
    }
    return false;
}
//# sourceMappingURL=oauthCachedSessionRestore.js.map