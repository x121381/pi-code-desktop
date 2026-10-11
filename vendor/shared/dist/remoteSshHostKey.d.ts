import type { RemoteTargetSnapshot } from "./protocol.js";
import type { SSHConnectOptions } from "./remoteTarget.js";
type SshRemoteHostKeyTarget = SSHConnectOptions | Extract<RemoteTargetSnapshot, {
    kind: "ssh";
}>;
/**
 * 构造窗口内 SSH Remote Host 的共享身份。
 * 密码和私钥口令只用于建连，禁止进入共享键或日志。
 */
export declare function buildSshRemoteHostKey(target: SshRemoteHostKeyTarget): string;
export {};
//# sourceMappingURL=remoteSshHostKey.d.ts.map