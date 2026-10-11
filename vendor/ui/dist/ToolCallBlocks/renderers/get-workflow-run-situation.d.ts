/**
 * GetWorkflowRun 工具卡的**情势截面**：阶段轨 + 健康行（花名册在
 * get-workflow-run-roster.tsx）。
 *
 * 两条纪律与模型面
 * （apps/zcode-cli/packages/core/src/tool/handlers/get-workflow-run-format-roster.ts）一字不差：
 *   1. **缺席即不画**。没有时刻就没有年龄，没有读数就没有那一格；`0` 是一件事实，
 *      而「不知道」是另一件——绝不用 0 顶替后者。
 *   2. 所有年龄对**快照时刻** `generatedAt` 算，不对 `Date.now()` 算：一张三天前的卡
 *      重新打开时读数不能跟着今天漂。`generatedAt` 缺席就一个年龄都不画。
 *
 * 布局：一律换行行（flex-wrap），没有定宽表格——手机窄屏下要能折行而不是横向溢出。
 */
import type { ToolCallGetWorkflowRunDisplay } from "@zcode/shared/zcode-protocol-v4";
type WorkflowRunPhaseView = NonNullable<ToolCallGetWorkflowRunDisplay["phases"]>[number];
type WorkflowRunHealthView = NonNullable<ToolCallGetWorkflowRunDisplay["health"]>;
/** 情势区块的容器：与同一张卡里的日志面板同款低层容器，不是第二种卡面。 */
export declare const SITUATION_BLOCK_CLASS = "min-w-0 space-y-1 rounded-lg border border-border bg-surface px-2 py-1.5";
/** 情势区块里的一行：窄屏折行，基线对齐（数字与文字混排时才不会互相顶高）。 */
export declare const SITUATION_ROW_CLASS = "flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-0.5";
/**
 * 阶段轨：一行一个阶段，声明序。`ahead` 的行只有序号、名字和状态词——它还没发生过，
 * 没有轮次也没有步数可说。
 */
export declare function WorkflowRunPhaseTrack({ phases, generatedAt, terminal, }: {
    phases: readonly WorkflowRunPhaseView[];
    generatedAt: number | undefined;
    terminal: boolean;
}): import("react/jsx-runtime").JSX.Element | null;
/**
 * 健康行：run 整体还在不在动，一行读数。
 *
 * `stalled` 只对活着的 run 有意义（终态 run 当然不动了）；终态 run 换成一句 **leftover 说明**
 * ——花名册里那些标着运行中的行是进程死在它们下面的残留。这是本张卡上唯一一处「把不知道
 * 说出口」的地方（另一处是待答问题不可见的提示）：沉默会被读成「它们还在跑」。
 *
 * `consecutiveFailures` / `cachedSteps` 只在大于 0 时出现：这两个读数为 0 时不是新闻，
 * 而卡面比模型面更吝惜行。
 */
export declare function WorkflowRunHealthLine({ health, generatedAt, terminal, }: {
    health: WorkflowRunHealthView;
    generatedAt: number | undefined;
    terminal: boolean;
}): import("react/jsx-runtime").JSX.Element | null;
export {};
//# sourceMappingURL=get-workflow-run-situation.d.ts.map