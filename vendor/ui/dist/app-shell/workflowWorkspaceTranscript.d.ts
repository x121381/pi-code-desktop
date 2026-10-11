import type { WorkflowRunState, WorkflowRunWorkspaceNode } from "@zcode/shared/zcode-protocol-v4";
import type { WorkflowCausalityGraphData } from "@/components/workflow-graph/types.js";
import type { PhaseNaming } from "@/components/workflow-graph/phase-name.js";
export type WorkspaceCardKind = "read" | "search" | "git" | "terminal" | "step";
/** 一张卡的静态素材（不含状态——状态在 `workspaceCardStatus`，因为它还要叠活投影）。 */
export interface WorkspaceCardModel {
    /** React key 与 ToolLayout 的 toolId / 展开态记忆键。 */
    key: string;
    node: WorkflowRunWorkspaceNode;
    kind: WorkspaceCardKind;
    op: string | undefined;
    /** Read：路径；Search：pattern（glob / grep）；Git：子命令 + 实参；Terminal：命令行；Step：步标签。 */
    primary: string;
    /** Search 的第二个实参（grep 的 glob 范围）；Git diff 的路径。 */
    secondary?: string;
    /** Terminal：`cmd arg…`（展开面板里 `$` 后面那一行）。 */
    command?: string;
    /** 所属阶段（静态图按站点查）；图不可得或站点不在图上时缺席。 */
    phase?: PhaseNaming;
    /** 该站点的第几次调用（journal 序号）；> 1 时源芯片带 ⟳n。 */
    round: number;
}
interface WorkspaceCardStatus {
    status: WorkflowRunWorkspaceNode["status"];
    /** 活投影说这一步是 resume 的缓存命中（`replayed` 芯片）。 */
    replayed: boolean;
}
/** 一条 argv 的展示：带空格的实参加引号，与终端里敲的样子一致。 */
export declare function formatCommandLine(cmd: string, args: readonly string[]): string;
export declare function workspaceCardKindOf(op: string | undefined): WorkspaceCardKind;
export declare function buildWorkspaceCards(nodes: readonly WorkflowRunWorkspaceNode[], graph: WorkflowCausalityGraphData | undefined): WorkspaceCardModel[];
/**
 * 活投影的叠加：只补 `cached`（replayed 芯片）。状态以 journal 行为准——投影里 settled 而
 * journal 还是 running 的那一拍是查询滞后，下一次 `lastEventSequence` 抬升就会追上；反过来
 * journal 领先于投影（admission 先落库再发事件）时投影里干脆没有这个节点。
 */
export declare function workspaceCardStatus(node: WorkflowRunWorkspaceNode, run: WorkflowRunState | undefined): WorkspaceCardStatus;
/** 落点：该阶段的第一张卡的下标；阶段还没到（没有卡）→ -1（面板滚到末尾）。 */
export declare function firstCardIndexOfPhase(cards: readonly WorkspaceCardModel[], phaseId: string): number;
/** `1.3s` / `840ms` / `2m 05s`：一步的耗时。 */
export declare function formatWorkspaceDuration(ms: number): string;
/** `4.1 KB` / `312 B` / `1.2 MB`：正文的大小。 */
export declare function formatWorkspaceBytes(bytes: number): string;
/** 失败行的状态词判据：driver 的超时 code 说「timed out」，其余说 code 本身。 */
export declare function isTimeoutError(error: {
    code: string;
    message: string;
} | undefined): boolean;
export {};
//# sourceMappingURL=workflowWorkspaceTranscript.d.ts.map