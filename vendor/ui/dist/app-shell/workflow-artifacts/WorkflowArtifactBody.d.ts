import type { ArtifactItem } from "@/app-shell/workflow-artifacts/presets/index.js";
import type { WorkflowRunArtifactView } from "@/hooks/useWorkflowRunArtifacts.js";
import type { Theme } from "@/useTheme.js";
interface WorkflowArtifactBodyProps {
    artifact: WorkflowRunArtifactView;
    /** 正在查看的版本；内容产物的字节按它读。 */
    version: number;
    bytes: Uint8Array<ArrayBuffer> | null;
    blob: Blob | null;
    objectUrl: string | null;
    /** 字节读取的状态：loading 与 error 都由本组件呈现（各查看器自己的 loading 只覆盖解析）。 */
    loading: boolean;
    error: string | null;
    /** 预置看板的条目流；内容产物恒空。 */
    items: readonly ArtifactItem[];
    theme: Theme;
    resolvedTheme: "light" | "dark";
    /** html 的「在浏览器中打开」；缺席即只显示提示。 */
    onOpenBrowserUrl?: (url: string) => void;
    /** 本地文件系统上的绝对路径（desktop-local ∧ `sourcePath` 在场时才有）。 */
    localSourcePath?: string;
    /** 「在工作区显示」：已绑定好路径的文件树 reveal；缺席即无渲染器的卡片上不出这个按钮。 */
    onReveal?: () => void;
    /** 查看的是不是最新版——旧版的工作区原文件早就被覆盖了，html 预览因此只对最新版开放。 */
    isLatestVersion: boolean;
    /** 元数据（含预置看板的 spec）还在读；预置正文据此区分「还没到」与「真的没有」。 */
    metadataLoading: boolean;
}
export declare function WorkflowArtifactBody(props: WorkflowArtifactBodyProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=WorkflowArtifactBody.d.ts.map