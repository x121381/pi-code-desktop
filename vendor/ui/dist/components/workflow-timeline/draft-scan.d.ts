import type { WorkflowTimelineModel } from "./timeline-model.js";
/**
 * 流式草稿：模型还在写
 * 脚本、分析器还没跑，卡上就先把**阶段线**画出来——只有站与淡墨轨道段，没有药丸、没有弧、没有
 * 状态；子代理只计数（表头的 `N phases · M agents`），画面留给分析器。这是一个**正则级扫描器**，
 * 不是解析器——它只认 `phase("…")` 与 `agent("…")`，认错了也无妨：display 一到整个模型就被
 * 分析器的替换掉（不变式 10）。
 *
 * 同名的第二个 `phase("implement")` 是回到那一站（分析器会把它折成回边），不是新站——草稿
 * 只加不减，站数与分析器的一致，交接时不会有站消失。最后一个未闭合的 `phase("ver` 给最后一站
 * `typing`。
 */
export interface WorkflowDraftPhase {
    name: string;
    typing?: true;
}
export interface WorkflowDraft {
    phases: WorkflowDraftPhase[];
    /** 按出现顺序去重的子代理名（只计数，不画）。 */
    agents: string[];
}
export declare function scanWorkflowDraft(script: string): WorkflowDraft;
/** 草稿 → 时间线模型：只有站与淡墨轨道段，没有药丸、没有弧、没有状态。 */
export declare function draftTimeline(draft: WorkflowDraft): WorkflowTimelineModel;
//# sourceMappingURL=draft-scan.d.ts.map