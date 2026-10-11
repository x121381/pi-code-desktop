import type { StepRunStatus } from "@/components/workflow-graph/types.js";
export type FaceState = "waiting" | "scanning" | "content" | "sad";
export type EyeExpression = "dots" | "pill" | "happy" | "sleepy" | "focused" | "sad" | "confused";
export declare function faceState(status: StepRunStatus | undefined): FaceState;
export declare const BASE_EXPRESSION: Record<FaceState, EyeExpression>;
/** 一张脸只有一个待执行计时器；DOM 动作不触发整个工作流的 React 重渲染。 */
export declare function startFaceMotion(face: SVGSVGElement, state: FaceState): () => void;
//# sourceMappingURL=workflow-face-motion.d.ts.map