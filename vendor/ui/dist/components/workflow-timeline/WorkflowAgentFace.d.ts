export { faceState } from "@/components/workflow-timeline/workflow-face-motion.js";
import type { StepRunStatus } from "@/components/workflow-graph/types.js";
/**
 * 瓦片脸：应用图标的圆角方块去掉 Z、
 * 加上两只眼。子代理的头像就是它——药丸、名册格、侧栏折叠头像串共用这一张脸。
 *
 * 身份是机身色：九个固定 HEX 颜色按 `avatarIndex` 取，第十个起循环；没有编号退回名字散列。
 * 状态定义基础表情，独立随机动作仅更新 SVG 属性。
 */
export declare const FACE_COLORS: readonly ["#54B9A6", "#F19D38", "#6464EF", "#885CF5", "#3C82F6", "#ED712E", "#EB4699", "#5BC67A", "#EA4045"];
/** 名字散列选色（31 进制取模 360 后映射到九色板）；只在没有 `avatarIndex` 时兜底。 */
export declare function avatarColor(name: string): string;
/** 代理的颜色：编号优先（九色环循环），缺席时退回名字散列。药丸悬停描边与脸共用它。 */
export declare function agentColor(avatarIndex: number | undefined, name: string): string;
export declare function WorkflowAgentFace({ avatarIndex, className, name, status, }: {
    avatarIndex: number | undefined;
    className?: string;
    name: string;
    status: StepRunStatus | undefined;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=WorkflowAgentFace.d.ts.map