import type { WorkflowRunState } from "@zcode/shared/zcode-protocol-v4";
import { type LaneRef } from "@/components/workflow-graph/lane-name.js";
import type { PhaseNaming } from "@/components/workflow-graph/phase-name.js";
import { type LaneClass, type StepRunStatus, type WorkflowCausalityGraphData } from "@/components/workflow-graph/types.js";
import { type HoleLabels, type TimelineFill, type TimelineHole } from "./timeline-holes.js";
import { type StationUnlisted } from "./station-observation.js";
import { type TimelineRailKind } from "./timeline-bands.js";
/**
 * 时间线模型。
 *
 * 一个纯函数把有界 display 与 `workflowRuns` 投影折成三样东西：站（阶段）、轨道段（相邻且
 * 有边的两站之间）、弧（非相邻的边）。聊天卡、确认窗与侧栏清单都从这里出发——不变式 1
 * 「一个模型，三处消费」。无 React、无 DOM、无时间。
 *
 * 顺序是**声明序**（载荷 `phases[]` = 首个 `phase()` 标记的顺序），不再分秩：两个只共享前驱的
 * 兄弟阶段照声明序排成一列，它们之间的边成为弧。回边按**方向**判定（目标站在左），不读载荷
 * 的 `back`——分析器把再入（第二个 `phase("plan")` 标记）标成前向边，画面上它仍然向左。
 */
export type TimelineInk = "faint" | "strong" | "march";
export type { TimelineRailKind } from "./timeline-bands.js";
export { arcLaneCount, assignArcLanes } from "./timeline-bands.js";
export interface TimelinePill {
    /** 拆分后的参与者 id（实例卡 `${participant}@${ordinal}`）；React key 与打开实例的抓手。 */
    key: string;
    lane: LaneRef;
    laneClass: LaneClass;
    /** 引擎发出的运行时名（persona 可能改写脚本里的名字）；缺席时渲染车道显示名。 */
    runtimeName?: string;
    /** workflow 内按代理身份分配的头像编号，跨阶段复用。 */
    avatarIndex?: number;
    /** 无 run 时 undefined（静态药丸，与 pending 逐像素相同）。 */
    status: StepRunStatus | undefined;
    /** 该药丸在投影里对应的实例；合成车道（workspace / unknown）没有。 */
    instance?: {
        siteId: string;
        ordinal: number;
        sessionId?: string;
    };
    /**
     * 药丸交出的槽位身份：有实例就是实例的序号；没有实例就是它**将来**
     * 的序号——成员卡 `member.index + 1`，单卡与 `many` 卡 1（引擎按站点顺序发号）。只有活的 run
     * 里的 agent 车道才有；有了它，还没启动的子代理也能开一个占位的 transcript tab。
     */
    slot?: {
        siteId: string;
        ordinal: number;
    };
    /**
     * 脚本药丸交出的抓手：
     * 它没有实例、没有会话，能开的是**整个 run 的脚本 transcript**，落到这一站的第一张卡。
     * 与 `slot` 互斥：只有活的 run 里的 workspace 车道才有；没有 run 就没有可开的东西。
     */
    workspace?: {
        phaseId: string;
    };
    /** 该参与者在本阶段的 step id（侧栏行的活动与计数素材）。 */
    stepIds: string[];
    /** 该实例有待答的升级问题（`run.pendingQuestions`）；名册的钉位规则读它。 */
    asking?: true;
}
export interface TimelineStation {
    id: string;
    naming: PhaseNaming;
    pills: TimelinePill[];
    /** 成员 step 状态的折叠；无 run 时 undefined。 */
    status: StepRunStatus | undefined;
    /** 投影里存在任一节点落在该站的站点上。 */
    visited: boolean;
    /** 该站站点上节点的最大 ordinal；0 = 未到。 */
    rounds: number;
    /** 是任一回边（向左的弧）的源或目标——只有这样的站才显示 `⟳ n`。 */
    onLoop: boolean;
    /** 所在的轨道（`timeline-bands.ts`）；带外一律 0，也就是主线。 */
    track: number;
    /** `settled / observed`；一个节点都没观察到时缺席。表外已结算的实例也在这两个数里。 */
    fraction?: {
        settled: number;
        observed: number;
    };
    /** 界在这一站花掉的表外条目（`station-observation.ts`）；一条都没少时缺席。 */
    unlisted?: StationUnlisted;
    /** 流式草稿里尚未闭合的最后一站。 */
    typing?: true;
    /** 这一站是一处留白（`timeline-holes.ts`）：虚线灯、类型徽标；等待时是当前站。 */
    hole?: TimelineHole;
    /** 这一站是某次补全写进来的（display 阶段上的 `fill`）：悬停时它所在的补全区域亮起。 */
    fill?: string;
    /** 补全行的草稿阶段线里的邻站：只作上下文，40% 墨。 */
    ghost?: true;
}
/** 一条轨道上前后相接的两站之间的一段轨道；下标指向 `stations`。 */
export interface TimelineRail {
    from: number;
    to: number;
    ink: TimelineInk;
    /**
     * 缺席 = 一条轨道上的普通段；带的两端是 `fork` / `merge`，带内跨轨道的相邻两站是 `twin`，同一条
     * 轨道上相邻两站之间的阶段流是 `stream`（墨：两端都在跑 `march`，有东西过去过 `strong`）。
     */
    kind?: TimelineRailKind;
    /** 触到开着 / 等着的留白：画成虚线（那里还不是代码）。 */
    dashed?: true;
}
/**
 * 非相邻的边：`to < from` 是回边。`lane` 从 0 起，贴近轨道的是 0；只有在 x 上**相交**的弧才分道
 * （见 {@link assignArcLanes}），互不相干的弧同高。
 */
export interface TimelineArc {
    from: number;
    to: number;
    lane: number;
    ink: TimelineInk;
    /** 画在哪条轨道的空中；分道按空各算各的，所以 `arcLaneCount` 要先按 `air` 筛。 */
    air: number;
    /** 不相邻的阶段流：墨按流的规则，不行进，不让站上环。 */
    stream?: true;
}
/** 带内的一条轨道；`stations` 是它的成员，声明序。 */
export interface TimelineTrack {
    stations: number[];
    /** 分叉进入这条轨道的墨；没有前驱时按首站到没到过。 */
    entry: TimelineInk;
    /** 这条轨道汇合出去的墨；没有汇合站时按末站到没到过。 */
    exit: TimelineInk;
}
/** 一条带：声明序上连续的一段站，拆到若干轨道上；弧把它当一个节点（`timeline-bands.ts`）。 */
export interface TimelineBand {
    from: number;
    to: number;
    /** 分叉所在的前驱站；缺席时画面上只有一小截尾巴。 */
    pred?: number;
    /** 汇合所在的后继站；缺席时画面上只有一小截残段。 */
    join?: number;
    tracks: TimelineTrack[];
}
export interface WorkflowTimelineModel {
    stations: TimelineStation[];
    rails: TimelineRail[];
    arcs: TimelineArc[];
    /** 并行阶段折成的带，按 `from` 升序；没有 `alongside` 的时间线是空的。 */
    bands: TimelineBand[];
    /** 正在运行的站（多个时取最右）；无则 undefined。 */
    runningIndex: number | undefined;
    /** 是否有 run 投影参与（决定灯 / 墨迹是否有话说）。 */
    live: boolean;
    /** 流式草稿：站由笔逐字写出，子代理只计数不画（`draft-scan.ts`）。分析器的模型没有它。 */
    draft?: {
        agents: number;
    };
    /** 有阶段的补全留下的头（`timeline-holes.ts`），按 `from` 升序；没有补全时为空。 */
    fills?: TimelineFill[];
    /** 留白 id → 包着它的留白 id（`timeline-holes.ts` 的 holeParentsOf）；悬停时外层区域据此亮起。 */
    holeParents?: Readonly<Record<string, string>>;
    /** 末站是尾巴留白：`open` 画 40px 淡出的虚线残段，`filled` 只留 40px 余地。 */
    tailStub?: "open" | "filled";
}
/**
 * 一个模型，三处消费（不变式 1）：卡、详情页与侧栏清单在同一帧里拿到**同一个**模型对象，
 * 按 (graph, run) 的对象身份记忆——为什么身份是正确的键见 `timeline-cache.ts`。模型是只读的，
 * 没有消费者改它，所以共享顺带也是引用稳定性的来源。
 */
export declare function buildWorkflowTimeline(input: WorkflowCausalityGraphData, run: WorkflowRunState | undefined, 
/**
 * 补全过的留白的名与类型（docs/dynamic-workflow/presentation.md「Holes on the timeline」）：没有 run 的
 * 静态图（确认窗、补全行）从工具入参递进来。给了它就不走共享缓存——那张表是按 (graph, run) 键的。
 */
holeLabels?: HoleLabels): WorkflowTimelineModel;
//# sourceMappingURL=timeline-model.d.ts.map