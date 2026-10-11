import type { ReactNode } from "react";
import type { ArtifactPillData } from "./WorkflowArtifactPill.js";
/**
 * 产物瓦片：一件产物 = 预览区 + 说明行。
 * 说明行是产物药丸的语法原样（方形 kind 瓦片、标题、等宽细节、版本尾槽、悬停 ↗ 顶替）；预览区是
 * 产物**本身**的缩略——文档开头的缩放渲染、CSV 的前几行、看板自己——由调用方按 kind 交进来，
 * 交不出来（PDF / 二进制 / 字节没到）就画一张安静的纸页字形。
 *
 * 药丸是产物在一行里的样子，瓦片是它有地方时的样子。今天只剩一处画它：run 侧板**没有交付物**时的
 * 画廊（130–180px 一列，读得清）。有交付物时其余产物走索引行（`WorkflowArtifactIndex`）——预览
 * 要么读得清，要么不画；曾经的「迷你瓦片」（六列的小框）就是因为读不清才撤的。
 *
 * ⚠ 术语：artifact = 脚本经 `artifact.*` 发布给用户看的产出。
 *
 * 整张瓦片永远是一颗 `<button>`：宿主没给回调时是**禁用**的按钮（「交付了什么」是事实，「能不能
 * 打开」是能力），与药丸同一条门。
 *
 * 预览框曾是按钮的子节点，而 markdown 缩略里可能有自己的控件（表格的
 * 「复制 Markdown」、文件链接），于是 `<button>` 嵌进了 `<button>`——React 报 DOM 嵌套错误。现在预览
 * 框是按钮的**兄弟**节点并标 `inert`（它是缩略图，不可交互也不进无障碍树），按钮只包说明行，用一个
 * 铺满整张瓦片的 `::after`（`.wf-tile-hit`）接住整块的点击、悬停与焦点；悬停时框的抬起由
 * `.wf-tile:has(.wf-tile-hit:hover)` 驱动。
 */
export interface WorkflowCompletionArtifact extends ArtifactPillData {
    contentType?: string;
    bytes?: number;
    sourcePath?: string;
    /** 预置看板喂进来的条数；通知载荷上没有，只有活投影 / journal 补过之后才有。 */
    itemCount?: number;
    /** 预置看板的 spec（只有 journal 带得回来）；预览区据它画图。 */
    spec?: unknown;
    /** 作者写的一两句说明；只有交付物行念它（瓦片放不下）。 */
    description?: string;
    /** run 的交付物。 */
    primary?: true;
}
/** 内容拿不到时的纸页字形：一张小纸 + 右下角的扩展名徽字。诚实，不装饰。 */
export declare function ArtifactSheetGlyph({ badge }: {
    badge?: string;
}): import("react/jsx-runtime").JSX.Element;
export declare function WorkflowArtifactTile({ artifact, detail, enterDelayMs, onOpen, preview, testId, title: tooltip, }: {
    artifact: WorkflowCompletionArtifact;
    /** 预览区的内容；缺席即纸页字形。 */
    preview?: ReactNode;
    /** 名字之后、尾槽之前的等宽附属信息（`CSV · 6 KB` / `4 items`）。 */
    detail?: ReactNode;
    onOpen?: (artifactId: string) => void;
    enterDelayMs?: number;
    testId?: string;
    /** tooltip 覆盖（侧板把工作区出处放进来）；缺席时是「种类词 · 标题」。 */
    title?: string;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=WorkflowArtifactTile.d.ts.map