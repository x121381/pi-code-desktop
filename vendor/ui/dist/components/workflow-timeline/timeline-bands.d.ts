/**
 * 带与轨道。
 *
 * 分析器报的 `alongside` 是**节点事实**：进入这一阶段时，还没 join 的其他阶段的 strand 仍在跑。
 * 这里把它折成画面上的**带**——声明序上连续的一段阶段，内部拆成若干**轨道**，轨道 0 是主线
 * （最下面那一行），分支轨道叠在它上面。带之前分叉、之后汇合；弧把整条带当**一个节点**。
 *
 * 只有下标，没有 id、没有墨迹、没有像素：时间线模型与侧栏的迷你运行线共用同一套折叠，后者只有
 * `phaseNames` 的下标空间，没有 display 图。
 */
/**
 * 一条阶段流（docs/dynamic-workflow/presentation.md「Streams」）：`from` 站在两者都在跑时把东西交给
 * `to` 站。只有下标，与 `alongside` 同一个下标空间。
 */
export interface StreamSpec {
    from: number;
    to: number;
}
/** 一条带：闭区间 `[from, to]` 上的所有站；`tracks[0]` 是主线。 */
export interface PhaseBand {
    from: number;
    to: number;
    tracks: number[][];
}
/**
 * 折带。`alongside[i]` = 与第 i 站并行的站的下标（越界、自指与未列出的都当没说）。
 *
 * 1. 对称化：`alongside` 只有后来者才报得出（进入 B 时 A 还在跑，A 的载荷里没有 B），画面上
 *    两站是对等的。
 * 2. `~` 的连通分量里成员 ≥ 2 的给出区间 `[min, max]`；相交的区间并起来；区间内的空档也算成员
 *    （鲁棒起见——没有循环时不会出现）。
 * 3. 轨道是区间图的贪心着色，按**声明序**：每个成员落到「道上没有与它并行的成员」的最低一道，
 *    否则另开一道。第一个成员因此总在轨道 0 上。
 * 4. 有流时（`streams`），着色只把「谁也够不着谁」的两站当并行：一个阶段与它下游的每个阶段是
 *    同一条线上的活，跑得再同时也该在一条轨道上。所有成员都落在一条轨道上的带**解散**——它不是
 *    带，站回到主线上，由流轨连起来（spec「Bands and tracks」）。侧栏的迷你运行线不传流。
 */
export declare function foldPhaseBands(count: number, alongside: readonly (readonly number[])[], streams?: readonly StreamSpec[]): PhaseBand[];
/** 第 i 站所在的带；带外 undefined。 */
export declare function bandOf<T extends PhaseBand>(bands: readonly T[], i: number): T | undefined;
/** 第 i 站所在的轨道；带外一律 0（主线）。 */
export declare function trackOf(bands: readonly PhaseBand[], i: number): number;
/** 轨道段的种类；缺席 = 一条轨道上的普通段；`stream` = 同一条轨道上相邻两站之间的阶段流。 */
export type TimelineRailKind = "fork" | "merge" | "twin" | "stream";
export interface RailSpec {
    from: number;
    to: number;
    kind?: TimelineRailKind;
}
export interface ArcSpec {
    from: number;
    to: number;
    /** 画在哪条轨道的空中：带内同轨道的弧用那条轨道的空，其余一律用最上面那条的空。 */
    air: number;
    /** 不相邻的阶段流：画成弧，但它说的是「喂给」，不是回环也不是控制跳转。 */
    stream?: true;
}
/** 带 + 它在画面上的两个端点：分叉所在的前驱站与汇合所在的后继站。 */
export interface BoundBand extends PhaseBand {
    pred?: number;
    join?: number;
}
export interface PhaseEdgeFold {
    bands: BoundBand[];
    rails: RailSpec[];
    arcs: ArcSpec[];
}
/**
 * 边 → 轨道段与弧。带把边吃掉一部分：分叉与汇合已经把
 * 「控制经过了这里」说清楚了，剩下的才成弧，且弧的端点被**重挂**到带的两端——带是一个节点。
 */
export declare function foldPhaseEdges(count: number, folded: readonly PhaseBand[], edges: readonly {
    from: number;
    to: number;
}[], streams?: readonly StreamSpec[]): PhaseEdgeFold;
/** 弧道的数量（最高的车道 + 1）；渲染层据它给弧留高度。 */
export declare function arcLaneCount(arcs: readonly {
    lane: number;
}[]): number;
/**
 * 弧的分道：区间图的贪心着色。弧按跨度从短到长（同跨度保持载荷序）依次落到**最低的空道**上——
 * 「空」= 该道上已有的弧与它在站的索引上**不相交**（闭区间：连共用一个端点的也算相交，因为两条弧
 * 在同一站的竖段会连成一线）。于是：互不相干的弧同一高度；嵌套的弧里面矮外面高（短的先落，长的
 * 只能往上）；只有真正交叉的弧才被推上去。
 *
 * 之前的写法是「第 k 条弧就是第 k 道」：两条各在一头、彼此无关的回边也一高一矮，读者会去找那个
 * 并不存在的理由。
 */
export declare function assignArcLanes(pairs: readonly {
    from: number;
    to: number;
}[]): {
    from: number;
    to: number;
    lane: number;
}[];
/**
 * 按 `air` 分别着色：一条轨道的空里只有那条轨道的弧，跨轨道的弧一律在最上面那层空里，
 * 两层空里的弧在 x 上相交也互不相让。返回与入参一一对应的车道号。
 */
export declare function assignAirLanes(arcs: readonly ArcSpec[]): number[];
//# sourceMappingURL=timeline-bands.d.ts.map