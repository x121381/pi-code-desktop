import { type ReactNode } from "react";
import type { RollGroup } from "./roster-model.js";
import type { TimelinePill } from "./timeline-model.js";
/**
 * 门后的名单：侧板名册站里没被钉住
 * 的人，每人一次，按状态分组、组序即注意力序（failed → running → pending → done），组内参与者序。
 * 组头是计数行的那一项——图标、人数、状态词、语义色，右边一条细线拉到边——所以门开着时计数行不必
 * 再出现一次。行由调用方渲染（各面自己的接线），这里只排两列、发入场延迟。
 *
 * 表外的那些（`unlisted`）没有行可落：门与计数行算了它们，名单只能在末尾用一行淡字交代这个差额，
 * 而不是假装那些行在（追记「表外的那些」）。
 */
/** 行依次落地：每行 8 ms、封顶 400 ms（沿用格子的节奏；30 ms 的药丸节奏对一卷名单太慢）。 */
export declare const ROW_STAGGER_MS = 8;
export declare const ROW_STAGGER_CAP_MS = 400;
export declare function WorkflowRoll({ groups, renderRow, unlisted, }: {
    groups: readonly RollGroup[];
    /** 渲染一行；`enterDelayMs` 是这一行在整卷名单里的落地延迟。 */
    renderRow: (pill: TimelinePill, enterDelayMs: number) => ReactNode;
    /** 这一站列不出行的子代理数（跑完的、还没跑的都算）；零即那一行淡字缺席。 */
    unlisted?: number;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=WorkflowRoll.d.ts.map