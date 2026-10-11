export declare function buildAgentProxyEnv(httpProxy: string | undefined): Record<string, string>;
export declare function buildAgentCaCertEnv(caCertPath: string | undefined): Record<string, string>;
export declare function buildAgentNoProxyEnv(noProxy: string | undefined): Record<string, string>;
/**
 * spawn agent 时一次性解析的运行时 env 补丁：代理 + No Proxy + 自定义 CA。
 * 这些值都只来自 AppSettings 显式配置；用户 shell 里的标准代理/证书变量已经在上游清洗。
 */
export declare function buildAgentRuntimeEnv(input: {
    httpProxy: string | undefined;
    noProxy?: string | undefined;
    caCertPath?: string | undefined;
}): Record<string, string>;
/**
 * 把 host 已解析出的**权威 ZCode API origin** 下发给 agent 子进程。
 *
 * 两侧的官方 MCP 信任判定共用 `@zcode/shared` 的同一份实现，但**输入**
 * 曾经分叉——host 用 `resolveRuntimeZCodeEndpointOrigin(env, { overrideOrigin: settings
 * .zcodeEndpointOrigin })`，agent 只有 `resolveRuntimeZCodeEndpointOrigin(env)`，而 settings
 * 覆盖值从不下发给子进程。在 `ZCODE_ENV=test` 且用户在设置页配了自定义端点时，两侧算出的
 * origin 必然不同，任一 origin 的官方 MCP 都会被其中一侧 fail closed 拒绝，日志表现却酷似
 * 插件 url 配错。单源实现救不了分叉的输入，因此必须把输入也统一。
 *
 * 为什么注入 `ZCODE_BASE_URL` 而不是只给信任判定加参数：agent 侧有 4 处调用
 * `resolveRuntimeZCodeEndpointOrigin`（信任判定、provider 路由来源头、model-config、
 * auth-login），它们都读同一个 env，一处注入即可全部对齐；只修信任判定会把另外 3 处的分叉留下。
 *
 * 幂等性：传入的是 host **已解析完成**的最终值。agent 继承 host 的 process.env，其 env 派生
 * 结果本就等于 host 的 env 派生结果，再叠加 override 就是这里的值；production 下 host 忽略
 * override，注入值等于 env 派生值，行为不变。
 *
 * 时效性：与代理/CA 同语义——spawn 时读取，「下次启动 agent」生效。会话中途改设置时 host 立即
 * 更新、agent 仍是旧值，直到 agent 重启才重新对齐；期间两侧不一致只会 fail closed，不构成放行。
 */
export declare function buildAgentEndpointOriginEnv(endpointOrigin: string | undefined): Record<string, string>;
/** 把 Host 已知的 remote workspace identity 注入对应 Agent；本地 workspace 保持 path fallback。 */
export declare function buildAgentWorkspaceIdentityEnv(workspaceIdentity: string | undefined): Record<string, string>;
//# sourceMappingURL=agentProxyEnv.d.ts.map