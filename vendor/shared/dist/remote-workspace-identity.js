const REMOTE_IDENTITY_PREFIX = "remote:";
/** authority 必选段数（不含 kind）：ssh = host/port/username，其余远端类型 = 单段。 */
const AUTHORITY_SEGMENTS = {
    ssh: 3,
    wsl: 1,
    docker: 1,
    server: 1,
};
function isRemoteWorkspaceIdentityKind(value) {
    return value === "ssh" || value === "wsl" || value === "docker" || value === "server";
}
function normalizeWorkspacePathForIdentity(workspacePath) {
    const normalized = workspacePath.replace(/\\/g, "/").replace(/\/+/g, "/");
    const trimmed = normalized.replace(/^\/+|\/+$/g, "");
    return `/${trimmed}`;
}
function resolveServerIdentityId(target) {
    const explicit = target.serverId?.trim() || target.name?.trim();
    if (explicit) {
        return explicit;
    }
    try {
        return new URL(target.url.trim()).host;
    }
    catch {
        return target.url.trim();
    }
}
function normalizeServerIdForIdentity(serverId) {
    const normalized = serverId
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9._-]+/g, "-")
        .replace(/^-+|-+$/g, "");
    if (!normalized) {
        throw new Error("serverId must contain at least one identity-safe character");
    }
    return normalized;
}
export function buildServerRemoteWorkspaceIdentity(options) {
    const serverId = normalizeServerIdForIdentity(options.serverId);
    const workspacePath = normalizeWorkspacePathForIdentity(options.workspacePath);
    return `${REMOTE_IDENTITY_PREFIX}server:${serverId}:${workspacePath}`;
}
/**
 * 统一构造远程 workspace identity。Host、Main 和 UI 禁止自行拼接 authority；
 * `workspacePath` 只在这里归一后进入身份键，实际 IO 仍使用调用方原路径。
 */
export function buildRemoteWorkspaceIdentity(workspacePath, target) {
    const normalizedPath = normalizeWorkspacePathForIdentity(workspacePath);
    switch (target.kind) {
        case "ssh":
            return `remote:ssh:${target.host.trim().toLowerCase()}:${target.port ?? 22}:${target.username.trim()}:${normalizedPath}`;
        case "wsl": {
            const distro = target.distro?.trim() || "default";
            const user = target.user?.trim();
            return user
                ? `remote:wsl:${distro}:${user}:${normalizedPath}`
                : `remote:wsl:${distro}:${normalizedPath}`;
        }
        case "docker":
            return `remote:docker:${target.container}:${normalizedPath}`;
        case "server":
            return buildServerRemoteWorkspaceIdentity({
                serverId: resolveServerIdentityId(target),
                workspacePath: normalizedPath,
            });
    }
}
/**
 * 解析远程 workspace identity；非法/非远程 identity 返回 null（调用方回落
 * 「按本地 workspacePath 处理」）。只提取 workspacePath——authority 细节
 * （host/port 等）对消费方（CLI 运行在远端机器上）无意义，不透出。
 */
export function parseRemoteWorkspaceIdentity(identity) {
    if (!identity.startsWith(REMOTE_IDENTITY_PREFIX)) {
        return null;
    }
    const rest = identity.slice(REMOTE_IDENTITY_PREFIX.length);
    const kindEnd = rest.indexOf(":");
    if (kindEnd <= 0) {
        return null;
    }
    const kind = rest.slice(0, kindEnd);
    if (!isRemoteWorkspaceIdentityKind(kind)) {
        return null;
    }
    // 逐段消费 authority；path 段可能含 ":"（理论上 posix 路径允许），
    // 因此不能整体 split——按段推进后取剩余整段为 path。
    let cursor = kindEnd + 1;
    for (let i = 0; i < AUTHORITY_SEGMENTS[kind]; i++) {
        const next = rest.indexOf(":", cursor);
        if (next <= cursor) {
            return null;
        }
        cursor = next + 1;
    }
    // WSL identity 为区分默认用户与显式用户增加了可选 user 段，旧解析器
    // 仍只消费 distro，导致 user 被误判为路径并让 identity 整体解析失败。远端路径
    // 必须以 "/" 开头，因此可以无歧义地区分 legacy 无 user 格式与显式 user 格式。
    if (kind === "wsl" && rest[cursor] !== "/") {
        const userEnd = rest.indexOf(":", cursor);
        if (userEnd <= cursor) {
            return null;
        }
        cursor = userEnd + 1;
    }
    const workspacePath = rest.slice(cursor);
    if (!workspacePath.startsWith("/")) {
        return null;
    }
    return { kind, workspacePath };
}
/** identity 是否是远程 workspace identity（可被 parseRemoteWorkspaceIdentity 解析）。 */
export function isRemoteWorkspaceIdentity(identity) {
    return parseRemoteWorkspaceIdentity(identity) !== null;
}
//# sourceMappingURL=remote-workspace-identity.js.map