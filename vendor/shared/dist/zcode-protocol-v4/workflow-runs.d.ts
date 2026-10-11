import { z } from "zod";
export declare const WORKFLOW_RUNS_LIMITS: {
    /** 最近若干个 run；超出按最旧淘汰。 */
    readonly maxRuns: 8;
    /**
     * actors 与 nodes **同界**。每个节点都属于某个 actor，所以 nodes 的界已经隐含了 actor
     * 数的量级；把 actors 压得更低（曾是 32）只会让一个平常的 50 路 fan-out 在检视器里
     * 静默少掉 18 个子代理，而节点表、引擎、图三层都装得下。
     *
     * 2026-09-20 从 256 抬到 1024：原来那条界的理由是「状态键按事件整体重发，无界即 O(N²)
     * 字节」，而键级增量（workflow-runs-delta.ts）落地后每条事件只发改动量，那条理由没了。
     * 剩下的两条理由都还在，而且都不需要 256 这么紧：挡住「疯掉的脚本在循环里 `agent()`」，
     * 以及让单条 run 的字节数有个上界。**跨 run** 的总量另有 {@link maxTotalEntries} 管。
     * 它仍然不是产品意义上的子代理上限。
     */
    readonly maxActors: 1024;
    readonly maxNodes: 1024;
    /**
     * 整个状态键的条目预算：所有 run 的 `nodes.length + actors.length` 之和。
     *
     * 单条 run 的界乘以 {@link maxRuns} 是 16384 条，按每条约 150 字节算就是 ~2.5 MB ——
     * 离 16 MiB 的快照上限不远，而快照是要整份序列化的。预算把最坏情形压回 ~1 MB，
     * 代价是**最旧的终态 run** 会提前离场（它的完整事实仍在 journal 里，详情页照样查得到）。
     * 归约在超预算时只淘汰终态 run，绝不动在跑的 run，也绝不动事件所属的那条。
     */
    readonly maxTotalEntries: 6144;
    /**
     * 详情页 Results 区的**展示**预算，刻意远小于引擎的 run 级 report 上限（`REPORT_CAPS.maxItemsPerRun`）：
     * 协议线上的界是展示预算，引擎的界才是契约，两者不必相等。超出这个界的条目仍在
     * journal 里（`dwf_node.kind = "report"`），只是不进这条高频状态键。
     */
    readonly maxReports: 64;
    readonly maxReportPreviewLength: 2048;
    readonly maxResultPreviewLength: 2048;
    readonly maxErrorLength: 2048;
    /**
     * 同时停驻的升级问题条数。引擎侧的真实上界是
     * per-ask 3 条 × 在飞 ask 数（maxConcurrency），32 因此在任何现实 caps 下都够用；
     * 它同时是一道防线——一个疯掉的脚本不该能把一个高频状态键撑爆。
     */
    readonly maxPendingQuestions: 32;
    /** 问题与补充说明的展示上界。与事件载荷的字符串界（2048）同值，所以正常路径永不截断。 */
    readonly maxQuestionLength: 2048;
    /** 并发桶的 provider key（`${providerId}/${modelId}`）上界。 */
    readonly maxConcurrencyKeyLength: 256;
    /**
     * 子代理模型串（`providerId/modelId`，可带 `$reasoningLevel` 后缀）的线上上界。与并发桶的
     * provider key 同值：两者是同一族标识串，只是这一条可能多一个推理档后缀。
     */
    readonly maxSubagentModelLength: 256;
    /**
     * actor `sessionId` 的线上上界。会话 id 是铸出来或读出来的标识，不是展示文本：超界的值
     * 整条丢弃而不是截断——一个被砍短的会话 id 指向的是另一条（或不存在的）会话。
     */
    readonly maxSessionIdLength: 256;
    /**
     * `run.concurrencyCeiling`（默认并发 D）的上界。D 按 `max(4, min(16, cores − 2))` 推导，这条界只挡坏载荷
     * （reducer 读到界外的值当作读不出，沿用已知值）。
     */
    readonly maxConcurrencyCeiling: 1024;
    /**
     * 子代理展示名的线上上界（actor.name 与 pendingQuestion.actorName 同值）。名字是脚本作者
     * 写的任意字符串（`agent("reader-" + paths.join("+"))`），reducer 必须按这条界裁剪后再上线：
     * 曾因一个 131 字的名字让父会话之后的每一帧被渲染端拒收，订阅永久失效。
     */
    readonly maxActorNameLength: 128;
    /**
     * 用户面产物的条数。与引擎侧的
     * `ARTIFACT_CAPS.maxArtifactsPerRun` **同值**，理由与 maxReports 的「展示预算 <
     * 引擎契约」相反：产物的引擎上限本来就是 32，把展示界压得更低只会让一个跑在上限上的
     * 脚本在侧板里静默少掉几张卡，而这些卡正是这个特性存在的全部理由。
     */
    readonly maxArtifacts: 32;
    /**
     * 被进入过的阶段条数。与 display
     * 载荷的 `CREATE_WORKFLOW_GRAPH_MAX_PHASES` 同值：时间线上画不出的阶段，投影里也不必记。
     */
    readonly maxPhases: 32;
    /** 阶段名的线上上界，与 display 的 `CREATE_WORKFLOW_GRAPH_MAX_NAME_CHARS` 同值（UI 按名字关联两边）。 */
    readonly maxPhaseNameLength: 128;
    /**
     * 一条 run 记得的留白条数（docs/dynamic-workflow/presentation.md「Holes on the timeline」）。与 display
     * 载荷的 `holes` 同界：时间线上画不出的留白，投影里也不必记。一个留白就是一个阶段，所以它天然
     * 不会多过 `maxPhases`。
     */
    readonly maxHoles: 32;
    /** 留白类型原文（`Plan`）的线上上界，与 display 的同名字段同值。 */
    readonly maxHoleTypeLength: 128;
    /** 留白的提示语在 run 状态里的上限（侧板等待体要画它）；超长时截到 499 字加 `…`。 */
    readonly maxHolePromptLength: 500;
    /**
     * 一次 ask 的**任务摘要**上界（`node-queued` 的 `instructionsHead`）。与引擎侧的
     * `INSTRUCTIONS_HEAD_MAX_CHARS` 同值：那一头已经按这条界切好，这里是线上的第二道闸。
     * 240 是「一眼看出这个子代理被派去干什么」所需的长度——再长就是在协议线上搬运指令全文，
     * 而指令全文有 journal 与子代理转录两处可去。
     */
    readonly maxInstructionsHeadLength: 240;
    /** 最近一次工具调用的工具名上界（与 actor/node 的 siteId 同量级，工具名是标识符不是文本）。 */
    readonly maxLastToolNameLength: 64;
    /**
     * 最近一次工具调用的**目标**上界（文件路径、命令头）。与引擎侧的
     * `LAST_TOOL_TARGET_MAX_CHARS` 同值。这条界同时是一条安全界：它只放得下一个路径或命令头，
     * 放不下参数全文或文件内容——后两者永远不该出现在这条高频状态键上。
     */
    readonly maxLastToolTargetLength: 120;
};
/**
 * **旧消费者**（没有 `workflowRunDeltas` 能力的那一代）编译进去的 actors / nodes 界。
 *
 * ⚠ 这两个数**永远不能改**：它们不是我们的界，是别人二进制里的校验界。超界的载荷不会被
 * 剥掉一个键——它会让整个 `state.updated` patch 解析失败、整帧被丢，那条订阅从此静默
 * （2026-09-04 的那次 `fault.subscription.recoveryFailed` 就是这个形状）。所以给这类订阅者
 * 发帧前必须先过 `clampWorkflowRunsForLegacy`。
 *
 * 「前 256 条」不是随手取的：旧归约触界时是**拒新**，它产出的恰好就是最早的那 256 条。
 */
export declare const WORKFLOW_RUNS_LEGACY_LIMITS: {
    readonly maxActors: 256;
    readonly maxNodes: 256;
};
/**
 * 一个被控制流进入过的阶段（`phase("…")` 标记；docs/dynamic-workflow/presentation.md
 * 2026-09-05）。`name` 是作者原词（时间线按它关联 display 的 `phases[].name`）；`rounds` 是进入
 * 次数——单调（reducer 取 max），所以 resume 重放的前缀不会把它加倍。
 */
export declare const workflowRunPhaseSchema: z.ZodObject<{
    name: z.ZodString;
    rounds: z.ZodNumber;
}, z.core.$strip>;
export type WorkflowRunPhase = z.infer<typeof workflowRunPhaseSchema>;
/**
 * 界在某个**出生阶段**上花掉了多少（docs/dynamic-workflow/presentation.md「Reduction」）。
 *
 * 两个计数器（{@link workflowRunUsageSchema} 的 `nodesUnlisted` / `nodesUnlistedSettled`）说得出
 * 一条 run 总共少列了多少，说不出少在**哪一站**——而读面是按站画的：一个站点的花名册、计数环和
 * 「N more」都得把自己那格的表外条目加回去，否则宽 fan-out 的站点会显示成一个小数字。
 *
 * `phaseName` 缺席 = 无阶段那一格（出生在任何 `phase()` 标记之前，或旧 CLI 没打戳）。`actors` 是
 * 这个阶段**此刻不在 actor 表上**的子代理数（被拒的、被淘汰的、按孤儿规则摘掉的都算），
 * `actorsSettled` 是其中已知已经结束的、`actorsFailed` 又是其中失败的，`settled` 是记在这一格上的
 * 表外已结算节点数。`actors` 可加可减：一个被淘汰的子代理在下次被派活时会回到表上。
 * 零值的可选子键缺席，四个数全零的格子整个不在（与本文件其余「无则缺席」同规）。
 */
export declare const workflowRunUnlistedPhaseSchema: z.ZodObject<{
    phaseName: z.ZodOptional<z.ZodString>;
    actors: z.ZodNumber;
    actorsSettled: z.ZodOptional<z.ZodNumber>;
    actorsFailed: z.ZodOptional<z.ZodNumber>;
    settled: z.ZodNumber;
}, z.core.$strip>;
export type WorkflowRunUnlistedPhase = z.infer<typeof workflowRunUnlistedPhaseSchema>;
/**
 * run 级用量：观察面，不是控制面（docs/dynamic-workflow/authoring.md）。`spentTokens` 直接取
 * 引擎 `usage-updated` 事件携带的已花总量（与 `dwf_run.spent_tokens` 同一同步步骤写入，
 * 二者永远相等）；`nodesUsed` 是本 run 已派发（dispatched）的节点数，由节点事件计数——
 * 没有任何上限可以拿来反算，也不需要。
 */
export declare const workflowRunUsageSchema: z.ZodObject<{
    spentTokens: z.ZodNumber;
    nodesUsed: z.ZodNumber;
    nodesUnlisted: z.ZodOptional<z.ZodNumber>;
    nodesUnlistedSettled: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export type WorkflowRunUsage = z.infer<typeof workflowRunUsageSchema>;
/**
 * 一个 actor 实例。`status` 是**派生**的三态：
 * 引擎的 Boundary C 除了 `actor-created` 之外不发任何 actor 生命周期事件，所以状态从该 actor 的
 * 节点与 run 的终态推出来——
 *   - `running`：有节点处于 executing / repairing / nudged（模型请求已发出、正在跑）；
 *   - `waiting`：有 live 节点（queued / dispatched / waiting：还没派下去、在等槽位或在退避），
 *     **或**尚无任何节点而 run 未终态（建了还没被 ask）；
 *   - `completed`：其余（全部节点已结算，或 run 已终态）。
 * 不存在可观察的 actor 级 failed：某次 ask 失败仍是「它的活干完了」，结果在节点上。
 *
 * `sessionId` 是**持有这个子代理转录的那条会话**（transcript 下钻直接读它，
 * docs/dynamic-workflow/presentation.md「Subagent transcripts」）。通常是 run service 按
 * `(runId, actorRef)` 确定性铸造的本 run 会话；修订 run 里一个到目前为止全部答案都来自导入
 * 命中的子代理没有自己的会话（命中不建会话），这时它是前驱里被读取的那条会话，由缓存结算的
 * `sourceSessionId` 带来，第一次 live 派发之后换回本 run 的会话（种子已抄入前缀）。
 */
export declare const workflowRunActorSchema: z.ZodObject<{
    siteId: z.ZodString;
    ordinal: z.ZodNumber;
    name: z.ZodOptional<z.ZodString>;
    sessionId: z.ZodOptional<z.ZodString>;
    status: z.ZodEnum<{
        running: "running";
        completed: "completed";
        waiting: "waiting";
    }>;
    phaseName: z.ZodOptional<z.ZodString>;
    model: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type WorkflowRunActor = z.infer<typeof workflowRunActorSchema>;
/**
 * 一次 ask 里**最近一次**工具调用（`node-progress` 携带）。`name` 是工具名；`target` 是一个
 * 短到能当标签用的目标——文件工具的路径、Bash 的命令头，读不出时缺席。
 *
 * **刻意只有这两个键**：参数全文与文件内容不进这条高频状态键（每个已解析轮次发一条），
 * 它们在 journal 与子代理转录里。`target` 的界因此既是展示预算也是那条约束的守卫。
 */
export declare const workflowRunNodeLastToolSchema: z.ZodObject<{
    name: z.ZodString;
    target: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type WorkflowRunNodeLastTool = z.infer<typeof workflowRunNodeLastToolSchema>;
/**
 * 一个节点（ask / world-read）实例。`phase` 就是引擎**实际发出的**节点事件：
 *   queued → dispatched → executing ⇄ waiting → (repairing | nudged) → settled。
 * `executing` / `waiting` 来自 driver 的观察：
 * `node-executing` = 该 ask 的模型请求真的发出去了；`node-waiting` = 它在等进程级槽位或在退避。
 * `dispatched` 因此是「会话就绪、首个请求尚未准入」的短暂相位，读面把它与 queued / waiting 同归「等待」。
 *
 * `kind` 可缺省：resume 的完结命中短路直接发 `node-settled`（ask 走 scheduler.ts 的
 * releaseCachedAsk / tryImportedSettle，world-read 走 engine-world.ts 的重放与导入命中），
 * 不经 `node-queued`，而 kind 只在 queued 上携带。
 */
export declare const workflowRunNodeSchema: z.ZodObject<{
    siteId: z.ZodString;
    ordinal: z.ZodNumber;
    kind: z.ZodOptional<z.ZodEnum<{
        ask: "ask";
        "world-read": "world-read";
    }>>;
    phase: z.ZodEnum<{
        queued: "queued";
        executing: "executing";
        waiting: "waiting";
        settled: "settled";
        dispatched: "dispatched";
        repairing: "repairing";
        nudged: "nudged";
    }>;
    outcome: z.ZodOptional<z.ZodEnum<{
        failed: "failed";
        cancelled: "cancelled";
        ok: "ok";
    }>>;
    cached: z.ZodOptional<z.ZodBoolean>;
    actorSiteId: z.ZodOptional<z.ZodString>;
    actorOrdinal: z.ZodOptional<z.ZodNumber>;
    phaseName: z.ZodOptional<z.ZodString>;
    instructionsHead: z.ZodOptional<z.ZodString>;
    turn: z.ZodOptional<z.ZodNumber>;
    toolCalls: z.ZodOptional<z.ZodNumber>;
    lastTool: z.ZodOptional<z.ZodObject<{
        name: z.ZodString;
        target: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type WorkflowRunNode = z.infer<typeof workflowRunNodeSchema>;
/**
 * 本 run 的并发现状。两条界，
 * 实际并发是**两者取小**：
 *
 * - `cap`：本 run 所在 provider key 的**共享**闸门现状（治理器按 key 分桶、按 run 扇出，
 *   随 `concurrency-changed` 移动）。
 * - `ceiling`：默认并发 D（线上键名早于「默认并发」，旧端还在读它，故保留）。它是参照线不是上限：
 *   共享 cap 可以自动长到 2D，用户也可以把本 run 调到 D 之上。已知 `run.concurrencyCeiling` 时就取
 *   它；只有老 CLI（不发 D）才退回「见过的最大 `previous` / `next`」。
 * - `limit`：本 run **自己的**界（`CreateWorkflow` / `AmendWorkflow` 的 `max_concurrency`
 *   落到 `caps.maxConcurrency`），随 `run-started` 到达、就地 retune 时随 `run-caps-changed` 移动。
 *   **只在 ≠ D 时在场**（高于低于都算）：跑在默认上的 run 与从前一模一样，一个键都不多。
 * - `cooldownMs`：带 Retry-After 的限流冻结新派发的时长，**相对量**（同 `retryInMs` 的理由）；
 *   `idle_reset` 与 run 终态清掉它。
 *
 * UI 的读数规则见 workflowRunConcurrencyView（docs/dynamic-workflow/concurrency.md「What the user sees」）。
 */
export declare const workflowRunConcurrencySchema: z.ZodObject<{
    key: z.ZodOptional<z.ZodString>;
    cap: z.ZodNumber;
    ceiling: z.ZodNumber;
    limit: z.ZodOptional<z.ZodNumber>;
    cooldownMs: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export type WorkflowRunConcurrency = z.infer<typeof workflowRunConcurrencySchema>;
/**
 * 一条脚本 `report(item)` 交出的**渐进产物**（详情页 Results 区的一行）。
 *
 * `report` 与 `log` 不同类：它有 site 身份、进 journal、有自己的 `RunEvent`，所以它进
 * 事件日志、进 Results 区、也随完成通知回给模型；但它**不进因果图**（纯进度发射、
 * 无任何顺序意义），也**不进 `nodes[]`**——报得勤的工作流不该显得步数虚高。
 *
 * `siteId × ordinal` 是身份（journal 的键），也是归约的去重键：脚本 replay 时每个
 * `report` 调用都会重跑，同一实例必须落成同一行而不是两行。
 *
 * 存**预览文本**而不是原值：序列化规则（string 原样；其余 pretty JSON）与 run 产物
 * 回投那条路径同源，一次算在 CLI 侧，renderer 因此不需要复制一份序列化契约；顺带
 * 让「协议边界上的所有载荷有界」这条不变量落在一个 string 上界上。
 */
export declare const workflowRunReportSchema: z.ZodObject<{
    siteId: z.ZodString;
    ordinal: z.ZodNumber;
    preview: z.ZodString;
    artifactId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type WorkflowRunReport = z.infer<typeof workflowRunReportSchema>;
/**
 * 一个**停驻中**的升级问题：某个 actor 撞上真阻塞
 * （坏门、指令自相矛盾、缺关键事实），把问题升级给主代理，并停在自己那次 ask 里等答案。
 *
 * 身份是 `qid`（全局唯一、跨 run），不是站点实例——升级**没有** site 身份：它不写 dwf_node
 * 行、不占 maxNodes，是一次 ask 轮次**内部**的慢工具调用。所以去重键是 qid，而 actor 只是
 * 一个属性。这与 nodes/actors/reports 那三张按 (siteId, ordinal) 去重的表是不同的族。
 *
 * `actorSiteId` / `actorOrdinal` 因此可缺省（形态照抄 `WorkflowRunNode` 的同名一对）：一条
 * 问不出提问者是谁的记录仍然要显示——这个特性存在的理由就是让被卡住的问题**可见**，为了
 * 一个读不动的 actor ref 把整条问题藏起来，恰好毁掉它唯一的兜底价值。`actorName` 是 persona
 * 名，匿名 actor 缺席（事件侧刻意不合成兜底标签，由消费者各自决定怎么渲染「无名」）。
 *
 * **纯内存、随 run 终态清空**：真相是 CLI 进程内的停驻 deferred。进程一死那些 deferred 就没了，
 * 于是「还欠谁一个答案」这件事在终态 run 上恒为假——终态 run 按定义没有在听的人。
 */
export declare const workflowRunPendingQuestionSchema: z.ZodObject<{
    qid: z.ZodString;
    actorSiteId: z.ZodOptional<z.ZodString>;
    actorOrdinal: z.ZodOptional<z.ZodNumber>;
    actorName: z.ZodOptional<z.ZodString>;
    question: z.ZodString;
    context: z.ZodOptional<z.ZodString>;
    askedAt: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export type WorkflowRunPendingQuestion = z.infer<typeof workflowRunPendingQuestionSchema>;
/**
 * 一个留白（docs/dynamic-workflow/authoring.md「Holes」；投影侧见 docs/dynamic-workflow/presentation.md
 * 「Holes on the timeline」）：脚本里一处 `hole<T>("名字")`，run 走到它就停驻那条分支、等主代理用
 * `FillWorkflowHole` 补上代码。身份是**站点 id**（名字键 `hole#<8 位十六进制>`）：同一站点在循环里可以停驻多个 ordinal，
 * 表里只留最新的那一个——补全是按站点一次性的，读面要说的也只是「这个留白等着 / 补上了」。
 *
 * `state`：`waiting` = 引擎里有停驻的 deferred（真相在 CLI 进程内，与 pendingQuestions 同族，所以新的
 * 一世与终态都把它剥掉）；`filled` = 补全已接进 run（事实在 journal 的 `hole-filled` 事件里，跨世保留）。
 * `type` 是作者写的类型原文；载荷不带它时缺席，读面退回 display 载荷的 `holes[].type` 按站点 id 取。
 * `since` 是到达时刻（epoch 毫秒，由事件携带——本模块无时钟），`filledAt` / `filledBy` 随 `hole-filled` 到达。
 */
export declare const workflowRunHoleSchema: z.ZodObject<{
    siteId: z.ZodString;
    ordinal: z.ZodNumber;
    name: z.ZodString;
    type: z.ZodOptional<z.ZodString>;
    prompt: z.ZodOptional<z.ZodString>;
    state: z.ZodEnum<{
        waiting: "waiting";
        filled: "filled";
    }>;
    since: z.ZodOptional<z.ZodNumber>;
    filledAt: z.ZodOptional<z.ZodNumber>;
    filledBy: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type WorkflowRunHole = z.infer<typeof workflowRunHoleSchema>;
export declare const workflowRunSchema: z.ZodObject<{
    runId: z.ZodString;
    toolCallId: z.ZodOptional<z.ZodString>;
    status: z.ZodEnum<{
        pending: "pending";
        running: "running";
        completed: "completed";
        stopped: "stopped";
        errored: "errored";
    }>;
    stopReason: z.ZodOptional<z.ZodEnum<{
        interrupted: "interrupted";
        model: "model";
        user: "user";
        provider: "provider";
        superseded: "superseded";
    }>>;
    resumedFrom: z.ZodOptional<z.ZodString>;
    supersededBy: z.ZodOptional<z.ZodString>;
    usage: z.ZodObject<{
        spentTokens: z.ZodNumber;
        nodesUsed: z.ZodNumber;
        nodesUnlisted: z.ZodOptional<z.ZodNumber>;
        nodesUnlistedSettled: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>;
    error: z.ZodOptional<z.ZodString>;
    resumable: z.ZodOptional<z.ZodLiteral<true>>;
    resultPreview: z.ZodOptional<z.ZodString>;
    actors: z.ZodArray<z.ZodObject<{
        siteId: z.ZodString;
        ordinal: z.ZodNumber;
        name: z.ZodOptional<z.ZodString>;
        sessionId: z.ZodOptional<z.ZodString>;
        status: z.ZodEnum<{
            running: "running";
            completed: "completed";
            waiting: "waiting";
        }>;
        phaseName: z.ZodOptional<z.ZodString>;
        model: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    nodes: z.ZodArray<z.ZodObject<{
        siteId: z.ZodString;
        ordinal: z.ZodNumber;
        kind: z.ZodOptional<z.ZodEnum<{
            ask: "ask";
            "world-read": "world-read";
        }>>;
        phase: z.ZodEnum<{
            queued: "queued";
            executing: "executing";
            waiting: "waiting";
            settled: "settled";
            dispatched: "dispatched";
            repairing: "repairing";
            nudged: "nudged";
        }>;
        outcome: z.ZodOptional<z.ZodEnum<{
            failed: "failed";
            cancelled: "cancelled";
            ok: "ok";
        }>>;
        cached: z.ZodOptional<z.ZodBoolean>;
        actorSiteId: z.ZodOptional<z.ZodString>;
        actorOrdinal: z.ZodOptional<z.ZodNumber>;
        phaseName: z.ZodOptional<z.ZodString>;
        instructionsHead: z.ZodOptional<z.ZodString>;
        turn: z.ZodOptional<z.ZodNumber>;
        toolCalls: z.ZodOptional<z.ZodNumber>;
        lastTool: z.ZodOptional<z.ZodObject<{
            name: z.ZodString;
            target: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
    reports: z.ZodOptional<z.ZodArray<z.ZodObject<{
        siteId: z.ZodString;
        ordinal: z.ZodNumber;
        preview: z.ZodString;
        artifactId: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>>;
    pendingQuestions: z.ZodOptional<z.ZodArray<z.ZodObject<{
        qid: z.ZodString;
        actorSiteId: z.ZodOptional<z.ZodString>;
        actorOrdinal: z.ZodOptional<z.ZodNumber>;
        actorName: z.ZodOptional<z.ZodString>;
        question: z.ZodString;
        context: z.ZodOptional<z.ZodString>;
        askedAt: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>>;
    concurrency: z.ZodOptional<z.ZodObject<{
        key: z.ZodOptional<z.ZodString>;
        cap: z.ZodNumber;
        ceiling: z.ZodNumber;
        limit: z.ZodOptional<z.ZodNumber>;
        cooldownMs: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>;
    concurrencyCeiling: z.ZodOptional<z.ZodNumber>;
    subagentModel: z.ZodOptional<z.ZodString>;
    artifacts: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        kind: z.ZodEnum<{
            file: "file";
            markdown: "markdown";
            chart: "chart";
            table: "table";
            metrics: "metrics";
            board: "board";
        }>;
        title: z.ZodOptional<z.ZodString>;
        version: z.ZodNumber;
        contentType: z.ZodOptional<z.ZodString>;
        bytes: z.ZodOptional<z.ZodNumber>;
        itemCount: z.ZodOptional<z.ZodNumber>;
        primary: z.ZodOptional<z.ZodLiteral<true>>;
    }, z.core.$strict>>>;
    phases: z.ZodOptional<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        rounds: z.ZodNumber;
    }, z.core.$strip>>>;
    currentPhase: z.ZodOptional<z.ZodString>;
    phaseNames: z.ZodOptional<z.ZodArray<z.ZodString>>;
    phaseAlongside: z.ZodOptional<z.ZodArray<z.ZodArray<z.ZodNumber>>>;
    phaseHoles: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    holes: z.ZodOptional<z.ZodArray<z.ZodObject<{
        siteId: z.ZodString;
        ordinal: z.ZodNumber;
        name: z.ZodString;
        type: z.ZodOptional<z.ZodString>;
        prompt: z.ZodOptional<z.ZodString>;
        state: z.ZodEnum<{
            waiting: "waiting";
            filled: "filled";
        }>;
        since: z.ZodOptional<z.ZodNumber>;
        filledAt: z.ZodOptional<z.ZodNumber>;
        filledBy: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>>;
    unlistedByPhase: z.ZodOptional<z.ZodArray<z.ZodObject<{
        phaseName: z.ZodOptional<z.ZodString>;
        actors: z.ZodNumber;
        actorsSettled: z.ZodOptional<z.ZodNumber>;
        actorsFailed: z.ZodOptional<z.ZodNumber>;
        settled: z.ZodNumber;
    }, z.core.$strip>>>;
    truncated: z.ZodOptional<z.ZodBoolean>;
    lastEventSequence: z.ZodNumber;
}, z.core.$strip>;
export type WorkflowRunState = z.infer<typeof workflowRunSchema>;
export declare const workflowRunsStateSchema: z.ZodObject<{
    revision: z.ZodNumber;
    runs: z.ZodArray<z.ZodObject<{
        runId: z.ZodString;
        toolCallId: z.ZodOptional<z.ZodString>;
        status: z.ZodEnum<{
            pending: "pending";
            running: "running";
            completed: "completed";
            stopped: "stopped";
            errored: "errored";
        }>;
        stopReason: z.ZodOptional<z.ZodEnum<{
            interrupted: "interrupted";
            model: "model";
            user: "user";
            provider: "provider";
            superseded: "superseded";
        }>>;
        resumedFrom: z.ZodOptional<z.ZodString>;
        supersededBy: z.ZodOptional<z.ZodString>;
        usage: z.ZodObject<{
            spentTokens: z.ZodNumber;
            nodesUsed: z.ZodNumber;
            nodesUnlisted: z.ZodOptional<z.ZodNumber>;
            nodesUnlistedSettled: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>;
        error: z.ZodOptional<z.ZodString>;
        resumable: z.ZodOptional<z.ZodLiteral<true>>;
        resultPreview: z.ZodOptional<z.ZodString>;
        actors: z.ZodArray<z.ZodObject<{
            siteId: z.ZodString;
            ordinal: z.ZodNumber;
            name: z.ZodOptional<z.ZodString>;
            sessionId: z.ZodOptional<z.ZodString>;
            status: z.ZodEnum<{
                running: "running";
                completed: "completed";
                waiting: "waiting";
            }>;
            phaseName: z.ZodOptional<z.ZodString>;
            model: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
        nodes: z.ZodArray<z.ZodObject<{
            siteId: z.ZodString;
            ordinal: z.ZodNumber;
            kind: z.ZodOptional<z.ZodEnum<{
                ask: "ask";
                "world-read": "world-read";
            }>>;
            phase: z.ZodEnum<{
                queued: "queued";
                executing: "executing";
                waiting: "waiting";
                settled: "settled";
                dispatched: "dispatched";
                repairing: "repairing";
                nudged: "nudged";
            }>;
            outcome: z.ZodOptional<z.ZodEnum<{
                failed: "failed";
                cancelled: "cancelled";
                ok: "ok";
            }>>;
            cached: z.ZodOptional<z.ZodBoolean>;
            actorSiteId: z.ZodOptional<z.ZodString>;
            actorOrdinal: z.ZodOptional<z.ZodNumber>;
            phaseName: z.ZodOptional<z.ZodString>;
            instructionsHead: z.ZodOptional<z.ZodString>;
            turn: z.ZodOptional<z.ZodNumber>;
            toolCalls: z.ZodOptional<z.ZodNumber>;
            lastTool: z.ZodOptional<z.ZodObject<{
                name: z.ZodString;
                target: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>>;
        }, z.core.$strip>>;
        reports: z.ZodOptional<z.ZodArray<z.ZodObject<{
            siteId: z.ZodString;
            ordinal: z.ZodNumber;
            preview: z.ZodString;
            artifactId: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>>;
        pendingQuestions: z.ZodOptional<z.ZodArray<z.ZodObject<{
            qid: z.ZodString;
            actorSiteId: z.ZodOptional<z.ZodString>;
            actorOrdinal: z.ZodOptional<z.ZodNumber>;
            actorName: z.ZodOptional<z.ZodString>;
            question: z.ZodString;
            context: z.ZodOptional<z.ZodString>;
            askedAt: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>>>;
        concurrency: z.ZodOptional<z.ZodObject<{
            key: z.ZodOptional<z.ZodString>;
            cap: z.ZodNumber;
            ceiling: z.ZodNumber;
            limit: z.ZodOptional<z.ZodNumber>;
            cooldownMs: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>>;
        concurrencyCeiling: z.ZodOptional<z.ZodNumber>;
        subagentModel: z.ZodOptional<z.ZodString>;
        artifacts: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            kind: z.ZodEnum<{
                file: "file";
                markdown: "markdown";
                chart: "chart";
                table: "table";
                metrics: "metrics";
                board: "board";
            }>;
            title: z.ZodOptional<z.ZodString>;
            version: z.ZodNumber;
            contentType: z.ZodOptional<z.ZodString>;
            bytes: z.ZodOptional<z.ZodNumber>;
            itemCount: z.ZodOptional<z.ZodNumber>;
            primary: z.ZodOptional<z.ZodLiteral<true>>;
        }, z.core.$strict>>>;
        phases: z.ZodOptional<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            rounds: z.ZodNumber;
        }, z.core.$strip>>>;
        currentPhase: z.ZodOptional<z.ZodString>;
        phaseNames: z.ZodOptional<z.ZodArray<z.ZodString>>;
        phaseAlongside: z.ZodOptional<z.ZodArray<z.ZodArray<z.ZodNumber>>>;
        phaseHoles: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
        holes: z.ZodOptional<z.ZodArray<z.ZodObject<{
            siteId: z.ZodString;
            ordinal: z.ZodNumber;
            name: z.ZodString;
            type: z.ZodOptional<z.ZodString>;
            prompt: z.ZodOptional<z.ZodString>;
            state: z.ZodEnum<{
                waiting: "waiting";
                filled: "filled";
            }>;
            since: z.ZodOptional<z.ZodNumber>;
            filledAt: z.ZodOptional<z.ZodNumber>;
            filledBy: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>>;
        unlistedByPhase: z.ZodOptional<z.ZodArray<z.ZodObject<{
            phaseName: z.ZodOptional<z.ZodString>;
            actors: z.ZodNumber;
            actorsSettled: z.ZodOptional<z.ZodNumber>;
            actorsFailed: z.ZodOptional<z.ZodNumber>;
            settled: z.ZodNumber;
        }, z.core.$strip>>>;
        truncated: z.ZodOptional<z.ZodBoolean>;
        lastEventSequence: z.ZodNumber;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type WorkflowRunsState = z.infer<typeof workflowRunsStateSchema>;
//# sourceMappingURL=workflow-runs.d.ts.map