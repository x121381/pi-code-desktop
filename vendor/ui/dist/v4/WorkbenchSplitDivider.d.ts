import { type CSSProperties, type RefObject } from "react";
import { type SplitDirection } from "@/v4/paneLayoutTree.js";
export interface WorkbenchSplitDividerProps {
    containerRef: RefObject<HTMLDivElement | null>;
    splitId: string;
    direction: SplitDirection;
    /** 当前已提交占比（store 值）；仅作为拖动起点，拖动过程不依赖它重渲染。 */
    ratio: number;
    /** 该分割节点区域占容器主轴的数值比例（拖拽像素→占比换算）。 */
    regionFraction: number;
    style: CSSProperties;
    onCommitRatio: (splitId: string, ratio: number) => void;
}
export declare const WorkbenchSplitDivider: import("react").MemoExoticComponent<({ containerRef, splitId, direction, ratio, regionFraction, style, onCommitRatio, }: WorkbenchSplitDividerProps) => import("react/jsx-runtime").JSX.Element>;
//# sourceMappingURL=WorkbenchSplitDivider.d.ts.map