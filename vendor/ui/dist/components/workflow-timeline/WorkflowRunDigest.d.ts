import type { WorkflowCausalityGraphData } from "@/components/workflow-graph/types.js";
import type { WorkflowRunCardSummary } from "@/ToolCallBlocks/fileSummaryTypes.js";
import type { HoleLabels } from "./timeline-holes.js";
import { type TimelinePill } from "./timeline-model.js";
import { type WorkflowRunSettingsHost } from "./WorkflowRunSettingsPopover.js";
/** 下方运行卡默认展开，无箭头但仍可收起；状态由标题表达。 */
export interface WorkflowRunDigestProps {
    name: string;
    runId: string;
    /** 该 run 的发起图（按发起 toolCallId 查到）；缺席即画不出阶段线（行窗口没带发起行）。 */
    graph: WorkflowCausalityGraphData | undefined;
    /** 补全过的留白的名字与类型（补全行入参），头的文字从它取（投影没记类型时）。 */
    holeLabels?: HoleLabels;
    /**
     * 活投影的联接摘要。缺席 = run 不在投影里（八条上限淘汰 / 冷恢复无 journal 命中）：卡退成中性单行
     * ——种类词「工作流已结束」、无灯无轨道无 Cancel / Resume，只留 ⤢（侧板会说「不再实时追踪」）。
     */
    summary: WorkflowRunCardSummary | undefined;
    /** 该 run 停驻的待答问题数；> 0 时表头出现警示色芯片。 */
    pendingQuestions?: number;
    /**
     * 打开 run 详情；缺席即无 ⤢、芯片不可点、「还有 n 个」那一行是静态的。带 `landing` 时详情页落到
     * 那一站：只有那一行会带，⤢ 与问题芯片开的是整个 run。
     */
    onOpenRun?: (landing?: {
        phaseId: string;
    }) => void;
    /** 恢复 run；只在 `summary.resumable` 且回调在场时渲染 Resume。 */
    onResume?: () => void;
    /**
     * 停止 run；只在 running 且回调
     * 在场时渲染 Stop，与 Resume 占同一个位置——两个互斥状态，用户从卡上就看到 run 的两条出路。
     */
    onCancel?: () => void;
    /** 点一枚药丸开那个子代理的 transcript；缺席即药丸不可点。 */
    onOpenPill?: (pill: TimelinePill) => void;
    /** 点脚本药丸开脚本 transcript、落到那一站；缺席即脚本药丸不可点。 */
    onOpenWorkspace?: (pill: TimelinePill) => void;
    /** 点一枚产物药丸开产物 tab；缺席即产物药丸禁用。 */
    onOpenArtifact?: (artifactId: string) => void;
    /**
     * providerId → provider 名（宿主从会话的模型清单给，见 useWorkflowSubagentModelProviderName）。
     * 缺席即拼名退回裸 modelId——**永远不显示 providerId**（团队套餐的它是一个 UUID）。
     */
    subagentModelProviderName?: (providerId: string) => string | undefined;
    /**
     * 「配置」弹层的宿主。在场即表头有
     * Configure 钮——宿主只在回调在场且 run 能配置时给它。
     */
    settingsHost?: WorkflowRunSettingsHost;
    /** testid 后缀（unit.key + toolCallId）。 */
    testIdKey: string;
}
export declare function WorkflowRunDigest({ graph, holeLabels, name, onOpenArtifact, onOpenPill, onOpenRun, onOpenWorkspace, onResume, onCancel, pendingQuestions, runId, settingsHost, subagentModelProviderName, summary, testIdKey, }: WorkflowRunDigestProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=WorkflowRunDigest.d.ts.map