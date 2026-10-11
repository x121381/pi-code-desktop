/** The single lane every `files.*` read runs in. */
export const WORKSPACE_LANE_ID = "workspace";
/** Lane of an ask whose receiver the analysis could not resolve to an actor site. */
export const UNKNOWN_LANE_ID = "unknown";
/**
 * 主代理的车道：分析器把每个开着的留白记成这条车道上的一步（analysis.md「Sites」）。它不是子代理，
 * 从不画成药丸——开着的留白自己就是一站（presentation.md「Pills」）。
 */
export const MAIN_LANE_ID = "main";
/** The terminal marker node: the artifact the workflow returns. */
export const SINK_NODE_ID = "sink";
/**
 * 兜底阶段：首个 `phase()` 标记之前发出的 step 的家，也是无标记脚本的隐式唯一阶段
 * （分析器的参与者恒带 `phase: "unphased"`）。保留 id，且**没有 name**——显示名由 UI
 * 本地化，与 `workspace`/`unknown` 车道同一模式（见 phase-name.ts）。
 */
export const UNPHASED_PHASE_ID = "unphased";
/**
 * 无标记脚本的隐式唯一模块的 id（UI 合成，见 participant-model.ts 的 `withImplicitPhase`）。
 * 与 `unphased` 分开：那个词在有标记的脚本里意味着「首个标记之前」（Ungrouped），而隐式
 * 模块就是整个工作流（Workflow）。
 */
export const IMPLICIT_PHASE_ID = "workflow";
export function laneClassOf(laneId) {
    if (laneId === WORKSPACE_LANE_ID)
        return "workspace";
    if (laneId === UNKNOWN_LANE_ID)
        return "unresolved";
    return "agent";
}
export function isSyntheticLaneId(id) {
    return id === WORKSPACE_LANE_ID || id === UNKNOWN_LANE_ID || id === MAIN_LANE_ID;
}
//# sourceMappingURL=types.js.map