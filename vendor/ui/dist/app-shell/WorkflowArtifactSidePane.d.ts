import type { WorkflowArtifactSidePaneTab } from "@/lib/workspaceSidePane.js";
/**
 * 一个 dwf 产物的全尺寸查看 tab。
 *
 * ⚠ 术语：这里的 artifact 是脚本经 `artifact.*` 交付给用户的产出，不是引擎内部那个
 * 「脚本顶层返回值」的同名词。
 *
 * 数据分三条：**元数据**走 `useWorkflowRunArtifacts`（活投影 + journal 合并），
 * **字节**走 `useWorkflowRunArtifactBytes`（分块拼 Blob），**看板条目**走
 * `useWorkflowRunArtifactData`（`itemCount` 抬升即增量续拉）。三条互不相干，
 * 所以一个看板永远不会去读字节，一份 pdf 也永远不会去翻 journal 的 report 行。
 */
export declare const WorkflowArtifactSidePane: import("react").MemoExoticComponent<({ tab, onOpenBrowserUrl, onRevealFileInTree, }: {
    tab: WorkflowArtifactSidePaneTab;
    /** html 产物的「在浏览器中打开」。 */
    onOpenBrowserUrl?: (url: string) => void;
    /** 「在工作区显示」：复用既有的文件树 reveal（与 Git 面板同一条路径）。 */
    onRevealFileInTree?: (path: string) => void;
}) => import("react/jsx-runtime").JSX.Element>;
//# sourceMappingURL=WorkflowArtifactSidePane.d.ts.map