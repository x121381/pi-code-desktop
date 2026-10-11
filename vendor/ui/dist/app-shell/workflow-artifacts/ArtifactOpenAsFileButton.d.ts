/**
 * 产物 tab 头部的「作为文件打开」分段按钮（docs/dynamic-workflow/authoring.md「How the user sees them」）。
 *
 * ⚠ 术语：artifact = 脚本经 `artifact.*` 发布给用户看的产出，不是引擎的 `RunSettlement.artifact`。
 *
 * 文件是宿主按 tab **已经读到的那一版字节**写出的本机副本（`materializeWorkflowArtifactFile`），
 * 不是 CLI artifact store 里的文件——理由见 desktop 的 `workflowArtifactFile.ts`。主按钮用系统
 * 默认 App 打开；chevron 列出已装 App（与其它「打开方式」同一份列表与偏好，文件管理器在前），
 * 其后是位置类动作：「在工作区显示」（产物有本机可达的工作区出处时）与「复制绝对路径」。
 * 「在工作区显示」收进这里，是为了头部只留一个文件控件；宿主不能落副本（手机远控、普通 Web）
 * 时整个按钮缺席，调用方据 {@link useCanOpenArtifactAsFile} 把「在工作区显示」放回头部。
 */
interface ArtifactOpenAsFileButtonProps {
    runId: string;
    artifactId: string;
    version: number;
    /** 副本的文件名（含扩展名，扩展名决定系统用哪个 App 打开）。 */
    fileName: string;
    /** **这一版**的字节；还没读到（或读到的属于别的版本）时传 null，按钮禁用。 */
    bytes: Uint8Array | null;
    /** 「在工作区显示」：已绑定好路径的文件树 reveal；缺席即菜单里没有这一项。 */
    onReveal?: () => void;
}
/** 当前宿主能不能「作为文件打开」——头部据此决定「在工作区显示」进菜单还是独立成按钮。 */
export declare function useCanOpenArtifactAsFile(): boolean;
export declare function ArtifactOpenAsFileButton(props: ArtifactOpenAsFileButtonProps): import("react/jsx-runtime").JSX.Element | null;
export {};
//# sourceMappingURL=ArtifactOpenAsFileButton.d.ts.map