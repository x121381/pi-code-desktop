import type { CodeViewerSource } from "@/lib/codeViewer.js";
import type { WorkflowWorkspaceSidePaneTab } from "@/lib/workspaceSidePane.js";
interface WorkflowWorkspaceSidePaneProps {
    tab: WorkflowWorkspaceSidePaneTab;
    focused: boolean;
    onOpenCodeViewer?: (source: CodeViewerSource) => void;
}
/**
 * 一个 workflow run 的脚本 transcript tab。组合方式照 `WorkflowActorSessionSidePane`：pane scope
 * + 内容；内容自己取数（两条 journal 查询），不嵌 SessionPane——工作区没有会话。
 */
export declare const WorkflowWorkspaceSidePane: import("react").MemoExoticComponent<({ tab, focused, onOpenCodeViewer, }: WorkflowWorkspaceSidePaneProps) => import("react/jsx-runtime").JSX.Element>;
export {};
//# sourceMappingURL=WorkflowWorkspaceSidePane.d.ts.map