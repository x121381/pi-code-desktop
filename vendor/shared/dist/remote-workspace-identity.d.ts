import type { RemoteTarget } from "./remoteTarget.js";
export type RemoteWorkspaceIdentityKind = "ssh" | "wsl" | "docker" | "server";
export interface ParsedRemoteWorkspaceIdentity {
    kind: RemoteWorkspaceIdentityKind;
    /** 远端真实路径（posix 归一形态）。 */
    workspacePath: string;
}
export interface BuildServerRemoteWorkspaceIdentityOptions {
    serverId: string;
    workspacePath: string;
}
export declare function buildServerRemoteWorkspaceIdentity(options: BuildServerRemoteWorkspaceIdentityOptions): string;
/**
 * 统一构造远程 workspace identity。Host、Main 和 UI 禁止自行拼接 authority；
 * `workspacePath` 只在这里归一后进入身份键，实际 IO 仍使用调用方原路径。
 */
export declare function buildRemoteWorkspaceIdentity(workspacePath: string, target: RemoteTarget): string;
/**
 * 解析远程 workspace identity；非法/非远程 identity 返回 null（调用方回落
 * 「按本地 workspacePath 处理」）。只提取 workspacePath——authority 细节
 * （host/port 等）对消费方（CLI 运行在远端机器上）无意义，不透出。
 */
export declare function parseRemoteWorkspaceIdentity(identity: string): ParsedRemoteWorkspaceIdentity | null;
/** identity 是否是远程 workspace identity（可被 parseRemoteWorkspaceIdentity 解析）。 */
export declare function isRemoteWorkspaceIdentity(identity: string): boolean;
//# sourceMappingURL=remote-workspace-identity.d.ts.map