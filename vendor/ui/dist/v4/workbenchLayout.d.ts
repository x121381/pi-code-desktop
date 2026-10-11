import type { CSSProperties } from "react";
import type { PaneLayoutNode, SplitDirection } from "@/v4/paneLayoutTree.js";
/** 分割占比 CSS 变量前缀（每个分割节点一个 `--v4-split-<nodeId>`）。 */
export declare const SPLIT_VAR_PREFIX = "--v4-split-";
/** 绝对定位表达式（不含 calc() 包裹；style 侧统一 `calc(${expr})`）。 */
export interface RectExpr {
    left: string;
    top: string;
    width: string;
    height: string;
}
export interface LeafLayout {
    paneId: string;
    rect: RectExpr;
}
export interface DividerLayout {
    splitId: string;
    direction: SplitDirection;
    /** store 当前占比（拖拽起点 + 容器 CSS 变量初值）。 */
    ratio: number;
    /** 该分割节点区域占容器主轴的数值比例（拖拽像素→占比换算；祖先占比取 store 数值）。 */
    regionFraction: number;
    /** 分割线（主轴位置）表达式。 */
    boundary: string;
    /** 交叉轴起点/长度表达式。 */
    crossStart: string;
    crossLength: string;
}
export interface WorkbenchLayout {
    leaves: LeafLayout[];
    dividers: DividerLayout[];
}
export declare function collectWorkbenchLayout(root: PaneLayoutNode): WorkbenchLayout;
export declare function rectStyle(rect: RectExpr): CSSProperties;
export declare function dividerStyle(divider: DividerLayout): CSSProperties;
//# sourceMappingURL=workbenchLayout.d.ts.map