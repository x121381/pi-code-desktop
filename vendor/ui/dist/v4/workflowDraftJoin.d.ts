import type { ConversationRow } from "@zcode/shared/zcode-protocol-v4";
import type { WorkflowDraftPosition } from "@/ToolCallBlocks/shared.js";
/**
 * 工作流工具行 → 草稿位置（稿号与是否已被替代）的联接表，行窗口一遍建成
 *
 * 编不过的脚本不是失败：什么都没跑，诊断交回了模型、模型改完再交。卡片要说「第几稿」与「后面还有没有
 * 更新的一稿」，这两个事实都不在单行上，只能从行序里读出来；读法只有这一处实现，卡片只读结果。
 *
 * 规则：
 * - 谱系：工具名，修订再加前驱 `run_id`。创建在创建之间数，每个 run 的修订各自从 1 数起；
 * - 稿号：1 + 同谱系、同一轮里自上一次编过（`display.ok === true`）以来编不过（`ok === false`）的行数；
 *   没有 display 的行（流式中、待确认、被拒、取消）既不计数也不清零；新的一轮从 1 数起；
 * - 被替代：窗口里同谱系后面还有行（同一轮或之后的轮都算）。
 *
 * 行窗口是有界的：前面几稿滑出窗口时稿号会偏小。稿号只用于展示，没有别的读者。
 */
export declare function buildWorkflowDraftByToolCallId(rows: readonly ConversationRow[] | undefined): ReadonlyMap<string, WorkflowDraftPosition>;
//# sourceMappingURL=workflowDraftJoin.d.ts.map