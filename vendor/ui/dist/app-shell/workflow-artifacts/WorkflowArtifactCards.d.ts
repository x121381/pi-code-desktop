/**
 * 「不能内联渲染」的三种正文（html 卡、表外类型的元数据卡、loading / 错误的一句话）。
 *
 * ⚠ 术语：artifact = 脚本经 `artifact.*` 发布给用户看的产出，不是引擎内部那个「脚本顶层返回值」的同名词。
 *
 * 从 `WorkflowArtifactBody.tsx` 里分出来的理由是行数上限（400）：那个文件的主体是**按
 * contentType 分派**，这三样是分派**兜不住**时的落点，两者按职责本就该分开读。
 */
import type { WorkflowRunArtifactView } from "@/hooks/useWorkflowRunArtifacts.js";
/**
 * 「不能内联渲染」的两种正文（html 与表外类型）共用的卡片壳：标题 / 类型 / 大小 / 出处，
 * 外加至多一个动作。两者各画一遍的话，迟早一个说了大小另一个没说。
 */
export declare function ArtifactMetadataCard({ artifact, bytes, note, action, testId, }: {
    artifact: WorkflowRunArtifactView;
    bytes: number;
    /** 卡片下方那句解释（为什么不内联渲染 / 打开的到底是什么）。 */
    note?: string;
    action?: {
        label: string;
        onActivate: () => void;
        testId?: string;
    };
    testId: string;
}): import("react/jsx-runtime").JSX.Element;
/**
 * html 产物的卡片（**不内联 iframe**，见本文件头部）。
 *
 * ## 「在浏览器中打开」为什么用**工作区原路径**而不是 store 里那份钉住的字节
 *
 * store 的句柄是 `zcode-artifact://…`，不是文件系统路径，浏览器 tab 打不开它；协议这一侧
 * 也刻意不把 store 的落盘路径交给 renderer。所以唯一能变成 `file://` 的东西是
 * `sourcePath`（工作区相对的原路径）。代价说清楚：那是**工作区当前的文件**，不是这一版
 * 被钉住的字节——所以卡上有一句话把这件事写明（spec 的「卡上写明打开的是工作区副本」），
 * 而且这个按钮只在**最新版**上出现：旧版的原文件早已被同名覆盖，拿它冒充历史版本会是
 * 一个安静的谎。
 */
export declare function WorkflowArtifactHtmlCard({ artifact, bytes, localSourcePath, isLatestVersion, onOpenBrowserUrl, onReveal, }: {
    artifact: WorkflowRunArtifactView;
    bytes: number;
    localSourcePath?: string;
    isLatestVersion: boolean;
    onOpenBrowserUrl?: (url: string) => void;
    onReveal?: () => void;
}): import("react/jsx-runtime").JSX.Element;
/** 正文位置上的一句话（loading / 错误 / 无法预览）。三态同形，只有色阶不同。 */
export declare function ArtifactNotice({ text, detail, tone, testId, }: {
    text: string;
    detail?: string;
    tone?: "error";
    testId?: string;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=WorkflowArtifactCards.d.ts.map