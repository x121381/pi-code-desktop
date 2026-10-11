import { jsx as _jsx } from "react/jsx-runtime";
import { workflowRunStepCounts } from "@zcode/shared/zcode-protocol-v4";
import { cn } from "../../components/lib/utils.js";
import { useZCodeIntl } from "../../i18n/IntlProvider.js";
/**
 * 「仅展示 {shown}/{total} 步的详情」（docs/dynamic-workflow/presentation.md「The run card」
 * 与「The run pane」）：run 撞过 `WORKFLOW_RUNS_LIMITS.maxNodes` 之后，实例表停在界上，而它
 * 上面那些数（步数、结算数）已经把表外的算进来了。这一行说的正是这个差额——**没停的是 run，
 * 停的是每一步的详情**。
 *
 * 卡与详情页共用一个实现：同一条 run 在两个面上必须说同一句话。
 *
 * 只在真有实例被拒之表外时出现。`truncated` 本身还会被 reports / artifacts / phases 等小表
 * 触界置位（workflow-runs.ts），那时步数一个不少，再念一句「仅展示 40/40 步」是句废话。
 */
export function WorkflowTruncatedNotice({ className, run, testId, }) {
    const { intl } = useZCodeIntl();
    if (run?.truncated !== true)
        return null;
    const shown = run.nodes.length;
    const { total } = workflowRunStepCounts(run);
    if (shown >= total)
        return null;
    return (_jsx("p", { className: cn("min-w-0 text-ui-xs text-foreground-subtlest", className), "data-testid": testId, children: intl.formatMessage({ id: "chat.toolCall.workflow.run.truncated" }, { shown, total }) }));
}
//# sourceMappingURL=WorkflowTruncatedNotice.js.map