import type { WorkflowRunState } from "@zcode/shared/zcode-protocol-v4";
import { IMPLICIT_PHASE_ID, type StepRunStatus, type StepStatusTable, type WorkflowCausalityGraphData, type WorkflowHandoffData, type WorkflowParticipantData, type WorkflowPhaseData } from "./types.js";
/**
 * 参与者层的纯选择器。
 *
 * 载荷的 `participants` 已经是分析器排好的**交接序**（第一张是开局者），`handoffs` 已经
 * 归约过；这里只做分桶、状态折叠、计数，以及两件 UI 自己的事：
 *   - 无标记脚本合成一个隐式阶段（`withImplicitPhase`），让板面只有一种画法；
 *   - 运行中把 `many` 卡按真实实例拆开、成员卡按 ordinal 收窄、单卡绑定它唯一的实例或在
 *     多实例时同样拆开（`liveParticipantView`）。
 *
 * 无 React、无 DOM：投影层与组件都消费它，测试直接调。
 */
export { IMPLICIT_PHASE_ID };
/** 视图切换的唯一判定曾经是它；现在它只回答「这张图要不要合成隐式阶段」。 */
export declare function hasPhaseVocabulary(graph: WorkflowCausalityGraphData): boolean;
/**
 * 无 `phase()` 标记的脚本 → 一个隐式模块：阶段表只有 `workflow`（无 name，UI 本地化为
 * 「Workflow」），没有阶段边，控制流到达正常完成当且仅当脚本有返回物；每个 step 与每张卡
 * 归入它（分析器给它们的 `unphased` 只是「没有阶段」的占位，卡 id 不变）。
 * 有词汇表的图原样返回（引用相等，memo 友好）。
 */
export declare function withImplicitPhase(graph: WorkflowCausalityGraphData): WorkflowCausalityGraphData;
/**
 * 一个阶段的参与者，保持载荷顺序（= 交接序）。主代理的车道（`main`）不算：它唯一的一步是开着的留白，
 * 而留白自己是一站（presentation.md「Pills」）。
 *
 * 修复原因（2026-09-29 testfield 实测）：分析器把开着的留白放在含 `hole()` 调用的阶段里、并为它发一个
 * `main` 车道的参与者；这里原样交出去，时间线就把它画成一个没名字的子代理，那一站多一枚「未命名子代理」。
 */
export declare function participantsOfPhase(graph: WorkflowCausalityGraphData, phaseId: string): WorkflowParticipantData[];
export declare function participantById(graph: WorkflowCausalityGraphData, id: string): WorkflowParticipantData | undefined;
/** 两端都在给定集合里的交接边（阶段内部的边）。 */
export declare function handoffsWithin(graph: WorkflowCausalityGraphData, ids: ReadonlySet<string>): WorkflowHandoffData[];
export declare function handoffsAround(graph: WorkflowCausalityGraphData, id: string): {
    incoming: WorkflowHandoffData[];
    outgoing: WorkflowHandoffData[];
};
/** 卡片次行的计数素材：ask 数与工作区读取数（一张卡只会有其中一种非零）。 */
export interface ParticipantCounts {
    asks: number;
    reads: number;
}
export declare function participantCounts(graph: WorkflowCausalityGraphData, participant: WorkflowParticipantData): ParticipantCounts;
/** 任一 step 带 `repeat` ⇒ 卡片显示重复图元（自环在参与者粒度上消失，这是它留下的线索）。 */
export declare function participantRepeats(graph: WorkflowCausalityGraphData, participant: WorkflowParticipantData): boolean;
/**
 * 多个 step 状态的折叠：收集名下**存在条目**的 step 的状态，交给 `aggregateRunStatuses`
 * （唯一的折叠，格见那里）。没有条目的 step 不参与——它是控制流没走的站点，不是排队中的
 * 节点；一个条目都没有（或静态渲染）返回 undefined。卡、站、检视器标题灯三处共用。
 */
export declare function collapseStatuses(stepIds: readonly string[], statuses: StepStatusTable | undefined): StepRunStatus | undefined;
/**
 * 一张卡的状态：实时视图给出的按实例收窄的覆盖值优先（成员卡 / 拆分出的实例卡），
 * 否则由它的 step 折叠。
 */
export declare function participantStatus(participant: WorkflowParticipantData, statuses: StepStatusTable | undefined, participantStatuses?: Record<string, StepRunStatus>): StepRunStatus | undefined;
/** 同一条车道还出现在哪些其他阶段（检视器「also in」一行）。 */
export declare function participantAlsoIn(graph: WorkflowCausalityGraphData, participant: WorkflowParticipantData): WorkflowPhaseData[];
/** 拆分出的实例卡 id：`${participant.id}@${ordinal}`。 */
export declare function instanceCardId(participantId: string, ordinal: number): string;
/**
 * 一张卡名下的实例：
 * 拆分出的实例卡（`many` 卡、多实例的单卡）各自的那一个，或者原卡**绑定**的那一个
 * （恰有一个实例的单卡、成员卡的第 i 个）。名字就是引擎发出的有效名，卡面优先念它。
 */
export interface ParticipantInstance {
    /** 拆分前的参与者 id（绑定时就是这张卡自己的 id）。 */
    participant: string;
    ordinal: number;
    name?: string;
    /**
     * 原卡绑定而非拆分：卡 id 没变，标签规则也不变（成员卡仍 `#i`，单卡无标签）——
     * 运行时名不做视觉标记。缺席 = 拆分出的实例卡，标签念 `#ordinal`。
     */
    bound?: true;
}
export interface LiveParticipantView {
    /** 参与者与交接已按实例拆分的图；无 run 时就是输入图（引用相等）。 */
    graph: WorkflowCausalityGraphData;
    /** 按实例收窄后的卡片状态（成员卡、实例卡）；其余卡由 step 折叠。 */
    participantStatuses: Record<string, StepRunStatus>;
    /** 实例卡 id → 身份。 */
    instances: Record<string, ParticipantInstance>;
}
/**
 * 实时视图
 *
 *  - `many` 卡：该车道上每个已出现的 actor 实例各出一张卡，交接边按原卡复制到每张实例卡；
 *    实例尚未出现时保留原来那一张（状态由 step 折叠）。
 *  - 单卡：车道上恰有一个实例 → 原卡绑定它（id 不变、状态仍由 step 折叠，只是名字有了）；
 *    两个以上 → 与 `many` 同一条拆分路径——运行时基数胜过静态基数。
 *  - 成员卡（字面量基数展开）：第 i 个成员对应该车道上按 ordinal 排序的第 i 个实例，绑定它，
 *    状态只看那个实例的节点；实例未出现 → pending、不绑定。多出 `of` 的实例不出卡。
 *  - 工作区等合成车道上没有实例，卡不动。
 *
 * 节点按 `(siteId ∈ 卡的站点, actorSiteId === lane, actorOrdinal === ordinal, 卡的阶段 ∈
 * phasesOf(节点))` 收窄；站点取 `step.source ?? step.id`（may-set 拷贝报的是站点 id，与
 * run-status.ts 的关联键同源）。实例在场而它的站点上一个节点都没有 → pending：实例是观察到
 * 的事实，只是还没在这一站动（折叠自己对空集只说 undefined，解缺席是这里的事）。
 *
 * 「实例绑定」：一张卡认领的实例不再是**整条车道**上的实例——同一个站点被 k
 * 个阶段再入时，k 张卡共享一条车道，按车道认领就是一次广播（每站都列全部 100 个）。见
 * {@link instancesOfCard}。
 */
export declare function liveParticipantView(graph: WorkflowCausalityGraphData, run: WorkflowRunState | undefined): LiveParticipantView;
//# sourceMappingURL=participant-model.d.ts.map