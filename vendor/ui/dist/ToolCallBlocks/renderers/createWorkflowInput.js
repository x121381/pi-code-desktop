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
export function isPlainRecord(value) {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}
function readTrimmedString(value) {
    if (typeof value !== "string") {
        return undefined;
    }
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
}
/**
 * 进行中的 kind 文案分相（run 尚未联接时）。「校验」只在 `running` 相成立——脚本在
 * `prepareApproval` 里早于确认弹窗就被 analyze 过一遍，而模型写脚本的 `inputStreaming` 相可以
 * 持续数十秒。相位只认适配器原样挂在 raw 上的 v4 状态；缺席就不猜。
 *
 * `amend` 为真时换成修订词汇：
 * 同一个渲染器、同一套相位，只是词不同——模型不是在启动什么，而是在改一个用户正看着的东西。
 */
export function readWorkflowKindMessageId(raw, isRunning, amend = false, 
/**
 * 这次调用只在调并发上限（`isWorkflowRetuneInput`）：不写脚本、也不编译，所以在途期一个字都不
 * 能提「校验」（docs/dynamic-workflow/concurrency.md）。修订词表的 `writing`「正在调整工作流」
 * 对它恒真——无论最后是就地生效还是（run 已结算时）退回一次真修订——所以整个在途期都用它，
 * 不为一个只活几百毫秒的相位新造一个词。待确认另说：那一相在场时它自己的词更有信息量。
 */
retuning = false) {
    const ids = workflowKindIds(amend);
    if (!isRunning) {
        return ids.ran;
    }
    const v4Status = isPlainRecord(raw) ? raw.v4Status : undefined;
    if (v4Status === "pendingApproval") {
        return ids.awaitingConfirmation;
    }
    if (v4Status === "inputStreaming" || retuning) {
        return ids.writing;
    }
    return ids.running;
}
/**
 * 启动前 ToolLayout 行的种类词：
 * - 编不过（有 display 且 `ok === false`）说「工作流草稿（调整草稿）」——什么都没跑，这是一稿待修正的草稿；
 * - 失败但没有 display（被拒、工具报错）仍说「工作流（调整）」；
 * - 编写中说「正在编写（调整）」，第 2 稿起说「正在修改…」——模型在回应反馈，而不是从头开始；
 * - 其余即待确认。
 * 与 `readWorkflowKindMessageId` 同一张词表，只是相位由渲染器算好了传进来。
 */
export function readWorkflowPrelaunchKindMessageId(phase, amend) {
    const ids = workflowKindIds(amend);
    if (phase.compileErrors)
        return ids.draft;
    if (phase.failed)
        return ids.ran;
    if (phase.writing)
        return phase.revising ? ids.revising : ids.writing;
    return ids.awaitingConfirmation;
}
const CREATE_KIND_IDS = {
    writing: "chat.toolCall.workflow.writing",
    revising: "chat.toolCall.workflow.revising",
    awaitingConfirmation: "chat.toolCall.workflow.awaitingConfirmation",
    running: "chat.toolCall.workflow.running",
    ran: "chat.toolCall.workflow.ran",
    draft: "chat.toolCall.workflow.draft",
};
/** 修订词汇。`running`（校验中）没有专门的词：校验与创建同一件事，沿用。 */
const AMEND_KIND_IDS = {
    writing: "chat.toolCall.workflow.amend.writing",
    revising: "chat.toolCall.workflow.amend.revising",
    awaitingConfirmation: "chat.toolCall.workflow.amend.awaitingConfirmation",
    running: "chat.toolCall.workflow.running",
    ran: "chat.toolCall.workflow.amend.ran",
    draft: "chat.toolCall.workflow.amend.draft",
};
/** 留白补全词汇（docs/dynamic-workflow/presentation.md「The fill row」）；校验中同样沿用创建的词。 */
const HOLE_KIND_IDS = {
    writing: "chat.toolCall.workflow.hole.writing",
    revising: "chat.toolCall.workflow.hole.revising",
    awaitingConfirmation: "chat.toolCall.workflow.hole.awaitingConfirmation",
    running: "chat.toolCall.workflow.running",
    ran: "chat.toolCall.workflow.hole.ran",
    draft: "chat.toolCall.workflow.hole.draft",
};
function workflowKindIds(vocabulary) {
    if (vocabulary === "hole")
        return HOLE_KIND_IDS;
    return vocabulary ? AMEND_KIND_IDS : CREATE_KIND_IDS;
}
/** CreateWorkflow 工具入参里的可选展示名；聊天卡片与运行确认窗共用同一读取规则。 */
export function readWorkflowName(input) {
    if (isPlainRecord(input) && typeof input.name === "string") {
        const trimmed = input.name.trim();
        if (trimmed.length > 0) {
            return trimmed;
        }
    }
    return undefined;
}
/** CreateWorkflow 工具入参里的脚本原文；聊天卡片与运行确认窗共用同一读取规则。 */
export function readWorkflowScript(input) {
    if (isPlainRecord(input) && typeof input.script === "string" && input.script.length > 0) {
        return input.script;
    }
    return undefined;
}
/**
 * AmendWorkflow 入参里被修订的前驱 run（`run_id`）。在场即本次是 supersede：以新脚本铸新 run，从这个前驱导入缓存，
 * 前驱还在跑就先停下它。
 *
 * 与 `readWorkflowScript` 同一条纪律：走**入参通道**而不是 display，所以 lineage 事实零新
 * 载荷。只对 AmendWorkflow 行有意义——CreateWorkflow 的入参没有 `run_id`。
 */
export function readWorkflowAmendTarget(input) {
    return isPlainRecord(input) ? readTrimmedString(input.run_id) : undefined;
}
export function readWorkflowAmendPredecessor(input) {
    if (!isPlainRecord(input) || !isPlainRecord(input.predecessor)) {
        return undefined;
    }
    const predecessor = input.predecessor;
    return {
        status: readTrimmedString(predecessor.status),
        name: readTrimmedString(predecessor.name),
    };
}
/**
 * `max_concurrency`：用户要求这次 run 最多同时跑几个子代理。Create 与 Amend 是同一个字段名，所以读取规则也只有一份。
 *
 * 只认正整数：Amend 的 `null`（去掉上限）与缺席在确认窗里是同一件事——没有上限可说，不摆这一行。
 * 到这里的值**已经是会生效的那个**：两个工具的 `resolveInput` 在开确认窗之前就把超过天花板的
 * 请求 clamp 过了。所以这里不重做 clamp——它既拿不到天花板，也不需要拿到。（run 跑起来之后
 * run 头的并发芯片显示的是 min(这条界, 共享 cap)，那是另一回事。）
 */
export function readWorkflowMaxConcurrency(input) {
    if (!isPlainRecord(input)) {
        return undefined;
    }
    const value = input.max_concurrency;
    return typeof value === "number" && Number.isInteger(value) && value > 0 ? value : undefined;
}
export function readWorkflowRetuneCall(input) {
    if (!isPlainRecord(input))
        return undefined;
    const runId = readWorkflowAmendTarget(input);
    if (runId === undefined)
        return undefined;
    const bound = input.max_concurrency;
    const requested = bound === null ? null : readWorkflowMaxConcurrency(input);
    if (requested === undefined)
        return undefined;
    // 任何一个别的意图在场都不是「只调并发上限」：脚本与 path 要编译，模型与名字要换一条 run。
    if (readWorkflowScript(input) !== undefined || readTrimmedString(input.path) !== undefined) {
        return undefined;
    }
    if (input.subagent_model !== undefined || input.name !== undefined)
        return undefined;
    return { runId, requested };
}
/**
 * `subagent_model`：这次 run 的**子代理**跑在哪个模型上（docs/dynamic-workflow/launch.md）。
 * 与 `max_concurrency` 同一条纪律：Create 与 Amend 是同一个字段名，读取规则也只有一份。
 *
 * 只认非空字符串：Amend 的 `null`（退回会话模型）与缺席在确认窗里是同一件事——子代理跟随
 * 会话模型，没有第二个模型可说，不摆这一行。到这里的值**已经是会生效的那个**：两个工具的
 * `resolveInput` 在开确认窗之前就把用户给的名字解析成了规范串 `providerId/modelId[$level]`，
 * 解析不了的调用根本走不到窗前。所以这里不做任何形状校验——UI 不是第二个解析器。
 */
export function readWorkflowSubagentModel(input) {
    return isPlainRecord(input) ? readTrimmedString(input.subagent_model) : undefined;
}
/**
 * 脚本给某些子代理点名了模型（CLI `resolveInput` 回填的 `model_bindings` 非空，docs/dynamic-workflow/
 * launch.md「Models the script names」）。确认窗不逐名列出它们——那是作者模型的选择——只据此把模型
 * 那一句改口成「子代理默认运行在」：它不再替每一个子代理说话。
 */
export function workflowScriptNamesModels(input) {
    return (isPlainRecord(input) &&
        isPlainRecord(input.model_bindings) &&
        Object.keys(input.model_bindings).length > 0);
}
/**
 * 确认窗可调的两项设置（docs/dynamic-workflow/launch.md「Adjusting the settings in the window」）。
 * 走入参而不是 display：display 的字段集冻结，多一个键旧端会整块丢掉。块缺席即旧 agent——它不会
 * 应用窗里改的值，确认窗就照旧只画纯文本条件行。
 */
export function readWorkflowAdjustableSettings(input) {
    if (!isPlainRecord(input) || !isPlainRecord(input.adjustable_settings)) {
        return undefined;
    }
    const block = input.adjustable_settings;
    // 线上键名 `concurrency_ceiling` 早于「默认并发」这个概念，为兼容旧端保留；它现在装的是 D。
    const defaultConcurrency = block.concurrency_ceiling;
    return {
        subagentModel: block.subagent_model === true,
        ...(typeof defaultConcurrency === "number" &&
            Number.isInteger(defaultConcurrency) &&
            defaultConcurrency > 0
            ? { defaultConcurrency }
            : {}),
    };
}
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
export function readWorkflowAmendScriptInherited(input) {
    if (!isPlainRecord(input)) {
        return false;
    }
    if (isPlainRecord(input.predecessor) && input.predecessor.script_inherited === true) {
        return true;
    }
    return readWorkflowScript(input) === undefined && readTrimmedString(input.path) === undefined;
}
/**
 * 聊天卡上的判定：这一行的入参说「沿用前驱
 * 脚本」。入参被快照裁剪成预览时不说——那时缺的是字节，不是脚本。调用方另负责只对**写完的**修订行问
 * （流式中脚本可能还没到）。
 */
export function readWorkflowCardKeptScript(toolCall) {
    const trimmed = (toolCall.snapshotRefs ?? []).some((ref) => ref.field === "input");
    return !trimmed && readWorkflowAmendScriptInherited(toolCall.input);
}
/** 前驱仍在飞（pending / running）：修订会先停下它。 */
export function isWorkflowAmendPredecessorLive(predecessor) {
    return predecessor?.status === "running" || predecessor?.status === "pending";
}
export function readWorkflowSaved(input) {
    if (!isPlainRecord(input) || !isPlainRecord(input.saved)) {
        return undefined;
    }
    const saved = input.saved;
    // 名字是这条来源的身份：读不出名字就当作没有来源，而不是渲染一个空徽标。
    const name = typeof saved.name === "string" ? saved.name.trim() : "";
    if (name.length === 0) {
        return undefined;
    }
    return {
        name,
        path: readTrimmedString(saved.path),
        scope: readTrimmedString(saved.scope),
        args: isPlainRecord(saved.args) ? saved.args : {},
    };
}
/**
 * 实参 / 默认值的展示形态：字符串原样（引号只会给中文实参添噪），其余走 JSON
 * ——声明的四种类型（string / number / boolean / json）由此都可读。
 */
export function formatWorkflowArgValue(value) {
    if (typeof value === "string") {
        return value;
    }
    try {
        return JSON.stringify(value) ?? String(value);
    }
    catch {
        // 循环引用等不可序列化的值不该让整块确认窗崩掉。
        return String(value);
    }
}
//# sourceMappingURL=createWorkflowInput.js.map