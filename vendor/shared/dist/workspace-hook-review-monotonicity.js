/**
 * Review 单调性单一裁决函数。
 *
 * 背景：`reviewFlowId/generation 只在单个 Runtime controller 内单调` 这条规则若在
 * product projection（事件回放）、prompt-turn observer（live monitor）、renderer
 * review store（binding 展示）三处独立重实现且已机制性分叉，只靠逐字相同的注释脆弱
 * 同步。本模块把"裁决"收敛为纯函数；"应用策略"（drop/defer/接受新 flow）仍归各
 * 消费方。新增镜像消费方必须消费本函数，不得再手写比较。
 */
export function verdictWorkspaceHookReviewRequest(current, candidate) {
    if (!current)
        return "no_current";
    if (candidate.reviewFlowId !== current.reviewFlowId)
        return "cross_flow";
    if (candidate.generation > current.generation)
        return "same_flow_advance";
    if (candidate.generation < current.generation)
        return "same_flow_stale";
    return candidate.interactionId === current.interactionId
        ? "same_flow_replay"
        : "same_flow_conflict";
}
//# sourceMappingURL=workspace-hook-review-monotonicity.js.map