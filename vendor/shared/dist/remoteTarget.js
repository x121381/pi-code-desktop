/** 删除只应存在于当前连接流程中的 secret，供长期内存状态和跨进程回包使用。 */
export function stripRemoteTargetSecrets(target) {
    if (target.kind === "ssh") {
        const { password: _password, privateKeyPassphrase: _privateKeyPassphrase, ...sanitized } = target;
        return sanitized;
    }
    if (target.kind === "server") {
        const { token: _token, ...sanitized } = target;
        return sanitized;
    }
    return target;
}
//# sourceMappingURL=remoteTarget.js.map