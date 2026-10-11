import type { MessageFileLinkTarget } from "@/components/ai-elements/message.js";
import type { CodeViewerSource } from "@/lib/codeViewer.js";
import type { WorkflowActorSessionSidePaneTab } from "@/lib/workspaceSidePane.js";
interface WorkflowActorSessionSidePaneProps {
    tab: WorkflowActorSessionSidePaneTab;
    focused: boolean;
    onOpenBrowserUrl?: (url: string) => void;
    onOpenCodeViewer?: (source: CodeViewerSource) => void;
    onOpenFileLink?: (target: MessageFileLinkTarget) => void;
}
/**
 * 一个 dwf actor 实例的 transcript。
 *
 * 组合方式照 `SubagentSessionSidePane`：pane scope + 嵌套**只读** `SessionPane`。除了未启动
 * 门之外这里没有任何自己的取数逻辑，而这正是把 actor 会话落成真实持久会话换来的东西——
 * 实时流、冷恢复、run 结束之后的回看，全部由既有 SessionPane 链路负责。
 *
 * 与 subagent 面板的两处**刻意**不同：
 *
 * - 不传 `onOpenSubagentSession`：actor 的工具面里 subagent 是关掉的（引擎 spec 的
 *   「Actor tool surface」），没有嵌套下钻可点，也就不该摆一个入口。
 * - 不传 `rootSessionId`：actor 会话不在任何 subagent 树里。编一个根会让这个只读面板去
 *   订阅一条与它无关的会话。
 */
export declare const WorkflowActorSessionSidePane: import("react").MemoExoticComponent<({ tab, focused, onOpenBrowserUrl, onOpenCodeViewer, onOpenFileLink, }: WorkflowActorSessionSidePaneProps) => import("react/jsx-runtime").JSX.Element>;
export {};
//# sourceMappingURL=WorkflowActorSessionSidePane.d.ts.map