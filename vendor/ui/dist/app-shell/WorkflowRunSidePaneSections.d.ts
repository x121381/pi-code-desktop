import type { WorkflowRunSaveSlots } from "@/components/workflow-timeline/WorkflowRunSaveControls.js";
import type { WorkflowRunState, WorkflowRunUsage } from "@zcode/shared/zcode-protocol-v4";
import type { workflowRunResultView } from "@/app-shell/workflowRunPanel.js";
/**
 * 状态头：第一行是名字与控件（Configure、
 * Resume、Stop），第二行是灯与状态词 + 并发芯片——三枚按钮挤在状态旁边太满，状态因此单独成行。
 * 其下是 lineage 行与与聊天卡页脚**同文案**的摘要行——同一个 run 在两个面上必须说同一句话。
 * 摘要行素材缺席（图不可得，建不出时间线）时退回既有的用量行。
 */
export declare const WorkflowRunStatusHeader: import("react").MemoExoticComponent<({ cancellable, configureOpen, onCancel, onConfigureFrom, onOpenSuccessor, onResume, rejection, resumable, run, saveSlots, subagentModel, summaryParts, title, usage, }: {
    cancellable: boolean;
    /** 「配置」弹层此刻开着（Configure 钮与模型段的 aria-expanded）。 */
    configureOpen?: boolean;
    onCancel: () => void;
    /**
     * 打开「配置」弹层、锚在点中的那个元素上。缺席即这个 run 不能配置：没有 Configure 钮，模型段只是字。
     */
    onConfigureFrom?: (element: HTMLElement) => void;
    /** 最近一次 Stop / Resume 被拒的解释；`detail` 是 ACK 携带的诊断。 */
    rejection?: {
        text: string;
        detail?: string;
    };
    /** 打开替代了本 run 的后继（`run.supersededBy`）；宿主解析不到后继时缺席，那一行是静态文字。 */
    onOpenSuccessor?: () => void;
    onResume: () => void;
    resumable: boolean;
    run: WorkflowRunState | undefined;
    /**
     * 「已保存」芯片与「保存」/「再次运行」（docs/dynamic-workflow/transcript-and-notifications.md
     * 「Saving the run, and running it again」）。同一个 run 在完成卡与这里必须说同一句话，所以两处
     * 用的是同一个控制器造出来的这两个节点，本组件只负责摆位置：动词排在 Stop 之前，芯片在第二行。
     * `null` / 缺席即没有服务上下文（那时一个控件都不画）。
     */
    saveSlots?: WorkflowRunSaveSlots | null;
    /**
     * 这次 run 的子代理模型：`name` 是屏幕上的词，`title` 里是强度与规范串
     * （docs/dynamic-workflow/presentation.md「The run pane」）。状态头第一行不再摆模型芯片——
     * 模型是第二行的第一个词，摘要行与退化的用量行都由它开头。缺席即没有可说的。
     */
    subagentModel?: {
        name: string;
        title: string;
    };
    /** 摘要行各段（`workflowSummaryParts`）；缺席时退回用量行。 */
    summaryParts: readonly string[] | undefined;
    title: string;
    usage: WorkflowRunUsage | undefined;
}) => import("react/jsx-runtime").JSX.Element>;
/** 终态区：不可追踪提示 / 完成产物预览 / 失败与取消的错误面板。非对应终态时各自缺席。 */
export declare const WorkflowRunResultSections: import("react").MemoExoticComponent<({ result, }: {
    result: ReturnType<typeof workflowRunResultView>;
}) => import("react/jsx-runtime").JSX.Element>;
//# sourceMappingURL=WorkflowRunSidePaneSections.d.ts.map