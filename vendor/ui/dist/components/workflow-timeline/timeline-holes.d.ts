import { type WorkflowRunState } from "@zcode/shared/zcode-protocol-v4";
import type { WorkflowCausalityGraphData } from "@/components/workflow-graph/types.js";
import type { TimelineRail, TimelineStation, WorkflowTimelineModel } from "./timeline-model.js";
/**
 * 留白在时间线模型上的派生（docs/dynamic-workflow/presentation.md「Holes on the timeline」）。
 * 从 timeline-model.ts 拆出（max-lines 门）：那里只在建站时问一句「这一站是留白吗」、在收尾时
 * 问一句「头在哪、尾巴要不要多 40px」，规则全在这里。无 React、无 DOM、无时间。
 *
 * 一个留白就是一个阶段（id = 站点 id、name = 字面量，规则 9012 保证名字唯一）：
 *   - **开着**：display 的 `holes[]` 列出它（是否尾巴）；run 停在它上时 `run.holes` 说它 waiting。
 *   - **补全了**：display 的 `holes[]` 不再列它；它写下的阶段与站点带 `fill: <它的 id>`。有阶段的补全，
 *     体的站站在留白的位置，留白只剩一个**头**（笔 · 名）悬在它们之上；没有阶段的补全，留白自己
 *     的阶段装着体的 ask，站保留名字、名字旁进一枚笔标。
 * 补全后的名字在 display 上没有落点（它不是站点了），所以从 `run.holes` 取；没有 run 的静态图
 * （确认窗、补全行）由调用方递 `holeLabels`；两处都没有时退回站点 id——总比空着强。
 * 留白的类型（`hole<T>` 的 T）线上有、界面上没有：它是编译契约，不是给用户读的。
 *
 * **嵌套**：补全里可以再留白。留白 id 是名字键（`hole#<8 位十六进制>`），不随深度增长，所以嵌套
 * 关系不在 id 里：一个留白**自己的**阶段 / 站带 `fill: <包着它的留白>`（顶层留白没有），由此得出
 * 父表 {@link HoleTable.parents}。外层的头覆盖「`fill` 是它或它里面任一层留白」的全部站，内层的区域
 * 落在外层的里面；头按 `from` 升序、同起点外层在前（区域先画外层、内层叠在上面）。
 * 修复原因：2026-09-29 之前 id 逐层拼接（`hole#1/hole#1`），接龙八九步就顶到协议的 64 字符上界。
 *
 * 站的 `fill` 回答「这一站属于哪片补全区域」：一般就是阶段的 `fill`；**已补全的留白自己的站**属于
 * 它自己的区域（悬停它亮它自己、它刚补全时它一起落地），所以取它自己的 id，见 {@link stationFillOf}。
 */
export type TimelineHoleState = "open" | "waiting" | "filled";
export interface TimelineHole {
    siteId: string;
    state: TimelineHoleState;
    /** 主代理收到的提示语（等待中，来自 `run.holes`）；侧板的等待体画它。 */
    prompt?: string;
    /** 脚本的尾巴：轨道在它之后多跑 40px。 */
    tail?: true;
    /** 到达时刻（等待中）；补全时刻（补全后）。 */
    since?: number;
    filledAt?: number;
    filledBy?: string;
}
/** 一次有阶段的补全留下的头：覆盖 `from..to` 这几站（下标指向 `stations`）。 */
export interface TimelineFill {
    holeId: string;
    name: string;
    from: number;
    to: number;
    filledAt?: number;
}
export type HoleLabels = ReadonlyMap<string, {
    name: string;
}>;
export declare function isHoleSiteId(id: string): boolean;
/** 留白 id → 包着它的留白 id（顶层留白不在表里）。 */
export type HoleParents = Readonly<Record<string, string>>;
/** `id` 是补全 `holeId` 本身、还是它里面（任意深度）的留白。 */
export declare function fillContains(holeId: string, id: string, parents: HoleParents): boolean;
/**
 * 父表：每个留白自己的阶段与站上的 `fill` 就是包着它的留白（分析器的约定，docs/analysis.md「Sites」）。
 * 阶段优先（补全过的留白只剩阶段），站兜底（开着的留白在 display 上是一个 kind hole 的站）。
 */
export declare function holeParentsOf(graph: Pick<WorkflowCausalityGraphData, "steps">, phases: readonly {
    id: string;
    fill?: string;
}[]): HoleParents;
/**
 * 把「头已经代表了它」的留白阶段从时间线上拿掉：已补全、自己没有成员、而它的体里另有站的留白。
 * 分析器把这种阶段留在表里（侧栏与 `phaseNames` 靠它念得出接龙每一步的名字，docs/analysis.md
 * 「Sites」），但时间线上它只会是体前面一盏空灯——头已经说了它的名字。拿掉时把进它的边接到出它的
 * 边上（`a → h → b` 成 `a → b`），轨道因此不断；没有体站的补全不拿（它的站带笔标，是唯一的痕迹）。
 */
export declare function withoutHeadedHolePhases(graph: WorkflowCausalityGraphData): WorkflowCausalityGraphData;
/**
 * 时间线从哪张图建站：头已代表的留白阶段拿掉（{@link withoutHeadedHolePhases}），父表却从**拿掉
 * 之前**的图算——被拿掉的留白仍是它体里留白的父，嵌套才不断。
 */
export declare function timelineHoleGraph(full: WorkflowCausalityGraphData): {
    graph: WorkflowCausalityGraphData;
    phases: NonNullable<WorkflowCausalityGraphData["phases"]>;
    parents: HoleParents;
};
/** 一站属于哪片补全区域（摊进站的字段）：已补全的留白自己的站属于它自己，其余站属于阶段的 `fill`。 */
export declare function stationFillOf(phase: {
    id: string;
    fill?: string;
}, hole: TimelineHole | undefined): {
    fill?: string;
};
export interface HoleTable {
    /** 阶段 id → 这一站是留白（自己的阶段还在表里的那些）。 */
    byPhase: ReadonlyMap<string, TimelineHole>;
    /** 有阶段的补全的头，按 `from` 升序。 */
    fills: TimelineFill[];
    /** 留白之间的包含关系（见 {@link holeParentsOf}）。 */
    parents: HoleParents;
}
/**
 * 从 display 与 run 读出留白表。`phases` 是模型建站用的那张阶段表（隐式阶段已合成），下标与站一致。
 */
export declare function holeTable(graph: WorkflowCausalityGraphData, phases: readonly NonNullable<WorkflowCausalityGraphData["phases"]>[number][], run: WorkflowRunState | undefined, labels: HoleLabels | undefined, 
/** 从**收缩之前**的图算出的父表（被拿掉的留白阶段仍然是它体里留白的父）；缺席时就地算。 */
parents?: HoleParents): HoleTable;
/** 尾巴留白：开着 / 等着 → 虚线残段 40px 淡出；无阶段补全后 → 只留 40px 的余地（头要落下）。 */
export declare function tailStubOf(stations: readonly TimelineStation[]): "open" | "filled" | undefined;
/** 触到开着 / 等着的留白的轨道段是虚线：那里还不是代码。 */
export declare function railTouchesHole(stations: readonly TimelineStation[], rail: Pick<TimelineRail, "from" | "to">): boolean;
/**
 * 补全行的草稿阶段线（docs/dynamic-workflow/presentation.md「The fill row」）：父轨道上补全所在的那一截
 * ——补全的站全墨、两侧各一个邻站 ghost（40%）——其余站不画。弧、带、运行态一律不带：这是一张说
 * 「新的站落在哪两站之间」的静态图。留白不认识时 undefined。
 */
export declare function narrowTimelineToFill(model: WorkflowTimelineModel, holeId: string): WorkflowTimelineModel | undefined;
//# sourceMappingURL=timeline-holes.d.ts.map