import { type WorkflowRunState } from "@zcode/shared/zcode-protocol-v4";
import type { WorkflowCausalityGraphData } from "@/components/workflow-graph/types.js";
import type { WorkflowTimelineModel } from "./timeline-model.js";
/**
 * 卡片表头细节与页脚摘要行的文案素材。侧栏状态头的摘要行也读这里——同一个 run 在两个面上必须说同一句话。
 *
 * 纯函数 + 注入的 formatMessage：本仓的轻量 intl 没有 ICU 复数，单复数各自一个 key。
 */
type FormatMessage = (descriptor: {
    id: string;
}, values?: Record<string, string | number>) => string;
export interface TimelineCounts {
    phases: number;
    /** 不重复的子代理车道数（合成车道不算）。 */
    agents: number;
    steps: number;
}
export declare function timelineCounts(model: WorkflowTimelineModel, graph: WorkflowCausalityGraphData | undefined): TimelineCounts;
/** 循环上的站到过的最多轮次；没有循环或还没到过时 0。 */
export declare function timelineRounds(model: WorkflowTimelineModel): number;
/**
 * 确认窗表头右侧只说阶段数——子代理数与步数
 * 在下方时间线上一眼可见，表头再复述只是噪音。
 */
export declare function workflowPhasesDetail(format: FormatMessage, model: WorkflowTimelineModel, graph: WorkflowCausalityGraphData | undefined): string;
/**
 * 卡片表头右侧的细节：**只说阶段数与子代理数**（卡上不要出现「步」，只留
 * 阶段与子代理）。编写中 / 待确认按静态图数；联接到 run 后阶段数不变、子代理改成
 * 「n 个工作中」（跑着）或总数（结束）。步数、token、轮次、产物数都不再上表头——它们留在
 * run 详情页的摘要行（`workflowSummaryParts`）。
 */
export declare function workflowHeaderDetail(format: FormatMessage, model: WorkflowTimelineModel, graph: WorkflowCausalityGraphData | undefined, run: WorkflowRunState | undefined, 
/**
 * 子代理模型名（已解析，见 subagent-model-label.ts）：细节串已经在说「几个子代理」，模型名
 * 跟在它后面当最后一段，同一段淡色文字——不加芯片、不加前缀。强度与规范串留给 tooltip。
 * 没指定过模型的 run 缺席这一段。
 */
subagentModelName?: string): string;
/**
 * 表头细节串 + 它的 tooltip，一次算完：两张卡（v4 轮尾摘要、旧宿主运行卡）必须说同一句话，
 * 所以「模型名加不加」「tooltip 里放什么」只有这一份实现。建不出时间线模型时整块缺席。
 */
export declare function workflowCardDetail(format: FormatMessage, model: WorkflowTimelineModel | undefined, graph: WorkflowCausalityGraphData | undefined, run: WorkflowRunState | undefined, 
/** providerId → provider 名；缺席即拼名退回裸 modelId（永远不显示 provider id）。 */
providerName?: (providerId: string) => string | undefined): {
    detail: string;
    title?: string;
} | undefined;
/**
 * run 详情页摘要行的各段：`1 agent working · 4/7 steps · 42,118 tokens · round 2`；终态换成
 * `3 agents · 11/11 steps · … · 3 rounds · 2 artifacts`。返回值只是字符串，间隔符由渲染方画。
 * 末段数的是**产物**（脚本经 `artifact.*` 交付给用户的产出），不是 `report` 条目：Results 区已
 * 撤走，「results」在屏幕上再没有落点。
 * 聊天里的卡片（工具卡页脚、轮尾摘要）不再用它——卡上只说阶段与子代理
 * （`workflowHeaderDetail`）；这一行只剩详情页在读。
 */
export declare function workflowSummaryParts(format: FormatMessage, model: WorkflowTimelineModel, run: WorkflowRunState, options?: {
    tokens?: boolean;
    /**
     * 子代理模型名（已解析，见 subagent-model-label.ts）：在场时是摘要行的**第一段**——
     * 这一行本来就是「这条 run 的几个数」，模型是它的第一个词。状态头因此不再摆模型芯片。
     */
    subagentModelName?: string;
}): string[];
export {};
//# sourceMappingURL=timeline-summary.d.ts.map