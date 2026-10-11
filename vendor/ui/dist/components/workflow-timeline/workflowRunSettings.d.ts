import { type AmendWorkflowRunSettingsPayload, type CommandAck, type WorkflowRunState } from "@zcode/shared/zcode-protocol-v4";
/**
 * 会话当前模型（「会话模型」那一项的名字从它来）：优先会话持久的稀疏选择，退回 UI effective 的
 * provider / model 投影；两者都读不出即缺席。
 */
export declare function workflowSessionModelOf(config: {
    modelSelection?: {
        providerId: string;
        modelId: string;
    };
    provider: string;
    model: string;
} | null | undefined): {
    providerId: string;
    modelId: string;
} | undefined;
/** 表单里的子代理模型：会话模型，或一个具体模型（可带思考档）。 */
export type WorkflowRunSettingsModel = {
    kind: "session";
} | {
    kind: "model";
    providerId: string;
    modelId: string;
    level?: string;
};
/** 表单的两项设置。`bound` 为 null 即「本 run 没有自己的界」（跑在默认并发上）。 */
export interface WorkflowRunSettingsDraft {
    model: WorkflowRunSettingsModel;
    bound: number | null;
}
/** Apply 发出去的那部分载荷（workId 由宿主补）。 */
export type WorkflowRunSettingsChange = Omit<AmendWorkflowRunSettingsPayload, "workId">;
/**
 * 哪些 run 能配置：
 * pending / running 能（节流或换模型的主场景）；stopped 能，除非是被一次修订替代掉的（活的是它的
 * 后继）；errored 能（换个模型重试是最常见的修复）；completed 不能（每个 ask 都会从缓存重放，没有
 * 东西会在新设置下跑）；不在投影里的 run 没有设置可显示。宿主回调与灰度门由调用方另叠。
 */
export declare function isWorkflowRunConfigurable(run: WorkflowRunState | undefined): boolean;
/**
 * 默认并发 D（docs/dynamic-workflow/concurrency.md「Protocol state」）：只读 `run.concurrencyCeiling`
 * （`run-started` 随带、恒在；键名早于「默认并发」）。它是起点不是上限：步进器据它写「默认 N」、
 * 判「等于默认 = 不设自己的界」，没有上界。
 *
 * Bug 根因（用户报「本机上限 2」）：此前老 CLI 没发它时退回读数芯片的水位 `concurrency.ceiling`，
 * 而那个水位是「见过的最大 cap」——共享桶在本 run 启动前就被限流压低时，它就是一个学到的 cap，
 * 被当成本机上限念了出来。宁可说不知道默认是几，也不拿一个学到的数冒充它。
 */
export declare function workflowRunDefaultConcurrency(run: WorkflowRunState): number | undefined;
/** 规范串 → 表单模型；解析不动（坏串）按会话模型处理不成立，所以原样保留成一个查不到的具体模型。 */
export declare function workflowRunSettingsModelOf(canonical: string | undefined): WorkflowRunSettingsModel;
/** 表单模型 → 规范串 `providerId/modelId[$level]`；会话模型没有串（undefined）。 */
export declare function workflowRunSettingsModelCanonical(model: WorkflowRunSettingsModel): string | undefined;
/** 打开弹层时的起点：两项都取 run 自己的当前设置。界缺席时停在默认上（默认也未知则为 null）。 */
export declare function initialWorkflowRunSettingsDraft(run: WorkflowRunState): WorkflowRunSettingsDraft;
/**
 * Apply 发什么：只发**改过的**那几项（工具的同一条三态：省略 = 沿用）。模型按规范串比较——
 * 只改思考档也算改了模型；回到会话模型发 `null`。界等于默认发 `null`（解除本 run 自己的界）。
 * 两项都没变 → undefined（Apply 禁用）。
 */
export declare function workflowRunSettingsChange(initial: WorkflowRunSettingsDraft, draft: WorkflowRunSettingsDraft, defaultConcurrency: number | undefined): WorkflowRunSettingsChange | undefined;
/** 步进器夹界：只有下限 1、向下取整，没有上限（默认并发是起点不是天花板）。 */
export declare function clampWorkflowRunSettingsBound(value: number): number;
/**
 * 后果句的文案 key：随 run 状态换最后一句（completed 不会走到这里）。
 *
 * 什么都还没改 → undefined（不念后果句）：Apply 禁用，没有后果可说。原先这里按 run 状态兜一句，
 * running 就念「将停止当前运行」——可只改并发恰恰不会停，改动之前替它下结论总有一项说错。
 *
 * 例外一条：**正在跑**的 run 只改并发上限时，这次修订就地生效——不停这次 run、不另起一次
 * （docs/dynamic-workflow/concurrency.md）。这是原来那句「将停止当前运行」唯一会说错话的场景，
 * 所以只在这一格换词。`pending` 不算在内：它的引擎可能还没建起来，就地设不上就照旧退回一次
 * 真正的修订，那时原句仍然是对的。
 */
export declare function workflowRunSettingsConsequenceId(status: WorkflowRunState["status"], change: WorkflowRunSettingsChange | undefined): string | undefined;
export interface WorkflowRunSettingsRejection {
    /** 词表内的 reason，或 `unsupported`（能力缺席）/ `generic`（词表外，文案带 code）。 */
    reason: string;
    /** 原始 reasonCode（缺席时是 ack.status）。 */
    code: string;
    /** ACK 携带的人可读细节（compile_failed 的有界诊断、start_failed 的原因）。 */
    message?: string;
}
/** accepted / noop 不是拒绝 → undefined；其余按 fault 前缀反查词表。 */
export declare function describeWorkflowRunSettingsRejection(ack: Pick<CommandAck, "status" | "reasonCode" | "message">): WorkflowRunSettingsRejection | undefined;
/** 文案 key：`chat.toolCall.workflow.run.settings.rejection.<reason>`。 */
export declare function workflowRunSettingsRejectionMessageId(rejection: WorkflowRunSettingsRejection): string;
/**
 * 细节块给不给：start_failed 的原因已经嵌进那句话（`{message}`），不再重复一遍；其余带 message 的
 * 拒绝（compile_failed 的诊断）放进有界等宽块。
 */
export declare function workflowRunSettingsRejectionDetail(rejection: WorkflowRunSettingsRejection): string | undefined;
//# sourceMappingURL=workflowRunSettings.d.ts.map