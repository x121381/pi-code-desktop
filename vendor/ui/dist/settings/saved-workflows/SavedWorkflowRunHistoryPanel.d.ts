import { type ZCodeSavedWorkflowRun } from "@zcode/shared";
/** 详情页某一行运行记录对应的项目（全局工作流跨 cwd 时用；cwd 命中已打开项目才能「查看实例」）。 */
export interface SavedWorkflowRunProject {
    label: string;
    /** 完整 cwd 路径，挂在 title 上。 */
    title?: string;
    /** 该行 cwd 对应本地已打开项目 → 可「查看实例」。 */
    canOpen: boolean;
}
/** 详情页「运行历史」：journal 行（状态 / 时间 / 花费 / 实参），有归属字段的行可「查看实例」。 */
export declare function SavedWorkflowRunHistory({ runs, now, canOpenRun, onOpenRun, onOpenArtifact, resolveRunProject, }: {
    runs: readonly ZCodeSavedWorkflowRun[];
    now: number;
    canOpenRun: boolean;
    onOpenRun: (run: ZCodeSavedWorkflowRun) => void;
    /**
     * 产物 chip → `workflow-artifact` tab。
     * 缺席即 chips 只读。门比「查看实例」松一格：产物不需要 `toolCallId`。
     */
    onOpenArtifact?: (run: ZCodeSavedWorkflowRun, artifactId: string) => void;
    /** 传入即在每行渲染项目列（全局工作流跨项目历史）；「查看实例」还要该行 canOpen。 */
    resolveRunProject?: (run: ZCodeSavedWorkflowRun) => SavedWorkflowRunProject | null;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=SavedWorkflowRunHistoryPanel.d.ts.map