import { type ChannelReplyHostRequest, type ChannelReplyResult } from "@zcode/shared";
import { type ZCodeTopicResourceReadParams, type ZCodeProtocolTrace, type ZCodePromptAttachment } from "@zcode/shared";
import type { IDisposable } from "@zcode/rpc";
import type { AccountProviderConfigSnapshot, ModelSelectionView, ProviderSource } from "@zcode/provider";
import type { OffPeakClientConfig } from "#src/coding-plan-subscription/codingPlanSubscription.js";
import { type SubagentRuntimeConfig, type ZCodeAutomation, type ZCodeAutomationRun, type DynamicWorkflowClientConfig, type DynamicWorkflowMode } from "@zcode/shared";
import type { IAccountRequestAuthService } from "#src/model-provider/accountRequestAuthService.js";
import type { ModelSelection, ZCodeSessionRuntimePreferencesScope, ZCodeSessionRuntimePreferencesResult } from "@zcode/shared";
import type { IZCodeAgentService, ZCodeAgentWorkspaceTarget } from "./zcodeAgent.js";
import type { ZCodeAgentProcessManagerOptions } from "./zcodeAgentProcessManager.js";
import type { IOffPeakTaskService } from "#src/session/offPeakTask.js";
import { type BrowserAmbientContextExecutor } from "./zcodeAgentBrowserAmbientContext.js";
import { type CuaOperationWorkspaceTarget, type CuaOperationStateReporter } from "./cuaOperationTurnTracker.js";
import type { PipSessionEvent } from "@zcode/zcode-cua/pip-session";
export declare function supportsLegacyRemoteTaskAllowlist(workspaceIdentity: string | undefined): boolean;
/**
 * 进程级 Provider Registry 的只读选择投影。
 *
 * 本地 Worker 自己持有完整 Registry；Host 只用这份投影判断模型执行是否可以启动，
 * 不能再把它扩张成 runtimeModel 并覆盖 Worker 的执行事实源。
 */
interface ModelSelectionReadinessSource {
    getView(): Promise<ModelSelectionView>;
    onDidChange?: (listener: (view: ModelSelectionView) => void) => IDisposable;
}
interface CreateZCodeAgentServiceOptions extends Omit<ZCodeAgentProcessManagerOptions, "idleTimeoutMs"> {
    /** 仅供 MCP 状态探测进程使用，不能把空闲回收传给 chat。 */
    mcpStatusIdleTimeoutMs?: number;
    accountProviderConfigSource?: ProviderSource<AccountProviderConfigSnapshot>;
    accountRequestAuthService?: IAccountRequestAuthService;
    /** Desktop Host 请求 Main 登记 Agent 已授权的精确本地视频路径。 */
    authorizeLocalMediaPreviewPath?: (path: string) => Promise<string>;
    modelSelectionReadinessSource?: ModelSelectionReadinessSource;
    readSubagentRuntimeConfig?: (workspace: {
        workspacePath: string;
        workspaceIdentity?: string;
    }) => Promise<SubagentRuntimeConfig>;
    sessionRuntimePreferencesAuthority?: "local" | "external";
    resolveSessionRuntimePreferences?: (scope: ZCodeSessionRuntimePreferencesScope) => Promise<ZCodeSessionRuntimePreferencesResult>;
    /** manual run 落库后由当前 host 直接派发；返回时 prompt 必须已被 session 接受。 */
    onAutomationManualRunRequested?: (params: {
        automation: ZCodeAutomation;
        run: ZCodeAutomationRun;
    }) => Promise<void>;
    /**
     * Off-Peak 会话内创建。config 同时承担曝光门（enabled && Selection View 非空 →
     * session create/resume 下发 offPeakToolEnabled）与缺省解析（model=白名单末位 /
     * thoughtLevel=最高档）；service 供 offPeak/create、offPeak/list 协议 handler 调用。
     * 两者任一缺省即整体关闭（纯 CLI / desktop-attached-remote 装配不传）。
     */
    resolveOffPeakClientConfig?: () => Promise<OffPeakClientConfig | undefined>;
    /**
     * 动态工作流灰度快照。Host 是唯一裁决者：
     * 结果既作为 workspace 级事实下发给 CLI，也决定 session create/resume/v4 是否带
     * dynamicWorkflowEnabled。缺省不传（纯 CLI 装配）= 永远关闭，与 CLI 缺省一致。
     */
    resolveDynamicWorkflowClientConfig?: () => Promise<DynamicWorkflowClientConfig | undefined>;
    /**
     * 用户选择的读取点（launch.md「The user's choice」）：拥有设置权威的 Host 注入，每次使用时读取
     * 设置文件。desktop-attached remote Host 不注入，改用 desktop 推来的值（syncDynamicWorkflowUserMode）。
     */
    resolveDynamicWorkflowUserMode?: () => Promise<DynamicWorkflowMode | undefined>;
    /** 用户选择同步后交给装配层转发（Desktop Host 推给本窗口的远程 Host）；值取自本机设置。 */
    forwardDynamicWorkflowUserMode?: (mode: DynamicWorkflowMode | undefined) => void;
    resolveOffPeakTaskService?: () => Pick<IOffPeakTaskService, "createTask" | "list" | "getCodingPlanSupport"> | undefined;
    /**
     * browser-use 执行桥：把 agent 的 interaction/browserExecute 反向请求转发到 main
     * （WebContentsView+CDP）。desktop host 装配时注入；缺省（纯 CLI/远控无 main）则
     * browser 命令返回 backend_unavailable，不影响其它功能。
     */
    browserControlExecutor?: BrowserAmbientContextExecutor;
    channelReplyExecutor?: (request: ChannelReplyHostRequest) => Promise<ChannelReplyResult>;
    topicResourceExecutor?: (request: ZCodeTopicResourceReadParams & ZCodeAgentWorkspaceTarget & {
        trace?: ZCodeProtocolTrace;
    }, signal: AbortSignal) => Promise<ZCodePromptAttachment>;
    topicResourceValidator?: (request: ZCodeTopicResourceReadParams & ZCodeAgentWorkspaceTarget & {
        trace?: ZCodeProtocolTrace;
    }, signal: AbortSignal) => Promise<void>;
    /**
     * 官方 Server MCP 身份头解析器。Agent 进程不持有用户身份权威，
     * 经 interaction/requestOfficialMcpAuthHeaders 向 host 索取本次请求的身份头。
     *
     * 缺省时该请求一律返回 official_auth_unavailable，绝不降级为匿名请求——
     * 例如 standalone CLI 没有 host auth port 的场景。
     */
    officialMcpAuthHeadersResolver?: {
        resolveHeaders(request: {
            mcpKey: string;
            pluginId: string;
            targetOrigin: string;
            workspace: {
                workspaceIdentity?: string;
                workspaceKey: string;
                workspacePath: string;
            };
        }): Promise<{
            ok: true;
            headers: Record<string, string>;
        } | {
            ok: false;
            reason: "official_auth_unavailable" | "official_auth_plan_required";
        }>;
    };
    /**
     * 官方 MCP 可信 Origin 校验器。**host 是身份权威边界**，因此
     * targetOrigin 的校验必须在这里执行，不能只依赖 agent adapter 的 fetch wrapper——那等于让
     * 被审查方自己当审查者。desktop-attached remote 场景下 agent 跑在远端而 host 持有本地用户身份。
     *
     * 此校验约束凭据请求的目标 origin，不提供逐插件权限控制。
     * HTTP 鉴权由宿主 fetch wrapper 注入，stdio 鉴权会将凭据交给插件进程；后者
     * 必须按受信任的可执行代码管理。服务端仍须校验每次调用的身份、权限和配额。
     *
     * 缺省时一律拒绝（fail closed），不退化为"只做 schema 校验就发凭据"。
     */
    officialMcpTrustedOrigins?: {
        isTrusted(input: {
            pluginId: string;
            mcpKey: string;
            origin: string;
        }): Promise<{
            detail?: string;
            trusted: boolean;
        }>;
    };
    /** desktop-local Host 注入；只消费已校验、已去重的 live session event。 */
    cuaOperationStateReporter?: CuaOperationStateReporter;
    onCuaPipSessionLifecycle?: (workspace: CuaOperationWorkspaceTarget, event: Exclude<PipSessionEvent, {
        kind: "focus-changed";
    }>) => void;
}
export declare function toProtocolOffPeakTaskSnapshot(task: {
    offPeakTaskId: string;
    title: string;
    status: "queued" | "paused" | "running" | "completed" | "failed" | "cancelled";
    queuePosition?: number;
    sessionId?: string;
    createdAt: number;
}): {
    createdAt: number;
    sessionId?: string | undefined;
    queuePosition?: number | undefined;
    offPeakTaskId: string;
    title: string;
    status: "failed" | "running" | "queued" | "completed" | "paused" | "cancelled";
};
export declare const OFF_PEAK_INTERNAL_ERROR_CODE = "offpeak_internal_error";
export declare const OFF_PEAK_INTERNAL_ERROR_MESSAGE = "Internal off-peak service error";
/** D49-8/SG-02：只有灰度有效开启且白名单非空才算"可创建"；其余一律视为关闭（空数组）。 */
export declare function resolveOffPeakAllowedModels(grayConfig: OffPeakClientConfig | undefined, providerId?: string): readonly string[];
/**
 * model 解析：省略 → 白名单末位（服务端顺序末位≈最新最强）；显式 → trim + 大小写不敏感匹配，
 * 命中返回白名单原写法，未命中返回 null（调用方回 model_not_allowed）。
 */
export declare function resolveOffPeakCreateModel(allowedModels: readonly string[], requested: string | undefined): string | null;
/**
 * 新工具任务复用公共最高档补全；旧 metadata/型号特判会偏离 values 的语义顺序。
 * 显式档位留给 createTask 的现有校验，不在入口擅自换档。
 */
export declare function resolveOffPeakToolSelection(view: ModelSelectionView, providerId: string, modelId: string, thoughtLevel?: string): ModelSelection | undefined;
export declare function createZCodeAgentService(options?: CreateZCodeAgentServiceOptions): IZCodeAgentService & {
    disposeAllAndWait(): Promise<void>;
};
export {};
//# sourceMappingURL=zcodeAgentService.d.ts.map