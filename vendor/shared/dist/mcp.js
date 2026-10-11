/**
 * MCP (Model Context Protocol) types for ZCode
 * Based on the original Tauri implementation
 */
// CUA official plugin 身份常量（port 自 feat；UI 设置面板 + bootstrap 复用以避免字面量漂移）。
export const ZCODE_CUA_OFFICIAL_PLUGIN_ID = "computer-use@zcode-plugins-official";
// CUA server 身份串（port 自 feat mcp.ts）：server key = 模型可见工具前缀段（刻意不带 zcode-）；
// namespace name = official plugin 运行时命名空间 plugin:<pluginId>:<serverKey>。
export const ZCODE_CUA_OFFICIAL_MCP_NAMESPACE_NAME = "plugin:computer-use:computer-use";
// 插件身份 env key：resolver（adapters/src/plugins/mcp.ts）权威写入 loaded.id，manifest/user env 不可覆盖。
// bootstrap + cli/plugin-host-command.ts 复用此常量识别 official zcode-cua plugin server，避免字面量漂移。
export const ZCODE_PLUGIN_ID_ENV_KEY = "ZCODE_PLUGIN_ID";
export function getMcpServerRequestHeaders(config) {
    return config.headers ?? config.http_headers;
}
// zcode-cua MCP server 识别的单一事实源。desktop 产品 broker resolver（@zcode/services 的
// mcpBrokerInjection）与 CLI bootstrap（apps/zcode-cli 的 mcp-config）两条注入入口必须用
// 完全一致的判定；否则同一 MCP 配置在不同入口行为不同，可能漏注入 product broker，让
// Python/uvx 自己持有 macOS TCC 权限（违反 fail-closed 边界）。改这里即同时改两条链路。
function zcodeCuaArgLeaf(value) {
    // 先去掉结尾的路径分隔符再取叶子：`.../zcode-cua/` 直接 split 会得到空串叶子 → 漏判 → fail-open。
    return (value
        .replace(/[\\/]+$/, "")
        .split(/[\\/]/)
        .pop() ?? value);
}
// 单个候选串是否为 zcode-cua 的包规格。PyPI 视 `_`/`-` 等价，故先把下划线归一成短横（zcode_cua →
// zcode-cua）；覆盖 uv/npm 的 `@version`、pip 的 `==version`、extras `[...]`、git 的 `.git`/`.git@`，
// 以及 `python -m zcode_cua.server` 这种点号子模块（`zcode-cua.<submodule>`）。fail-closed 边界宁可
// 过判也不漏判；仍不会误判 `zcode-cua-proxy`（短横续接，不以 `.`/`@`/`[`/`==` 边界续接）。
function matchesZCodeCuaSpec(candidate) {
    const c = candidate.replace(/_/g, "-");
    return (c === "zcode-cua" ||
        c.startsWith("zcode-cua[") ||
        c.startsWith("zcode-cua@") ||
        c.startsWith("zcode-cua==") ||
        // `.` 分支同时覆盖 `zcode-cua.git` / `zcode-cua.git@v1` 与 `zcode-cua.server` 等 python 子模块。
        c.startsWith("zcode-cua."));
}
/**
 * MCP server 的 command 是否指向 zcode-cua。用与 args 相同的包规格判定（并比对路径叶子），
 * 覆盖 `command: "zcode-cua"`、`/opt/bin/zcode-cua`，以及把包规格直接当 command 的写法
 * （`zcode-cua@1.2.3` 等）。对 fail-closed 边界宁可过判也不漏判。
 */
export function isZCodeCuaMcpCommand(command) {
    return matchesZCodeCuaSpec(command) || matchesZCodeCuaSpec(zcodeCuaArgLeaf(command));
}
/**
 * 单个 arg 是否为 zcode-cua 的包规格。覆盖 `zcode-cua`、`zcode-cua[macos]`、`zcode-cua@1.2.3`、
 * `zcode-cua==1.2.3`、`zcode_cua`，以及 git / 本地路径形态（`.../zcode-cua`、`zcode-cua.git`、
 * `git+https://.../zcode-cua.git@v1`）。同时比对原始值与路径叶子，覆盖 `--from <path>`、`--from <git-url>`。
 */
export function isZCodeCuaMcpPackageArg(value) {
    return matchesZCodeCuaSpec(value) || matchesZCodeCuaSpec(zcodeCuaArgLeaf(value));
}
export function convertToZCodeAgentMcpServer(name, config) {
    let inferredType = config.type;
    if (!inferredType) {
        if (config.command)
            inferredType = "stdio";
        else if (config.url)
            inferredType = "http";
    }
    const isStdio = inferredType === "stdio";
    if (isStdio && config.command) {
        // Windows 上 agent 通常用 shell: true 启动子进程，
        // "cmd /c npx ..." 会被双重包裹成 "cmd.exe /c cmd /c npx ..." 导致连接失败。
        // 这里把 cmd /c 包衣拆掉，直接使用内部命令。
        let command = config.command;
        let args = config.args || [];
        // 自动检测平台：Node.js 用 process.platform，浏览器用 navigator.platform
        const isWin32 = (typeof process !== "undefined" && process.platform === "win32") ||
            (typeof navigator !== "undefined" && /win/i.test(navigator.platform));
        if (isWin32) {
            const lowerCmd = command.toLowerCase();
            const unwrappedCommand = args[1];
            if ((lowerCmd === "cmd" || lowerCmd === "cmd.exe") && args[0] === "/c" && unwrappedCommand) {
                // noUncheckedIndexedAccess 下 args[1] 即使经过 length 判断也仍是 string | undefined。
                // 先显式取值并判空，既满足类型收窄，也避免把空命令传给 ZCode Agent。
                command = unwrappedCommand;
                args = args.slice(2);
            }
        }
        return {
            name,
            command,
            args,
            env: config.env
                ? Object.entries(config.env).map(([key, value]) => ({
                    name: key,
                    value,
                }))
                : [],
            // MCP 设置页会把 timeoutMs 写入 config；session/create 走协议 DTO 时
            // 只能透传正整数，否则 strict protocol schema 会把存量非法配置从“忽略”变成“创建失败”。
            ...(isValidMcpTimeoutMs(config.timeoutMs) ? { timeoutMs: config.timeoutMs } : {}),
            ...(isMcpIsolation(config.isolation) ? { isolation: config.isolation } : {}),
            ...(isMcpProtocolVersion(config.protocolVersion)
                ? { protocolVersion: config.protocolVersion }
                : {}),
        };
    }
    else if (config.url && inferredType) {
        const normalizedType = inferredType === "sse" ? "sse" : "http";
        const headers = getMcpServerRequestHeaders(config);
        return {
            name,
            type: normalizedType,
            url: config.url,
            headers: headers
                ? Object.entries(headers).map(([key, value]) => ({
                    name: key,
                    value,
                }))
                : [],
            ...(isValidMcpOAuthConfig(config.oauth) ? { oauth: config.oauth } : {}),
            // HTTP/SSE MCP 与 stdio 一样需要保留超时配置，避免 UI 保存后真实 session 丢字段。
            ...(isValidMcpTimeoutMs(config.timeoutMs) ? { timeoutMs: config.timeoutMs } : {}),
            ...(isMcpIsolation(config.isolation) ? { isolation: config.isolation } : {}),
            ...(isMcpProtocolVersion(config.protocolVersion)
                ? { protocolVersion: config.protocolVersion }
                : {}),
        };
    }
    return null;
}
function isValidMcpTimeoutMs(value) {
    return typeof value === "number" && Number.isInteger(value) && value > 0;
}
function isMcpIsolation(value) {
    return value === "session" || value === "workspace";
}
function isMcpProtocolVersion(value) {
    return value === "legacy" || value === "auto" || value === "2026-07-28";
}
function isValidMcpOAuthConfig(value) {
    if (!isRecord(value))
        return false;
    if (value.type === "client_credentials" &&
        typeof value.clientId === "string" &&
        value.clientId.trim().length > 0 &&
        typeof value.clientSecret === "string" &&
        value.clientSecret.trim().length > 0) {
        return ((value.clientName === undefined || typeof value.clientName === "string") &&
            (value.scope === undefined || typeof value.scope === "string"));
    }
    if (value.type === "authorization_code") {
        return ((value.clientId === undefined || typeof value.clientId === "string") &&
            (value.clientSecret === undefined || typeof value.clientSecret === "string") &&
            (value.clientName === undefined || typeof value.clientName === "string") &&
            (value.redirectPath === undefined || typeof value.redirectPath === "string") &&
            (value.scope === undefined || typeof value.scope === "string"));
    }
    return false;
}
function isRecord(value) {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}
//# sourceMappingURL=mcp.js.map