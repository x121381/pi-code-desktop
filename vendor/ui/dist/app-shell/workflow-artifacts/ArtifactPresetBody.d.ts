import { type ArtifactItem } from "@/app-shell/workflow-artifacts/presets/index.js";
import type { PresetLabels } from "@/app-shell/workflow-artifacts/presets/index.js";
import type { WorkflowRunArtifactView } from "@/hooks/useWorkflowRunArtifacts.js";
/**
 * 预置看板的正文。
 *
 * ⚠ 术语：artifact = 脚本经 `artifact.*` 发布给用户看的产出，不是引擎内部那个「脚本顶层返回值」
 * 的同名词。
 *
 * 曾与侧板的产物卡同住一个文件；卡换成产物药丸之后，
 * 这里只剩侧板小预览与全尺寸 tab 共用的这一个分派。
 */
/**
 * 按 kind 把 spec + 条目交给四个渲染器之一。侧板小卡（`compact`）与全尺寸 tab 共用它——
 * 两处若各写一份 switch，迟早出现「小卡画了图、大图什么也没画」这种只在一处发生的偏斜。
 */
export declare function ArtifactPresetBody({ artifact, items, labels, compact, invalidLabel, missingLabel, className, }: {
    artifact: Pick<WorkflowRunArtifactView, "kind" | "spec">;
    items: readonly ArtifactItem[];
    labels: PresetLabels;
    compact?: boolean;
    /** spec 在场但**解析不出来**时的降级文案；缺席即整块不渲染。 */
    invalidLabel?: string;
    /** spec **整个不在场**时的文案；缺席即整块不渲染（见下面那段关于加载中的注释）。 */
    missingLabel?: string;
    className?: string;
}): import("react/jsx-runtime").JSX.Element | null;
//# sourceMappingURL=ArtifactPresetBody.d.ts.map