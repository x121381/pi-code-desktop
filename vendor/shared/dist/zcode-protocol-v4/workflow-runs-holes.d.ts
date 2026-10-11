import { type WorkflowRunState } from "./workflow-runs.js";
/**
 * 留白的站点 id：`hole#` 加 8 位十六进制，键是留白的**名字**，与嵌套深度无关（CLI 的
 * analysis/hole-id.ts 铸造；apps/zcode-cli/packages/dynamic-workflow/docs/analysis.md「Sites」）。
 * id 里不再写嵌套关系：一个留白在哪个留白里面，看它自己的阶段 / 站上的 `fill`。
 */
export declare const WORKFLOW_HOLE_SITE_ID_PATTERN: RegExp;
/**
 * `run-launched.holes` / `hole-filled.holes` 的搬运：下标指向**被接受的**那张 `phaseNames`，所以
 * 越界、非整数、重复一律丢——越界的下标会让侧栏把一盏虚线灯画到一个不存在的站上。一项都不剩时
 * 返回 `undefined`：键不建。
 */
export declare function readPhaseHoles(raw: unknown, count: number): number[] | undefined;
/**
 * 载荷上的声明阶段表（`run-launched` 与 `hole-filled` 同形）：按声明序、裁到与 `phases` 同一对界。
 * 空表返回 `undefined`，调用方据此不动已有的表。
 */
export declare function readPhaseNames(raw: unknown): string[] | undefined;
export declare function reduceHoleReached(run: WorkflowRunState, payload: Record<string, unknown>): WorkflowRunState;
/**
 * `hole-filled`：主代理的补全接进了 run。三件事一步做完——那条记录翻成 filled、阶段表换成补全后的
 * 声明表（超集：留白的体在留白的位置展开）、留白下标表整张换新。「同时在跑」表按插入位置右移：
 * 补全只在留白那一站之后插入 k 站，旧表里 > h 的下标一律 +k；表的形状对不上（不是这种插入）就丢掉，
 * 宁可侧栏少画双线段，也不把它连到错的站上。
 */
export declare function reduceHoleFilled(run: WorkflowRunState, payload: Record<string, unknown>): WorkflowRunState;
/**
 * 剥掉 waiting 记录（新的一世 / 终态）：真相是进程内的停驻 deferred，与 pendingQuestions 同一条理由——
 * 一个已停的 run 没有人在等补全；resume 重跑到那个站点会再发一条 `hole-reached`。filled 记录跨世保留：
 * 那是接进 run 的代码，不是残影。一条不剩时整个键摘掉。
 */
export declare function withoutWaitingHoles(run: WorkflowRunState): WorkflowRunState;
//# sourceMappingURL=workflow-runs-holes.d.ts.map