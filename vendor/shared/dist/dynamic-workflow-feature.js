// ============================================================
// Dynamic Workflow 灰度：服务端 feature key 的取值域与客户端快照
// ============================================================
// 服务端 `/api/v1/client/configs` 下发 `data.configs.dynamicWorkflow.mode`。
// 这里只放三端（Host services、Desktop main、UI）共用的取值域、归一化与快照形状；
// 读取远端、覆盖与下发都在各自的 owner 里，不在 shared 层发请求。
export const DYNAMIC_WORKFLOW_MODES = ["disabled", "onDemand", "alwaysOn"];
/**
 * 本地覆盖用的环境变量。语义按构建档位分三层，由 Desktop main 在 fork Host 前**改写或删除**
 * （desktopRuntimeEnv.ts 的 buildHostProcessEnv），Host 只消费不再分辨来源：
 *   - 未打包 dev：透传开发者 shell 里的合法取值；
 *   - 打包 preview：固定写入 `alwaysOn`，忽略 shell；
 *   - 打包 production：删除继承值，永不写入。
 * 没有 main 的 Web/server Host 直接读进程环境（运维/开发者设置）。
 */
export const ZCODE_DYNAMIC_WORKFLOW_MODE_ENV = "ZCODE_DYNAMIC_WORKFLOW_MODE";
/** 服务端缺省、格式非法或请求失败时的取值：fail-closed，与闲时任务灰度一致。 */
export const DEFAULT_DYNAMIC_WORKFLOW_MODE = "disabled";
export function normalizeDynamicWorkflowMode(value) {
    if (typeof value !== "string")
        return undefined;
    const trimmed = value.trim();
    return DYNAMIC_WORKFLOW_MODES.includes(trimmed)
        ? trimmed
        : undefined;
}
/**
 * 「功能是否提供」的折叠：`onDemand` 与 `alwaysOn` 同为开启——目录里的 `/workflow`、技能、
 * 自动化页的工作流 tab 与 Resume 入口在两种模式下都在。两者的差别只在模型工具面的注册时机
 * （launch.md「On demand: activation」），由 CLI 侧按 mode 本身裁决，这里不参与。
 */
export function isDynamicWorkflowModeEnabled(mode) {
    return mode !== "disabled";
}
export function createDynamicWorkflowClientConfig(offeredMode, source) {
    return {
        mode: offeredMode,
        enabled: isDynamicWorkflowModeEnabled(offeredMode),
        source,
        offeredMode,
    };
}
/**
 * 功能是否提供（与用户选择无关）：设置行只在提供时出现。
 *
 * 修复原因：快照可能来自没有 offeredMode 的旧 Host（新 UI——例如手机远控 bundle——连旧桌面）。
 * 过去直接比 `!== "disabled"`，缺席的字段读作「已提供」，设置行照出、选择写进一个旧 Host 不认的
 * 设置。缺席或读不懂的 offeredMode 一律按未提供：只有认用户选择的 Host 才会写这个字段。
 */
export function isDynamicWorkflowOffered(config) {
    const offeredMode = normalizeDynamicWorkflowMode(config.offeredMode);
    return offeredMode !== undefined && isDynamicWorkflowModeEnabled(offeredMode);
}
/**
 * 「服务端提供、用户挑选」规则的唯一实现（launch.md「The user's choice」）：
 *   - 功能未提供（offeredMode 为 disabled）时用户选择不生效——选择永远不能把服务端关掉的功能打开；
 *   - 可用时合法的用户选择取代提供的模式；缺席或非法值（旧文件、未来版本写入的新值）按跟随处理。
 * 只从 `offeredMode` 推导，所以对已应用过选择的快照再次应用是覆盖而不是叠加：Host 闩住的是提供，
 * 每次使用都用最新选择重新应用。
 */
export function applyDynamicWorkflowUserMode(config, userMode) {
    const offer = createDynamicWorkflowClientConfig(config.offeredMode, config.source);
    const choice = normalizeDynamicWorkflowMode(userMode);
    if (!choice || !isDynamicWorkflowOffered(offer))
        return offer;
    return {
        ...offer,
        mode: choice,
        enabled: isDynamicWorkflowModeEnabled(choice),
        userMode: choice,
    };
}
/**
 * 纯函数：把远端 envelope 的 `configs.dynamicWorkflow` 与本地覆盖环境变量折叠成「提供」，再应用用户选择。
 * 提供的优先级：覆盖 > 远端合法值 > 缺省。远端成功但**未下发**该 key 也视为 disabled——
 * 服务端撤掉 key 等于关闭，不能沿用旧快照（与 desktopContextPromptRollout 同一裁决）。
 */
export function resolveDynamicWorkflowClientConfig(input) {
    return applyDynamicWorkflowUserMode(resolveDynamicWorkflowOffer(input), input.userMode);
}
function resolveDynamicWorkflowOffer(input) {
    const override = normalizeDynamicWorkflowMode(input.env?.[ZCODE_DYNAMIC_WORKFLOW_MODE_ENV]);
    if (override)
        return createDynamicWorkflowClientConfig(override, "override");
    const remoteMode = normalizeDynamicWorkflowMode(typeof input.remote === "object" && input.remote !== null
        ? input.remote.mode
        : undefined);
    if (remoteMode)
        return createDynamicWorkflowClientConfig(remoteMode, "remote");
    return createDynamicWorkflowClientConfig(DEFAULT_DYNAMIC_WORKFLOW_MODE, "default");
}
//# sourceMappingURL=dynamic-workflow-feature.js.map