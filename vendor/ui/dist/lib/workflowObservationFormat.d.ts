/**
 * 观察类工作流工具卡的数值/时间格式化（GetWorkflowRun 与 ListWorkflowRuns 共用）。
 * 纯函数、无 i18n 依赖：数字与时间走 Intl 默认 locale，文案才走 message 表。
 */
export declare function formatWorkflowTokenCount(value: number): string;
/** 列表行的短时间戳：密排行里只保留月日 + 时分。 */
export declare function formatWorkflowTimestamp(epochMs: number): string;
/**
 * `40s` / `5m 10s` / `2h 15m` / `3d 2h`：情势截面里每一段时长与年龄的写法。
 *
 * 刻意与 GetWorkflowRun 模型面的 `formatWorkflowRunDuration`
 * （apps/zcode-cli/packages/core/src/tool/handlers/workflow-run-introspection.ts）逐字同款：
 * 同一份快照的同一个数，模型读到的和卡上画的不能长得不一样。
 */
export declare function formatWorkflowDuration(ms: number): string;
/**
 * 「多久以前」的裸时长（文案里的「前」由 message 表拼）。
 *
 * 基准是快照时刻 `generatedAt`，**不是** `Date.now()`：一条三天前的 transcript 重新打开时，
 * 卡上的年龄仍该是当时那个年龄，否则同一张卡每次重渲染都在漂。没有基准或没有那个时刻就回
 * `undefined`——读侧据此整段省略这个年龄，绝不用 0 或「未知」顶替一件不知道的事。
 */
export declare function formatWorkflowAge(generatedAt: number | undefined, at: number | undefined): string | undefined;
//# sourceMappingURL=workflowObservationFormat.d.ts.map