import type { ReactNode } from "react";
import type { WorkflowRunArtifactKind } from "@zcode/shared/zcode-protocol-v4";
/**
 * 产物药丸：与子代理药丸同一套语法——
 * 同样的高度、圆角、底色、悬停抬起、尾槽里 ↗ 顶替原有内容——只换两样：**方**的墨灰瓦片代替
 * **圆**的带色头像（颜色说「谁」，形状说「什么」），尾槽里放版本号而不是状态标记。
 *
 * ⚠ 术语：这里的 artifact 是脚本经 `artifact.*` 发布给用户看的产出，不是引擎内部「脚本顶层返回值」的同名词。
 *
 * 两个尺寸：`md`（32px）用在药丸本来就在的地方——时间线下的产物条、中枢的「最近产物」；
 * `sm`（24px）用在单行里——完成通知的折叠头部、中枢的运行历史行。产物**有地方**时（完成卡、
 * run 侧板的画廊）用的是瓦片（`WorkflowArtifactTile`），说明行就是这枚药丸的语法。
 *
 * 永远是 `<button>`：产物是一个「可以打开的东西」，宿主没给回调时它是**禁用**的按钮，看起来与
 * 没有会话的子代理药丸一样安静——「交付了什么」是事实，「能不能打开」是能力。版本号从 v2 起才
 * 出现（v1 是常态，写出来是噪音）；同 id 再发布时尾槽按版本重挂，播标记的弹入动画。
 */
export interface ArtifactPillData {
    id: string;
    kind: WorkflowRunArtifactKind;
    title?: string;
    version?: number;
}
export type ArtifactPillSize = "md" | "sm";
export declare function WorkflowArtifactPill({ artifact, className, detail, enterDelayMs, fill, onOpen, size, testId, title, truncateTitle, variant, }: {
    variant?: "pill" | "link";
    artifact: ArtifactPillData;
    size?: ArtifactPillSize;
    /** 名字之后、尾槽之前的等宽附属信息（侧栏行的 `PDF · 1.2 MB` / `12 items`）。 */
    detail?: ReactNode;
    /** 在场即可打开；缺席即禁用（回调的存在即门控）。 */
    onOpen?: (artifactId: string) => void;
    /** 名字占满剩余宽度（侧栏行）；缺席时药丸按内容收拢（时间线下的产物条）。 */
    fill?: boolean;
    /** 条里的标题截到 24 字（完整标题在 tooltip 里）；侧栏行靠 CSS truncate，不截字。 */
    truncateTitle?: boolean;
    /** tooltip 覆盖；缺席时是「种类词 · 标题」。 */
    title?: string;
    /** 入场延迟（产物条里依次落地，每枚错 30 ms）。 */
    enterDelayMs?: number;
    testId?: string;
    className?: string;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=WorkflowArtifactPill.d.ts.map