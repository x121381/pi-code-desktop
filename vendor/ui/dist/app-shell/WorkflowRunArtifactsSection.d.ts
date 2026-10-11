import type { WorkflowRunArtifactView } from "@/hooks/useWorkflowRunArtifacts.js";
/**
 * workflow run 详情页的产物区。
 *
 * ⚠ 术语：这一节的 artifact 是脚本经 `artifact.*` 交付给**用户**的产出。它与上面那个「结果」
 * 面板（脚本的顶层返回值，给模型的）**是两件事**，约定要求两者在屏幕上同时可见且措辞
 * 可区分。
 *
 * 节头走阶段清单的节奏（同一高度、同一内缩、同一枚 chevron）。节身两种画法：
 * - **有交付物**（打了 primary 旗子的那件，或清单只有一件）：交付物行（与完成卡同一条
 *   `WorkflowArtifactRow`；面板窄于 380px 时框收成 136 × 85，由节身的容器查询决定），细线之下
 *   其余产物作**索引**：一件一行、单列、全部列出（与完成卡同一条 `WorkflowArtifactIndex`，卡上
 *   六行封顶、这里不封）。十二件产物是十二行，一屏之内。
 * - **没有交付物**：一片**画廊**：一件产物一张瓦片（预览框 + 说明行，`WorkflowArtifactTile`），列数
 *   随面板宽度自适应——130px 起一列、单列至多 180px，这个尺寸的缩略读得清，所以留着它。
 * 预览框里是产物本身：看板按自然尺寸居中、随 report 条目实时长；文档缩放着露出开头；CSV 前几行；
 * PDF 与二进制画纸页字形。清单已经是交付物在前、其余按首次发布顺序（hook 排过）。
 *
 * **默认展开**（与阶段节相反）：产物是这次运行**交付给用户的东西**，收起等于把交付物藏起来，
 * 而它恰恰是用户打开这个面板最常见的目的。仍可手动收起，收起时节头带件数。
 * **失败与取消的 run 一样渲染**：一个死在第 12 步的 run 仍然可能已经发布了一份 pdf。
 */
export declare const WorkflowRunArtifactsSection: import("react").MemoExoticComponent<({ artifacts, sessionId, runId, onOpenArtifact, }: {
    /** 已确认非空；零件时调用方整区不渲染（「无则缺席」惯例，不留空壳）。 */
    artifacts: readonly WorkflowRunArtifactView[];
    sessionId: string;
    runId: string;
    /** 缺席即瓦片禁用（宿主没注入打开 tab 的能力）。 */
    onOpenArtifact?: (artifactId: string) => void;
}) => import("react/jsx-runtime").JSX.Element>;
//# sourceMappingURL=WorkflowRunArtifactsSection.d.ts.map