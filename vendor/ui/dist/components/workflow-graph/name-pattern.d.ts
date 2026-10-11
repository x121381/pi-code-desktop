import type { WorkflowCausalityGraphData } from "./types.js";
/** 一条车道 / 一张卡片的名字形状；形状取自协议，不在这里另立一套。 */
export type NamePattern = NonNullable<WorkflowCausalityGraphData["lanes"][number]["namePattern"]>;
/**
 * `{head: "研究员"}` → `研究员…`，`{tail: "-worker"}` → `…-worker`，两端都有 → `a…b`。
 *
 * 两个 affix 都缺席时返回 undefined 而不是孤零零一个 `…`：分析器不会发这种 pattern，但契约
 * 上 `{}` 是能通过 `.strict()` 的，这里不替它兜着就会在画面上留一个没有意义的省略号。
 */
export declare function formatNamePattern(pattern: NamePattern | undefined): string | undefined;
//# sourceMappingURL=name-pattern.d.ts.map