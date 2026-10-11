import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo } from "react";
import { draftTimeline, scanWorkflowDraft } from "@/components/workflow-timeline/draft-scan.js";
import { narrowTimelineToFill } from "@/components/workflow-timeline/timeline-holes.js";
import { buildWorkflowTimeline, } from "@/components/workflow-timeline/timeline-model.js";
import { readWorkflowDisplay } from "@/ToolCallBlocks/renderers/createWorkflowDisplay.js";
import { readWorkflowHoleTarget, } from "@/ToolCallBlocks/renderers/createWorkflowHoleInput.js";
import { isFillWorkflowHoleToolCall } from "@/lib/workflowToolNames.js";
/**
 * 留白补全行在 create-workflow 渲染器里的那几样（docs/dynamic-workflow/presentation.md「The fill row」）。
 * 从 create-workflow.tsx 拆出（max-lines 门）：同一个渲染器换留白词汇；主文本是留白的名字（来自 display
 * 的 `fill` 块——行的入参没有名字）；草稿阶段线是父轨道上补全所在的那一截（新的站全墨、两侧邻站 ghost）。
 */
export function useWorkflowHoleRow(toolCall, amend) {
    const fill = isFillWorkflowHoleToolCall(toolCall);
    const holeTarget = useMemo(() => fill
        ? readWorkflowHoleTarget(toolCall.input, readWorkflowDisplay(toolCall.raw)?.fill)
        : undefined, [fill, toolCall.input, toolCall.raw]);
    return { fill, holeTarget, vocabulary: fill ? "hole" : amend };
}
/** 卡上的时间线模型：有图按图（补全行收窄到补全那一截），流式中按草稿扫描，其余没有。 */
export function useWorkflowCardModel({ graph, holeTarget, run, scriptText, writing, }) {
    return useMemo(() => {
        if (graph !== undefined) {
            // 补全行：有效脚本的图收窄到补全所在的那一截（邻站 ghost）；名字来自工具回填的入参。
            if (holeTarget?.holeId !== undefined) {
                const labels = new Map(holeTarget.name === undefined ? [] : [[holeTarget.holeId, { name: holeTarget.name }]]);
                const whole = buildWorkflowTimeline(graph, undefined, labels);
                return narrowTimelineToFill(whole, holeTarget.holeId) ?? whole;
            }
            return buildWorkflowTimeline(graph, run);
        }
        // 流式草稿：display 还没到，站先从半截脚本里扫出来；display 一到整个模型被替换。
        if (writing && scriptText !== undefined)
            return draftTimeline(scanWorkflowDraft(scriptText));
        return undefined;
    }, [graph, holeTarget, run, scriptText, writing]);
}
/**
 * 启动前 / 反馈行的主文本。ToolLayout 是 memo 组件：交给它的节点必须引用稳定。补全行是
 * `· <留白名>`；其余只有名字。留白的类型不上界面。
 */
export function useWorkflowRowPrimaryText(fill, name) {
    return useMemo(() => fill ? (_jsxs("span", { className: "inline-flex min-w-0 items-center gap-2 text-foreground-subtlest", children: [_jsx("span", { "aria-hidden": true, children: "\u00B7" }), _jsx("span", { className: "truncate", "data-testid": "workflow-fill-hole-name", children: name })] })) : (_jsx("span", { className: "truncate text-foreground-subtlest", children: name })), [fill, name]);
}
//# sourceMappingURL=workflow-fill-row.js.map