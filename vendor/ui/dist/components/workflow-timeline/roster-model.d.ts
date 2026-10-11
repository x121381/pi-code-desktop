import type { StepRunStatus } from "@/components/workflow-graph/types.js";
import type { TimelinePill, TimelineStation } from "./timeline-model.js";
/**
 * 阶段名册：一站的参与者过了阈值，药丸列
 * 换成「钉住的几枚药丸 + 其余」。这里只做纯的划分——谁被钉住、谁是其余、各状态几人——卡、轮尾摘要、
 * 确认窗与侧板四处同一条规则（不变式 1）。卡把「其余」折成一行「还有 n 个」（追记「五枚药丸与一扇门」，
 * `rosterMore`）；侧板把同一行当门，门后是按状态分组的名单（追记「一扇门与一卷名单」，`rosterRoll`）。
 *
 * 界上列不出来的子代理（`station.unlisted`）没有药丸，但阈值、总数、计数与「还有 n 个」都得算上
 * 它们：一站的数字不随它的子代理离表而缩水，只有行会少。
 */
/** 参与者 ≤ 这么多枚时仍是药丸列（六枚 = 222 px，已经比名册高）。 */
export declare const ROSTER_THRESHOLD = 6;
/** 卡上钉住的药丸数：五枚 + 「还有 n 个」一行 = 六枚药丸的高度。 */
export declare const ROSTER_PINS_CARD = 5;
/** 侧板钉住的药丸数（拉满一列，有地方多说几个名字）。 */
export declare const ROSTER_PINS_PANE = 5;
/** 「还有 n 个」那一行上叠着的脸数。 */
export declare const ROSTER_DECK = 3;
export type RosterCounts = Record<StepRunStatus, number>;
/**
 * 表外的那些（`station.unlisted`）：归约在界上列不出来的子代理，没有药丸、没有脸、没有行。
 * 名册只**数**它们——一站的数字不能随着它的子代理离表而缩水。`settled` 是其中已知跑完的，
 * `failed ⊆ settled`；剩下的 `actors − settled` 还要跑。
 */
export interface RosterUnlisted {
    actors: number;
    settled: number;
    failed: number;
}
export interface StationRoster {
    /** 钉住的药丸：asking → running → failed → 按参与者序补位，槽永不空。 */
    pinned: TimelinePill[];
    /** 其余参与者（没被钉住的）：按参与者序。表外的不在这里——它们没有药丸。 */
    rest: TimelinePill[];
    /** 全部参与者（钉住的与表外的都算）按状态计数；静态药丸计作 pending。 */
    counts: RosterCounts;
    /** 表外的那些；一条都没少时是零。 */
    unlisted: RosterUnlisted;
    total: number;
}
/** 静态（无 run）与 pending 逐像素相同，计数上也归一类。 */
export declare function pillStatusOf(pill: Pick<TimelinePill, "status">): StepRunStatus;
/** 实例键（`siteId@ordinal`）：待答问题按它挂到提问者；合成车道没有。 */
export declare function pillInstanceKey(pill: Pick<TimelinePill, "instance">): string | undefined;
export declare function rosterCounts(pills: readonly TimelinePill[]): RosterCounts;
/** 注意力序：「还有 n 个」那一叠脸先露最要紧的；名单的组也按它排。 */
export declare const ATTENTION_ORDER: readonly StepRunStatus[];
/**
 * 钉位序 asking → running → failed → 参与者序：正在跑的一枚不设上限，多少个在跑都钉得满。桶内保持
 * 参与者序，所以一枚 running 的钉位只在它自己停下来时让出——钉位一次只换一枚，不会整列翻。跑完的
 * run 既没有 asking 也没有 running 药丸，这条序自己就退化成 failed → 参与者序，不需要额外的存活输入。
 */
export declare function stationRoster(pills: readonly TimelinePill[], options: {
    pins: number;
    unlisted?: RosterUnlisted;
}): StationRoster | undefined;
/**
 * 一站的名册：表外那一格从站上取（`station.unlisted`），所以卡与侧板读的是同一个值，
 * 谁都不必自己去翻 `run.unlistedByPhase`。
 */
export declare function stationRosterOf(station: Pick<TimelineStation, "pills" | "unlisted">, pins: number): StationRoster | undefined;
/** 门关着时那一行的计数行：门后的一切——表内的其余，加上没有药丸的表外那些。 */
export declare function rosterRestCounts(roster: StationRoster): RosterCounts;
/** 卡上「还有 n 个」那一行的内容（追记「五枚药丸与一扇门」）。 */
export interface RosterMore {
    /** 没被钉住的参与者数（表外的也算——它们同样在这一行后面）。 */
    count: number;
    /** 叠着的脸：其余里按注意力序的前几个（failed → running → pending → done）。表外的没有脸。 */
    deck: TimelinePill[];
    /** 藏在这一行后面的 failed 数（钉住的不算，表外失败的算）——卡上这一行唯一会说的状态。 */
    failed: number;
}
export declare function rosterMore(roster: StationRoster, deck?: number): RosterMore;
/** 侧板名单里的一组：同一状态的其余参与者，参与者序。 */
export interface RollGroup {
    status: StepRunStatus;
    pills: TimelinePill[];
}
/** 门后的名单：其余按状态分组、组序即注意力序、空组缺席。 */
export declare function rosterRoll(roster: StationRoster): RollGroup[];
//# sourceMappingURL=roster-model.d.ts.map