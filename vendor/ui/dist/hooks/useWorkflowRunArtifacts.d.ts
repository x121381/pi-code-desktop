import type { WorkflowRunArtifactKind, WorkflowRunArtifactSummary, WorkflowRunArtifactVersion } from "@zcode/shared/zcode-protocol-v4";
/**
 * ⚠ 术语：本模块的 artifact 是
 * **脚本经 `artifact.*` 发布给用户看的产出**，不是引擎内部那个「脚本顶层返回值」的同名词。
 */
/**
 * 一个产物的合并视图：活投影的**新鲜元数据** + journal 的**完整元数据**（版本历史与 spec）。
 *
 * 两个来源缺一不可，所以这个类型是它们的并集而不是二选一：
 * - 活投影（`workflowRuns[].artifacts`）刻意只带最新版的元数据——它是一个高频状态键，
 *   带上 spec 与全部版本会让每一帧都重发一遍不会变的东西；
 * - journal 查询带 `versions` 与 `spec`，而**预置看板没有 spec 就画不出来**，
 *   所以哪怕 run 就在活投影里也仍然要查一次 journal。
 */
export interface WorkflowRunArtifactView {
    id: string;
    kind: WorkflowRunArtifactKind;
    title?: string;
    description?: string;
    contentType?: string;
    /** 最新版的字节数（内容产物才有）。 */
    bytes?: number;
    /** 工作区相对的原路径（`file` 才有）——「在工作区显示」按它定位。 */
    sourcePath?: string;
    /** 最新版号。 */
    version: number;
    /** 版本升序；journal 查询缺席（老 CLI / 读失败）时整键缺席，版本步进器随之退化成只有最新版。 */
    versions?: readonly WorkflowRunArtifactVersion[];
    /** 预置看板的 spec；journal 查询缺席时同样缺席，看板卡因此退回「读不到详情」。 */
    spec?: unknown;
    /** 打了这个 id 标签的 report 条数——看板取数 hook 的**刷新信号**。 */
    itemCount: number;
    /** run 的交付物；两个来源任一带上即算。 */
    primary?: true;
}
interface WorkflowRunArtifactsViewState {
    artifacts: readonly WorkflowRunArtifactView[];
    /**
     * 元数据的**主**来源。`live` = run 还在活投影里（此时 journal 只用来补 spec / versions）；
     * `journal` = 冷恢复或被 8-run 上限淘汰，整份清单都来自 journal。
     *
     * 它不是「有没有查过 journal」的标记——两种情形都会查——而是给读者与测试一个可观察的
     * 判据：这份清单是跟着 run 实时长出来的，还是事后从日志里读回来的。
     */
    source: "live" | "journal";
    loading: boolean;
    /** 会话不支持产物查询（老 CLI）：内容产物仍能列出，预置看板画不出来。 */
    unavailable: boolean;
    error: string | null;
    /**
     * 这份清单是**完整的**：活投影在场（它的上界 32 = 引擎的每 run 上限，所以从不被砍），或
     * journal 已经答过。完成卡据它决定 `+N` 写数字还是省略号——通知载荷砍在 8 件，那是**载荷**
     * 的事实，不是这里画的清单的事实；能力缺席（老 CLI）时清单可能确实不全，仍为 false。
     */
    complete: boolean;
}
/**
 * 一个 workflow run 的产物清单。
 *
 * ```
 * 活投影 workflowRuns[].artifacts ─┐
 *   （新鲜、无 spec、上界 32）      ├─▶ merge ─▶ artifacts[]
 * journal workflowRunArtifacts ───┘
 *   （完整、含 versions + spec）
 * ```
 *
 * journal 查询在**两种情形**下都发：活投影在场时用来补 spec / versions（看板没有 spec 就
 * 画不出来），活投影缺席时它就是唯一来源（冷恢复 / 被 8-run 上限淘汰）。重查的触发是摘要的
 * **形状签名**变化，不是数组引用——见 `summariesSignature`。
 */
export declare function useWorkflowRunArtifacts(options: {
    sessionId: string;
    runId: string;
    /**
     * 活投影里该 run 的产物摘要。`undefined` = run 不在活投影里（此时 `source` 为 journal）；
     * 空数组 = run 在场且零产物。两者语义不同，调用方不要把前者坍缩成后者。
     */
    live?: readonly WorkflowRunArtifactSummary[];
    enabled?: boolean;
}): WorkflowRunArtifactsViewState;
export {};
//# sourceMappingURL=useWorkflowRunArtifacts.d.ts.map