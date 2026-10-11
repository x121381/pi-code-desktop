import type { ArtifactItem } from "@/app-shell/workflow-artifacts/presets/index.js";
interface WorkflowRunArtifactDataState {
    items: readonly ArtifactItem[];
    loading: boolean;
    /** 会话不支持产物取数（老 CLI）：看板画不出来，与「还没有数据」区分。 */
    unavailable: boolean;
    error: string | null;
}
export declare function useWorkflowRunArtifactData(options: {
    sessionId: string;
    runId: string;
    artifactId: string;
    /**
     * 刷新信号 = 投影里该 id 的 `itemCount`。抬升即增量拉取；它可能**多算一个**
     * （3a 记录的有意取舍），所以只当「也许还有」用，绝不当条目数用——真正的条数是
     * `items.length`。
     */
    itemCount?: number;
    enabled?: boolean;
    /**
     * 看板会读到的字段路径（`artifactPresetFieldPaths`）。给了它就只让 CLI 取这些字段，一条 1 MiB
     * 的 item 不会整条进渲染器；缺省取整条 item。
     */
    fields?: readonly string[];
}): WorkflowRunArtifactDataState;
export {};
//# sourceMappingURL=useWorkflowRunArtifactData.d.ts.map