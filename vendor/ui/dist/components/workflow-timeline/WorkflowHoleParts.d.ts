import type { WorkflowRunState } from "@zcode/shared/zcode-protocol-v4";
import type { TimelineHole } from "./timeline-holes.js";
/**
 * 留白的小零件（docs/dynamic-workflow/presentation.md「Holes on the timeline」），卡、侧板与工具行共用：
 * 无阶段补全后站名旁的笔标（它的头）、等待中的元数据词「等待补全」、表头与侧板的「{n} 处留白待补全」芯片。
 *
 * 留白的类型（`hole<T>` 的 T）**不在任何界面上出现**：它是编译器与主代理之间的契约，不是用户要读
 * 的东西。2026-09-28 的实测里它曾作为等宽徽标挂在站名之后：`{ target: string; reason: string }`
 * 这样的原文把站头撑满、站名被挤到零宽——所以这里只剩名字。
 */
export declare function HoleFillMark({ className, holeId }: {
    className?: string;
    holeId: string;
}): import("react/jsx-runtime").JSX.Element;
/** 站头右侧的「等待补全」：警示色、不换行；只在 run 停在这处留白上时出现。 */
export declare function HoleWaitingMeta({ hole }: {
    hole: TimelineHole | undefined;
}): import("react/jsx-runtime").JSX.Element | null;
/** 侧板状态头的同一枚芯片：直接读 run 的留白表，数等待中的。 */
export declare function RunHolesWaitingChip({ run, testId, }: {
    run: Pick<WorkflowRunState, "holes"> | undefined;
    testId: string;
}): import("react/jsx-runtime").JSX.Element;
/**
 * 「{n} 处留白待补全」芯片（run 卡表头、侧板状态头）：笔图标，落在问题芯片的槽位上；两枚可以同时在。
 * 与问题芯片同一副面孔（警示色 12% 底、`text-ui-xs`），可点时开 run 详情。
 */
export declare function HolesWaitingChip({ count, onOpen, testId, }: {
    count: number;
    onOpen?: () => void;
    testId?: string;
}): import("react/jsx-runtime").JSX.Element | null;
//# sourceMappingURL=WorkflowHoleParts.d.ts.map