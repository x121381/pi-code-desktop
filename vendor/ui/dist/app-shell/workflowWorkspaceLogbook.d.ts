import type { PhaseNaming } from "@/components/workflow-graph/phase-name.js";
import type { WorkspaceCardModel } from "@/app-shell/workflowWorkspaceTranscript.js";
export interface WorkspaceChapter {
    key: string;
    /** 图不可得（或站点不在图上）的卡没有阶段：这一章不画章头。 */
    phase: PhaseNaming | undefined;
    /** 这是该阶段第几次进入；> 1 时章头带 ⟳n。 */
    round: number;
    cards: WorkspaceCardModel[];
    startedAt: number;
    endedAt: number;
}
export declare function buildWorkspaceChapters(cards: readonly WorkspaceCardModel[]): WorkspaceChapter[];
/** 时间标尺的零点：第一张卡的准入时刻（run 自己的开始时刻不在清单上）。 */
export declare function transcriptOrigin(cards: readonly WorkspaceCardModel[]): number | undefined;
/** `+0:00` / `+1:12` / `+1:02:05`：一张卡相对零点的时刻。 */
export declare function formatOffset(ms: number): string;
/** `6s` / `2m 05s`：running 的那张卡「开始于多久前」。 */
export declare function formatAgo(ms: number): string;
interface TranscriptSummary {
    phases: number;
    steps: number;
    /** 第一张卡准入到最后一张卡结算（还在跑则到 `now`）。 */
    durationMs: number;
}
export declare function transcriptSummary(cards: readonly WorkspaceCardModel[], now: number): TranscriptSummary;
interface PeekLine {
    text: string;
    /** 看起来是一行错误（× / ✗ / FAIL / Error…）：peek 里用 destructive 色。 */
    error: boolean;
}
export declare function isErrorLine(line: string): boolean;
/** 命令输出的尾巴：stdout 最后几行非空行；stdout 空则 stderr；字符串正文同理；其余没有 peek。 */
export declare function peekLinesOf(result: unknown, max?: number): PeekLine[];
export declare function rememberedOpen(key: string): boolean;
export declare function setRememberedOpen(key: string, open: boolean): void;
/** 测试用：清空展开态记忆。 */
export declare function resetWorkspaceEntryOpenState(): void;
export {};
//# sourceMappingURL=workflowWorkspaceLogbook.d.ts.map