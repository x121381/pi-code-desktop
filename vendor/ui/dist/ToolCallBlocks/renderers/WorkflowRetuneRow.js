import { jsx as _jsx } from "react/jsx-runtime";
import { WorkflowSettingsChangeRow } from "@/components/workflow-timeline/WorkflowSettingsChangeRow.js";
/**
 * 入参里那个数 → 设置轮那一块元数据。两者本来就是同一件事的两种记法（GUI 走轮元数据，工具走
 * 入参），映射到同一个形状之后措辞只剩一份实现。
 *
 * `requested` 是**模型发出的**数（readWorkflowRetuneCall）。它没有上限——默认并发 D 是起点不是
 * 天花板，高于 D 的数就是生效的数。所以这里把 D（元数据的 `ceiling` 键，名字早于「默认并发」）
 * 一起交给措辞规则：`workflowSettingsChangeSegments` 对 `to === D` 与 `to` 缺席一视同仁，都念
 * 「上限恢复为默认」（等于默认 = 这条 run 没有自己的界），其余的数照念。D 未知（那条 run 已被
 * 淘汰出投影、或老 CLI 没发过它）时只能照念请求值。
 *
 * `from` 不填：入参不知道改之前是多少，而这一行的措辞只读 `to`。`predecessorRunId` 同样不填——
 * 就地生效没有前驱（workflow-row-meta.ts）。
 */
function retuneAsAmendMeta(requested, defaultConcurrency) {
    return {
        maxConcurrency: requested === null ? {} : { to: requested },
        ...(defaultConcurrency === undefined ? {} : { ceiling: defaultConcurrency }),
    };
}
export function WorkflowRetuneRow({ defaultConcurrency, onOpen, requested, runId, }) {
    const row = (_jsx(WorkflowSettingsChangeRow, { amend: retuneAsAmendMeta(requested, defaultConcurrency) }));
    if (onOpen === undefined) {
        return (_jsx("div", { "data-testid": "workflow-retune-row", "data-workflow-retune-run-id": runId, children: row }));
    }
    return (_jsx("button", { className: "flex w-full min-w-0 cursor-pointer rounded-md px-1 text-left transition-colors hover:bg-surface-hover focus-visible:ring-2 focus-visible:ring-ring/40", "data-testid": "workflow-retune-row", "data-workflow-retune-run-id": runId, onClick: onOpen, type: "button", children: row }));
}
//# sourceMappingURL=WorkflowRetuneRow.js.map