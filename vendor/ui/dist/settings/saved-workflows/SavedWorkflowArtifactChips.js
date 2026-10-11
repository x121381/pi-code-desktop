import { jsx as _jsx } from "react/jsx-runtime";
import { TID_WORKFLOW_ARTIFACT_CHIP } from "@zcode/shared";
import { WorkflowArtifactStrip } from "@/components/workflow-timeline/WorkflowArtifactStrip.js";
/**
 * 中枢里的产物条：运行历史行的状态词之后用小号药丸，
 * 详情页头部那条「最近产物」用常规尺寸。
 *
 * ⚠ 术语：artifact = 脚本经 `artifact.*` 发布给用户看的产出。
 *
 * 与通知行、时间线下的产物条是**同一个**组件——同一个产物在四处必须长得一样。载荷类型
 * （legacy `workflows/runs` 行）与 v4 通知 meta 不同，但四个字段（id / kind / title / version）
 * 两边都有，条只读这四个。
 */
export function SavedWorkflowArtifactChips({ artifacts, onOpenArtifact, className, size = "sm", }) {
    return (_jsx(WorkflowArtifactStrip, { artifacts: artifacts, moreTestId: "workflow-run-artifact-chips-more", pillTestId: TID_WORKFLOW_ARTIFACT_CHIP, size: size, testId: "workflow-run-artifact-chips", ...(className === undefined ? {} : { className }), ...(onOpenArtifact === undefined ? {} : { onOpenArtifact }) }));
}
//# sourceMappingURL=SavedWorkflowArtifactChips.js.map