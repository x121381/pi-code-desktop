/**
 * CreateWorkflow 工具入参的读取规则。
 *
 * 从 `create-workflow.tsx` 拆出：这些是纯函数，而卡片组件本身随 run 态/诊断/图交互线性增长，
 * 两者叠在一处后该文件越过 oxlint max-lines(400)（`rows.ts → toolDisplay.ts`、
 * `ToolCallBlocks.tsx → resolveRenderer.ts` 是同一先例）。本文件不含 JSX，也不碰渲染。
 *
 * 一处定义、三处消费——聊天卡片、运行确认窗、run 详情页——所以同一份入参在任何一个面上
 * 都不会被各自解析出不同的结果。
 */
export declare function isPlainRecord(value: unknown): value is Record<string, unknown>;
/**
 * 进行中的 kind 文案分相（run 尚未联接时）。「校验」只在 `running` 相成立——脚本在
 * `prepareApproval` 里早于确认弹窗就被 analyze 过一遍，而模型写脚本的 `inputStreaming` 相可以
 * 持续数十秒。相位只认适配器原样挂在 raw 上的 v4 状态；缺席就不猜。
 *
 * `amend` 为真时换成修订词汇：
 * 同一个渲染器、同一套相位，只是词不同——模型不是在启动什么，而是在改一个用户正看着的东西。
 */
export declare function readWorkflowKindMessageId(raw: unknown, isRunning: boolean, amend?: WorkflowKindVocabulary, 
/**
 * 这次调用只在调并发上限（`isWorkflowRetuneInput`）：不写脚本、也不编译，所以在途期一个字都不
 * 能提「校验」（docs/dynamic-workflow/concurrency.md）。修订词表的 `writing`「正在调整工作流」
 * 对它恒真——无论最后是就地生效还是（run 已结算时）退回一次真修订——所以整个在途期都用它，
 * 不为一个只活几百毫秒的相位新造一个词。待确认另说：那一相在场时它自己的词更有信息量。
 */
retuning?: boolean): string;
/**
 * 启动前 ToolLayout 行的种类词：
 * - 编不过（有 display 且 `ok === false`）说「工作流草稿（调整草稿）」——什么都没跑，这是一稿待修正的草稿；
 * - 失败但没有 display（被拒、工具报错）仍说「工作流（调整）」；
 * - 编写中说「正在编写（调整）」，第 2 稿起说「正在修改…」——模型在回应反馈，而不是从头开始；
 * - 其余即待确认。
 * 与 `readWorkflowKindMessageId` 同一张词表，只是相位由渲染器算好了传进来。
 */
export declare function readWorkflowPrelaunchKindMessageId(phase: {
    compileErrors: boolean;
    failed: boolean;
    writing: boolean;
    revising: boolean;
}, amend: WorkflowKindVocabulary): string;
/** 三套词表的选择：`true` 是修订（历史上的布尔参数），`"hole"` 是留白补全，其余是创建。 */
export type WorkflowKindVocabulary = boolean | "hole";
/** CreateWorkflow 工具入参里的可选展示名；聊天卡片与运行确认窗共用同一读取规则。 */
export declare function readWorkflowName(input: unknown): string | undefined;
/** CreateWorkflow 工具入参里的脚本原文；聊天卡片与运行确认窗共用同一读取规则。 */
export declare function readWorkflowScript(input: unknown): string | undefined;
/**
 * AmendWorkflow 入参里被修订的前驱 run（`run_id`）。在场即本次是 supersede：以新脚本铸新 run，从这个前驱导入缓存，
 * 前驱还在跑就先停下它。
 *
 * 与 `readWorkflowScript` 同一条纪律：走**入参通道**而不是 display，所以 lineage 事实零新
 * 载荷。只对 AmendWorkflow 行有意义——CreateWorkflow 的入参没有 `run_id`。
 */
export declare function readWorkflowAmendTarget(input: unknown): string | undefined;
/**
 * AmendWorkflow 入参里由 CLI `resolveInput` 回填的前驱事实块：确认窗据 `status` 决定要不要说「仍在运行，将被停止」。只读确认窗
 * 会用到的两个字段；权限判定读的 `owned_by_this_session` 在 CLI 侧，UI 不看它。
 */
interface WorkflowAmendPredecessor {
    status: string | undefined;
    name: string | undefined;
}
export declare function readWorkflowAmendPredecessor(input: unknown): WorkflowAmendPredecessor | undefined;
/**
 * `max_concurrency`：用户要求这次 run 最多同时跑几个子代理。Create 与 Amend 是同一个字段名，所以读取规则也只有一份。
 *
 * 只认正整数：Amend 的 `null`（去掉上限）与缺席在确认窗里是同一件事——没有上限可说，不摆这一行。
 * 到这里的值**已经是会生效的那个**：两个工具的 `resolveInput` 在开确认窗之前就把超过天花板的
 * 请求 clamp 过了。所以这里不重做 clamp——它既拿不到天花板，也不需要拿到。（run 跑起来之后
 * run 头的并发芯片显示的是 min(这条界, 共享 cap)，那是另一回事。）
 */
export declare function readWorkflowMaxConcurrency(input: unknown): number | undefined;
/**
 * 这次 `AmendWorkflow` 调用**只在调并发上限**：`run_id` + `max_concurrency`，没有任何脚本来源、
 * 也不改模型、不改名字。run 还在飞时这样的调用就地生效（docs/dynamic-workflow/concurrency.md）：
 * 不停这次 run、不铸新 run、不编译，结果只有一句话，连 display 都没有。
 *
 * **入参是这条事实在线上的唯一落点**：工具的结构化输出不过 v4（只有 `text` 与 `display`），而
 * 三处 `create_workflow` display schema 都是 `.strict()` 的冻结字段集——多一个键会让旧端把整条
 * 工具结果丢掉。所以呈现按入参形状裁，零协议改动。
 *
 * 只看**形状**，不预言结果：run 已经结算时同一个调用会退回一次真修订（带上前驱的脚本去编译）。
 * 那条路会留下 display、也会铸出一条按 toolCallId 联接得上的 run，两者都是接线层的判据。
 * 流式中入参只到了一半时这个形状也会短暂成立（脚本还没流到），所以在途只用它挑一个对两种结局
 * 都真的词，不据它改变行的形态。
 */
export interface WorkflowRetuneCall {
    runId: string;
    /**
     * 用户要求的上限；`null` = 解除本 run 自己的界（回到默认并发）。
     *
     * ⚠ **未经取整**：CLI 的 `resolveInput` 只把它向下取整到至少 1（没有上限），而这里读到的是模型
     * 发出的那个数。等于默认并发的数与 `null` 一样读作「回到默认」，所以展示方要拿默认并发去比。
     */
    requested: number | null;
}
export declare function readWorkflowRetuneCall(input: unknown): WorkflowRetuneCall | undefined;
/**
 * `subagent_model`：这次 run 的**子代理**跑在哪个模型上（docs/dynamic-workflow/launch.md）。
 * 与 `max_concurrency` 同一条纪律：Create 与 Amend 是同一个字段名，读取规则也只有一份。
 *
 * 只认非空字符串：Amend 的 `null`（退回会话模型）与缺席在确认窗里是同一件事——子代理跟随
 * 会话模型，没有第二个模型可说，不摆这一行。到这里的值**已经是会生效的那个**：两个工具的
 * `resolveInput` 在开确认窗之前就把用户给的名字解析成了规范串 `providerId/modelId[$level]`，
 * 解析不了的调用根本走不到窗前。所以这里不做任何形状校验——UI 不是第二个解析器。
 */
export declare function readWorkflowSubagentModel(input: unknown): string | undefined;
/**
 * 脚本给某些子代理点名了模型（CLI `resolveInput` 回填的 `model_bindings` 非空，docs/dynamic-workflow/
 * launch.md「Models the script names」）。确认窗不逐名列出它们——那是作者模型的选择——只据此把模型
 * 那一句改口成「子代理默认运行在」：它不再替每一个子代理说话。
 */
export declare function workflowScriptNamesModels(input: unknown): boolean;
/** CLI `resolveInput` 回填的「确认窗可调」事实（`adjustable_settings`）。 */
export interface WorkflowAdjustableSettings {
    /** 宿主能解析窗里选的模型；false 时模型那一行只是一句话。 */
    subagentModel: boolean;
    /**
     * 默认并发 D（线上键 `concurrency_ceiling`，名字早于「默认并发」）；缺席即未知。它不是上限：
     * 步进器从 1 起没有上界，只拿它写「默认 N」与判「等于默认 = 不设自己的界」。
     */
    defaultConcurrency?: number;
}
/**
 * 确认窗可调的两项设置（docs/dynamic-workflow/launch.md「Adjusting the settings in the window」）。
 * 走入参而不是 display：display 的字段集冻结，多一个键旧端会整块丢掉。块缺席即旧 agent——它不会
 * 应用窗里改的值，确认窗就照旧只画纯文本条件行。
 */
export declare function readWorkflowAdjustableSettings(input: unknown): WorkflowAdjustableSettings | undefined;
/**
 * 这次修订沿用前驱的脚本。
 * 两个面各有一条证据，读法只有这一份：
 *
 *   - 确认窗读的是 CLI `resolveInput` 回填过的入参：脚本已经在里面，`predecessor.script_inherited`
 *     说它是沿用来的；
 *   - 聊天卡读的是**模型发出的**入参（行的 input 来自流式参数，回填发生在那之后）：两个脚本来源
 *     `script` 与 `path` **都**没有，才是省略了脚本。只缺 `script` 不算——`path` 修订（「Script
 *     files」的常态）同样不带 `script`，而它交上来的正是一份改过的脚本。
 *
 * 第二条只在入参**写完之后**成立——流式中脚本可能还没到，调用方负责只在非 `inputStreaming` 时问。
 * 入参不是记录（快照裁剪成预览、形状不明）时什么都不断言。
 */
export declare function readWorkflowAmendScriptInherited(input: unknown): boolean;
/**
 * 聊天卡上的判定：这一行的入参说「沿用前驱
 * 脚本」。入参被快照裁剪成预览时不说——那时缺的是字节，不是脚本。调用方另负责只对**写完的**修订行问
 * （流式中脚本可能还没到）。
 */
export declare function readWorkflowCardKeptScript(toolCall: {
    input: unknown;
    snapshotRefs?: readonly {
        field: string;
    }[];
}): boolean;
/** 前驱仍在飞（pending / running）：修订会先停下它。 */
export declare function isWorkflowAmendPredecessorLive(predecessor: WorkflowAmendPredecessor | undefined): boolean;
/**
 * CreateWorkflow 归一化入参里的 saved 来源（可复用工作流 spec 的「归一化形状」：
 * `{name, script, saved: {name, args, path, scope}}`）。
 *
 * 与 `readWorkflowScript` 同一条纪律：这些字段走的是**入参通道**而不是 display，
 * 所以聊天卡片与运行确认窗共用这一份读取规则，两处不各自解析。`saved` 缺席就是内联提交，
 * 不是降级——内联路径逐字保持今天的样子。
 */
export interface WorkflowSavedSource {
    name: string;
    path: string | undefined;
    scope: string | undefined;
    /** 校验回填后的实参袋。缺席或形状不符时为空对象，绝不是 undefined。 */
    args: Record<string, unknown>;
}
export declare function readWorkflowSaved(input: unknown): WorkflowSavedSource | undefined;
/**
 * 实参 / 默认值的展示形态：字符串原样（引号只会给中文实参添噪），其余走 JSON
 * ——声明的四种类型（string / number / boolean / json）由此都可读。
 */
export declare function formatWorkflowArgValue(value: unknown): string;
export {};
//# sourceMappingURL=createWorkflowInput.d.ts.map