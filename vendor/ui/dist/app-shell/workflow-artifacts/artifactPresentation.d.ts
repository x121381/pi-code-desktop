import type { ReactNode } from "react";
import type { WorkflowRunArtifactKind } from "@zcode/shared/zcode-protocol-v4";
import type { ArtifactPresetKind, PresetLabels } from "@/app-shell/workflow-artifacts/presets/index.js";
export declare function isArtifactPresetKind(kind: WorkflowRunArtifactKind): kind is ArtifactPresetKind;
/** kind 词的 message id。六个成员各一个词（文件 / 文档 / 图表 / 表格 / 指标 / 看板）。 */
export declare function artifactKindMessageId(kind: WorkflowRunArtifactKind): string;
/**
 * kind 图标。`className` 由调用方给尺寸（卡片 size-4、chip size-3.5、tab 头部 size-4）——
 * 尺寸是各表面的密度决定的，图形本身不是。
 */
export declare function ArtifactKindIcon({ kind, className, }: {
    kind: WorkflowRunArtifactKind;
    className?: string;
}): ReactNode;
/**
 * 字节数的展示写法。
 *
 * 刻意在本模块另写一份而不是 import `feedback/feedbackSubmissionJob.ts` 里那个同名函数：
 * 那是反馈上传作业模块，为了五行算术把整条上传链路拖进 app-shell 的依赖图不划算，
 * 而两者若漂移也不会有人受害（一个说文件多大，一个说传了多少）。
 */
export declare function formatArtifactBytes(bytes: number): string;
/**
 * 这个 contentType 的正文是不是**人能读的文本**——「复制」动作的门。
 *
 * `application/json` 单独列出来的理由：它按 IANA 归在 application/ 下，但脚本用
 * `artifact.file("summary", "out/report.json")` 交出来的东西，用户想要的就是把它复制走。
 * 与正文分派用的 `textLanguageFor` 是两件事：那个决定用哪个 code viewer，这个只决定
 * 「能不能整份复制」。
 */
export declare function isTextArtifactContentType(contentType: string | undefined): boolean;
/** 文件的类型徽字：工作区原路径的扩展名优先（`out/book.pdf` → `PDF`），没有路径时退回 MIME 子类型。 */
export declare function artifactFileBadge(artifact: {
    sourcePath?: string;
    contentType?: string;
}): string | undefined;
/**
 * 药丸 / 瓦片说明行里的等宽细节：文件 `PDF · 4.0 KB`，文档只有大小，预置看板是喂进来的条数
 * （它的「大小」是数据量；条数不知道时缺席）。侧板瓦片与完成卡共用——两处各写一份，迟早一处
 * 说了徽字另一处没说。返回 null 即调用方不画细节槽。
 */
export declare function ArtifactDetail({ artifact, labels, }: {
    artifact: {
        kind: WorkflowRunArtifactKind;
        bytes?: number;
        itemCount?: number;
        sourcePath?: string;
        contentType?: string;
    };
    labels: PresetLabels;
}): ReactNode;
/**
 * 说明行细节的**纯文本**写法（`PDF · 4.0 KB` / `4 items`）：迷你瓦片把细节挪进 tooltip，
 * 交付物行把它写进 `kind · size` 那一行。与 `ArtifactDetail` 同一套规则，只是没有 testid。
 */
export declare function artifactDetailText(artifact: {
    kind: WorkflowRunArtifactKind;
    bytes?: number;
    itemCount?: number;
    sourcePath?: string;
    contentType?: string;
}, labels: PresetLabels): string | undefined;
/**
 * 交付物：打了 `primary` 旗子的那一件；没有旗子而清单
 * 只有一件时，那一件就是交付物——**单件规则只在 UI 上成立**，协议与引擎从不推断旗子。其余情形
 * 没有交付物：发布失败的 primary 不由别的产物顶替，两件以上无旗子就是今天的画法。
 */
export declare function resolvePrimaryArtifact<T extends {
    primary?: true;
}>(artifacts: readonly T[]): T | undefined;
/**
 * 交付物带头，其余保持原顺序。CLI 的三处投影（journal → 端口、通知清单、GetWorkflowRun）已经
 * 这样排过；这里是**活投影那条路**（`workflowRuns[].artifacts` 按发布顺序 upsert）唯一的排序点。
 */
export declare function orderArtifactsPrimaryFirst<T extends {
    primary?: true;
}>(artifacts: readonly T[]): T[];
/** 卡片标题：作者写的 title 优先，缺席退回 id（facade 的缺省 title 本来就是 id）。 */
export declare function artifactDisplayTitle(artifact: {
    id: string;
    title?: string;
}): string;
/** 通知行 / 中枢行一次最多摆几枚 chip，其余折进「+N」。 */
export declare const ARTIFACT_CHIP_MAX_VISIBLE = 3;
export declare function truncateArtifactChipTitle(title: string): string;
/**
 * 喂给四个预置渲染器的三句译文。渲染器自己不查 i18n（它要能被侧板 / tab / 中枢复用），
 * 所以每个表面在自己的 intl 语境里造一份。
 */
export declare function buildPresetLabels(formatMessage: (descriptor: {
    id: string;
}, values?: Record<string, string>) => string): PresetLabels;
/**
 * 该产物能不能在**本地文件系统**上被定位（「在工作区显示」与 html 的「在浏览器中打开」的门）。
 *
 * 判据与 `shouldOpenAssistantHtmlInBrowser` 同源：远程 workspace（SSH / WSL / Docker）
 * 的路径在本机不存在，手机远控也没有文件树可以跳。`sourcePath` 缺席则连路径都没有——
 * markdown 产物与预置看板天生就没有出处。
 */
export declare function canRevealArtifactInWorkspace(params: {
    sourcePath?: string;
    workspaceIdentity?: string;
    remoteSessionId?: string;
}): boolean;
/**
 * 「作为文件打开」副本的文件名。`markdown` 恒为 `<id>.md`（id 已限定在 `[A-Za-z0-9_.-]`）；
 * `file` 取**这一版**的 `sourcePath` 基名——扩展名决定系统用哪个 App 打开，而同一个 id 的
 * 不同版本可以来自不同路径。拿不到出处时退回 id。
 */
export declare function artifactOpenAsFileName(artifact: {
    id: string;
    kind: WorkflowRunArtifactKind;
    version: number;
    sourcePath?: string;
    versions?: readonly {
        version: number;
        sourcePath?: string;
    }[];
}, version: number): string;
//# sourceMappingURL=artifactPresentation.d.ts.map