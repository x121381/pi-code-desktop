import type { WorkflowSettingsAmendMeta } from "@zcode/shared/zcode-protocol-v4";
import { type WorkflowSubagentModelDeps } from "./subagent-model-label.js";
/**
 * 转写行的各段（不含开头的「已调整设置」与末尾时刻）：只有改过的设置在场，模型在前、上限在后。
 * 上限的 `to` 缺席或等于默认并发（`ceiling`，键名早于「默认并发」），都读作「上限恢复为默认」；
 * 其余的数——高于默认也一样——念它自己。
 */
export declare function workflowSettingsChangeSegments(amend: WorkflowSettingsAmendMeta, deps: WorkflowSubagentModelDeps): string[];
export interface WorkflowSettingsProvenanceRow {
    key: "model" | "limit";
    label: string;
    /** 「{from} → {to}」。 */
    value: string;
}
/**
 * 详情页来龙去脉块的 from → to 行。缺席的一端写默认：模型写「会话模型」，上限写默认（知道默认
 * 并发时带上数字，「默认 13 → 4」）。等于默认的一端同样写默认；高于默认的一端念数。
 */
export declare function workflowSettingsProvenanceRows(amend: WorkflowSettingsAmendMeta, deps: WorkflowSubagentModelDeps): WorkflowSettingsProvenanceRow[];
//# sourceMappingURL=workflowSettingsChange.d.ts.map