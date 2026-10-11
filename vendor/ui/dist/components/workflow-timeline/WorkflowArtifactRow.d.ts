import type { ReactNode } from "react";
import type { PresetLabels } from "@/app-shell/workflow-artifacts/presets/index.js";
import type { WorkflowCompletionArtifact } from "./WorkflowArtifactTile.js";
/**
 * 交付物行（侧板）：run 的 primary 产物在完成卡与 run 侧板上的样子。
 *
 * 它是**侧躺的瓦片**：同一只 16:10 预览框（160 × 100，与瓦片同一档——不是横幅），框旁是 kind 图标 +
 * 比说明行大一级的标题、作者写的 description（三行截断）、一行等宽的 `kind · size`，尾槽是瓦片的
 * （v{n}，悬停让位给 ↗）。强调来自位置、形态与文字，从不来自更大的预览，也从不来自任何标签——
 * UI 上没有「primary」这个词。
 *
 * 面板窄于 380px 时（容器查询 `wf-artifacts`，由侧板的节身声明）框收成 136 × 85；完成卡不声明
 * 容器，于是恒为 160 × 100。
 *
 * 整行是一颗 `<button>`：宿主没给回调时是禁用的按钮，与瓦片同一条门。与瓦片同一个结构（见
 * WorkflowArtifactTile 文件头）：预览框是按钮的兄弟节点并标 `inert`，按钮只包文字列，
 * 用铺满整行的 `::after` 接住点击。尾槽与细节沿用瓦片的 testid（`workflow-artifact-tile-version` /
 * `-open`、`workflow-run-artifact-badge` / `-bytes` / `-items`）：它们是同一套语法，读测试的人不该
 * 因为形态换了而找不到版本号。
 */
export declare function WorkflowArtifactRow({ artifact, enterDelayMs, labels, onOpen, preview, testId, title: tooltip, }: {
    artifact: WorkflowCompletionArtifact;
    labels: PresetLabels;
    /** 预览框的内容；缺席即纸页字形（由调用方交 `ArtifactSheetGlyph`，与瓦片一致）。 */
    preview?: ReactNode;
    onOpen?: (artifactId: string) => void;
    enterDelayMs?: number;
    testId?: string;
    /** tooltip 覆盖（侧板把工作区出处放进来）；缺席时是「种类词 · 标题」。 */
    title?: string;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=WorkflowArtifactRow.d.ts.map